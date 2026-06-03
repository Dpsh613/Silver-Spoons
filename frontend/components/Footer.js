import TrackedLink from "./TrackedLink";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Brand */}
        <div>
          <h3 className="font-serif text-2xl text-amber-500 mb-4">The Golden Fork</h3>
          <p className="text-sm leading-relaxed">
            Experience the harmony of flavors, crafted with passion and served with elegance.ai
          </p>
        </div>
        {/* Hours */}
        <div>
          <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Opening Hours</h4>
          <p className="text-sm mb-2">Mon - Thu: 11:00 AM - 10:00 PM</p>
          <p className="text-sm mb-2">Fri - Sat: 11:00 AM - 11:00 PM</p>
          <p className="text-sm">Sunday: 10:00 AM - 9:00 PM</p>
        </div>
        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Location</h4>
          <p className="text-sm mb-2">123 Culinary Lane</p>
          <p className="text-sm mb-4">New York, NY 10001</p>
          <p className="text-sm font-semibold text-amber-500">
            <TrackedLink type="callClicks" href="tel:+15551234567">Call us: (555) 123-4567</TrackedLink>
          </p>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-800 text-center text-sm text-stone-500">
          © {new Date().getFullYear()} The Golden Fork. All rights reserved.
        </div>
      </div>
    </footer>
  );
}