import Order from "../components/OrderDetails"
import { useState, useEffect, ChangeEvent } from "react";
import { axios } from "../utils/axios";
import base62 from 'base62';
import { useNavigate } from "react-router-dom";
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

export default function Orders() {
    const [orderHistoryList, setOrderHistoryList] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [timeFilter, setTimeFilter] = useState<string>("all time");
    // const [flag, setFlag] = useState(0);
    const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
    const user = useTypedSelector((state) => state.user);
    const navigate = useNavigate();

    function encodeOrderId(orderId: string): string {
        // Convert to a number first if necessary
        const numberId = parseInt(orderId, 16); // Assuming orderId is in hexadecimal
        return base62.encode(numberId).substring(0, 8).toUpperCase();
    }

    useEffect(() => {
        if(!user.id) navigate("/")
        const fetchOrders = async () => {

            if(user.isAdmin){
                const res: any = await axios.get<{ orders: Order[] }>(`order/all`)
                // console.log(res.data.orders)
                setOrderHistoryList(res.data.orders?.reverse())
            } else {
                const res: any = await axios.get<{ orders: Order[] }>(`order/${user.id}`)
                setOrderHistoryList(res.data.orders?.reverse())
            }
        }
        fetchOrders();
    }, [user])

    useEffect(() => {
        const filterOrders = () => {
            let filtered = orderHistoryList;

            // Apply status filter
            if (statusFilter !== "all") {
                filtered = filtered.filter(order => 
                    (statusFilter === "completed" && order.isVerified) ||
                    (statusFilter === "transit" && !order.isVerified && order.status !== "cancelled") ||
                    (statusFilter === "cancelled" && order.status === "cancelled")
                );
            }

            // Apply time filter
            const now = new Date();
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.order_date);
                switch (timeFilter) {
                    case "this week":
                        return now.getTime() - orderDate.getTime() < 7 * 24 * 60 * 60 * 1000;
                    case "this month":
                        return now.getMonth() === orderDate.getMonth() && now.getFullYear() === orderDate.getFullYear();
                    case "last 3 months":
                        return now.getTime() - orderDate.getTime() < 3 * 30 * 24 * 60 * 60 * 1000;
                    case "last 6 months":
                        return now.getTime() - orderDate.getTime() < 6 * 30 * 24 * 60 * 60 * 1000;
                    default:
                        return true;
                }
            });

            setFilteredOrders(filtered);
        };

        filterOrders();
    }, [statusFilter, timeFilter, orderHistoryList]);

    const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const handleTimeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setTimeFilter(e.target.value);
    };

    return (
        <>
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div className="mx-auto max-w-5xl">
                        <div className="gap-4 sm:flex sm:items-center sm:justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">My orders</h2>

                            <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
                                <div>
                                    <label htmlFor="order-type" className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">Select order type</label>
                                                                        <select
                                        id="order-type"
                                        value={statusFilter}
                                        onChange={handleStatusChange}
                                        className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                    >
                                        <option value="all">All orders</option>
                                        <option value="completed">Completed</option>
                                        <option value="transit">In transit</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <span className="inline-block text-gray-500 dark:text-gray-400"> from </span>

                                <div>
                                    <label htmlFor="duration" className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">Select duration</label>
                                    <select
                                        id="duration"
                                        value={timeFilter}
                                        onChange={handleTimeChange}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                    >
                                        <option value="all time">All time</option>
                                        <option value="this week">This week</option>
                                        <option value="this month">This month</option>
                                        <option value="last 3 months">Last 3 months</option>
                                        <option value="last 6 months">Last 6 months</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flow-root sm:mt-8">
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredOrders.length > 0 ? filteredOrders.map((item: Order) => (
                                    <Order key={item._id} id={encodeOrderId(item._id)} status={item.status? item.status : (item.isVerified  ? "complete" : "pending")} 
                                        total={item.total}
                                        order={item}
                                        setOrderHistory={setFilteredOrders}
                                    />
                                )) : (
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">No orders found :&#40;</h2>
                                )}
                            </div>
                        </div>

                        <nav className="mt-6 flex items-center justify-center sm:mt-8" aria-label="Page navigation example">
                            <ul className="flex h-8 items-center -space-x-px text-sm">
                                <li>
                                    <a href="#" className="ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-4 w-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                                </li>
                                <li>
                                    <a href="#" className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                                </li>
                                <li>
                                    <a href="#" aria-current="page" className="z-10 flex h-8 items-center justify-center border border-primary-300 bg-primary-50 px-3 leading-tight text-primary-600 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                                </li>
                                <li>
                                    <a href="#" className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
                                </li>
                                <li>
                                    <a href="#" className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
                                </li>
                                <li>
                                    <a href="#" className="flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                        <span className="sr-only">Next</span>
                                        <svg className="h-4 w-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>
        </>
    )
}