import { getAllAnnouncements } from "../services/anouncements"
import { useEffect, useState } from "react"
import Card from "../components/productCard";
import iconAdd from '../assets/plus.svg';
import iconSearch from '../assets/search.svg';
import AddAnnouncement from "./addAnnouncement";


export default function Anouncements() {
    const [anouncements, setAnnounces] = useState([]);
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

    return (
        <>
            <div className="flex gap-5">
                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 h-13 align-center ml-8 text-xl py-3 rounded-full border border-gray-300 shadow-md w-12 md:w-[230px] cursor-pointer hover:border-gray-400">
                    <img src={iconAdd} alt="icon" />
                    Add new
                </button>
                <form className="w-[700px]">
                    <div className="relative">
                        <div className="inset-y-0 left-0 flex items-center pl-5 pointer-events-none absolute">
                            <img src={iconSearch} alt="icon" />
                        </div>
                        <input type="search" id="default-search"
                            onChange={(e) => setFilters({...filter, search: e.target.value})}
                            className="block w-full p-4 pl-13 h-13 text-lg text-gray-900 border rounded-full bg-gray-50 focus:border-gray-400"
                            placeholder="Search"
                            required
                        />
                    </div>
                </form>
            </div>
            <AddAnnouncement isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={() => console.log("submited")} />
            <div>
                <div className="grid place-items-center mt-6 px-14 grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {anouncements.map(n => (
                        <Card key={n.id} title={n.title} onEdit={() => console.log('edit')} onRemove={() => console.log('remove')}/>
                    ))}
                </div>
            </div>
        </>
    )
}
