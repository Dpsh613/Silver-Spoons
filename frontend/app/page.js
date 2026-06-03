import Link from "next/link";
import { MapPin, Clock, Phone } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center">
        {/* Background Image (Using Unsplash placeholder for now) */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            Taste the Extraordinary
          </h1>
          <p className="text-lg md:text-2xl mb-8 font-light max-w-2xl mx-auto drop-shadow-md">
            A modern dining experience blending classic techniques with fresh, local ingredients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-medium transition shadow-lg">
              Reserve Your Table
            </Link>
            <Link href="#menu" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/50 px-8 py-4 rounded-full text-lg font-medium transition">
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED DISHES (Static Placeholder) */}
      <section id="menu" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-stone-900 mb-4">Chef's Signatures</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Dish 1 */}
            <div className="group cursor-pointer">
              <div className="overflow-hidden rounded-2xl mb-4 aspect-[4/3] bg-stone-200">
                <img src="https://images.unsplash.com/photo-1544025162-8111f4a7a0eb?q=80&w=800&auto=format&fit=crop" alt="Dish 1" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 flex justify-between">Truffle Risotto <span className="text-amber-600">$28</span></h3>
              <p className="text-stone-600">Wild mushrooms, aged parmesan, and black truffle shavings.</p>
            </div>
            {/* Dish 2 */}
            <div className="group cursor-pointer">
              <div className="overflow-hidden rounded-2xl mb-4 aspect-[4/3] bg-stone-200">
                <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop" alt="Dish 2" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 flex justify-between">Pan-Seared Scallops <span className="text-amber-600">$34</span></h3>
              <p className="text-stone-600">Cauliflower purée, crispy pancetta, and lemon butter sauce.</p>
            </div>
            {/* Dish 3 */}
            <div className="group cursor-pointer">
              <div className="overflow-hidden rounded-2xl mb-4 aspect-[4/3] bg-stone-200">
                <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop" alt="Dish 3" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 flex justify-between">Wagyu Ribeye <span className="text-amber-600">$65</span></h3>
              <p className="text-stone-600">Roasted garlic mash, seasonal asparagus, and red wine reduction.</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/menu" className="inline-block border-2 border-stone-900 text-stone-900 px-8 py-3 rounded-full hover:bg-stone-900 hover:text-white transition font-medium">
              See Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* LOCATION & HOURS */}
      <section id="location" className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl text-stone-900 mb-8">Visit Us</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Address</h4>
                    <p className="text-stone-600">123 Culinary Lane, New York, NY 10001</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Hours</h4>
                    <p className="text-stone-600">Mon - Thu: 11am - 10pm<br/>Fri - Sat: 11am - 11pm<br/>Sun: 10am - 9pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Contact</h4>
                    <p className="text-stone-600">(555) 123-4567<br/>hello@thegoldenfork.com</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Map Placeholder */}
            <div className="w-full h-96 bg-stone-300 rounded-2xl shadow-inner flex items-center justify-center text-stone-500">
              [ Google Map Embed Goes Here ]
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}