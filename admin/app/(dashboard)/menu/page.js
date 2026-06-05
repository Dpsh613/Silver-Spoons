"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import { Plus } from "lucide-react";

export default function MenuManager() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        const res = await api.get('/menu');
        setCategories(res.data);
    };

    // Crucial: Handle multipart/form-data for file uploads
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('category', data.category);
            formData.append('isSoldOut', data.isSoldOut);
            // Append the actual File object
            if (data.image && data.image[0]) {
                formData.append('image', data.image[0]);
            }
 
            await api.post('/menu/items', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsModalOpen(false);
            reset();
            fetchMenu();
        } catch (error) {
            alert("Error adding menu item");
        }
    };

    const deleteItem = async (id) => {
        if (confirm("Are you sure? This will delete the image from Cloudinary as well.")) {
            await api.delete(`/menu/items/${id}`);
            fetchMenu();
        }
    };

    return (
        <div className="p-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-stone-900">Menu Manager</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition">
                    <Plus size={20} /> Add Item
                </button>
            </div>

            <div className="space-y-12">
                {categories.map(cat => (
                    <div key={cat._id}>
                        <h2 className="text-xl font-serif border-b border-stone-200 pb-2 mb-4">{cat.name}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {cat.items.map(item => (
                                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 flex gap-4">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-stone-100" />
                                    <div className="flex-1">
                                        <h3 className="font-bold">{item.name} <span className="text-amber-600 font-normal ml-2">${item.price}</span></h3>
                                        <p className="text-sm text-stone-500 line-clamp-1">{item.description}</p>
                                        <button onClick={() => deleteItem(item._id)} className="text-red-500 text-sm mt-2 hover:underline">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-6">Add New Dish</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input {...register("name", { required: true })} className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea {...register("description")} className="w-full border rounded px-3 py-2"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <input {...register("price", { required: true })} type="number" step="0.01" className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select {...register("category", { required: true })} className="w-full border rounded px-3 py-2">
                                        <option value="">Select...</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Image File</label>
                                <input {...register("image", { required: true })} type="file" accept="image/*" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-stone-200 py-2 rounded">Cancel</button>
                                <button type="submit" className="flex-1 bg-amber-600 text-white py-2 rounded">Upload & Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}