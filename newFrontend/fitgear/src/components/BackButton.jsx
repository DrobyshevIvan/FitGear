import { use } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-6 py-2 mb-4 ml-6 border border-gray-400 rounded-full bg-white text-gray-800 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:border-black hover:shadow-xl cursor-pointer"
        >
            <ArrowLeft
                size={20}
                className="transition duration-300 ease-in-out text-gray-600 group-hover:text-black group-hover:-translate-x-1"
            />
            <span className="transition duration-300 ease-in-out group-hover:text-black">Back</span>
        </button>
    );
}