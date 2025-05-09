import useToastHook from "../hooks/useToastHook";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordConfirmMutation } from "../redux/api/userApi";
import { object, ref, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import Spinner from "../components/spinner";

let passwordResetScheme = object({
  password: string().required("password is required")
    .min(8, "password must be longer that 8 characters")
    .max(24, "password must be shorter than 24 characters"),
  passwordConfirm: string()
    .oneOf([ref("password"), undefined], "Passwords must match")
    .required("password is required"),
});

interface Inputs {
  password: string;
  passwordConfirm: string;
}

const ResetPasswordConfirmPage = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const { toastSuccess, toastError } = useToastHook();
  const [resetPasswordConfirm, { isLoading }] = useResetPasswordConfirmMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(passwordResetScheme),
    mode: "onBlur",
  });


  const onSubmit: SubmitHandler<Inputs> = (data) => {
    resetPasswordConfirm({
      uid,
      token,
      new_password: data.password,
    })
      .unwrap()
      .then(() => {
        toastSuccess("Your password has been successfully changed!");
        reset()
        navigate("/login");
      })
      .catch(() => toastError("Something went wrong!"));
  };


    return (
        <div className="flex items-center justify-center h-screen w-full px-5 mobile:px-0">
        <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-lg lg:max-w-4xl w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full p-8 lg:w-1/2">
            <p className="text-base text-gray-600 text-center">Enter your new password!</p>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                type="password"
                required
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
            </div>
            <div className="mt-4 flex flex-col justify-between">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Repeat Password
                </label>
              </div>
              <input
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
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
              <button type="submit" className="bg-primary text-white font-bold py-3 px-4 w-full rounded">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}
 
export default ResetPasswordConfirmPage;