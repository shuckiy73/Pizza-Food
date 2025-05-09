import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Iproduct {
    id: number
    img_modify:string
    name: string
    price: string
    quantity: number
    extra: {}
    size: string
    grams: string
    pizzaDough?: string
    extra_info?: string
    product_type?: string
    description?: string
}

export interface initialState {
    cartProducts: Iproduct[]
    totalPrice: number
    productsCount: number
}


const initialState:initialState = {
    cartProducts: [],
    totalPrice: 0,
    productsCount: 0
}

const cartSlice = createSlice({
    name: 'userCart',
    initialState,
    reducers: {
        addProductToCart: (state, action) => {
            let findEquelProductInCart = false;

            state.cartProducts.forEach((item) => {
                if (item.id === action.payload.id &&
                    item.pizzaDough == action.payload.pizzaDough &&
                    item.size === action.payload.size &&
                    item.price === action.payload.price &&
                    Object.keys(item.extra).toString() === Object.keys(action.payload.extra).toString()
                ) {
                  item.quantity += 1;
                  state.totalPrice += Number(action.payload.price);
                  findEquelProductInCart = true;
                  return;
                }
              });

              if (!findEquelProductInCart) {
                action.payload.quantity = 1
                state.cartProducts.push(action.payload);
                state.productsCount += 1
                state.totalPrice += Number(action.payload.price);
              }
        },
        changeProductInCart: (state, action: PayloadAction<{
          productInfo: {}
          priceBeforeChanges: number
          productIndex: number
        }>) => {
          const { productInfo, priceBeforeChanges, productIndex} = action.payload

          state.cartProducts[productIndex] = {...state.cartProducts[productIndex], ...productInfo}
          state.totalPrice += Number(
            (Number(state.cartProducts[productIndex].price) * state.cartProducts[productIndex].quantity)
             - 
            (state.cartProducts[productIndex].quantity * priceBeforeChanges)
          )
        },
        removeProductFromCart: (
            state,
            action: PayloadAction<number>,
          ) => {
            state.productsCount -= 1
            state.totalPrice -= Number(state.cartProducts[action.payload].price) * Number(state.cartProducts[action.payload].quantity);
            state.cartProducts = state.cartProducts.filter(
              (_, index) => index !== action.payload,
            );
          },
        increaseProductQuantity: (state, action: PayloadAction<number>) => {
            state.cartProducts[action.payload].quantity += 1
            state.totalPrice += Number(state.cartProducts[action.payload].price)
        },
        decreaseProductQuantity: (state, action: PayloadAction<number>) => {
            state.cartProducts[action.payload].quantity -= 1
            state.totalPrice -= Number(state.cartProducts[action.payload].price)
        },
        clearCart: () => initialState
    }
})

export default cartSlice.reducer
export const { 
  addProductToCart,
  changeProductInCart,
  removeProductFromCart,
  increaseProductQuantity,
  decreaseProductQuantity,
  clearCart
 } = cartSlice.actions