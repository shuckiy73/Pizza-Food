import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Iextra {
    [key:string]: {
        name: string
        price: string
        img_url: string
    }
}


export interface initialState {
    showModal: boolean
    extra: Iextra
    product: {
        id: number
        index: number
        name:string
        modify: boolean
        priceBeforeChanges: number
        img_modify:string
        description:string
        sizeIndex: number
        doughType: 'traditional' | 'thin'
        product_type:string
        extra_info?:string
        ingredients: [
         {
            id: number
            name:string
            img_url: string
            price: string
            }
        ] | [] 
        sizes: {
        [key:string]: { 
            size: number | string | undefined
            grams: number | string | undefined
            price: string}
        }
    }
}

const initialState: initialState = {
    showModal: false,
    extra: {},
    product: {
        id: 0,
        index: 0,
        name: '',
        modify: false,
        priceBeforeChanges: 0,
        sizeIndex: 0,
        doughType: 'traditional',
        img_modify: '',
        product_type: '',
        description: '',
        ingredients: [],
        sizes: {
          "0": {size: '',
            grams: '',
            price: ''}
          }
    },
}

const modalSlice = createSlice({
    name: "modalSlice",
    initialState:initialState,
    reducers: {
        setShowModal: (state, action: PayloadAction<{showModal:boolean, hideScroll: boolean}>) => {
            if (action.payload.hideScroll) {
                document.body.style.marginRight = `${window.innerWidth - document.documentElement.clientWidth}px`
                document.body.style.overflowY = "hidden";
            } else {
                document.body.style.overflowY = 'auto'
                document.body.style.marginRight = `0px`
            }
            state.showModal = action.payload.showModal
        },
        setProduct: (state, action) => {
            state.product = action.payload
        },
        setExtra: (state, action) => {
            state.extra = action.payload
        },
        setSizeIndex: (state, action: PayloadAction<number>) => {
            state.product.sizeIndex = action.payload
        },
        setDoughType: (state, action) => {
            state.product.doughType = action.payload
        },
        addExtra: (state, action) => {
            state.extra[action.payload.name] = action.payload.data 
        },
        removeExtra: (state, action: PayloadAction<string>) => {
            delete state.extra[action.payload]
        },
        setReset: () => initialState
    }
})


export default modalSlice.reducer
export const {
    setShowModal,
    setProduct,
    setExtra,
    setSizeIndex, 
    setDoughType,
    addExtra,
    removeExtra,
    setReset 
} = modalSlice.actions