import BackButton from "../components/BackButton";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserInfoById } from "../services/users";
import Man from "../assets/user.jpg";
import BookingCard from "../components/BookingCard";


export default function EditUser() {
    const [formData, setFormData] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await getUserInfoById(id);
            setFormData({
                email: data.email, 
                firstName: data.firstName, 
                lastName: data.lastName, 
                roles: data.roles, 
                phoneNumber: data.phoneNumber
            });
            setBookings(data.bookings || []);
            setPayments(data.payments || []);
        }
        fetchUserData();
    }, [id]);

    if (!formData) return <div>Loading...</div>;

    return (
        <>
            <div className="max-w-[1300px] mx-auto">
                <BackButton />
                <div className="flex justify-center gap-32 mx-auto border border-gray-300 shadow-md max-w-[1000px] p-12">
                    <div className="flex flex-col justify-center w-[250px] select-none">
                        <img src={Man} alt="" className="rounded-full object-cover w-[200px] h-[200px] mx-auto " />
                        <h3 className="text-2xl select-text">{formData.firstName} {formData.lastName}</h3>
                    </div>
                    <div className="flex flex-col gap-5 text-left">
                        <div >
                            <label className="text-3xl font-medium">First Name</label>
                            <p className="text-2xl">{formData.firstName || "-"}</p>
                        </div>
                        <div>
                            <label className="text-3xl font-medium">Last Name</label>
                            <p className="text-2xl">{formData.lastName || "-"}</p>
                        </div>
                        <div>
                            <label className="text-3xl font-medium">Email</label>
                            <p className="text-2xl">{formData.email || "-"}</p>
                        </div>
                        <div>
                            <label className="text-3xl font-medium">Phone number</label>
                            <p className="text-2xl">{formData.phoneNumber || "-"}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-24 flex justify-center max-w-[1000px] mx-auto">
                    <div className="w-full">
                        <h2 className="text-3xl font-semibold mb-6">Bookings</h2>
                        {bookings.length === 0 ? (
                            <p className="text-gray-500">No bookings available.</p>
                        ) : (
                            bookings.map(b => (
                                <BookingCard key={b.id} status={b.status} from={b.from} to={b.to} announcementId={b.announcementId}/>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}