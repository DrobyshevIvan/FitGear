import { useState, useEffect } from "react";
import { getAllBookings } from "../services/bookings";
import { getAnnouncementById } from "../services/anouncements";


export default function BookingsManage() {
    const [bookings, setBookings] = useState([]);
    const [filterStatus, setFilterStatus] = useState(null);
    const statuses = ["Pending", "Confirmed", "Active", "Completed", "Cancelled", "Rejected"];

    /*const NormalizeBookings = (data) => {
        const array = Array.isArray(data) ? data : data?.$values;
        if (!array) return [];
        
        return array.map(c => ({
            ...c,
            id: c.id ?? parseInt(c.$id),
            announcementName: getAnnouncementById(c.announcementId)
        }));
    }*/

    useEffect(() => {
        /*getAllBookings().then(data => {
            const normalized = NormalizeBookings(data);
            console.log("Bookings list:", normalized);
            setBookings(normalized);
        })*/

        const fetchData = async () => {
            const rawBookings = await getAllBookings();

            const enriched = await Promise.all(
                rawBookings.map(async (c) => {
                    const announcement = await getAnnouncementById(c.announcementId);
                    return {
                        ...c,
                        id: c.id ?? parseInt(c.$id),
                        announcement: announcement
                    };
                })
            )
            console.log("Bookings:", enriched);
            setBookings(enriched);
        };
        fetchData();
    }, []
    );

    const filteredBookings = bookings.filter(b => 
        !filterStatus || b.status === filterStatus
    );
    
    return (
        <div className="flex justify-between items-start">
            <div className="w-full max-w-[80%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredBookings
                .map(c => (
                    <div key={c.id} className="border p-4 rounded shadow bg-white flex flex-col justify-between transition-transform transform hover:scale-105 duration-200">
                        <h1>{c.announcement.title}</h1>
                        <h1>{c.status}</h1>
                        <hr className="my-2 border-t border-gray-300" />
                        <div className="flex flex-col space-y-1 mt-2">
                            <button className="text-blue-500 hover:text-blue-700">
                                Edit
                            </button>
                            <button className="text-red-500 hover:text-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                ))
                }
            </div>

            <div className="w-48 shrink-0 pl-6 pr-6 space-y-2">
                <h3 className="font-bold mb-2">Status</h3>
                <button
                    onClick={() => setFilterStatus(null)}
                    className={`block w-full text-left px-4 py-2 rounded ${filterStatus === null ? "bg-blue-500 text-white" : "bg-gray-200"} transition-transform transform hover:scale-105 duration-200`}
                >
                    ✕ All
                </button>
                {statuses.map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`block w-full text-left px-4 py-2 rounded ${filterStatus === status ? "bg-blue-500 text white" : "bg-gray-200"} transition-transform transform hover:scale-105 duration-200`}
                    >
                        {status}
                    </button>
                ))
                }
            </div>
        </div>
    )
}
