import { getAllAnnouncements } from "../services/anouncements"
import { useEffect, useState } from "react"
import Card from "../components/productCard";
import iconAdd from '../assets/plus.svg';
import AddAnnouncement from "./addAnnouncement";
import { useNavigate, Outlet, useMatch } from "react-router-dom";
import SearchBar from "../components/SearchBar";



export default function Anouncements() {
    const navigate = useNavigate();
    const [anouncements, setAnnounces] = useState([]);
    const isEditing = useMatch("/manage/anouncements/edit/:id");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilters] = useState({
        search: "",
        orderItem: "PricePerDay",
        sortDirection: "Ascending",
    })

    useEffect(() => {
        const fetchAnouncements = async () => {
            let data = await getAllAnnouncements(filter);
            console.log(filter.search)
            setAnnounces(data);
        }
        fetchAnouncements();
    }, [filter]);

    if (isEditing) {
        return <Outlet />;
    }

    return (
        <>
            <div className="flex gap-5">
                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 h-13 align-center ml-8 text-xl py-3 rounded-full border border-gray-300 shadow-md w-12 md:w-[230px] cursor-pointer hover:border-gray-400">
                    <img src={iconAdd} alt="icon" />
                    Add new
                </button>
                <SearchBar search={filter.search} onSearchChange={search => setFilters(prev => ({ ...prev, search }))}/>
            </div>

            <AddAnnouncement isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={() => console.log("submited")} />
                
            <div>
                <div className="grid place-items-center mt-6 px-14 grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {anouncements.map(n => (
                        <Card key={n.id} title={n.title} onEdit={() => navigate(`edit/${n.id}`)} onRemove={() => console.log('remove')}/>
                    ))}
                </div>
            </div>
        </>
    )
}
