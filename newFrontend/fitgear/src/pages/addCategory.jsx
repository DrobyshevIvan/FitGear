import { useState } from "react";

export default function AddCategory({ isOpen, onClose, onSubmit }) {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit({ name });
        setName("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded shadow-md w-[300px]">
            <h2 className="text-xl font-bold mb-4">Add Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                className="border rounded px-3 py-2 w-full"
            />
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-600 hover:text-black"
                >
                    Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Add
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}
