import { useState, useEffect } from "react";
export const statuses = ["Pending", "Confirmed", "Active", "Completed", "Cancelled", "Rejected"];

export default function EditBooking({ isOpen, onClose, onSubmit, booking }) {
    const [selectedStatus, setSelectedStatus] = useState("");

    useEffect(() => {
        if(booking) {
            setSelectedStatus(booking.status || "")
        }
    }, [booking]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedStatus) return;
        onSubmit({...booking, status: selectedStatus});
    };

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded shadow-md w-[300px]">
                <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select
                        value = {selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="mb-4 border px-2 py-1 rounded"
                    >
                        <option value="" disabled>Select status</option>
                        {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))

                        }
                    </select>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-600 hover:text-black"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}