import { useState, useEffect } from "react"
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { getAnnouncementById, updateAnnouncement } from "../services/anouncements";
import { getAllCategories } from "../services/categories";
import { Plus, Minus } from 'lucide-react';
import BackButton from "../components/BackButton";
import { getReviewsForAnnouncement, deleteReview } from "../services/reviews";
import ReviewCard from "../components/ReviewCard";

export default function EditAnnouncement() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const { id } = useParams();
    const { onUpdate } = useOutletContext();
    const [categories, setCategories] = useState([]);

    const increase = () => { setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 })) };
    const decrease = () => { setFormData(prev => ({ ...prev, quantity: prev.quantity - 1 })) };

    useEffect(() => {
        const fetchAnnouncement = async () => {
            const data = await getAnnouncementById(id);
            const reviews = await getReviewsForAnnouncement(id);
            const categoriesData = await getAllCategories();
            setFormData({ title: data.title, description: data.description, url: data.url || "", price: data.pricePerDay, quantity: data.quantityAvailable, id: id, categoryId: data.categoryId });
            setReviews(reviews);
            setCategories(categoriesData);
        }
        fetchAnnouncement();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAnnouncement(id, formData);
            await onUpdate();
            navigate("/manage/anouncements");
        } catch (err) {
            console.log(err);
        }
    }

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            setReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch (err) {
            console.log(err);
        }
    }

    if (!formData) return <div>Loading...</div>;

    return (
        <>
            <div className="flex ml-25">
                <BackButton />
            </div>
            <div>
                <div className="flex justify-center max-w-[900px] gap-12 mx-auto">
                    <div>
                        <img src={formData.url} alt="product image" className="max-w-[350px] object-cover w-[250px] h-[250px] " />
                    </div>
                    <div className="flex flex-col w-[400px] text-left gap-5 ml-12">
                        <div>
                            <label htmlFor="title" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Title</label>
                            <input type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, title: e.target.value }))
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg 
                        focus:ring-blue-500 focus:border-blue-500 block w-[80%] p-2.5 dark:bg-gray-700 
                        dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                        dark:focus:border-blue-500" placeholder="Title" required />
                        </div>
                        <div>
                            <label htmlFor="category" className="block mb-2 text-lg font-medium text-gray-700 dark:text-white">Category</label>
                            <select
                                id="category"
                                value={formData.categoryId}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, categoryId: Number(e.target.value) }))
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg 
      focus:ring-blue-500 focus:border-blue-500 block w-[80%] p-2.5 dark:bg-gray-700 
      dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex">
                            <div className="w-[30%]">
                                <label htmlFor="price" className="block mb-2 text-lg font-medium text-gray-700 dark:text-white">Price ($)</label>
                                <input type="number"
                                    id="price"
                                    value={formData.price}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, price: e.target.value }))
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg 
                        focus:ring-blue-500 focus:border-blue-500 block w-[80%] text-lg px-2.5 py-1 dark:bg-gray-700 
                        dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                        dark:focus:border-blue-500" placeholder="Price" required />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="quantity" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Quantity</label>
                                <div className="flex gap-3">
                                    <button className=" border border-gray-300 shadow-md cursor-pointer rounded-full hover:bg-gray-900" onClick={decrease}>
                                        <Minus size={35} className="hover:text-white" />
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
                                    <button className=" border border-gray-300 shadow-md cursor-pointer rounded-full hover:bg-gray-900" onClick={increase}>
                                        <Plus size={35} className="hover:text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto w-[50vw] max-w-[900px] mt-12">
                    <div className="flex flex-col text-left">
                        <label htmlFor="title" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Image URL</label>
                        <input type="text"
                            id="url"
                            value={formData.url}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, url: e.target.value }))
                            }}
                            className="w-full g-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg block p-2.5 dark:bg-gray-700 
                        dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Enter url" />
                    </div>
                    <div className="flex flex-col text-left">
                        <label htmlFor="title" className="block mb-2 text-lg mt-5 font-medium text-gray-900 dark:text-white">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData(prev => ({ ...prev, description: e.target.value }))
                            }
                            rows="5"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter a detailed description"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={(e) => handleSubmit(e)} className="px-6 py-2 w-[100px] border rounded-full cursor-pointer text-white bg-gray-900 hover:text-black hover:bg-white">
                                Submit
                            </button>
                            <button onClick={() => navigate("/manage/anouncements")} className="px-6 py-2 w-[100px] border rounded-full cursor-pointer">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-4 max-w-[900px] mx-auto flex flex-col items-center">
                    <h3 className="text-3xl">Reviews</h3>
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 mb-8">No reviews...</p>
                    ) : (
                        reviews.map(n => (
                            <ReviewCard key={n.id} id={n.id} comment={n.comment} createdAt={n.createdAt} rating={n.rating} userId={n.userId} userName={n.userName} onDelete={handleDeleteReview} />
                        ))
                    )}
                </div>
            </div>
        </>
    )
}