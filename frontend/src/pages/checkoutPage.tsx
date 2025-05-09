import Modal from "../components/modal";
import CheckoutItem from "../components/checkoutItem";
import ukFlag from "../assets/ukraine_flag.svg";
import roFlag from "../assets/ro_flag.svg";
import useToastHook from "../hooks/useToastHook";
import Spinner from "../components/spinner";
import queryString from "query-string";
import { Navigate, useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { Trash2, Package, Percent, Truck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxHooks";
import { memo, useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { ChevronDown } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { normalizeInput } from "../services/phoneNumberFormat";
import {
  useCheckStripePaymentMutation,
  useCreateOrderMutation,
  usePayWithStripeMutation,
} from "../redux/api/productsApi";


let deliverySchema = object({
  name: string().required("name is required"),
  secondName: string().required("name is required"),
  email: string().email().required("email is required"),
  phone: string().required("phone is required").min(12, "invalid phone number"),
  address: string().required("address is required"),
  comment: string(),
  paymentType: string(),
});

interface Inputs {
  name: string;
  secondName: string;
  email: string;
  phone: string;
  address: string;
  paymentType?: string;
  comment?: string;
}

const flags = [ukFlag, roFlag];
const phonesCountrys: { [key: number]: string } = {
  0: "+380",
  1: "+40",
};

const CheckoutPage = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toastError } = useToastHook()
  const countryRef = useRef<HTMLDivElement | null>(null);
  const { cartProducts, totalPrice } = useAppSelector(
    (state) => state.cartSlice
  );
  const { user } = useAppSelector((state) => state.userSlice);
  const { toastSuccess } = useToastHook();
  const [flagIndex, setFlagIndex] = useState(0);
  const [showFlags, setShowFlags] = useState(false);
  const [checkStripePayment] = useCheckStripePaymentMutation()

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(deliverySchema),
    mode: "onBlur",
    defaultValues: {
      name: user.first_name,
      secondName: user.second_name,
      email: user.email,
      phone: "",
      address: "",
      comment: "",
      paymentType: "card",
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const urlParsed = queryString.parseUrl(window.location.href);

    if (urlParsed?.query?.success && urlParsed?.query?.session_id) {
      checkStripePayment(urlParsed.query.session_id)
      .unwrap()
      .then((data) => {
        toastSuccess(data?.res, 15000)
        dispatch(clearCart());
        reset()
        navigate("/");
      })
      .catch(() => navigate('/checkout'))
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!countryRef?.current?.contains(event.target as Node)) {
        setShowFlags(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, []);

  const [createOrder, { isLoading: isLoadingOrder }] = useCreateOrderMutation();
  const [payWithStripe, { isLoading: isLoadingPayment }] =
    usePayWithStripeMutation();

  const checkoutData = cartProducts.map((item: any, index: number) => (
    <CheckoutItem {...item} index={index} key={index} />
  ));
  const phoneWatch = watch("phone");
  const paymentTypeWatch = watch("paymentType");

  const countryFlags = flags
    .map((item: string, index: number) => (
      <div
        onClick={() => {
          setFlagIndex(index);
          setShowFlags(false);
        }}
        className="flex items-center cursor-pointer gap-x-1"
      >
        <img
          className="h-[30px] w-[30px]"
          src={item}
          key={index}
          alt="country"
        />
        <span className="text-[12px]">{phonesCountrys[index]}</span>
      </div>
    ))
    .filter((_, index) => index !== flagIndex);

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    const { email, name, secondName, phone, address, comment, paymentType } = data;

    const orderItems = cartProducts.map((item) => {
      const {name,product_type,img_modify,price,quantity,size,grams, pizzaDough,extra,extra_info,} = item;

      return {
        name,
        product_type,
        price: paymentTypeWatch === 'card' ? price.replace(".", "") : price,
        img_modify,
        quantity,
        size,
        grams,
        pizzaDough,
        extra_info,
        extra,
      };
    });

    const orderData = {
      email,
      first_name: name,
      second_name: secondName,
      phone: `${phonesCountrys[flagIndex]} ${phone}`,
      address,
      comment,
      paymentType,
      orderPrice: (totalPrice + (totalPrice * 0.19) + 5).toFixed(2),
      orderItems: { ...orderItems }
    }


    if (paymentType === "card") {
      payWithStripe({ orderData })
        .unwrap()
        .then((data) => {
          window.location.href = data.url;
        })
        .catch(() => toastError('something went wrong please try later!'));
      return;
    }

    createOrder(orderData)
      .unwrap()
      .then(() => {
        toastSuccess("You have successfully placed an order!");
        dispatch(clearCart());
        reset()
        navigate("/");
      })
      .catch(() => toastError('failed to place an order, please try again later'));
  };

  if (cartProducts.length === 0) return <Navigate to="/" />;

  return (
    <div className="container h-fit mb-20">
      <div className="flex flex-col m-auto ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex laptop:w-full laptop:flex-col tablet:mx-auto gap-[20px] mt-10"
        >
          <div className="w-fit laptop:mx-auto">
            <div className="bg-gray-100 rounded-[30px] p-[35px] tablet:p-4 mobile:px-2 max-w-[752px]">
              <div className="flex justify-between">
                <h1 className=" text-[24px] font-bold">1. Cart</h1>
                <span
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to clear the trash?"
                      )
                    ) {
                      dispatch(clearCart());
                    }
                  }}
                  className="flex gap-x-1 cursor-pointer opacity-60 transition-all items-center 
                  hover:opacity-30 hover:scale-105"
                >
                  <Trash2 /> Clear cart
                </span>
              </div>
              <hr className="mt-5 mb-5 h-[1px] bg-[#dedede]" />
              {checkoutData}
            </div>
            <div className="mt-10 bg-gray-100 rounded-[30px] p-[35px] max-w-[752px]">
              <h2 className="text-[24px] font-bold">2. Personal info</h2>

              <hr className="mt-5 mb-5 h-[1px] bg-[#dedede]" />

              <div className="grid grid-cols-2 tablet:grid-cols-1 gap-[25px]">
                <div className="flex w-[100%] max-w-[328px] tablet:max-w-[100%] flex-col">
                  <label className="font-bold mb-1">First name</label>
                  <input aria-label="first name" {...register("name")} type="text" />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex w-[100%] max-w-[328px] tablet:max-w-[100%] flex-col">
                  <label className="font-bold mb-1">Second Name</label>
                  <input aria-label="second name" {...register("secondName")} type="text" />
                  {errors.secondName && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.secondName.message}
                    </p>
                  )}
                </div>
                <div className="flex w-[100%] max-w-[328px] tablet:max-w-[100%] flex-col">
                  <label className="font-bold mb-1">E-Mail</label>
                  <input
                  aria-label="email"
                    disabled={user.email ? true : false}
                    {...register("email")}
                    type="text"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col  w-[100%] max-w-[328px] tablet:max-w-[100%]">
                  <label className="font-bold mb-1">Phone</label>

                  <div className="flex items-center gap-x-1">
                    <div ref={countryRef} className="bg-white w-[130px]">
                      <div
                        onClick={() => setShowFlags((prev) => !prev)}
                        className="flex items-center cursor-pointer gap-x-1 p-2 w-fit transition-transform hover:scale-[1.02] "
                      >
                        <img
                          className="h-[30px] w-[30px] cursor-pointer"
                          src={flags[flagIndex]}
                          alt="country"
                        />
                        <span className="text-[12px]">
                          {phonesCountrys[flagIndex]}
                        </span>
                        <ChevronDown size={16} />
                      </div>
                      {showFlags && (
                        <div className="absolute flex flex-col gap-y-2 bg-white mt-2 ml-2">
                          {countryFlags}
                        </div>
                      )}
                    </div>
                    <input
                    aria-label="phone number"
                      {...register("phone")}
                      onChange={(e) => {
                        setValue(
                          "phone",
                          normalizeInput(e.target.value, phoneWatch)
                        );
                        trigger("phone");
                      }}
                      className="w-[100%]"
                      type="text"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 bg-gray-100 rounded-[30px] p-[35px] max-w-[752px]">
              <h3 className="text-[24px] font-bold">4. Delivery address</h3>

              <hr className="mt-5 mb-5 h-[1px] bg-[#dedede]" />

              <div>
                <div className="flex flex-col">
                  <label className="font-bold mb-1">Address</label>
                  <input
                    {...register("address")}
                    aria-label="address"
                    className="w-full"
                    type="text"
                    placeholder="write the address where to deliver..."
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="flex mt-8 flex-col">
                  <label className="font-bold mb-1">Comment to order</label>
                  <textarea
                    {...register("comment")}
                    aria-label="comment for courier"
                    placeholder="Please provide additional information for the courier here..."
                    className="resize-none"
                  />
                  {errors.comment && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.comment.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-4  max-w-[752px] laptop:mx-auto">

          <div className="bg-gray-100 rounded-[30px] p-8 w-full min-w-[300px]">
              <h3 className="text-[24px] font-bold">3. Payment</h3>

              <hr className="mt-5 mb-5 h-[1px] bg-[#dedede]" />

              <div className="flex flex-col gap-y-2">
                {" "}
                <div className="flex items-center gap-x-2 cursor-pointer w-fit">
                  <input
                    {...register("paymentType")}
                    type="radio"
                    aria-label="payment type cash or card"
                    id="payafter"
                    name="paymentType"
                    value="cash"
                  />
                  {" "}
                  <label className="cursor-pointer" htmlFor="payafter">
                    Pay on recieve with cash
                  </label>
                </div>
                {" "}
                <div className="flex items-center gap-x-2 cursor-pointer w-fit">
                  <input
                    {...register("paymentType")}
                    type="radio"
                    id="paynow"
                    name="paymentType"
                    value="card"
                  />
                  {" "}
                  <label className="cursor-pointer" htmlFor="paynow">
                    Pay now with card
                  </label>
                </div>
              </div>
            </div>

          <div className="bg-gray-100 rounded-[30px] p-[40px] h-fit max-w-[450px] w-[100%] laptop:m-auto">
            <h4 className="text-[22px]">Total:</h4>
            <h5 className="font-extrabold mt-4 text-[34px]">
              {(totalPrice + (totalPrice * 0.19 ) + 5).toFixed(2)} $
            </h5>

            <hr className="mt-5 mb-5 h-[1px] bg-[#dedede]" />

            <div className="flex flex-col gap-y-[15px]">
              <div className="flex gap-x-2 items-center">
                <Package className="opacity-30" />
                <div className="flex items-end w-[100%]">
                  <h6 className="text-[18px] min-w-fit">
                    The total value of goods
                  </h6>
                  <div className="border-dotted border-t-[2px] opacity-50  mx-1 mb-[3px] border-black w-[100%]"></div>
                  <h6 className="font-bold min-w-fit">
                    {totalPrice.toFixed(2)} $
                  </h6>
                </div>
              </div>
              <div className="flex gap-x-2 items-center">
                <Percent className="opacity-30" />
                <div className="flex items-end w-[100%]">
                  <h6 className="text-[18px] min-w-fit">Taxes</h6>
                  <div className="border-dotted border-t-[2px] opacity-50  mx-1 mb-[3px] border-black w-[100%]"></div>
                  <h6 className="font-bold min-w-fit">
                    {((totalPrice * 0.19) + 0.95).toFixed(2)} $
                  </h6>
                </div>
              </div>
              <div className="flex gap-x-2 mb-2 items-center">
                <Truck className="opacity-30" />
                <div className="flex items-end w-[100%]">
                  <h6 className="text-[18px] min-w-fit">Delivery</h6>
                  <div className="border-dotted border-t-[2px] opacity-50  mx-1 mb-[3px] border-black w-[100%]"></div>
                  <h6 className="font-bold min-w-fit">5.00 $</h6>
                </div>
              </div>
            </div>
            <span className="text-[12px] text-red-600">When paying by card, the tax may change, depends on the country</span>
            {isLoadingOrder || isLoadingPayment && <Spinner />}
            <button
              disabled={[!!Object.keys(errors)?.length, isLoadingOrder, isLoadingPayment].includes(true)}
              type="submit"
              className="w-full mt-6"
            >
              {paymentTypeWatch === 'cash' ? 'Create an order': 'Payment'}
            </button>
          </div>
          </div>
        </form>
      </div>
      <Modal />
    </div>
  );
});

export default CheckoutPage;
