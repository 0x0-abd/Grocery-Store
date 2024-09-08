// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react';
import { axios } from './utils/axios';
import Navbar from './components/Navbar'
import { useDispatch } from 'react-redux';
import { setUser } from './store/userSlice';

function App() {
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/auth/getUser', { withCredentials: true });
        if (response.data.success) {
          const loggedInUser = {
            id: response.data.user._id,
            name: response.data.user.name,
            email: response.data.user.email,
            isAdmin: response.data.user.isAdmin,
          };
          dispatch(setUser(loggedInUser));
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default App
