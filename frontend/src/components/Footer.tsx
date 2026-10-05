import React from 'react';
import { UtensilsCrossed, Clock, MapPin, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Mission */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-white text-base tracking-tight">
                CAMPUS<span className="text-orange-500">CANTEEN</span>
              </p>
              <p className="text-xs text-slate-400">
                Fresh, hygienic, and nutritious food prepared daily for campus students and faculty.
              </p>
            </div>
          </div>

          {/* Timings & Location */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Timings: <strong>8:00 AM – 7:30 PM</strong></span>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Campus Food Court, Block B</span>
            </div>

            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Quality &amp; Hygiene Assured</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Campus Canteen System. All rights reserved.</span>
          <span>Fast Counter Pickups &bull; Digital Food Ordering</span>
        </div>
      </div>
    </footer>
  );
};
