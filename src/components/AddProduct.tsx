import { useState } from 'react';
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


const Modal: React.FC<{ isOpen: boolean; onClose: () => void; updateInventory: (newItem: any) => void  }> = ({ isOpen, onClose, updateInventory}) => {
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddItemFormData>({
        resolver: zodResolver(addItemSchema), // Connect Zod schema with React Hook Form
    });
    
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
            const response = await axios.post('/admin/addItem', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Item added:', response.data);
            updateInventory(response.data.item);
            onClose();
            // Handle successful response here, e.g., show a success message
        } catch (error) {
            console.error('Error adding item:', error);
            // Handle error here, e.g., show an error message
        }
        setIsSubmitting(false);
    };
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

            {/* Modal content */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg z-50 w-11/12 max-w-lg">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Item</h2>
                <div className="space-y-4 text-gray-300">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full px-4 md:px-8 py-4 rounded-xl border border-gray-600 bg-slate-800">
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
                                placeholder="Item Name"
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
                                placeholder="Price"
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
                                defaultValue="snacks"
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
                        <button
                            type="submit"
                            className="w-full py-2 px-4 text-lg bg-blue-700 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
                            disabled={isSubmitting}
                        >
                            Add Item
                        </button>
                    </form>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 focus:outline-none"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;