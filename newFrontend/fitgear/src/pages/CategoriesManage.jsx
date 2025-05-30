import { useState, useEffect } from "react";
import AddCategory from "./addCategory";
import { addCategory, getAllCategories } from "../services/categories";

export default function CategoriesManage() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getAllCategories().then(data => {
            console.log("Изначальные категории:", data);
            setCategories(data.$values || []);
        });
    }, []);

    const handleAdd = async (data) => {
        await addCategory(data);
        setIsModalOpen(false);
        const updated = await getAllCategories();
        console.log("Данные с бэкенда:", updated);
        setCategories(Array.isArray(updated.$values) ? updated.$values : []);
    };

    return (
        <div className="p-6">
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded shadow hover:bg-blue-700 mb-4"
            >
                + Add Category
            </button>

            <AddCategory
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAdd}
            />

            <ul className="space-y-2">
                {categories.map(c => (
                <li key={c.id} className="border p-2 flex justify-between items-center">
                    <span>{c.name}</span>
                </li>
                ))}
            </ul>
        </div>
    );

}