import horseImg from '../assets/horse.jpg';

export default function Card({ title, price, onEdit, onRemove, url }) {
    return (
        <div className="flex flex-col text-center w-full max-w-[300px] px-6 border border-gray-200 shadow-md py-3 rounded-lg">
            <img
                alt={title}
                src={url}
                className="aspect-square mx-auto mt-1 rounded-md h-[250px] w-[250px] bg-gray-200 object-contain"
            />
            <div className='flex mt-3 px-2 justify-between'>
                <h3 className="text-lg text-left text-gray-700">{title}</h3>
                <p className="text-lg font-medium text-gray-900">{price}$</p>
            </div>
            <div className='mt-2 flex gap-2'>
                <button onClick={onEdit} className='flex-1 cursor-pointer py-1.5 text-md border text-white bg-gray-900 rounded-full hover:text-black hover:bg-white'>
                    Edit
                </button>
                <button onClick={onRemove} className='flex-1 w-auto cursor-pointer py-1.5 text-md border rounded-full hover:border-red-700 hover:bg-red-700 hover:text-white'>
                    Remove
                </button>
            </div>
        </div>
    )
}
