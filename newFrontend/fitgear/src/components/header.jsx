import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
    const { user, logout } = useAuth();

    const navItems = [
        { name: "Manage", path: "/manage/anouncements"},
        { name: "About us", path: "/"},
        { name: "Contacts", path: "/" },
    ];

    return (
        <>
            <div className="flex  w-full justify-between px-10 md:px-[15%] border-b bg-white">
                <div>
                    <h1 className="text-5xl font-medium my-3 fade-down select-none"><a href="/">FitGear</a></h1>
                </div>
                <nav className="flex items-center gap-5">
                    {navItems.map(item => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className="flex cursor-pointer px-1 rounded-md text-lg hover:underline transition fade-down"
                        >

                            {item.name}

                        </NavLink>
                    ))}
                    {user ? (
                        <button
                            onClick={logout}
                            className="flex cursor-pointer px-1 rounded-md text-lg hover:underline transition fade-down"
                        >
                            Logout
                        </button>
                    ) : (
                        <NavLink
                            to="/login"
                            className="flex cursor-pointer px-1 rounded-md text-lg hover:underline transition fade-down"
                        >
                            Log in
                        </NavLink>
                    )}
                </nav>
            </div>
        </>
    )
}