import { useState, useContext } from "react";
import iconEyeOn from '../assets/eyeOn.svg';
import iconEyeOff from '../assets/eyeOff.svg';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import BackButton from "../components/BackButton";

export default function RegisterPage() {
    const navigate = useNavigate();
    const {register, loading, error, setError, googleAuth } = useContext(AuthContext);
    const [isHidden, setHidden] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password != confirmedPassword) {
            setError("Passwords don't match")
            return;
        }

        setError("");
        await register(email, password)
    }

    const handleSignIn = () => {
        navigate('/login');
    };

    const handleGoogleAuth = async (e) => {
        e.preventDefault();
        await googleAuth();
    };

    return (
        <>
            <div className="fixed pt-5">
                <BackButton />
            </div>
            <div className="flex justify-center items-center min-h-screen">
                <form className="flex flex-col items-center w-[25vw] min-w-[400px] h-[600px] mt-[-100px] border border-gray-300 shadow-xl/10 rounded-md">
                    <h1 className="text-3xl my-6 text-medium">Fitgear</h1>
                    <h3 className="text-2xl mt-2 mb-8 border-b-1 w-95 py-3">Create an account</h3>
                    <div className="w-90">
                        <input type="text" 
                            onChange={e => setEmail(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 
                            text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                            block w-full p-3" placeholder="Email" required />
                    </div>
                    <div className="mt-6">
                        <div className="relative w-90">
                            <input type={isHidden ? "password" : "text"} onChange={e => setPassword(e.target.value)}
                            className="py-3 text-sm ps-4 pe-10 block w-full border border-gray-300 
                            rounded-lg focus:border-blue-500 focus:ring-blue-500" 
                            placeholder="Enter password" required/>
                            <button type="button" className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600 ">
                                <img src={isHidden ? iconEyeOff : iconEyeOn} alt="icon" onClick={() => setHidden(prev => !prev)} />
                            </button>
                        </div>
                        <div className="relative w-90 mt-5">    
                            <input type="password" onChange={e => setConfirmedPassword(e.target.value)}
                            className="py-3 text-sm ps-4 pe-10 block w-full border border-gray-300 
                            rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Confirm password" required />
                        </div>
                    </div>
                    {error && <p className="text-red-600 my-2">{error}</p>}
                    <button onClick={handleSignUp} className="bg-blue-700 text-white w-60 mt-6 py-3 border border-blue-700 cursor-pointer hover:bg-white hover:text-black select-none">
                        Sign up
                    </button>
                    <p className="mb-5">Already signed up? <a onClick={handleSignIn} className="text-blue-500 cursor-pointer underline select-none">Sign in</a></p>
                    <p>or</p>
                    <button onClick={handleGoogleAuth} className="border border-gray-300 py-2 px-4 mt-3 cursor-pointer">
                        Sign up with Google
                    </button>
                </form>
            </div>
        </>
    );
}