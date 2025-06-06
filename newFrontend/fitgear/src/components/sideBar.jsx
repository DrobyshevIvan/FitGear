import { useState } from "react";
import { NavLink } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { UserCog, ChartColumn, BookOpenCheck, MonitorCog, SlidersVertical, LogOut } from 'lucide-react';

export default function SideBar() {
    const [active, setActive] = useState("Manage");
    const { logout } = useAuth();

    const navItems = [
        { name: "Manage", path: "/manage", icon: <UserCog size={30}/> },
        { name: "Analytics", path: "/", icon: <ChartColumn size={30} /> },
        { name: "Reports", path: "/", icon: <BookOpenCheck size={30}/>},
        { name: "Policies", path: "/", icon: <MonitorCog size={30} /> },
    ];

    return (
        <>
        <div className="fixed w-[350px] left-0 top-0 h-screen bg-[var(--main-color)] text-white flex flex-col justify-between py-4">
            <NavLink to="/" className="mx-auto w-35 my-4">
                <h1 className="text-[3rem] font-medium select-none">Fitgear</h1>
            </NavLink>

            <div className='flex flex-col items-center space-y-2'>
                {navItems.map(item => (
                    
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex cursor-pointer py-2 pl-18 rounded-md w-70 text-xl transition ${
                                isActive ? "bg-blue-700" : "hover:bg-blue-600"
                            }`
                        }>
                        {item.icon}
                        <span className="px-3">{item.name}</span>
                    </NavLink>
                ))}
                </div>

                <div className="flex flex-col items-center space-y-2 text-xl pb-4">
                    <button className="flex gap-3 pl-18 py-2 hover:bg-blue-600 rounded-md w-70 cursor-pointer">
                        <SlidersVertical size={30} />
                        Settings
                    </button>
                    <button
                        onClick={logout}
                        className="flex gap-3 pl-18 py-2 hover:bg-blue-600 rounded-md text-left w-70 cursor-pointer"
                    >
                        <LogOut size={30} />
                        Exit
                    </button>
                </div>
            </div>
        </>
    )
}