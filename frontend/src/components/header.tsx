
import logo from "../assets/logo.svg";
import { User } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxHooks";
import { logoutUser } from "../redux/slices/userSlice";

const nav: {[key:string]: string} = {
  "Profile": "/profile",
  "My orders": "/orders",
  "Logout": "/login"
}

const Header: React.FC = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const popUpRef = useRef<HTMLInputElement | null>(null)
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const user = useAppSelector((state) => state.userSlice.user.email)

  const popUpNavigation = Object.keys(nav).map((item, index:number) => {
    return (
      <div key={index}>
        <h6 onClick={() => {
          setShowPopup(false)
          if (item === 'Logout') {
            dispatch(logoutUser())
          }
          navigate(nav[item])
        }} className="p-2 font-bold tracking-wider cursor-pointer hover:bg-orange-100">{item}
        </h6>
        <hr className="h-[2px] bg-gray-300"/>
      </div>
    )
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!popUpRef?.current?.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, []);


  const onClickHandler = () => {
    if (user) {
      setShowPopup(prev => !prev)
    } else {
      navigate('/login')
    }
  }

  return (
    <header
      className={`pt-[40px] flex items-center justify-between laptop:px-2`}
    >
      <div
        onClick={() => navigate("/")}
        className={`items-center gap-x-[15px] min-w-fit flex cursor-pointer tablet:gap-x-[6px]`}
      >
        <img src={logo} alt="logo" />
        <div className="tablet:mt-2">
          <h1 className="text-2xl font-black tablet:text-base tablet:leading-[10px] laptop:text-xl">
            DJANGO PIZZA
          </h1>
          <span className="text-gray-500 text-base tablet:text-[10px]">
            it couldn't be more delicious
          </span>
        </div>
      </div>


      <div className="flex gap-x-[15px] relative tablet:gap-x-[6px]">
        <button
          onClick={onClickHandler}
          className="hover:bg-orange-600 relative py-[12px] px-[16px] items-center h-fit flex hover:text-white tablet:p-[6px]"
        >
          <User className="#fff" />
          <span className="font-bold">{user ? 'Profile' : 'Login'}</span>
        </button>
        {showPopup && (
            <div ref={popUpRef} className="h-fit top-[55px] left-0 z-40 absolute w-full text-black  bg-white shadow-lg border-2 ">
              {popUpNavigation}
            </div>
          )}
      </div>
    </header>
  );
});

export default Header;
