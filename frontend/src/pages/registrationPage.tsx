import { Link, useNavigate } from "react-router-dom";
import { GoogleIcon } from "./loginPage";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { object, string, ref } from "yup";
import { useCreateUserMutation } from "../redux/api/userApi";
import useToastHook from "../hooks/useToastHook";
import Spinner from "../components/spinner";



let userSchema = object({
  email: string()
  .required("Email is required")
  .email("Please enter valid email"),
  name: string().required("name is required")
    .min(2, "name must be longer that 2 characters")
    .max(24, "name must be shorter than 24 characters"),
  secondName: string().required("name is required")
    .min(2, "second name must be longer that 2 characters")
    .max(24, "second name must be shorter than 24 characters"),
  password: string().required("password is required")
    .min(8, "password must be longer that 8 characters")
    .max(24, "password must be shorter than 24 characters"),
  passwordConfirm: string()
    .oneOf([ref("password"), undefined], "Passwords must match")
    .required("password is required"),
});

interface Inputs {
  email: string;
  name: string;
  secondName: string;
  password: string;
  passwordConfirm: string;
}

const RegistrationPage: React.FC = () => {

  const navigate = useNavigate()
  const [createUser, {isLoading}] = useCreateUserMutation()
  const { toastError, toastInfo} = useToastHook()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(userSchema),
    mode: "onBlur",
  });


  const checkEmail = async (email:string) => {
    let response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/user/check-email/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      },
    );
    if (response.ok) {
      return true;
    } 

    return false; 
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const email = await checkEmail(data.email)

    if (!email) {
      toastError('user with this email already exist')
      reset({email: ""})
      return
    }

    createUser({
      first_name : data.name,
      second_name: data.secondName,
      email: data.email,
      password: data.password
    }).unwrap().then(() => {
      toastInfo(
        "An activation code has been sent to your email, please verify your account!",
      );
      reset();
      navigate("/login");
    })
    .catch(() =>
      toastError("we have some problem with server, please try later!"),
    );
  };

  return (
    <div className="flex items-center justify-center h-fit py-10 w-full px-5 mobile:px-0">
      <div className="flex bg-white rounded-lg shadow-lg border max-w-lg overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full p-8">
          <p className="text-xl text-gray-600 text-center">Create Account!</p>
          <div className="mt-4 flex gap-x-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                First Name
              </label>
              <input
                className={`text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2
                border-${errors.name ? "red-500" : "border-gray-300"}
                focus:outline-blue-700`}
                {...register("name")}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Second Name
              </label>
              <input
                {...register("secondName")}
                required
                className={`text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2
                  border-${errors.secondName ? "red-500" : "border-gray-300"}
                 focus:outline-blue-700`}
              />
              {errors.secondName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.secondName.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className={`text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2
              border-${errors.email ? "red-500" : "border-gray-300"}
              focus:outline-blue-700`}
              type="email"
              autoComplete="email"
              required
              {...register("email")}
              />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
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
              className={`text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2
              border-${errors.password ? "red-500" : "border-gray-300"}
               focus:outline-blue-700`}
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
            <div className="flex mt-4 justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Repeat Password
              </label>
            </div>
            <input
              className={`text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2
              border-${errors.passwordConfirm ? "red-500" : "border-gray-300"}
               focus:outline-blue-700`}
              type="password"
              autoComplete="new-password"
              {...register("passwordConfirm")}
            />
            {errors.passwordConfirm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>
          {isLoading && <Spinner />}
          <div className="mt-4">
            <button disabled={isLoading} className="bg-primary text-white font-bold py-3 px-4 w-full rounded">
              Sign-up
            </button>
          </div>
          <div
            className="flex cursor-pointer items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100"
          >
            <div className="flex px-5 mt-2 justify-center w-full py-3">
              <div className="min-w-[30px]">
                <GoogleIcon />
              </div>
              <div className="flex w-full justify-center">
                <h1 className="whitespace-nowrap text-gray-600 font-bold">
                  Sign in with Google
                </h1>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center w-full text-center">
            <span
              className="text-xs text-gray-500 capitalize text-center w-full"
            >
              Already have an account?
              <Link to="/login" className="text-blue-700">
                {" "}
                Sign In{" "}
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RegistrationPage;
