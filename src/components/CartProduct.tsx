import { addItem, decrementQuantity } from "../store/cartSlice";
import { useDispatch } from "react-redux";

export default function CartProduct({ item }: { item: any }) {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, quantity: 1 }));
    };

    const handleDecrement = () => {
        dispatch(decrementQuantity(item.id))
    }

    return (
        <div className="rounded-lg border grid grid-cols-3 mt-2 w-full p-2 shadow-sm border-gray-700 bg-gray-800 items-center">

            <div className="flex items-center space-x-4">
                <div className="h-24 w-24 min-w-12">
                {item.imageUrl ? <img className="mx-auto  h-full block rounded-lg" src={item.imageUrl} />
                        : (
                            <>
                                <img className="mx-auto h-full hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg" alt="" />
                                <img className="mx-auto h-full block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg" alt="" />
                            </>
                        )
                    }
                </div>
                <a href="#" className="text-lg font-semibold leading-tight hover:underline text-white">{item.name}</a>
            </div>

            <div className="mt-4 flex items-center gap-2 justify-evenly">
                
                <>
                    <button type="button" onClick={handleDecrement} className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 bg-primary-600 hover:bg-primary-700 focus:ring-primary-800">
                        -
                    </button>

                    <p className="text-xl font-extrabold leading-tight text-blue-500">{item.quantity}</p>
                    <button type="button" onClick={handleAddToCart} className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 bg-primary-600 hover:bg-primary-700 focus:ring-primary-800">
                        +
                    </button>
                </>
            </div>
            <div>
                <p className="text-xl leading-tight  text-white text-right">Rs. {item.price} x {item.quantity} = <b>{item.price * item.quantity}</b></p>
            </div>
            
        </div>
    )
}