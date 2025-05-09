import { ArrowLeft } from "lucide-react";
import img from '../assets/404.svg'


const PageNotFound = () => {
    return (
        <div className="flex items-center gap-x-10 justify-center h-screen w-full">
            <div className="flex flex-col gap-y-4">
                <h2 className="font-bold text-[32px]">Page not found</h2>
                <span className="opacity-50 max-w-80">Check that the address you entered is correct or try again later.</span>
                <div className="flex gap-x-4">
                    <button className="flex group items-center py-2 gap-x-2">
                        <ArrowLeft className="group-hover:-translate-x-5 transition-transform" />
                        Home
                    </button>
                    <button className="bg-white hover:bg-gray-200 border-gray-400 text-gray-400">Reload</button>
                </div>
            </div>

            <div>
                <img src={img} alt='img' /> 
            </div>
            
        </div>
    );
}
 
export default PageNotFound;