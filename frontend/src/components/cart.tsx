import emptyCart from "../assets/empty.svg";
import CartItem from "./cartItem";
import { useAppSelector } from "../hooks/useReduxHooks";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

interface props {
    isOpen: boolean
    setIsOpen: (isOpen:boolean) => void
}

const Drawer: React.FC<props> = memo(({ isOpen, setIsOpen}) => {
  const navigate = useNavigate()
  const { cartProducts, totalPrice } = useAppSelector((state) => state.cartSlice)
  const productCount = cartProducts.length
  const cartData = cartProducts.map((item:any, index) => <CartItem {...item} index={index} key={index} />)

  return (
    <main
      className={
        " fixed overflow-hidden z-20 bg-gray-900 bg-opacity-65 inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 translate-x-0  "
          : " transition-all delay-500 opacity-0 translate-x-full  ")
      }
    >
      <section
        className={
          " w-screen max-w-[430px] tablet:max-w-[70%] mobile:max-w-[100%] right-0 absolute bg-[#f4f1ee] h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
          (isOpen ? " translate-x-0 " : " translate-x-full ")
        }
      >
        <article className="relative  flex flex-col space-y-2 overflow-y-hidden h-full">
        {cartData.length > 0 ? (
          <div className="flex flex-col justify-between h-screen">
            <div className="h-[calc(100%-250px)]">
              <div className="flex items-center justify-between p-4">
                {productCount > 0 && <p className="text-[22px]">
                  In cart{" "}
                  <span className="font-bold text-[24px]">{productCount} product{productCount > 1 && 's'}</span>
                </p>}
                <X
                  onClick={() => setIsOpen(false)}
                  size={35}
                  className="opacity-50 hover:scale-125 transition-transform cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-y-2 max-h-[100%] overflow-auto">
                  {cartData}
              </div>
            </div>

            <div className="w-[100%] bg-white h-[180px] p-[35px] flex flex-col gap-y-2">
              <div className="flex items-center">
                  <div className="flex items-end w-[100%]">
                      <h6 className="text-[18px] min-w-fit">The total value of goods</h6>
                      <div className="border-dotted border-t-[2px] opacity-50  mx-1 mb-[3px] border-black w-[100%]"></div>
                      <h6 className="font-bold min-w-fit">{totalPrice.toFixed(2)} $</h6>
                  </div>
              </div>
              <div className="flex gap-x-2 items-center">
                  <div className="flex items-end w-[100%]">
                      <h6 className="text-[18px] min-w-fit">Taxes</h6>
                      <div className="border-dotted border-t-[2px] opacity-50  mx-1 mb-[3px] border-black w-[100%]"></div>
                      <h6 className="font-bold min-w-fit">{((totalPrice * 0.19) + 0.95).toFixed(2)} $</h6>
                  </div>
              </div>

              <button
                    onClick={() => {
                      setIsOpen(false)
                      document.body.style.overflowY = "scroll";
                      navigate('/checkout')
                    }}
                    className="flex text-[20px] mt-2 relative group justify-center items-center gap-x-8 py-4"
                  >
                    Checkout
                    <ArrowRight size={30} className="group-hover:translate-x-8 right-16 absolute transition-transform duration-500" />
            </button>
            </div>
          </div>
        ) : (
          <div className="flex max-w-[285px] m-auto items-center justify-center flex-col gap-y-4">
            <div>
              <img src={emptyCart} alt="cart" />
            </div>
            <h6 className="font-bold text-[22px]">Cart is empty</h6>
            <span className="text-center max-w-[240px] leading-6 opacity-60">
              Add at least one pizza to complete your order
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="flex text-[20px] group justify-center items-center gap-x-2 py-3 w-[80%]"
            >
              <ArrowLeft className="group-hover:-translate-x-5 transition-all" />
              return
            </button>
          </div>
        )}
        </article>
      </section>
      <section
        className="h-full cursor-pointer "
        onClick={() =>  setIsOpen(false)}
      ></section>
    </main>
  );
})

export default Drawer

