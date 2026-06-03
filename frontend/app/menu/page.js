import Image from "next/image";

// Force dynamic fetching so the menu updates immediately when the admin changes it
export const dynamic = 'force-dynamic';

async function getMenu() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch menu');
  return res.json();
}

export default async function MenuPage() {
  const menuCategories = await getMenu();

  return (
    <div className="pt-24 pb-16 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl text-stone-900 mb-4">Our Menu</h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        {menuCategories.length === 0 ? (
          <p className="text-center text-stone-500">Menu is currently being updated. Please check back later.</p>
        ) : (
          menuCategories.map((category) => (
            <div key={category._id} className="mb-16">
              <h2 className="font-serif text-3xl text-stone-800 border-b border-stone-200 pb-2 mb-8 uppercase tracking-wide">
                {category.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((item) => (
                  <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group">
                    <div className="relative h-60 bg-stone-200 overflow-hidden">
                      {/* Using standard img tag for simplicity with external Cloudinary URLs without needing next.config.js setup */}
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {item.isSoldOut && (
                        <div className="absolute top-4 right-4 bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                          Sold Out
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-stone-900">{item.name}</h3>
                        <span className="text-lg font-semibold text-amber-600">${item.price}</span>
                      </div>
                      <p className="text-stone-600 text-sm line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}