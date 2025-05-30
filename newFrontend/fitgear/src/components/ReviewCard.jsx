import Man from "../assets/man.jpg";
import { Trash2 } from 'lucide-react';

export default function ReviewCard({ id, comment, createdAt, rating, userId, userName, onDelete }) {

    return (
        <div className="flex flex-col w-full max-w-[800px] px-8 border border-gray-200 my-2 shadow-md py-3 rounded-lg">
            <div className='flex justify-between items-center'>
                <div className='flex'>
                    <img
                        alt="Man"
                        src={Man}
                        className="w-[50px] h-[50px] rounded-full object-cover"
                    />
                    <div className='flex mt-3 px-4 justify-between'>
                        <p className="text-lg text-left text-gray-700">{userName}</p>
                        <p className="text-lg font-medium text-gray-900"></p>
                    </div>
                </div>
                <div className='flex items-center gap-1'>
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                    <button
                        onClick={() => onDelete(id)}
                        className="text-gray-600 hover:text-red-600 cursor-pointer transition-colors duration-200 p-1 rounded"
                        aria-label="Delete review"
                    >
                        <Trash2/>
                    </button>
                </div>
                
            </div>
            <div className='mt-2 flex gap-2 text-left'>
                <p className='text-md'>{comment}</p>
            </div>
        </div>
    )
}
