import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useReduxHooks';
import { removeExtra, addExtra } from '../redux/slices/modalSlice';

interface props {
    name: string
    img_url: string
    price: string
}

const Ingredient: React.FC<props> = ({name, img_url, price}) => {

    const { extra } = useAppSelector((state) => state.modalSlice)
    const [active, setActive] = useState<boolean>(extra.hasOwnProperty(name))
    const dispatch = useAppDispatch()
    const ref = useRef(false)

    useEffect(() => {
        if (ref.current) {
            if (active) {
                dispatch(addExtra({name:name,  data:{name, img_url, price}}))
            } else {
                dispatch(removeExtra(name))
            }
        }
        ref.current = true
    }, [active])

    return (
        <div 
        onClick={() => setActive(prev => !prev)}
        className={`
        relative
        w-[106px]
        h-[185px]
        bg-white
        shadow-xl
        cursor-pointer
        p-2
        flex
        flex-col
        justify-between
        hover:scale-105
        hover:${active ? 'border-primary' : 'border-orange-100'}
        hover:border-2
        transition-all
        items-center rounded-[15px] ${active && 'border-2 border-primary'}`}>
            <img className='mt-[10px] ml-1' src={img_url} alt='ingredient' />
            {active && (
                <div className='absolute right-2 p-[1px] top-2 border-2 rounded-4xl border-primary'>
                <Check size={14} color='rgb(254 95 0)' />
            </div>
            )}
            <h5 className='mt-2 mb-2 text-[12px] text-center'>{name}</h5>
            <h6 className='font-bold'>{price}$</h6>
        </div>
    );
}
 
export default Ingredient;