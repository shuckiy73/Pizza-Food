import { memo } from "react";
import { Plus, Minus } from "lucide-react";
import { useAppDispatch } from "../hooks/useReduxHooks";
import { decreaseProductQuantity, increaseProductQuantity } from "../redux/slices/cartSlice";

interface props {
    padding?: string
    quantity: number
    index: number
}

const Quantity: React.FC<props> = memo(({padding = '2', quantity, index}) => {
    const dispatch = useAppDispatch()

    return (
        <div className="flex gap-x-2 items-center">
            <button 
            aria-label="decrease product quantity"
            onClick={() => dispatch(decreaseProductQuantity(index))}
            disabled={quantity === 1}
            type="button"
            className={`p-${padding} mobile:p-[2px] bg-white text-primary hover:bg-primary hover:text-white hover:scale-110`}><Minus/></button>
            <span className="font-bold text-[20px]">{quantity}</span>
            <button
            type="button"
            aria-label="increase product quantity"
            onClick={() => dispatch(increaseProductQuantity(index))}
            className={`p-${padding} mobile:p-[2px] bg-white text-primary hover:bg-primary hover:text-white hover:scale-110`}><Plus/></button>
        </div>
    );
})
 
export default Quantity;