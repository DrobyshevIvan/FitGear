import { useState, useEffect } from "react";
import AddCategory from "./addCategory";
import { addCategory, getAllCategories } from "../services/categories";
import DeleteCategory from "./deleteCategory";
import { deleteCategory } from "../services/categories";

export default function CategoriesManage() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);


    useEffect(() => {
        getAllCategories().then(data => {
            console.log("Изначальные категории:", data);
            setCategories(data.$values.map(c => ({
                ...c,
                id: parseInt(c.$id)
            })));
        });
    }, []);

    const handleAdd = async (data) => {
        await addCategory(data);
        setIsModalOpen(false);
        const updated = await getAllCategories();
        console.log("Данные с бэкенда:", updated);
        setCategories(Array.isArray(updated.$values) ? updated.$values : []);
    };

    const confirmDelete = async (category) => {
        const id = category?.id || category?.$id;
        if (!id) {
            console.error("Нет ID категории для удаления", categoryToDelete)
            return;
        }

        await deleteCategory(id);
        const updated = await getAllCategories();
        setCategories(updated.$values || []);
        setIsDeleteOpen(false);
        setCategoryToDelete(null);
    }

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
                    <button
                        onClick={() => {
                            console.log("Удаляется категория:", categoryToDelete);
                            setCategoryToDelete(c);
                            setIsDeleteOpen(true);
                        }
                        }
                        className="text-red-500 hover:text-red-700"
                    >
                        Delete
                    </button>
                </li>
                ))}
            </ul>

            <DeleteCategory
                isOpen = {isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                category={categoryToDelete}
            />
        </div>
    );

}