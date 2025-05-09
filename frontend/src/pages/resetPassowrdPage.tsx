import { Undo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResetPasswordMutation } from '../redux/api/userApi';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import Spinner from '../components/spinner';
import useToastHook from '../hooks/useToastHook';

let userSchema = object({email: string().email().required("email is required")});
interface Inputs {email: string}

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const {toastInfo, toastError} = useToastHook()
  const [resetPassword, {isLoading}] = useResetPasswordMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(userSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    resetPassword({email: data.email}).unwrap()
    .then(() => {
      toastInfo("Link to reset you password was sent to your email!");
      reset()
      navigate("/");
    })
    .catch(() => toastError("user with this email not exist"));
  };


    return (
        <div className="flex items-center justify-center h-screen w-full px-5 mobile:px-0">
      <div className="flex relative bg-white rounded-lg shadow-lg border overflow-hidden max-w-lg w-full">
          <Undo2 onClick={() => navigate('/login')} className='absolute top-2 left-2 hover:scale-105 cursor-pointer hover:text-primary transition-all'/>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full p-8 lg:w-1/2">
          <p className="text-base text-gray-600 text-center">
          Lost your password? <br/> Please enter your email address. You will
          receive a link to create a new password via email.
          </p>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
              type="email"
              required
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
              {errors.email.message}
            </p>
            )}
          </div>
          {isLoading && <Spinner />}
          <div className="mt-4">
            <button disabled={isLoading} className="bg-primary text-white font-bold py-3 px-4 w-full rounded">
              Reset password
            </button>
          </div>
        </form>
      </div>
    </div>
    );
}
 
export default ResetPasswordPage;