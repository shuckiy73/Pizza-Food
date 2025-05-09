import { BaseApi, baseHeadersOptions } from './baseApi'

// Define a service using a base URL and expected endpoints
export const productsApi = BaseApi.enhanceEndpoints({
  addTagTypes: ["user"],
}).injectEndpoints({
  endpoints: (builder) => ({
    getProductsList: builder.query({
      query: () => 'api/products/products-list/'
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: 'api/orders/create-order/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["user"]
    }),
    getListOrders: builder.query({
      query: (access) => ({
        url: 'api/orders/list-orders/',
        method: 'GET',
        headers: {
          ...baseHeadersOptions,
          Authorization: "JWT " + access
        },
      }),
      providesTags: ["user"]
    }),
    payWithStripe: builder.mutation({
      query: (data) => ({
        url: `/api/stripe/create-checkout-session/`,
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: data
      }),
    }),
    checkStripePayment: builder.mutation({
      query: (data) => ({
        url: '/api/stripe/payment-notification/',
        method: 'POST',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(data)
      })
    })
  }),
})


export const {
  useGetProductsListQuery,
  useCreateOrderMutation,
  useGetListOrdersQuery,
  usePayWithStripeMutation,
  useCheckStripePaymentMutation
 } = productsApi