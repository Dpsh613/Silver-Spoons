"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Check, X } from "lucide-react";

export default function Reservations() {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        const res = await api.get('/reservations');
        setReservations(res.data);
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/reservations/${id}/status`, { status });
            fetchReservations(); // Refresh list
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-stone-100 text-stone-800';
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold text-stone-900 mb-8">Reservations</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-200">
                        <tr>
                            <th className="p-4 font-semibold text-stone-600">Guest Name</th>
                            <th className="p-4 font-semibold text-stone-600">Date & Time</th>
                            <th className="p-4 font-semibold text-stone-600">Party</th>
                            <th className="p-4 font-semibold text-stone-600">Status</th>
                            <th className="p-4 font-semibold text-stone-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((res) => (
                            <tr key={res._id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                                <td className="p-4">
                                    <div className="font-medium text-stone-900">{res.name}</div>
                                    <div className="text-sm text-stone-500">{res.phone}</div>
                                </td>
                                <td className="p-4">
                                    <div>{res.date}</div>
                                    <div className="text-sm text-stone-500">{res.time}</div>
                                </td>
                                <td className="p-4">{res.partySize} pax</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(res.status)}`}>
                                        {res.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {res.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => updateStatus(res._id, 'confirmed')} className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition" title="Approve">
                                                <Check size={18} />
                                            </button>
                                            <button onClick={() => updateStatus(res._id, 'cancelled')} className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition" title="Decline">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {reservations.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-stone-500">No reservations found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}