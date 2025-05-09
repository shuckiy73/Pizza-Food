import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { useLoginUserMutation } from "../redux/api/userApi";
import { Iuser, setUserWithTokens } from "../redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxHooks";
import { jwtDecode } from 'jwt-decode';
import useToastHook from "../hooks/useToastHook";
import Spinner from "../components/spinner";
import LoginWithGoogle from "../components/loginWithGoogle";

let userSchema = object({
  email: string().email().required("email is required"),
  password: string().required("password is required"),
});

interface Inputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(userSchema),
    mode: "onBlur",
  });

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [loginUser, {isLoading}] = useLoginUserMutation()
  const { toastSuccess, toastError } = useToastHook()
  const { user } = useAppSelector((state) => state.userSlice)

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    loginUser({
      email: data.email,
      password: data.password,
    })
      .unwrap()
      .then((data: any) => {
        const { user } = jwtDecode<{user: Iuser}>(data.access)
        dispatch(setUserWithTokens({...data, user}))
        toastSuccess('You login success!')
        reset()
        navigate('/')
      })
      .catch((error) => {
        if (error.status === "FETCH_ERROR") {
          toastError("we have some problems with server, please try later!");
        }
        if (error.status === 401) {
          toastError("invalid email or password!");
          reset({ password: "" });
        }
      });
  };

  if (user?.email) return <Navigate to='/' />

  return (
    <div className="flex items-center justify-center py-10 h-fit w-full px-5 mobile:px-0">
      <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-lg w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full p-8">
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className={`text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2
                border-${errors.email ? 'red-500' : 'border-gray-300'}
               focus:outline-blue-700`}
              type="email"
              autoComplete="email"
              required
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
              {errors.email.message}
            </p>
            )}
          </div>
          <div className="mt-4 flex flex-col justify-between">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
            </div>
            <input
              {...register('password')}
              type="password"
              autoComplete="current-password"
              className={`text-gray-700 border rounded py-2 px-4 block w-full focus:outline-2
                border-${errors.password ? 'red-500' : 'border-gray-300'}
                focus:outline-blue-700`}
            />
            {errors.password && (
                <p className="text-red-500 text-sm mt-2">
                {errors.password.message}
              </p>
              )}
            <Link
              to="/reset-password"
              className="text-xs text-gray-500 hover:text-gray-900 text-end w-full mt-2"
            >
              Forget Password?
            </Link>
          </div>
          {isLoading && <Spinner />}
          <div className="mt-4">
            <button disabled={isLoading} className="bg-primary text-white font-bold py-3 px-4 w-full rounded">
              Login
            </button>
          </div>
          <div
            className=" flex cursor-pointer items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100"
          >
            <LoginWithGoogle />
          </div>
          <div className="mt-4 flex items-center w-full text-center">
            <span
              className="text-xs text-gray-500 capitalize text-center w-full"
            >
              Don&apos;t have any account yet?
              <Link to='/sign-up' className="text-blue-700"> Sign Up</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;

export const GoogleIcon = () => {
  return (
    <svg className="h-6 w-6" viewBox="0 0 40 40">
      <path
        d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
        fill="#FFC107"
      />
      <path
        d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
        fill="#FF3D00"
      />
      <path
        d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
        fill="#4CAF50"
      />
      <path
        d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
        fill="#1976D2"
      />
    </svg>
  );
};
