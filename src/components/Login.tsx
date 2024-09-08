// SignInForm.tsx
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from '../assets/EyeIcons';
import { axios } from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

// Define Zod schema for form validation
const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  name: z.string().min(1, 'Username is required').min(3, 'Username must be at least 3 characters long'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], // Set path of error message
});

// Define TypeScript type for form data using the Zod schema
type SignInFormData = z.infer<typeof signInSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface SignInFormProps {
  handleToggle: () => void; // A function that toggles between SignIn and Register views
}

const SignInForm: React.FC<SignInFormProps> = ({ handleToggle}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),  // Connect Zod schema with React Hook Form
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [ isLogging, setIsLogging ] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data: SignInFormData) => {
    console.log('Form Data:', data);
    // Handle form submission logic here, e.g., API calls
    setIsLogging(true)
    try {
      const response = await axios.post("/auth/login", data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      // console.log(response.data)
      if (response.data.user._id) {
        console.log("Signed In")
        const loggedInUser = {
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          isAdmin: response.data.user.isAdmin,
        }
        dispatch(setUser(loggedInUser));
        navigate("/browse")
      }
    } catch (e: any) {
      // console.log(e?.response?.data)
      // setError(e.response.data.message)
      // setTimeout(() => {setError(undefined)}, 3000 )
    }
    setIsLogging(false)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full px-4 md:px-8 py-4 rounded-xl border border-gray-600 bg-slate-800">
      {/* Email Input Field */}
      <div className='w-full text-2xl text-white font-semibold text-center'>
        Sign In
      </div>
      <div className='w-full text-sm text-gray-300 text-center'>
        Enter your credentials to login to your account.
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div>
        <label htmlFor="email" className="block  font-medium text-white">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="block mt-2 p-2.5 z-20 w-full  text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder='Email'
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Password Input Field */}
      <div>
        <label htmlFor="password" className="block font-medium text-white">
          Password
        </label>
        <div className="relative">
          <input
            type={passwordVisible ? 'text' : 'password'} // Conditional input type based on passwordVisible state
            id="password"
            {...register('password')}
            className="block mt-2 p-2.5 z-20 w-full text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder='Password'
          />
          {/* Eye icon to toggle password visibility */}
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-400"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 px-4 text-lg bg-blue-700 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
        disabled={isLogging}
      >
        Sign In
      </button>

      <div className='w-full text-sm text-gray-300 text-center'>
        Don't have an account? <button onClick={handleToggle} className=' underline text-white'> Click Here!</button>
      </div>
    </form>
  );
};

const RegisterForm: React.FC<SignInFormProps> = ({ handleToggle }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [ isLogging, setIsLogging ] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data: RegisterFormData) => {
    console.log('Register Form Data:', data);
    // Handle register form submission logic here, e.g., API calls
    setIsLogging(true)
    try {
      const response = await axios.post("/auth/register", data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      // console.log(response.data)
      if (response.data.user._id) {
        console.log("Signed In")
        const loggedInUser = {
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          isAdmin: response.data.user.isAdmin,
        };
        dispatch(setUser(loggedInUser));
        navigate("/browse")
      }
    } catch (e: any) {
      // console.log(e?.response?.data)
      // setError(e.response.data.message)
      // setTimeout(() => {setError(undefined)}, 3000 )
    }
    setIsLogging(false)

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full px-4 md:px-8 py-4 rounded-xl border border-gray-600 bg-slate-800">
      {/* Register Form Content */}
      <div className='w-full text-2xl text-white font-semibold text-center'>
        Register
      </div>
      <div className='w-full text-sm text-gray-300 text-center'>
        Enter your credentials to create a new account.
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

      <div>
        <label htmlFor="name" className="block font-medium text-white">
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="block mt-2 p-2.5 z-20 w-full  text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder='Enter Name'
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block font-medium text-white">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="block mt-2 p-2.5 z-20 w-full  text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder='Email'
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block font-medium text-white">
          Password
        </label>
        <div className="relative">
          <input
            type={passwordVisible ? 'text' : 'password'} // Conditional input type based on passwordVisible state
            id="password"
            {...register('password')}
            className="block mt-2 p-2.5 z-20 w-full text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder='Password'
          />
          {/* Eye icon to toggle password visibility */}
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-400"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block font-medium text-white">
        Confirm Password
        </label>
        <div className="relative">
          <input
            type={passwordVisible ? 'text' : 'password'} // Conditional input type based on passwordVisible state
            id="confirmPassword"
            {...register('confirmPassword')}
            className="block mt-2 p-2.5 z-20 w-full text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder='Confirm Password'
          />
          {/* Eye icon to toggle password visibility */}
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-400"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 text-lg bg-blue-700 text-white font-semibold rounded-md shadow-md hover:bg-green-600"
        disabled={isLogging}
      >
        Register
      </button>
      <div className='w-full text-sm text-gray-300 text-center'>
        Already have an account? <button onClick={handleToggle} className=' underline text-white'> Click Here!</button>
      </div>
    </form>
  );
};

export { SignInForm, RegisterForm };

