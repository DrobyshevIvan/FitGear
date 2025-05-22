import { NavLink } from "react-router-dom";

export default function Header() {
    const navItems = [
        { name: "Manage", path: "/manage/anouncements"},
        { name: "About us", path: "/"},
        { name: "Contacts", path: "/" },
        { name: "Log in", path: "/login" },
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
                </nav>
            </div>
        </>
    )
}