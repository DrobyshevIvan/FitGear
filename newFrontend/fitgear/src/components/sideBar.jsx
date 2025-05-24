import { useState } from "react";
import { NavLink } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";


export default function SideBar() {
    const [active, setActive] = useState("Manage");
    const { logout } = useAuth();

    const navItems = [
        { name: "Manage", path: "/manage"},
        { name: "Analytics", path: "/"},
        { name: "Reports", path: "/" },
        { name: "Policies", path: "/" },
    ];

    return (
        <>
        <div className="fixed w-[350px] left-0 top-0 h-screen bg-[var(--main-color)] text-white flex flex-col justify-between py-6 px-4">
            <NavLink to="/" className="mx-auto w-35 my-4">
                <h1 className="text-5xl font-medium select-none">Fitgear</h1>
            </NavLink>

            <div className='flex flex-col items-center space-y-2'>
                {navItems.map(item => (
                    
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex justify-center cursor-pointer px-1 py-2 rounded-md w-70 text-center text-lg transition ${
                                isActive ? "bg-blue-700" : "hover:bg-blue-600"
                            }`
                        }>
                        {/* <span className="w-5 h-5"></span> */}
                        {item.name}
                    </NavLink> 
                ))}
            </div>

            <div className="flex flex-col items-center space-y-4">
                <button className="flex justify-center cursor-pointer gap-3 px-4 py-2 hover:bg-blue-600 rounded-md w-70 text-left ">
                    Settings
                </button>
                <button
                    onClick={logout}
                    className="flex justify-center cursor-pointer gap-3 px-4 py-2 hover:bg-blue-600 rounded-md w-70 text-left">
                    Exit
                </button>
            </div>
        </div>
        </>
    )
}