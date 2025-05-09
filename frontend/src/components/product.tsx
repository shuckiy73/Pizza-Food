
import { Plus } from 'lucide-react';
import { useAppDispatch } from '../hooks/useReduxHooks';
import { setProduct, setShowModal } from '../redux/slices/modalSlice';
import { addProductToCart } from '../redux/slices/cartSlice';
import { memo } from 'react';


interface props {
    id: number
    name: string
    img_url: string
    description?: string
    rating?: number
    product_type:string
    extra_info?:string
    sizeIndex:number
    add_extra_Ingredients?: string[]
    ingredients: Array<{
        id:number
        name:string
        img_url: string
        price: string
    }>
    sizes: Array<{
        size: number
        grams: number
        price: string
    }>
}


const Product: React.FC<props> = memo(({id, name, img_url, ingredients, product_type, extra_info, description, sizes}) => {

    const img_modify = img_url.replace('292x292', '584x584')
    const dispatch = useAppDispatch()

    const modalOpenHandler = () => {
        dispatch(setProduct({id, name, img_modify, ingredients, sizes, description, product_type, extra_info,
        doughType: 'traditional', sizeIndex: 0, modify: false}))
        dispatch(setShowModal({showModal:true, hideScroll: true}))
    }

    const onAddHandler = () => {
        if (product_type === 'Pizzas') {
            modalOpenHandler()
        } else {
            dispatch(addProductToCart({
                id,
                name,
                img_modify,
                price: sizes[0].price,
                extra: {},
                extra_info,
                modify: false,
                product_type,
                ingredients,
                description,
                sizes,
                sizeIndex: 0,
                grams: sizes[0].grams,
                size: sizes[0].size,
            }))
        }
        
    }

    return (
        <div className='w-[100%] h-[450px] flex flex-col justify-between'>
           <div>
                <div
                onClick={modalOpenHandler}
                style={{backgroundImage: `url(${img_url})`}}
                className="
                    bg-[length:200px_200px]
                    cursor-pointer
                    bg-[57%]
                    rounded-[15px]
                    bg-orange-100 
                    bg-no-repeat 
                    h-[260px] 
                    w-[100%]
                    transition-all
                    hover:bg-[57%_67%]
                ">
                </div>

                <h4 className="text-[22px] my-4 font-bold">{name}</h4>

                <p title={description} className={`text-gray-500 line-clamp-3 h-13 leading-5`}>
                {description}.
                </p>
           </div>

            <div className='flex justify-between items-end'>
                <p>{sizes?.length > 1 && 'From'} <span className='font-bold text-[22px]'> {sizes && sizes[0]?.price} $</span></p>
                <button
                onClick={onAddHandler}
                className='flex items-center  gap-x-2 py-2 px-4 transition-all first-line:rounded-4xl hover:translate-x-1
                '>{product_type === 'Pizzas' ? 'Choose' : <><Plus/> Add</>}</button>
            </div>

        </div>
    );
})
 
export default Product;