import { useState, Dispatch, SetStateAction } from "react";
import { axios } from "../utils/axios";
import { RootState } from "../store/index";
import { useSelector, TypedUseSelectorHook } from "react-redux";

interface Product {
    _id: string;
    item_name: string;
    itemQuantity: number;
    price: number;
}

interface Order {
    _id: string;
    order_date: string;
    products: Product[];
    quantity: number;
    total: number;
    user_id: string;
    isVerified: string;
    user_name?: string;
    status?: string;
}

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; order: Order, status: string }> = ({ isOpen, onClose, order, status }) => {
    if (!isOpen) return null;

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

            {/* Modal content */}
            <div className=" bg-gray-800 p-8 rounded-lg shadow-lg z-50 w-11/12 max-w-lg">
                <h2 className="text-lg font-semibold  text-white mb-4">Order Details</h2>
                <div className="space-y-4 text-gray-300">
                    <p><strong>Transaction ID:</strong> {order._id}</p>
                    <p><strong>Customer Name: </strong><u>{order.user_name ? order.user_name : "John Doe"}</u> </p>
                    <p><strong>Date and Time:</strong>{formatDate(order.order_date)}</p>
                    <p><strong>Total:</strong> Rs. {order.total}</p>
                    <h3 className="text-md font-semibold  text-white mt-4">Products:</h3>
                    <ul className="list-disc list-inside">
                        {order.products.map((product) => (
                            <li key={product._id}>
                                {product.item_name} - {product.itemQuantity} x Rs. {product.price}
                            </li>
                        ))}
                    </ul>
                    <p><strong>Status:</strong> {status.charAt(0).toUpperCase() + status.slice(1)}</p>
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

export default function Order({ status, id, total, order, setOrderHistory }: { status: string, id: string, total: number, order: Order, setOrderHistory: Dispatch<SetStateAction<Order[]>> }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
    const user = useTypedSelector((state) => state.user);

    const handleOrderCancel = async () => {
        try {
            const response = await axios.post(`order/order/${order._id}/cancelled`);

            if (response.status === 200) {
                console.log('Order Updated Successfully:', response.data);
            }
            setOrderHistory((prevOrders) =>
                prevOrders.map((o) =>
                    o._id === order._id ? { ...o, status: 'cancelled' } : o
                )
            );
        } catch (error) {
            console.error('Error updating order:', error);
        }
    }

    const handleOrderConfirm = async () => {
        try {
            const response = await axios.post(`order/order/${order._id}/complete`);

            if (response.status === 200) {
                console.log('Order Updated Successfully:', response.data);
            }

            setOrderHistory((prevOrders) =>
                prevOrders.map((o) =>
                    o._id === order._id ? { ...o, status: 'complete' } : o
                )
            );
        } catch (error) {
            console.error('Error updating order:', error);
        }
    }


    return (
        <>
            <div className="flex flex-wrap items-center gap-y-4 py-6">
                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium  text-gray-400">Order ID:</dt>
                    <dd className="mt-1.5 text-base font-semibold  text-white">
                        <a href="#" className="hover:underline">{id}</a>
                    </dd>
                </dl>

                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium  text-gray-400">Date:</dt>
                    <dd className="mt-1.5 text-base font-semibold  text-white">20.12.2023</dd>
                </dl>

                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium  text-gray-400">Price:</dt>
                    <dd className="mt-1.5 text-base font-semibold  text-white">Rs. {total}</dd>
                </dl>

                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium  text-gray-400">Status:</dt>
                    {status === "complete" ? (
                        <dd className="me-2 mt-1.5 inline-flex items-center rounded  px-2.5 py-0.5 text-xs font-medium  bg-green-900 text-green-300">
                            <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                            </svg>
                            Completed
                        </dd>
                    ) :
                        status == "cancelled" ? (
                            <dd className="me-2 mt-1.5 inline-flex items-center rounded  px-2.5 py-0.5 text-xs font-medium  bg-red-900 text-red-300">
                                <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                </svg>
                                Cancelled
                            </dd>
                        ) : (
                            <dd className="me-2 mt-1.5 inline-flex items-center rounded  px-2.5 py-0.5 text-xs font-medium  bg-yellow-900 text-yellow-300">
                                <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                                </svg>
                                In transit
                            </dd>
                        )
                    }
                </dl>

                <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                    {status !== "complete" && status !== "cancelled" ? (
                        <>
                            <button type="button" className="w-full rounded-lg border  px-3 py-2 text-center text-sm font-medium  focus:outline-none focus:ring-4 border-red-500 text-red-500 hover:bg-red-600 hover:text-white focus:ring-red-900 lg:w-auto"
                                onClick={handleOrderCancel}
                            >
                                Cancel</button>
                            {user.isAdmin && <button type="button" className="w-full rounded-lg border  px-3 py-2 text-center text-sm font-medium   focus:outline-none focus:ring-4  border-green-500 text-green-500 hover:bg-green-600 hover:text-white focus:ring-green-900 lg:w-auto"
                                onClick={handleOrderConfirm}
                            >
                                Confirm</button>}
                        </>
                    ) : (
                        <button type="button" className="w-full rounded-lg bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 lg:w-auto">Order again</button>
                    )
                    }
                    <button type="button" onClick={toggleModal} className="w-full inline-flex justify-center rounded-lg  border  px-3 py-2 text-sm font-medium  hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 border-gray-600 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-gray-700 lg:w-auto">Details</button>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={toggleModal} order={order} status={status} />
        </>
    )
}