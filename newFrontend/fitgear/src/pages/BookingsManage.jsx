import { useState, useEffect } from "react";
import { getAllBookings } from "../services/bookings";
import { getAnnouncementById } from "../services/anouncements";
import { getUserInfoById } from "../services/users";
import { formatDate } from "../services/utils"; 


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
                    const user = await getUserInfoById(c.userId);
                    return {
                        ...c,
                        id: c.id ?? parseInt(c.$id),
                        announcement: announcement,
                        user: user
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
                .map(b => (
                    <div key={b.id} className="border space-y-1 p-4 rounded shadow bg-white flex flex-col justify-between transition-transform transform hover:scale-105 duration-200">
                        <h3 className="text-lg font-semibold text-gray-800">{b.announcement.title}</h3>
                        <p className="text-sm text-gray-500">Status: <span className="font-medium text-black">{b.status}</span></p>
                        <p className="text-sm text-gray-500">
                            From: <span className="text-black">{formatDate(b.from)}</span>
                            <br />
                            Till: <span className="text-black">{formatDate(b.to)}</span>
                        </p>
                        <p className="text-sm text-gray-500 truncate hover:overflow-visible hover:whitespace-normal hover:bg-white relative z-10">
                            User: <span className="text-black">{b.user.firstName} {b.user.lastName}</span>
                            <br />
                            Email: <span className="text-black">{b.user.email}</span>
                        </p>

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
                    className={`block w-full text-left px-4 py-2 rounded shadow ${filterStatus === null ? "bg-blue-500 text-white" : "bg-gray-200"} transition-transform transform hover:scale-105 duration-200`}
                >
                    ✕ All
                </button>
                {statuses.map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`block w-full text-left px-4 py-2 rounded shadow ${filterStatus === status ? "bg-blue-500 text white" : "bg-gray-200"} transition-transform transform hover:scale-105 duration-200`}
                    >
                        {status}
                    </button>
                ))
                }
            </div>
        </div>
    )
}
