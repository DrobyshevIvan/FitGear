import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { getAnnouncementById } from "../services/anouncements";
import horseImg from '../assets/horse.jpg';
import { Plus, Minus } from 'lucide-react';

export default function EditAnnouncement() {
    const [formData, setFormData] = useState(null);
    const { id } = useParams();
    
    const increase = () => {setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))};
    const decrease = () => {setFormData(prev => ({ ...prev, quantity: prev.quantity - 1 }))};

    useEffect(() => {
        const fetchAnnouncement = async () => {
            const data = await getAnnouncementById(id);   
            setFormData({ title: data.title, description: data.description, price: data.pricePerDay, quantity: data.quantityAvailable, });
        }
        fetchAnnouncement();
    }, [id]);

    if (!formData) return <div>Loading...</div>;

    return (
        <>  
            <div className="flex ml-25">
                <a href="/manage/anouncements">Back</a>
                <h2 className="text-3xl w-[400px] text-left ml-[15%] mb-5">Edit Announcement</h2>
            </div>
            <div>
                <div className="flex justify-center gap-15 mx-auto">
                    <div>
                        <img src={horseImg} alt="product image" className="max-w-[350px]" />
                    </div>
                    <div className="flex flex-col w-[550px] text-left gap-5">
                        <div>
                            <label htmlFor="title" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Title</label>
                            <input type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, title: e.target.value }))
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg 
                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
                        dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                        dark:focus:border-blue-500" placeholder="Title" required />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="quantity" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Quantity</label>
                            <div className="flex gap-3">
                                <button className=" border border-gray-300 shadow-md cursor-pointer rounded-full" onClick={decrease}>
                                    <Minus size={35} />
                                </button>
                                <input type="number"
                                    name="quantity"
                                    id="quantity"
                                    value={formData.quantity}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        if (val >= 0) {
                                            setFormData(prev => ({ ...prev, quantity: val }));
                                        }
                                    }}
                                    className="border rounded-lg px-2.5 w-[100px]" />
                                <button className=" border border-gray-300 shadow-md cursor-pointer rounded-full" onClick={increase}>
                                    <Plus size={35} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mx-auto w-[50vw] max-w-[1000px] text-left">
                    <label htmlFor="title" className="block mb-2 text-lg mt-5 font-medium text-gray-900 dark:text-white">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData(prev => ({ ...prev, description: e.target.value }))
                        }
                        rows="7"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter a detailed description..."
                    />
                </div>
            </div>
        </>
    )
}