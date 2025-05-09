import Spinner from "../components/spinner";
import useToastHook from "../hooks/useToastHook";
import { useParams, useNavigate } from "react-router-dom";
import { useActivationAccountMutation } from "../redux/api/userApi";


const AccountActivationPage: React.FC = () => {

  const { uid, token } = useParams();
  const [activateAccount, { isLoading }] = useActivationAccountMutation();

  const { toastSuccess, toastError } = useToastHook();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await activateAccount({
      uid,
      token,
    })
      .unwrap()
      .then(() => toastSuccess("the account was successfully activated"))
      .catch(() =>
        toastError("something went wrong, account activation failed!"),
      );
    navigate("/login");
  };
    return (
        <div className="flex items-center justify-center h-screen w-full px-5 mobile:px-1">
        <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-lg w-full">
          <form onSubmit={handleSubmit} className="w-full p-8">
            <p className="text-base text-gray-600 text-center">Activate your account!</p>
            {isLoading && <Spinner />}
            <div className="mt-4">
              <button disabled={isLoading} type="submit" className="bg-primary text-white font-bold py-3 px-4 w-full rounded">
                Activate
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}
 
export default AccountActivationPage;