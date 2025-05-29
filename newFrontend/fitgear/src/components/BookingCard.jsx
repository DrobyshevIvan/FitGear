import { getAnnouncementById } from "../services/anouncements"
import { useEffect, useState } from "react"

export default function BookingCard({ from, to, announcementId, status }) {
    const [anouncement, setAnnounce] = useState(null);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            const response = await getAnnouncementById(announcementId);
            setAnnounce({
                title: response.title,
                descript: response.description,
                url: response.url,
            })
        }
        fetchAnnouncement();
    }, [announcementId])
    

    return (
        <>
            <div className="flex flex-col gap-8 p-4 px-12">
                <div className="flex gap-16 border-gray-400">
                    <p className={`text-xl font-semibold ${status === 'Active' ? 'text-green-600' : 'text-yellow-500'}`}>
                        {status}
                    </p>
                    <p className="text-xl"><span>From: </span>{new Date(from).toLocaleDateString()}</p>
                    <p className="text-xl"><span>To: </span>{new Date(to).toLocaleDateString()}</p>
                </div>
                {anouncement ? (
                    <div className="flex">
                        <img src={anouncement.url} alt="product" className="max-w-[250px] max-h-[250px] bg-gray-200 object-cover select-none"/>
                        <div className="text-left ml-6 mt-4 max-w-[600px] max-h-[100px]">
                            <p className="text-xl font-medium">{anouncement.title}</p>
                            <p className="text-md mt-4 line-clamp-3">{anouncement.descript}</p>
                        </div>
                        
                    </div>
                ) : (
                    <p>Loading announcement</p>
                )}
            </div>
        </>
    )
}