import { useState, useEffect } from "react";
import { getAllBookings } from "../services/bookings";
import { getAnnouncementById } from "../services/anouncements";


export default function BookingsManage() {
    const [bookings, setBookings] = useState([]);

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
    
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {bookings
                .filter(c => c.status === "Pending")
                .map(c => (
                    <div key={c.id} className="border p-4 rounded shadow bg-white flex flex-col justify-between">
                        <h1>{c.announcement.title}</h1>
                        <h1>{c.status}</h1>
                    </div>
                ))
                }
            </div>
        </div>
    )
}
