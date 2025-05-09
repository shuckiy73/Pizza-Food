import OrderItem, { IorderItem } from "../components/orderItem";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useReduxHooks";
import { useGetListOrdersQuery } from "../redux/api/productsApi";
import Spinner from "../components/spinner";

const OrdersPage = () => {
    const {access, user} = useAppSelector((state) => state.userSlice)
    const { data = [], isLoading } = useGetListOrdersQuery(access)


    const ordersData = data.map((item:IorderItem, index:number) =>
         <OrderItem {...item} orderCount={data.length} index={index} key={item.id} />)

    if (!user.email) return <Navigate to='/' />
    return (
        <div className="container h-full mt-4 pb-40 tablet:px-2">

            <h2 className="font-extrabold text-[36px] mb-4">{ordersData.length > 0 ? "My orders": "You haven't made any orders yet :("}</h2>
            <div className="flex flex-col gap-y-4">
                {isLoading ? <Spinner size="32" /> : ordersData}
            </div>
        </div>
    );
}

export default OrdersPage;