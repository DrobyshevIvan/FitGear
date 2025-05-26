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
            <div className="flex bg-gray-500 w-full justify-between px-100">
                <div>
                    <h1 className="text-4xl font-medium my-4 text-white">Fitgear</h1>
                </div>
                <nav className="flex items-center gap-5">
                    {navItems.map(item => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className="flex cursor-pointer px-1 rounded-md text-lg text-white transition"
                        >

                            {item.name}

                        </NavLink>
                    ))}
                    {user ? (
                        <button
                            onClick={logout}
                            className="flex cursor-pointer px-1 rounded-md text-lg text-white transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <NavLink
                            to="/login"
                            className="flex cursor-pointer px-1 rounded-md text-lg text-white transition"
                        >
                            Log in
                        </NavLink>
                    )}
                </nav>
            </div>
        </>
    )
}