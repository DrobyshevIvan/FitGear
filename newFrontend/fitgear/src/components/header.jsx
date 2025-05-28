import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { Menu } from "lucide-react";


export default function Header() {
    const { user, logout } = useAuth();
    const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);

    const navItems = [
        { name: "Manage", path: "/manage/anouncements"},
        { name: "About us", path: "/"},
        { name: "Contacts", path: "/" },
    ];

    return (
        <>
            <header className="fixed bg-white border-b z-100 w-full lg:px-5">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-2 lg:px-0">
                    <div className="flex flex-1">
                        <h1 className="text-5xl font-medium my-3 fade-down select-none"><a href="/">FitGear</a></h1>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(prev => !prev)} 
                            className="-m-2.5 inline-flex items-center justify-center p-2.5 text-gray-700 cursor-pointer border border-transparent hover:border-gray-300 shadow-2xl rounded-full"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Menu aria-hidden="true" className="size-6" />
                        </button>
                    </div>

                    <div className="hidden lg:flex items-center gap-5">
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
                    </div>
                </nav>
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-18 right-0 w-64 bg-white border shadow-md z-50 transition-all">
                        <div className="flex flex-col">
                            {navItems.map(item => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className="text-lg hover:underline transition"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                            {user ? (
                                <button
                                    onClick={() => {
                                        logout()
                                        setMobileMenuOpen(false)
                                    }}
                                    className="text-lg hover:underline transition"
                                >
                                    Logout
                                </button>
                            ) : (
                                <NavLink
                                    to="/login"
                                    className="text-lg hover:underline transition"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Log in
                                </NavLink>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    )
}