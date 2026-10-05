import React from 'react';
import { OrderStatus } from '../types';
import { CheckCircle2, Clock, ChefHat, BellRing, Check, XCircle } from 'lucide-react';

interface OrderStatusStepperProps {
  status: OrderStatus;
}

const steps: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: 'PLACED', label: 'Order Placed', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'PREPARING', label: 'Preparing Food', icon: ChefHat },
  { key: 'READY', label: 'Ready for Pickup', icon: BellRing },
  { key: 'COMPLETED', label: 'Completed', icon: Check },
];

export const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({ status }) => {
  if (status === 'CANCELLED') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-sm">Order Cancelled</h4>
          <p className="text-xs text-red-600">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex((step) => step.key === status);

  return (
    <div className="py-6 px-2">
      <div className="relative flex items-center justify-between w-full">
        {/* Progress Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0"></div>
        {/* Active Progress Fill Line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 z-0"
          style={{
            width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%`,
          }}
        ></div>

        {/* Steps */}
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-xs ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : isCurrent
                    ? 'bg-orange-600 text-white ring-4 ring-orange-100 shadow-md shadow-orange-600/30 scale-110 animate-bounce-short'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>

              <span
                className={`mt-2 text-xs font-semibold text-center whitespace-nowrap ${
                  isCurrent
                    ? 'text-orange-600 font-bold'
                    : isDone
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
