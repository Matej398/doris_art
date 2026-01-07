"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { RentalItem, RentalReservation } from "@/lib/rentals";
import { DateRangePicker } from "./DateRangePicker";

interface RentalReservationFormProps {
  rental: RentalItem;
}

export function RentalReservationForm({ rental }: RentalReservationFormProps) {
  const t = useTranslations("rentals.form");
  const locale = useLocale();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  
  const [calculation, setCalculation] = useState<{
    days: number;
    rentalPrice: number;
    deposit: number;
    total: number;
  } | null>(null);

  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      pickupDate !== "" &&
      returnDate !== "" &&
      new Date(returnDate) > new Date(pickupDate) &&
      calculation !== null &&
      calculation.days > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid() || !calculation) return;
    
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const reservation: RentalReservation = {
      rentalId: rental.id,
      rentalTitle: locale === "en" && rental.titleEn ? rental.titleEn : rental.title,
      name,
      email,
      phone,
      pickupDate,
      returnDate,
      pickupTime: pickupTime || undefined,
      message: message || undefined,
      totalPrice: calculation.total,
      deposit: rental.deposit,
      currency: rental.currency,
    };

    try {
      const response = await fetch("/api/rental-reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setPickupDate("");
        setReturnDate("");
        setPickupTime("");
        setMessage("");
        setCalculation(null);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const rentalTitle = locale === "en" && rental.titleEn ? rental.titleEn : rental.title;

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
      <h3 className="text-3xl md:text-4xl font-semibold text-stone-900 mb-6">
        {rentalTitle}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Range Picker */}
        <DateRangePicker
          pickupDate={pickupDate}
          returnDate={returnDate}
          onPickupDateChange={setPickupDate}
          onReturnDateChange={setReturnDate}
          pricePerDay={rental.pricePerDay}
          deposit={rental.deposit}
          currency={rental.currency}
          onCalculationChange={setCalculation}
        />

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              {t("name")} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              placeholder={t("namePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              {t("email")} *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              placeholder={t("emailPlaceholder")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            {t("phone")} *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            placeholder={t("phonePlaceholder")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            {t("pickupTime")}
          </label>
          <input
            type="text"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            placeholder={t("pickupTimePlaceholder")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            {t("message")}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-none"
            placeholder={t("messagePlaceholder")}
          />
        </div>

        {/* Price Summary */}
        {calculation && (
          <div className="bg-stone-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">{t("pricePerDay")}:</span>
              <span className="text-stone-900">
                {rental.pricePerDay} {rental.currency} × {calculation.days} {t("days")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">{t("rentalPrice")}:</span>
              <span className="text-stone-900">
                {calculation.rentalPrice} {rental.currency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">{t("deposit")}:</span>
              <span className="text-stone-900">
                {calculation.deposit} {rental.currency}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-stone-200">
              <span className="text-stone-900">{t("total")}:</span>
              <span className="text-stone-900">
                {calculation.total} {rental.currency}
              </span>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            isFormValid() && !isSubmitting
              ? "bg-accent text-white hover:bg-accent/90"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? t("sending") : t("submit")}
        </button>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {t("successMessage")}
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {t("errorMessage")}
          </div>
        )}
      </form>
    </div>
  );
}

