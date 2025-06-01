import { useState, useEffect } from "react";
import AddCategory from "./addCategory";
import { addCategory, getAllCategories } from "../services/categories";
import DeleteCategory from "./deleteCategory";
import { deleteCategory } from "../services/categories";
import EditCategory from "./editCategory";
import { editCategory } from "../services/categories";

export default function CategoriesManage() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    const normalizeCategories = (data) => {
        const array = Array.isArray(data) ? data : data?.$values;
        if (!array) return [];

        return array.map(c => ({
            ...c,
            id: c.id ?? parseInt(c.$id)
        })

        );
    }

    useEffect(() => {
        getAllCategories().then(data => {
            const normalized = normalizeCategories(data);
            console.log("Изначальные категории:", normalized);
            setCategories(normalized);
        });
    }, []);

    const handleAdd = async (data) => {
        await addCategory(data);
        setIsModalOpen(false);
        const updated = await getAllCategories();
        const normalized = normalizeCategories(updated);
        console.log("Данные с бэкенда:", normalized);
        setCategories(normalized);
    };

    const confirmDelete = async (category) => {
        const id = category?.id || category?.$id;
        if (!id) {
            console.error("Нет ID категории для удаления", categoryToDelete)
            return;
        }

        await deleteCategory(id);
        const updated = await getAllCategories();
        setCategories(normalizeCategories(updated));
        setIsDeleteOpen(false);
        setCategoryToDelete(null);
    }

    const handleEdit = async (updatedCategory) => {
        try {
            console.log("Edited category:", updatedCategory)
            await editCategory(updatedCategory);
            const updated = await getAllCategories();
            setCategories(normalizeCategories(updated));
            setIsEditOpen(false);
            setCategoryToEdit(null);
        } catch (error) {
            console.error("Ошибка про редактировании:", error)
        }
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
                {Array.isArray(categories) && categories.map(c => (
                <li key={c.id} className="border p-2 flex justify-between items-center">
                    <span>{c.name}</span>
                    <div className="flex space-x-5">
                        <button
                            onClick={() => {
                                setCategoryToEdit(c);
                                setIsEditOpen(true);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                console.log("Удаляется категория:", c);
                                setCategoryToDelete(c);
                                setIsDeleteOpen(true);
                            }
                            }
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </li>
                ))}
            </ul>

            <DeleteCategory
                isOpen = {isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                category={categoryToDelete}
            />

            <EditCategory
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSubmit={handleEdit}
                category={categoryToEdit}
            />
        </div>
    );

}