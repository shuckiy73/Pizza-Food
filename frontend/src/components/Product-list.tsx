import Product from "./product"
import { memo, useEffect, useRef } from "react";
import { useIntersection, useMedia } from "react-use";
import { Iproduct } from "../redux/slices/cartSlice";
import Skeleton from "./skeleton";


interface props {
    data: Array<Iproduct>
    title: string
    isLoading: boolean
    setProductType: (productType:string) => void
}

const ProductList: React.FC<props> = memo(({data, title, isLoading, setProductType}) => {
    const isWide = useMedia('(max-width: 480px)');
    const threshold = title === 'Pizzas' && isWide ? 0.1 : 0.25
    const intersectionRef = useRef(null);
    const intersection = useIntersection(intersectionRef, {
        threshold: threshold
      });

    useEffect(() => {
        if (intersection?.isIntersecting) {
            setProductType(title)
        }
    }, [title, intersection?.isIntersecting])



    const items = isLoading ? [...new Array(4)].map((_, index) => <Skeleton key={index} />)
                            : data?.map((product:any, index:number) => <Product key={index} {...product} />)

    return (
        <div id={title} ref={intersectionRef}>
            {items.length > 0 && <h2 className="font-bold text-[40px] pt-[60px] mb-[20px]">{title}</h2>}
            <div className={`grid px-2 grid-cols-4 flex-wrap gap-[20px] laptop:grid-cols-3 tablet:grid-cols-2
             mobile:grid-cols-1
             `}>
                {items}
            </div>
        </div>
    );
})
 
export default ProductList;