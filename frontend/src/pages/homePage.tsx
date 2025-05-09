import { memo, useEffect, useState } from "react";
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useGetProductsListQuery } from "../redux/api/productsApi";
import { useAppSelector } from "../hooks/useReduxHooks";
import ProductList from "../components/Product-list";
import Modal from "../components/modal";
import Drawer from "../components/cart";


const productsTypes = ['Pizzas', 'Snacks', 'Beverages', 'Cocktails', 'Cofe', 'Desserts', 'Sauces']

const HomePage: React.FC = memo(() => {
    const [productType, setProductType] = useState<string>(productsTypes[0])
    const [open, setIsOpen] = useState(false);
    const { productsCount } = useAppSelector((state) => state.cartSlice)
    const {data: data = [], isLoading} = useGetProductsListQuery({})


    useEffect(() => {
        if (open) {
          document.body.style.overflowY = "hidden";
        } else {
          document.body.style.overflowY = "scroll";
        }
      }, [open]);


    const productsData = productsTypes.map((item, index) => (
        <ProductList key={index} isLoading={isLoading} data={data[item]} title={item} setProductType={setProductType} />
    ))
    
    const pTypes = productsTypes.map((item, index) => (
        <a
        key={index}
        href={`/#${item}`}
        className={`${item === productType ? 'bg-white shadow-sm text-primary' : 'hover:bg-gray-200'}
        w-[100%]
        text-center
        cursor-pointer p-3 rounded-[15px] transition font-medium
        tablet:px-0
        `}
        >
            {item}
        </a>
    ))


    return (
        <div>

            <div className="flex py-1 tablet:px-2 gap-x-4 sticky top-0 backdrop-blur-sm bg-white/75 z-10 shadow-black/5  bg-white shadow-lg items-center justify-between mt-[22px]">
                <div className="flex overflow-x-auto w-[761px] transition-all relative p-1 gap-x-6 rounded-[15px] bg-gray-100">
                    {pTypes}
                </div>

                <div
                    onClick={() => setIsOpen(true)}
                    className="flex bg-primary transition-transform cursor-pointer relative group items-center border-none gap-x-2 text-black rounded-[15px] py-[12px] px-[18px] h-fit tablet:p-[6px]
                    hover:bg-orange-600
                    hover:scale-105
                    "
                >
                    <ShoppingCart color='#fff' />
                    {productsCount > 0 && (
                        <>
                        <div className="text-white">|</div>
                        <span className="text-white transition-opacity delay-75 group-hover:opacity-0">{productsCount}</span>
                        <ArrowRight className="absolute right-4 opacity-0
                        group-hover:opacity-100 group-hover:translate-x-2 transition-all delay-100" color="#fff" size={18} />
                        </>
                    )}
                </div>
            </div>


            <div className="flex flex-col justify-between w-[100%]">
                {productsData}
            </div>

            <div className="my-24 px-2">
                <h5 className="font-bold text-[34px]">Delivery and payment</h5>

                <div className="flex gap-x-10 mt-10">
                    <div className="flex flex-col gap-y-4">
                        <h6 className="text-primary font-bold text-[20px]">60 minutes or free pizza</h6>
                        <p className="max-w-[450px]">
                        If we fail to deliver in 60 minutes,
                        you will receive an excused pizza.
                        It can be added to one of the following orders.
                        </p>
                        <span>All prices on the menu do not include discounts..</span>
                    </div>
                    <div className="flex flex-wrap gap-x-10">
                        <div>
                            <span className="text-primary font-bold text-[20px]">from 6.90 $</span>
                            <p>Minimum delivery amount</p>
                        </div>
                        <div>
                            <span className="text-primary font-bold text-[20px]">100.00 $</span>
                            <p>Maximum amount when paying in cash</p>
                            <p>Product images may differ from the products in your order.</p>
                        </div>
                    </div>
                </div>
            </div>
           <Modal />
           <Drawer isOpen={open} setIsOpen={setIsOpen} />
        </div>
    );
})
 
export default HomePage;