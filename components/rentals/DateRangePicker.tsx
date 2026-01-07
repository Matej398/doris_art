"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface DateRangePickerProps {
  pickupDate: string;
  returnDate: string;
  onPickupDateChange: (date: string) => void;
  onReturnDateChange: (date: string) => void;
  pricePerDay: number;
  deposit: number;
  currency: string;
  onCalculationChange?: (calculation: {
    days: number;
    rentalPrice: number;
    deposit: number;
    total: number;
  }) => void;
}

export function DateRangePicker({
  pickupDate,
  returnDate,
  onPickupDateChange,
  onReturnDateChange,
  pricePerDay,
  deposit,
  currency,
  onCalculationChange,
}: DateRangePickerProps) {
  const t = useTranslations("rentals.datePicker");
  
  const [error, setError] = useState<string>("");

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const minDate = getTodayDate();

  useEffect(() => {
    if (pickupDate && returnDate) {
      const pickup = new Date(pickupDate);
      const return_ = new Date(returnDate);
      
      if (return_ <= pickup) {
        setError(t("returnDateAfterPickup"));
        // Clear calculation on error
        if (onCalculationChange) {
          onCalculationChange({
            days: 0,
            rentalPrice: 0,
            deposit: 0,
            total: 0,
          });
        }
      } else {
        setError("");
        
        // Calculate days
        const diffTime = return_.getTime() - pickup.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const days = diffDays > 0 ? diffDays : 1;
        
        // Calculate prices
        const rentalPrice = pricePerDay * days;
        const total = rentalPrice + deposit;
        
        // Notify parent component
        if (onCalculationChange) {
          onCalculationChange({
            days,
            rentalPrice,
            deposit,
            total,
          });
        }
      }
    }
  }, [pickupDate, returnDate, pricePerDay, deposit, onCalculationChange, t]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            {t("pickupDate")} *
          </label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => onPickupDateChange(e.target.value)}
            min={minDate}
            required
            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            {t("returnDate")} *
          </label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => onReturnDateChange(e.target.value)}
            min={pickupDate || minDate}
            required
            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

