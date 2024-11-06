import Product from "../components/Product";
import { useEffect, useState } from "react";
import { axios } from "../utils/axios"
import { useQuery } from "@tanstack/react-query";
import { RootState } from "../store/index";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import AddItemModal from "../components/AddProduct"
import { useLocation } from "react-router-dom";

export default function Browse() {
    const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
    const user = useTypedSelector((state) => state.user);
    const preference = useTypedSelector((state) => state.preference)

    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inventoryData, setInventoryData] = useState<any[]>([]); // Lifted state


    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const fetchInventory = async () => {
        const endpoint = preference.showProductTypes === "all" ? `admin/inventory/` : `admin/inventory/${preference.showProductTypes}`;
        const response = await axios.get(endpoint);
        return response.data.items;
    };


    const { data, isLoading, isError } = useQuery({ queryKey: ['inventoryData', preference.showProductTypes], queryFn: fetchInventory });

    useEffect(() => {
        if (data) {
            const filtered = data.filter((item:any) => 
                item.item_name.toLowerCase().includes(searchQuery)
            );
            setInventoryData(filtered); // Set inventory data after fetching
        }
    }, [data, searchQuery]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('search')?.toLowerCase() || '';
        setSearchQuery(query);
    }, [location.search])

    const updateInventory = (newItem: any) => {
        setInventoryData((prevInventory) => [newItem, ...prevInventory]); // Append new item to inventory
    };

    const toggleStock = (itemId: string) => {
        // console.log("state_changed")
        setInventoryData((prevInventory) =>
            prevInventory.map((item) =>
                item._id === itemId ? { ...item, in_stock: !item.in_stock } : item
            )
        );
    };

    const deleteItem = (itemId: string) => {
        setInventoryData((prevInventory) =>
            prevInventory.filter((item) => item._id !== itemId) // Filter out the item with the matching id
        );
    };

    const updateItem = (updatedItem: any) => {
        setInventoryData((prevInventory) =>
            prevInventory.map((item) =>
                item._id === updatedItem._id ? { ...item, ...updatedItem } : item
            )
        );
    };

    // useEffect(() => {
    //     if (inventoryData) {
    //         console.log('Fetched inventory data:', inventoryData);
    //     }
    // }, [inventoryData]);

    if (isLoading) return (
        <section className=" h-full py-8 antialiased bg-gray-900 md:py-12">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <h2 className="mt-3 text-xl font-semibold  text-white sm:text-2xl">Loading...</h2>
                </div>
            </section>
        );
    if (isError) return (
        <section className=" h-full py-8 antialiased bg-gray-900 md:py-12">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <h2 className="mt-3 text-xl font-semibold  text-white sm:text-2xl">Error Fetching Data</h2>
                </div>
            </section>
    );

    return (
        <>
            <section className=" py-8 antialiased bg-gray-900 md:py-12">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div className="mb-4 items-end justify-between space-y-2 sm:flex sm:space-y-0 md:mb-8">
                        <div className="flex w-full justify-between items-center space-x-2">
                            <h2 className="mt-1 text-xl font-semibold  text-white sm:text-2xl">All Products</h2>
                            {user.isAdmin && (
                                <button type="button" className="w-full rounded-lg border max-w-sm border-green-700 px-3 py-2 text-center text-lg font-medium text-green-700 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-900 lg:w-auto"
                                onClick={toggleModal}
                            >
                                Add Item</button>
                            )}
                        </div>
                    </div>
                    <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
                        {inventoryData.length > 0 ? inventoryData.slice(0).reverse().map((item: any) => (
                            <div className="col-md-3" key={item._id}>
                                <Product item={item} toggleStockInventory={toggleStock} inStock={item.in_stock} deleteItem={deleteItem} updateItem={updateItem}/>
                            </div>
                        )) : (
                            <h2>No Items Found</h2>
                        )}
                    </div>
                    <div className="w-full text-center">
                        <button type="button" className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Show more</button>
                    </div>
                </div>
            </section>
            <AddItemModal isOpen={isModalOpen} onClose={toggleModal} updateInventory={updateInventory}/>
        </>
    )
}