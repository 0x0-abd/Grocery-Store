import CartProduct from "../components/CartProduct";
import { RootState } from "../store/index";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { useState } from "react";
import { axios } from "../utils/axios";
import { emptyCart } from "../store/cartSlice";
import { useNavigate, Link   } from "react-router-dom";


export default function Cart() {
    const [ processing, setProcessing ] = useState(false);
    const dispatch = useDispatch();
    const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
    const { items: products, totalPrice, totalCount } = useTypedSelector((state) => state.cart);
    const user = useTypedSelector((state) => state.user);

    const navigate = useNavigate();

    const handleOrder = async () => {
        setProcessing(true);
        try{
            const res = await axios.post("/order", {
                user_id: user.id,
                user_name: user.name,
                products: products.map((item) => ({
                    _id: item.id,
                    item_name: item.name,
                    itemQuantity: item.quantity,
                    price: item.price
                })),
                quantity: totalCount,
                total: totalPrice,
                order_date: new Date(),
            })
            if(res) {
                dispatch(emptyCart(products));
                navigate("/orders")
            }
        } catch(e) {

        }
        setProcessing(false)
    }

    

    return (
        <>
            <div className="w-full px-4 py-4 flex space-x-4">
                <div className="rounded-lg border w-2/3 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="pt-2">

                        <a href="#" className="text-2xl font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
                            Cart Items
                            <span className=" float-right">
                                {totalCount} items
                            </span>

                        </a>

                        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

                    </div>
                    {products.length > 0 ? products.map((item: any) => (
                        <div className="col-md-3" key={item.id}>
                            <CartProduct item={item} />
                        </div>
                    )) : (
                        <>
                        <h2 className="text-2xl text-center font-semibold leading-tight text-gray-900 hover:underline dark:text-white py-4">Cart is Empty :&#40;</h2>
                        <Link to="/browse" className="text-2xl text-center font-semibold leading-tight text-gray-900 hover:underline dark:text-blue-500">Add some items</Link>
                        </>
                    )
                    }
                    {products.length>0 && <div className="text-2xl text-gray-900 dark:text-white py-4">
                        Total <span className=" float-right"><b>Rs. {totalPrice}</b></span>
                    </div>}

                </div>

                <div className="flex flex-col rounded-lg border w-1/3 items-center justify-around">
                    {!user.id && 
                        <div className="flex flex-col items-center content-center">
                            <p className="text-xl dark:text-white">Login to place orders</p>
                            <Link to="/" className="text-2xl text-center font-semibold leading-tight text-gray-900 hover:underline dark:text-blue-500">Sign In</Link>
                        </div>
                    }
                    {user.id && products.length === 0 && 
                        <div className="flex flex-col items-center content-center">
                            <Link to="/browse" className="text-2xl text-center font-semibold leading-tight text-gray-900 hover:underline dark:text-blue-500">Add items</Link>
                        </div>
                    }
                    <button type="button" className="w-full inline-flex justify-center rounded-lg  border  border-green-700 px-3 py-2 text-center text-sm font-medium text-green-700 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-900 lg:w-auto"
                        disabled={!user.id || products.length === 0 || processing}
                        onClick={handleOrder}
                    >Place Order</button>
                </div>
            </div>
        </>
    )
}