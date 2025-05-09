import queryString from "query-string";
import useToastHook from "../hooks/useToastHook";
import { setUserWithTokens } from "../redux/slices/userSlice";
import { useEffect } from "react";
import { GoogleIcon } from "../pages/loginPage";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../hooks/useReduxHooks";
import { useLoginUserWithGoogleMutation } from "../redux/api/userApi";

const LoginWithGoogle = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toastError, toastSuccess } = useToastHook();
  const [login] = useLoginUserWithGoogleMutation();

  useEffect(() => {
    const urlParsed = queryString.parseUrl(window.location.href);

    if (urlParsed?.query?.code) {
      googleHandler(urlParsed.query.code);
    }
  }, []);

  const googleHandler = (response: any) => {
    if (response) {
      login({ authorizationCode: response })
        .unwrap()
        .then((data) => {
          dispatch(setUserWithTokens(data));
          toastSuccess("You success login!")
          navigate("/");
        })
        .catch(() => {
          toastError("something went wrong, please try later!");
          navigate("/login");
        });
    } else {
      toastError("something went wrong, can't auth with google");
      navigate("/login");
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  });

  return (
    <div onClick={googleLogin} className="flex px-5 mt-2 justify-center w-full py-3">
      <div className="min-w-[30px]">
        <GoogleIcon />
      </div>
      <div className="flex w-full justify-center">
        <h1 className="whitespace-nowrap text-gray-600 font-bold">
          Sign in with Google
        </h1>
      </div>
    </div>
  );
};

export default LoginWithGoogle;
