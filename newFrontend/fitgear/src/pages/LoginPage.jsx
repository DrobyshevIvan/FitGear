import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BackButton from "../components/BackButton";
import GoogleIcon from "../assets/icon-google.svg";
import {Eye, EyeOff} from "lucide-react";


export default function LoginPage() {
    const navigate = useNavigate();
    const [isHidden, setHidden] = useState(true);
    const { user, login, error, setError, googleAuth } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    const handleGoogleAuth = async (e) => {
        e.preventDefault();
        await googleAuth();
    }

    return (
        <>  
            <div className="fixed pt-5">
                <BackButton />
            </div>
            <div className="flex justify-center items-center min-h-screen">
                <form className="flex flex-col items-center w-[25vw] h-[590px] min-w-[400px] md:mt-[-120px] border border-gray-300 shadow-xl/10 rounded-md">
                    <h1 className="text-5xl my-6">FitGear</h1>
                    <h3 className="text-3xl mt-2 mb-8 border-b-1 w-95 py-3">Login</h3>
                    <div className="w-90">
                        <input type="text" onChange={e => setEmail(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 
                            text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 
                            block w-full p-3" placeholder="login" required />
                    </div>
                    <div className="mt-6">
                        <div className="relative w-90">
                            <input type={isHidden ? "password" : "text"} onChange={e => setPassword(e.target.value)} className={`py-3 text-md ps-4 pe-10 block w-full border 
                            rounded-lg ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`} placeholder="Enter password" />
                            <button
                                type="button"
                                onClick={() => setHidden(prev => !prev)}
                                className="absolute inset-y-0 right-3 flex cursor-pointer items-center px-3cursor-pointer text-gray-400 rounded-e-md focus:outline-none"
                                aria-label={isHidden ? "Show password" : "Hide password"}
                            >
                                {isHidden ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {error && <p className="text-red-600">{error}</p>}
                    </div>
                    <button type="submit" onClick={handleSignIn} className="bg-blue-700 text-white text-lg w-60 mt-6 py-3 border border-blue-700 cursor-pointer hover:bg-white hover:text-black select-none">
                        Login
                    </button>
                    <p className="mb-5">New here? <a onClick={() => navigate("/register")} className="text-blue-500 cursor-pointer underline select-none">Sign up</a></p>
                    <p>or</p>
                    <button onClick={handleGoogleAuth} className="flex border items-center gap-1 border-gray-300 py-2 px-4 mt-3 cursor-pointer  hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800 transition-colors duration-200">
                        <img src={GoogleIcon} alt="" className="w-8 h-7"/>
                        Sign in with Google
                    </button>
                </form> 
            </div>  
        </>
    );
}