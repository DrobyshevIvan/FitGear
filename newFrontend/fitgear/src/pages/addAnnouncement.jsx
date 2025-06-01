import { useEffect, useState } from "react";
import { getAllCategories } from "../services/categories";

export default function AddAnnouncement({ isOpen, onClose, onSubmit}) {
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        quantity: 0,
        categoryId: 1,
        url: "",
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getAllCategories();
            setCategories(response);
            if (response.length > 0) {
                setFormData(prev => ({ ...prev, categoryId: response[0].id }));
            }
        };
        fetchCategories();
    }, []);

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
                <div className="flex flex-col items-center mt-20 pt-5 w-[600px] max-h-[750px] bg-white text-left rounded-lg">
                    <h3 className="text-2xl font-medium">Add new announcement</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="w-90 mt-5">
                            <label htmlFor="title" className="block mb-2 ml-2 text-lg font-medium text-gray-900">Title</label>
                            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 
                            text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                            block w-full p-2.5" placeholder="Title" required />
                        </div>
                        <div className="w-90 mt-5">
                            <label htmlFor="descript" className="block mb-2 text-lg font-medium text-gray-900">Decription</label>
                            <input type="text" id="descript" name="description" value={formData.description} onChange={handleChange} 
                                className="bg-gray-50 border border-gray-300 text-gray-900 
                            text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                            block w-full p-2.5" placeholder="Decription" required />
                        </div>
                        <div className="w-90 mt-5">
                            <label htmlFor="price" className="block mb-2 text-lg font-medium text-gray-900">Price (per day)</label>
                            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required />
                        </div>
                        <div className="w-90 mt-5">
                            <label htmlFor="quantity" className="block mb-2 text-lg font-medium text-gray-900">Quantity</label>
                            <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required />
                        </div>
                        <div className="w-90 mt-5">
                            <label htmlFor="url" className="block mb-2 text-lg font-medium text-gray-900">Picture URL</label>
                            <input type="text" id="url" name="url" value={formData.url} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder=""/>
                        </div>
                        <div className="w-90 mt-5">
                            <label htmlFor="category" className="block mb-2 text-lg font-medium text-gray-700 dark:text-white">Category</label>
                            <select
                                id="category"
                                value={formData.categoryId}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, categoryId: Number(e.target.value) }))
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg 
    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex mx-auto w-70 m-5 gap-2">
                            <button type="submit" className="flex justify-center bg-black text-white py-2.5 text-lg rounded-full cursor-pointer w-[150px]">
                                Add
                            </button>
                            <button type="button" onClick={onClose} className="flex justify-center w-[150px] py-2.5 border text-lg border-gray rounded-full cursor-pointer">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}