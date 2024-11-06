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
                <div className="rounded-lg border w-2/3  p-6 shadow-sm border-gray-700 bg-gray-800">
                    <div className="pt-2">

                        <a href="#" className="text-2xl font-semibold leading-tight  hover:underline text-white">
                            Cart Items
                            <span className=" float-right">
                                {totalCount} items
                            </span>

                        </a>

                        <hr className="h-px my-4  border-0 bg-gray-700" />

                    </div>
                    {products.length > 0 ? products.map((item: any) => (
                        <div className="col-md-3" key={item.id}>
                            <CartProduct item={item} />
                        </div>
                    )) : (
                        <>
                        <h2 className="text-2xl text-center font-semibold leading-tight  hover:underline text-white py-4">Cart is Empty :&#40;</h2>
                        <Link to="/browse" className="text-2xl text-center font-semibold leading-tight  hover:underline text-blue-500">Add some items</Link>
                        </>
                    )
                    }
                    {products.length>0 && <div className="text-2xl  text-white py-4">
                        Total <span className=" float-right"><b>Rs. {totalPrice}</b></span>
                    </div>}

                </div>

                <div className="flex flex-col rounded-lg border w-1/3 items-center justify-around">
                    {!user.id && 
                        <div className="flex flex-col items-center content-center">
                            <p className="text-xl text-white">Login to place orders</p>
                            <Link to="/" className="text-2xl text-center font-semibold leading-tight  hover:underline text-blue-500">Sign In</Link>
                        </div>
                    }
                    {user.id && products.length === 0 && 
                        <div className="flex flex-col items-center content-center">
                            <Link to="/browse" className="text-2xl text-center font-semibold leading-tight  hover:underline text-blue-500">Add items</Link>
                        </div>
                    }
                    <button type="button" className="w-full inline-flex justify-center rounded-lg  border  px-3 py-2 text-center text-sm font-medium focus:outline-none focus:ring-4 border-green-500 text-green-500 hover:bg-green-600 hover:text-white focus:ring-green-900 lg:w-auto"
                        disabled={!user.id || products.length === 0 || processing}
                        onClick={handleOrder}
                    >Place Order</button>
                </div>
            </div>
        </>
    )
}