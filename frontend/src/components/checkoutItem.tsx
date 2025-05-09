import Quantity from "./quantity";
import { X } from "lucide-react";
import { useAppDispatch } from "../hooks/useReduxHooks";
import { removeProductFromCart } from "../redux/slices/cartSlice";
import { setProduct, setExtra, setShowModal } from "../redux/slices/modalSlice";
import { IitemProps } from "./cartItem";
import { memo } from "react";


const CheckoutItem: React.FC<IitemProps> = memo(({
  id,
  index,
  name,
  img_modify,
  size,
  pizzaDough,
  grams,
  extra,
  quantity,
  price,
  ingredients,
  sizes,
  sizeIndex,
  description,
  product_type,
  extra_info
}) => {
  const dispatch = useAppDispatch();

  const modalOpenHandler = () => {
    dispatch(setProduct({id, index, name, img_modify, ingredients, sizes, sizeIndex, description, product_type, extra_info,
    priceBeforeChanges: Number(price), doughType: pizzaDough, modify: true}))
    dispatch(setExtra(extra))
    dispatch(setShowModal({showModal: true, hideScroll: true}))
  }

  return (
    <>
      <div className="flex items-center justify-between gap-x-4 mobile:gap-x-2">
        <div className="flex gap-x-2 items-center">
          <img className="w-[64px] h-[64px] mobile:w-[32px] mobile:h-[32px]" src={img_modify} alt="pizza" />

          <div className="flex flex-col max-w-[200px] w-[198px] tablet:w-[120px] mobile:w-[80px] gap-y-1">
            <span onClick={modalOpenHandler}
            className="text-primary font-bold cursor-pointer hover:text-orange-700">
            Change</span>
            <h6 className="font-bold text-[16px] tablet:text-[14px]">{name} </h6>
            <span className="text-[14px] tablet:text-[12px]">
              {size && `${size} cm, `}
              {pizzaDough && `${pizzaDough} dough, `}
              {grams && `${grams} grams `}
              {extra_info && `${extra_info}`}
            </span>
            {Object.keys(extra).length > 0 && (
              <p className="text-[14px]">
                + {Object.keys(extra).join(", ")}
              </p>
            )}
          </div>
        </div>

        <span className="font-bold min-w-[100px] tablet:ml-auto text-center">
          {(Number(price) * Number(quantity)).toFixed(2)} $
        </span>
        <div className="tablet:ml-auto">
        <Quantity index={index} quantity={quantity} />
        </div>

        <X
          onClick={() => dispatch(removeProductFromCart(index))}
          className="cursor-pointer transition-transform hover:scale-125 hover:opacity-50"
        />
      </div>

      <hr className="mt-5 mb-5 h-[1px] bg-[#dedede]" />
    </>
  );
});

export default CheckoutItem;
