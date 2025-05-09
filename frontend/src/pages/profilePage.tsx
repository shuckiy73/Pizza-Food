import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useReduxHooks";
import noProfileImg from '../assets/noProfileImg.webp'

const Profile = () => {
    const { user } = useAppSelector((state) => state.userSlice)
    if (!user.email) return <Navigate to='/' />
    
    return (
        <div className="py-32">

            <ul className="flex m-auto flex-col gap-y-2 bg-gray-200 w-fit p-8 rounded-4xl">
                <li>
                    <img 
                        className="h-32 w-32 m-auto rounded-[100%] mb-4 shadow-lg "
                        src={user?.img_url || noProfileImg} alt="profile img" 
                    />
                 </li>
                <li>E-mail: {user.email}</li>
                <li>First Name: {user.first_name}</li>
                <li>Second Name: {user.second_name}</li>
            </ul>
        </div>
    );
}
 
export default Profile;