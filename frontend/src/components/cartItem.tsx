import Quantity from "./quantity";
import { X } from "lucide-react";
import { useAppDispatch } from "../hooks/useReduxHooks";
import { removeProductFromCart } from "../redux/slices/cartSlice";
import { setExtra, setProduct, setShowModal } from "../redux/slices/modalSlice";
import { memo } from "react";

export interface IitemProps {
  index: number;
  id: number;
  name: string;
  img_modify: string;
  grams: number;
  price: string;
  quantity: number;
  size: string;
  sizeIndex: number;
  sizes: any;
  extra: any;
  pizzaDough?: string;
  description: string;
  product_type: string;
  extra_info: string;
  ingredients: any;
}

const CartItem: React.FC<IitemProps> = memo(
  ({
    id,
    index,
    name,
    img_modify,
    grams,
    price,
    extra,
    ingredients,
    description,
    product_type,
    extra_info,
    quantity,
    size,
    sizeIndex,
    sizes,
    pizzaDough,
  }) => {
    const dispatch = useAppDispatch();

    const modalOpenHandler = () => {
      dispatch(
        setProduct({
          id,
          index,
          name,
          img_modify,
          ingredients,
          sizes,
          sizeIndex,
          description,
          product_type,
          extra_info,
          priceBeforeChanges: Number(price),
          doughType: pizzaDough,
          modify: true,
        })
      );
      dispatch(setExtra(extra));
      dispatch(setShowModal({ showModal: true, hideScroll: true }));
    };

    return (
      <div className="flex flex-col p-2 bg-white gap-x-4">
        <div className="flex w-[100%] gap-x-3">
          <img
            className="w-[64px] h-[64px] ml-1"
            src={img_modify}
            alt="pizza"
          />

          <div className="flex flex-col gap-y-1 mt-2">
            <h6 className="font-bold text-[14px]">{name}</h6>
            <span className="text-[12px]">
              {size && `${size} cm, `}
              {pizzaDough && `${pizzaDough} dough, `}
              {grams && `${grams} g`}
            </span>
            {Object.keys(extra).length > 0 && (
              <p className="text-[12px] max-w-[250px]">
                + {Object.keys(extra).join(", ")}
              </p>
            )}
          </div>

          <X
            onClick={() => dispatch(removeProductFromCart(index))}
            className="ml-auto cursor-pointer transition-transform hover:scale-125 hover:opacity-50"
          />
        </div>

        <hr className=" h-[2px] my-2 w-full bg-gray-100" />

        <div className="flex items-center justify-between">
          <span className="ml-1 font-bold">
            {(Number(price) * Number(quantity)).toFixed(2)} $
          </span>
          <div className="flex items-center gap-x-3">
            <span
              onClick={modalOpenHandler}
              className="text-primary font-bold cursor-pointer transition-transform hover:scale-105 hover:text-orange-700"
            >
              Change
            </span>
            <Quantity index={index} quantity={quantity} padding="1" />
          </div>
        </div>
      </div>
    );
  }
);

export default CartItem;
