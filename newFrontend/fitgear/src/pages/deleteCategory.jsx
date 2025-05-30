import React from "react";

export default function DeleteCategory({ isOpen, onClose, onConfirm, category}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-[300px]">
                <h2 className="text-xl font-bold mb-4">Delete Category</h2>
                <p>Are you sure you want to delete <strong>{category?.name}</strong></p>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="text-gray-600 hover:text-black"> 
                        Cancel
                    </button>
                    <button onClick={() => onConfirm(category)} className="bg-red-500 text-white px-4 py-2 rounded">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}