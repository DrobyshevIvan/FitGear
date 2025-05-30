import { useState } from "react";
import { addAnnouncement } from "../services/anouncements";

export default function AddAnnouncement({ isOpen, onClose, onSubmit}) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        quantity: 0,
        categoryId: 1,
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex justify-center z-50 bg-black/50 ">
                <div className="flex flex-col items-center mt-20 pt-5 w-[500px] max-h-[500px] bg-white text-left rounded-lg">
                    <h3 className="text-2xl font-medium">Add new announcement</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="w-90 mt-5">
                            <label htmlFor="title" className="block mb-2 ml-2 text-sm font-medium text-gray-900">Title</label>
                            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 
                            text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                            block w-full p-2.5" placeholder="Title" required />
                        </div>
                        <div className="w-90 mt-5">
                            <label htmlFor="descript" className="block mb-2 text-sm font-medium text-gray-900">Decription</label>
                            <input type="text" id="descript" name="description" value={formData.description} onChange={handleChange} 
                                className="bg-gray-50 border border-gray-300 text-gray-900 
                            text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                            block w-full p-2.5" placeholder="Decription" required />
                        </div>
                        <div className="w-90 mt-5">
                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">Price (per day)</label>
                            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required />
                        </div>
                        <div className="w-90 mt-5">
                            <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900">Quantity</label>
                            <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required />
                        </div>
                        <div className="flex justify-between w-70 m-5 gap-5">
                            <button type="submit" className="flex-1 bg-black text-white py-1 rounded-full cursor-pointer">
                                Add
                            </button>
                            <button type="button" onClick={onClose} className="flex-1 py-1 border border-gray rounded-full cursor-pointer">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}