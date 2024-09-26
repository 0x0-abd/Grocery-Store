import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux';
import './index.css'
import store from "./store/index.ts"
import Home from './routes/Home.tsx';
import Browse from './routes/Browse.tsx';
import Cart from './routes/Cart.tsx';
import Orders from './routes/Orders.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, 
        element: <Home />,
      },
      {
        path: "/browse",
        element: <Browse/>
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/orders",
        element: <Orders />
      },
      {
        path: "/product/:productId",
        element: <div> ohIsee </div>
      }
    ]
  },
])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient} >
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
