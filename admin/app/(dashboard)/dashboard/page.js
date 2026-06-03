"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from "@/lib/axios";

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/analytics?days=7');
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold text-stone-900 mb-8">Performance Overview</h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                <h2 className="text-lg font-semibold mb-6">Last 7 Days Activity</h2>
                {loading ? (
                    <p>Loading chart data...</p>
                ) : data.length === 0 ? (
                    <p className="text-stone-500">No data available for the last 7 days.</p>
                ) : (
                    <div className="h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="pageViews" stroke="#8b5cf6" strokeWidth={2} name="Page Views" />
                                <Line type="monotone" dataKey="reservations" stroke="#f59e0b" strokeWidth={2} name="Reservations" />
                                <Line type="monotone" dataKey="callClicks" stroke="#10b981" strokeWidth={2} name="Calls" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}