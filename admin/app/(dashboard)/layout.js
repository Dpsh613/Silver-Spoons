"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CalendarDays, UtensilsCrossed, Settings, LogOut } from "lucide-react";
import api from "@/lib/axios";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await api.post('/auth/logout');
        router.push('/login');
    };

    const navItems = [
        { name: "Analytics", href: "/dashboard", icon: LayoutDashboard },
        { name: "Reservations", href: "/reservations", icon: CalendarDays },
        { name: "Menu", href: "/menu", icon: UtensilsCrossed },
    ];

    return (
        <div className="flex h-screen bg-stone-50">
            {/* Sidebar */}
            <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col">
                <div className="p-6 border-b border-stone-800">
                    <h2 className="text-xl font-serif font-bold text-amber-500">The Golden Fork</h2>
                    <p className="text-xs mt-1 text-stone-400">Admin Portal</p>
                </div>
                <nav className="flex-1 py-6 space-y-2 px-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-amber-600 text-white' : 'hover:bg-stone-800 hover:text-white'}`}>
                                <Icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-stone-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-stone-800 text-left transition">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}