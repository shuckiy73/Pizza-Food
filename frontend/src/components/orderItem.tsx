import { ChevronDown } from "lucide-react";
import { memo, useState } from "react";
import { Iextra } from "../redux/slices/modalSlice";
import { CircleDollarSign, CreditCard } from "lucide-react";

export interface IorderItem {
  id: number;
  index: number;
  orderCount: number;
  email: string;
  first_name: string;
  second_name: string;
  phone: string;
  address: string;
  comment: string;
  orderPrice: string;
  paymentType: string;
  paid_status: boolean;
  created: string;
  orderItems: Array<{
    name: string;
    img_modify: string;
    product_type: string;
    price: number;
    quantity: number;
    size: number | null | undefined;
    grams: number | null | undefined;
    pizzaDough?: string;
    extra_info: string;
    extra: Iextra;
  }>;
}

const months: { [key: string]: string } = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  10: "Octomber",
  11: "November",
  12: "December",
};

const pizzaSizes: { [key: string]: string } = {
  25: "small",
  30: "medium",
  35: "big",
  0: "",
};

const OrderItem: React.FC<IorderItem> = memo(({
  index,
  created,
  orderCount,
  paymentType,
  paid_status,
  orderItems,
  orderPrice,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const date = created.split("/");

  const orderItemsDate = Object.values(orderItems).map((item, index) => {
    return (
      <div key={index}>
        <div className="flex items-center justify-between gap-x-1">
          <div className="flex items-center gap-x-3">
            <div className="w-[68px] h-[68px]">
              <img src={item.img_modify} alt="product" />
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="font-bold text-[20px]">{item.name}</h3>
              <span className="opacity-50">
                {pizzaSizes[item?.size || 0]} {item.size && item.size + " cm, "}{" "}
                {item.pizzaDough} {item.extra_info}
              </span>
              {Object.keys(item.extra).length > 0 && (
                <p className="text-[14px] max-w-[280px]">
                  + {Object.keys(item.extra).join(", ")}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-1">
            <h4 className="font-bold min-w-max text-[20px]mobile:text-[16px]">
              {(item.price * item.quantity).toFixed(2)} $
            </h4>
            <span className="opacity-50">X {item.quantity}</span>
          </div>
        </div>

        <hr className="mt-5 mb-5 h-[2px] bg-[#dedede]" />
      </div>
    );
  });

  return (
    <div className="max-w-[752px] bg-gray-200 rounded-[30px] p-6 mobile:p-4 target:p-2">
      <div className="flex items-center justify-between gap-x-4">
        <div className="flex items-center gap-x-4">
          <h2 className="text-[24px] mobile:text-[18px] min-w-fit font-bold">
            Order #{orderCount - index}
          </h2>
          <span className="opacity-50 mobile:text-[14px]">{`${date[0]} ${
            months[date[1]]
          } ${date[2]}`}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-1 mobile:flex-col">
            <div
              className={`w-[80px] tablet:w-[80px] text-center h-[40px] bg-gray-300 flex items-center justify-center gap-x-1 font-bold py-3 rounded-[30px]`}>
              {paymentType === "cash" ? (
                <CircleDollarSign color="green" />
              ) : (
                <CreditCard />
              )}
              {paymentType}
            </div>
            <div
              className={` w-[100px] tablet:w-[80px] text-center font-bold py-3 rounded-[30px]
                            ${paid_status ? "bg-green-200" : "bg-red-400"}
                            ${paid_status ? "text-green-600" : "text-red-900"} 
              `}>
              {paid_status ? "paid" : "unpaid"}
            </div>
          </div>
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="bg-gray-50 p-2 rounded-[30px] hover:scale-105 hover:bg-gray-300 transition-colors cursor-pointer"
          >
            <ChevronDown
              className={`${
                open ? "rotate-180" : ""
              } transition-all duration-500`}
            />
          </div>
        </div>
      </div>

      <div
        className={`${
          open ? `max-h-screen mt-4` : "max-h-0"
        } transition-all overflow-y-scroll scrollbar-thin scrollbar-webkit pr-2 duration-500 overflow-hidden  w-full`}
      >
        <hr className=" h-[2px] mb-5 bg-[#dedede]" />
        {orderItemsDate}
      </div>
      {open && (
        <p className="text-[24px] mobile:mt-2 mobile:text-[16px]">
          Total include delivery & taxe:{" "}
          <span className="font-bold">{orderPrice} $</span>
        </p>
      )}
    </div>
  );
});

export default OrderItem;
