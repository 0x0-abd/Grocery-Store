import { RootState } from "../store/index";
import { addItem, decrementQuantity } from "../store/cartSlice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { BoxIcon, BoxOffIcon, CheckIcon, CrossIcon, EditIcon, TrashIcon } from "../assets/EditIcons";
import { useRef, useState } from "react";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { axios } from '../utils/axios';

const addItemSchema = z.object({
    item_name: z.string().min(1, 'Item name is required'),
    price: z.number().min(0, 'Price must be a positive number'),
    item_description: z.string().optional(),
    category: z.enum(["bakery", "fruits", "personal", "snacks", "beverages"]),
    image: z.instanceof(File).optional(),  // Allow image file to be optional
});

type AddItemFormData = z.infer<typeof addItemSchema>;


export default function Product({ item, toggleStockInventory, deleteItem, updateItem, inStock }: { item: any, toggleStockInventory: (itemId: string) => void, deleteItem: (itemId: string) => void, updateItem: (item:any)=>void, inStock:boolean }) {
    const dispatch = useDispatch();
    const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
    const { items: products } = useTypedSelector((state) => state.cart);
    const user = useTypedSelector((state) => state.user);

    const [productEdit, setProductEdit] = useState(false);

    const cartItem = products.find((product) => product.id === item._id);
    const inCart = !!cartItem;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddItemFormData>({
        resolver: zodResolver(addItemSchema), // Connect Zod schema with React Hook Form
    });

    const formRef = useRef<HTMLFormElement>(null); // Create a reference for the form

    const handleItemUpdate = () => {
        if (formRef.current) {
            formRef.current.requestSubmit(); // Trigger form submission
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const onSubmit = async (data: AddItemFormData) => {
        setIsSubmitting(true);
        const formData = new FormData();

        // Append item details
        formData.append('item_name', data.item_name);
        formData.append('price', data.price.toString());
        formData.append('item_description', data.item_description || '');
        formData.append('category', data.category);

        // Append file if it exists
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            console.log(formData)
            const response = await axios.patch(`/admin/updateItem/${item._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Item updated:', response.data);
            // Handle successful response here, e.g., show a success message
            updateItem(response.data.item)
            toggleProductEdit()
        } catch (error) {
            console.error('Error adding item:', error);
            // Handle error here, e.g., show an error message
        }
        setIsSubmitting(false);
    };

    const deleteProduct = async () => {
        try {
            const res = await axios.delete(`/admin/deleteItem/${item._id}`);

            if(res.data.item) {
                deleteItem(item._id);
                toggleProductEdit()
            }
        } catch(err) {

        }
    }

    const toggleStock = async () => {
        const negation = !inStock;
        try {
            // console.log(item._id, negation);

            await axios.put(`/admin/toggleStock/${item._id}`, { negation })
            // setFlag(flag+1);

            toggleStockInventory(item._id)
        }
        catch(err) {
        }
    }

    const handleAddToCart = () => {
        dispatch(addItem({ id: item._id, name: item.item_name, imageUrl: item.imageUrl, price: item.price, quantity: 1 }));
    };

    const handleDecrement = () => {
        dispatch(decrementQuantity(item._id))
    }

    const toggleProductEdit = () => {
        setProductEdit((prev) => !prev)
    }

    return (
        <div
            className={`rounded-lg border ${inCart ? 'border-blue-500 dark:border-blue-700' : 'border-gray-200 dark:border-gray-700'
                } bg-white p-6 shadow-sm  dark:bg-gray-800 relative`}
        >
            {user.isAdmin && (
                <button onClick={toggleProductEdit}>
                    {!productEdit && (
                        <EditIcon className="absolute right-1 top-1 stroke-white duration-200 hover:scale-110 hover:stroke-green-400" />
                    )}
                </button>
            )}
            {productEdit ? (
                <>
                    <div className="flex justify-between flex-row-reverse -mt-8 py-2">
                        <button onClick={toggleProductEdit}>
                            <CrossIcon className=" stroke-white duration-200 hover:scale-110 hover:stroke-blue-400" />
                        </button>
                        {inStock ? (
                            <button onClick={toggleStock}>
                                <BoxOffIcon className=" stroke-white duration-200 hover:scale-110 hover:stroke-blue-400" />
                            </button>
                        ) : (
                            <button onClick={toggleStock}>
                                <BoxIcon className=" stroke-white duration-200 hover:scale-110 hover:stroke-blue-400" />
                            </button>
                        )}
                        <button onClick={handleItemUpdate} disabled={isSubmitting}>
                            <CheckIcon className=" stroke-white duration-200 hover:scale-110 hover:stroke-green-400" />
                        </button>
                        <button onClick={deleteProduct}>
                            <TrashIcon className=" stroke-white duration-200 hover:scale-110 hover:stroke-red-400" />
                        </button>

                    </div>
                    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-full rounded-xl bg-slate-800">
                        {/* Item Name Input Field */}
                        <div>
                            <label htmlFor="item_name" className="block font-medium text-white">
                                Item Name
                            </label>
                            <input
                                type="text"
                                id="item_name"
                                {...register('item_name')}
                                className="block mt-2 p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                placeholder={item.item_name}
                            />
                            {errors.item_name && <p className="text-red-500 text-sm">{errors.item_name.message}</p>}
                        </div>

                        {/* Price Input Field */}
                        <div>
                            <label htmlFor="price" className="block font-medium text-white">
                                Price
                            </label>
                            <input
                                type="number"
                                id="price"
                                {...register('price', { valueAsNumber: true })}
                                className="block mt-2 p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                placeholder={item.price}
                            />
                            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                        </div>

                        {/* Description Input Field */}
                        <div>
                            <label htmlFor="item_description" className="block font-medium text-white">
                                Description
                            </label>
                            <textarea
                                id="item_description"
                                {...register('item_description')}
                                className="block mt-2 p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                placeholder="Description"
                            />
                            {errors.item_description && <p className="text-red-500 text-sm">{errors.item_description.message}</p>}
                        </div>

                        {/* Category Input Field */}
                        <div>
                            <label htmlFor="category" className="block font-medium text-white">
                                Category
                            </label>
                            <select
                                id="category"
                                {...register('category')}
                                className="block mt-2 p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                defaultValue={item.category}
                            >
                                <option value="bakery">Bakery</option>
                                <option value="fruits">Fruits</option>
                                <option value="personal">Personal</option>
                                <option value="snacks">Snacks</option>
                                <option value="beverages">Beverages</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                        </div>

                        {/* Image Upload Field */}
                        <div>
                            <label htmlFor="image" className="block font-medium text-white">
                                Image
                            </label>
                            <input
                                type="file"
                                id="image"
                                onChange={handleFileChange} // Capture file input manually
                                className="block mt-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                            />
                            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
                        </div>

                        {/* Submit Button */}
                        {/* <button
                            type="submit"
                            className="w-full py-2 px-4 text-lg bg-blue-700 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
                            disabled={isSubmitting}
                        >
                            Add Item
                        </button> */}
                    </form>
                </>
            ) : (
                <>
                    <div className="h-60 w-full">
                        {item.imageUrl ? <img className="mx-auto hidden h-full dark:block rounded-md" src={item.imageUrl} />
                            : (
                                <>
                                    <img className="mx-auto h-full dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg" alt="" />
                                    <img className="mx-auto hidden h-full dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg" alt="" />
                                </>
                            )
                        }
                    </div>
                    <div className="pt-4">

                        <a href="#" className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">{item.item_name}</a>

                        <div className="mt-4 flex items-center justify-between gap-4">
                            <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">Rs. {item.price}</p>

                            {!inCart ?
                                (inStock ? (
                                <button type="button" onClick={handleAddToCart} className="inline-flex items-center rounded-lg w-full border border-green-700 px-3 py-2 text-center text-sm font-medium text-green-700 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-900 lg:w-auto">
                                    <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                                    </svg>
                                    Add to Cart
                                </button>
                                ) : (
                                    <button type="button" disabled className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    Out of Stock
                                </button>
                                 )
                            )
                                :
                                <>
                                    <button type="button" onClick={handleDecrement} className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                        -
                                    </button>

                                    <p className="text-xl font-extrabold leading-tight text-gray-900 dark:text-blue-500">{cartItem.quantity}</p>
                                    <button type="button" onClick={handleAddToCart} className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                        +
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}