import { useState, useEffect } from "react";
import { useNavigate, Outlet, useMatch } from "react-router-dom";
import { getAllUsers } from "../services/users";
import SearchBar from "../components/SearchBar";
import { CircleUser } from "lucide-react";


export default function Users() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState({search: ""});
    const navigate = useNavigate();
    const isEditing = useMatch("/manage/users/edit/:id");

    useEffect(() => {
        const fetchUsers = async () => {
            let data = await getAllUsers(filter);
            setUsers(data);
        }
        fetchUsers();
    }, [filter]);

    if (isEditing) {
        return <Outlet />;
    }

    return (
        <>
            <div>
                <div className="flex justify-center">
                    <SearchBar search={filter.search} onSearchChange={search => setFilter(prev => ({ ...prev, search }))} />
                </div>
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200 p-12">
                        <thead className="bg-gray-50 border-b border-black">
                            <tr>
                                <th className="px-4 py-2 text-left text-lg font-medium text-gray-500 w-1/10">Avatar</th>
                                <th className="px-4 py-2 text-left text-lg font-medium text-gray-500 w-2/5">Email</th>
                                <th className="px-4 py-2 text-left text-lg font-medium text-gray-500">First Name</th>
                                <th className="px-4 py-2 text-left text-lg font-medium text-gray-500">Last Name</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300 text-left">
                            {users.map(user => (
                                <tr key={user.id} onClick={() => navigate(`edit/${user.id}`)} className="transition cursor-pointer hover:bg-gray-300">
                                    <td className="px-4 py-3 w-1/10">
                                        <CircleUser size={35} className="ml-2"/>
                                    </td>
                                    <td className="px-4 py-3 text-md text-gray-800">{user.email}</td>
                                    <td className="px-4 py-3 text-md text-gray-700">{user.firstName || '—'}</td>
                                    <td className="px-4 py-3 text-md text-gray-700">{user.lastName || ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

