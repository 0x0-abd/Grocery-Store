import { Link, useNavigate } from "react-router-dom";
import MainLogo from "../assets/MainLogo"
import { RootState } from "../store";
import { ChangeEvent, useState } from 'react';
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { axios } from "../utils/axios";
import { clearUser } from "../store/userSlice";
import "../index.css"
import { setProductType } from "../store/preferenceSlice";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
    const dispatch = useDispatch();
    const { items: products } = useTypedSelector((state) => state.cart);
    const user = useTypedSelector((state) => state.user);
    const preference = useTypedSelector((state) => state.preference);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate()

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!searchQuery || searchQuery === "") navigate('/browse');
        else navigate(`/browse?search=${searchQuery}`);  // Navigate to the browse page with the search query as a URL parameter
    };

    const handleProductTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setProductType(e.target.value));
        navigate("/browse")
    };

    const toggleDropdown_b = () => {
        setDropdownVisible(!dropdownVisible);
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
        }
    };

    const handleSignOut = async () => {

        try {
            const res = await axios.post("/auth/signout", {}, {
                withCredentials: true
            })
            console.log(res.data.message)
        } catch (e) {
            console.log(e)
        }
        dispatch(clearUser(user));
    }

    return (
        <nav className="flex top-0 sticky z-20 h-16 px-4 w-full justify-around bg-slate-800 items-center">
            <Link to="/browse">
                <div className="flex items-center px-3 gap-x-2">

                    <MainLogo />
                    <b className=" text-2xl text-gray-200">Grocery Shop</b>

                </div>
            </Link>
            <Link to="/browse">
                <p className="pl-4 pr-4 text-xl text-blue-500 duration-200 hover:scale-110 hover:text-green-500">Explore</p>
            </Link>
            <form className="max-w-lg ml-auto mr-4" onSubmit={handleSearch}>
                <div className="flex">
                    <label htmlFor="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                        Your Email
                    </label>
                    <label htmlFor="order-type" className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">Select order type</label>
                    <select
                        id="order-type"
                        onChange={handleProductTypeChange}
                        value={preference.showProductTypes}
                        className="
    flex-shrink-0 z-10 relative inline-flex items-center py-1.5 px-4 
    text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 
    rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none 
    focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 
    dark:focus:ring-gray-700 dark:text-white dark:border-gray-600 
    text-center custom-text-align-last
  "
                    >
                        <option value="all">All Products</option>
                        <option value="bakery">Bakery</option>
                        <option value="fruits">Fruits</option>
                        <option value="snacks">Snacks</option>
                        <option value="beverages">Drinks</option>
                        <option value="personal">Personal</option>
                    </select>

                    <div className="relative w-full">
                        <input
                            type="search"
                            id="search-dropdown"
                            className="block p-2.5 w-64 z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                            placeholder="Search for Products"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="absolute top-0 right-10 p-2.5 text-sm font-medium h-full text-gray-400 bg-transparent"
                                onClick={() => setSearchQuery('')}
                            >
                                <svg
                                    className="w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <button
                            type="submit"
                            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </div>
                </div>
            </form>
            <div className="flex items-center px-3 gap-x-5">


                {user.id ? (
                    <div className="relative">
                        <div
                            className="hover:scale-110 duration-100 cursor-pointer"
                            onClick={toggleDropdown_b}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-circle">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
                            </svg>
                        </div>
                        {dropdownVisible && (
                            <div className="absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <li>
                                        <Link to="/orders" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            View Orders
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleSignOut}
                                            className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                ) : (
                    <Link to="/" className="hover:scale-110 duration-100">
                        <button type="button" className="w-full rounded-lg border border-green-700 px-3 py-2 text-center text-sm font-medium text-green-700 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-900 lg:w-auto">Sign In</button>
                    </Link>
                )}
                {/* <a className="hover:scale-110 duration-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
                </a> */}
                <Link to="/cart" className="hover:scale-110 duration-100 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
                    {products.length > 0 && <b className=" text-xl text-gray-200 absolute -top-4 right-0 - rounded-full">{products.length}</b>}
                </Link>
            </div>
        </nav>
    )
}