import Ingredient from "./ingedient";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { setDoughType, setReset, setShowModal, setSizeIndex } from "../redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxHooks";
import { addProductToCart, changeProductInCart } from "../redux/slices/cartSlice";


interface ingredientI {
    [key:string]: {
        name:string
        img_url: string
        price:string
    }
}

const pizzaSizes = ["small", "medium", "big"]

const Modal: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { showModal, product, extra } = useAppSelector((state) => state.modalSlice);
  const { sizeIndex, doughType } = product


  const ingedientsData = product?.ingredients?.map((item) =>
   <Ingredient {...item} key={item.id} />)

  const totalPriceOfExtraIngrediest = (data:ingredientI) => {
    return Number(Object.values(data).reduce((a, b) => a + Number(b.price), 0))
  }

  const modalCloseHandler = () => {
      dispatch(setReset())
      dispatch(setShowModal({showModal: false, hideScroll: product.modify && location.pathname === '/'}))
  }

  const addToCartProductHandler = (price: number) => {
    const {id, index, name, ingredients, description, img_modify, product_type, sizes, extra_info, priceBeforeChanges, modify} = product
    
    const productInfo = {
      id,
      name,
      img_modify,
      price: price.toFixed(2),
      extra,
      extra_info,
      modify,
      product_type,
      ingredients,
      description,
      sizes,
      sizeIndex,
      grams: sizes[sizeIndex].grams,
      size: sizes[sizeIndex].size,
      ...(product.product_type == 'Pizzas' && {pizzaDough: doughType})
      }

    
    if (modify) {
      dispatch(changeProductInCart({productInfo, priceBeforeChanges, productIndex:index}))
    } else {
      dispatch(addProductToCart(productInfo))
    }

    modalCloseHandler()
  }

  
  const sizes = pizzaSizes.map((item, index) => (
    <div
      key={index}
      onClick={() => dispatch(setSizeIndex(index))}
      className={`${index === sizeIndex && "bg-white shadow-sm text-primary"}
        hover:${index === sizeIndex ? "scale-100" : "scale-105"}
        hover:${index === sizeIndex ? "bg-white" : "bg-gray-300"}
        w-[100%] cursor-pointer  text-center p-1 rounded-[15px] transition font-medium`}
    >
      {item}
    </div>
  ));

  const types = ["traditional", "thin"].map((item, index) => (
    <div
      key={index}
      onClick={() => dispatch(setDoughType(item))}
      className={`${item === doughType && "bg-white shadow-sm text-primary"}
        p-1 rounded-[15px] transition font-medium text-center cursor-pointer w-[100%]
        hover:${item === doughType ? "scale-100" : "scale-105"}
        hover:${item === doughType ? "bg-white" : "bg-gray-300"}
        disabled:bg-red
        `}
    >
      {item}
    </div>
  ));

  return (
    <div
      onClick={modalCloseHandler}
      className={`
        fixed inset-0 flex z-30 justify-center items-center transition-colors 
        ${showModal ? "visible bg-black/75" : "invisible"}
      `}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white rounded-xl shadow transition-all w-[924px] rounded-4xl overflow-y-auto
          ${product.product_type === 'Pizzas' ? 'tablet:h-full': ''}
          ${showModal ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
      >
        <X
          size={30}
          onClick={modalCloseHandler}
          className="absolute cursor-pointer top-2 right-2 transition-transform hover:scale-125 hover:opacity-50"
        />

        <div className="flex tablet:flex-col">
          <div className="w-screen m-auto">
            <img
                className="m-auto h-[450px] w-[450px] mobile:h-[300px] mobile:w-[300px]"
                src={product.img_modify}
              />
          </div>
          <div className="flex flex-col justify-between rounded-r-4xl  bg-[#FCFCFC]">
            <div className="w-[394px] tablet:w-full h-[100%] max-h-[510px] pb-4 mt-10 mobile:mt-2 px-4 overflow-y-auto scrollbar-thin scrollbar-webkit">
              <h6 className="font-bold text-[26px] mb-2">{product.name}</h6>
              <span className="opacity-50">
                {product.product_type === 'Pizzas' && doughType + ' dough, '}
                {product?.sizes[sizeIndex]?.size && product?.sizes[sizeIndex]?.size + ' cm, '}
                {product.extra_info && product.extra_info + ', '}
                {product?.sizes[sizeIndex]?.grams && product?.sizes[sizeIndex]?.grams + ' grams'}
              </span>
              <p className="text-[14px] mt-2 leading-4">
                {product.description}
              </p>
              {product.extra_info && (
                <div className="mt-4 cursor-pointer bg-gray-100 text-center text-[14px] rounded-4xl py-3">
                  {product.extra_info}
                </div>
              )}
              {product.product_type === 'Pizzas' && (
                <>
                <div className="flex p-1 h-8 gap-x-2 mt-4 transition-all relative rounded-[15px] bg-gray-200">
                  {sizes}
                </div>
                <div className="flex p-1 h-8 gap-x-2 mt-2 transition-all relative rounded-[15px] bg-gray-200">
                  {types}
              </div>
              </>
              )}

              {ingedientsData.length > 0 && (
                <>
                <h6 className="my-4 font-bold text-[20px]">Add to taste</h6>

                <div className="flex flex-wrap gap-[14px] mobile:justify-around">
                  {ingedientsData}
                </div>
                </>
              )}
            </div>
            <button 
            onClick={() => addToCartProductHandler((Number(product?.sizes[sizeIndex]?.price) + totalPriceOfExtraIngrediest(extra)))}
            className="my-6 py-3 w-[80%] mx-auto">
              {product.modify ? 'Save' : 
              'Add to cart for ' + (Number(product?.sizes[sizeIndex]?.price) + totalPriceOfExtraIngrediest(extra)).toFixed(2) + '$'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
