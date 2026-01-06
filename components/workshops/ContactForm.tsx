"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Workshop, EventType } from "@/lib/workshops";
import { getNextSchedule, getAvailableSpots, formatDateSl, formatDateEn } from "@/lib/workshops";

type InquiryMode = "scheduled" | "custom";

interface ContactFormProps {
  workshops: Workshop[];
  eventTypes: EventType[];
  preselectedWorkshop?: Workshop | null;
}

export function ContactForm({ workshops, eventTypes, preselectedWorkshop }: ContactFormProps) {
  const t = useTranslations("workshops.form");
  const tCard = useTranslations("workshops.card");
  const locale = useLocale();

  // Helper function to format spots text in Slovenian with proper pluralization
  const formatSpotsText = (spots: number, locale: string): string => {
    if (locale === "sl") {
      if (spots === 1) return "1 mesto";
      if (spots >= 2 && spots <= 4) return `${spots} mesta`;
      return `${spots} mest`;
    }
    // English
    return spots === 1 ? "1 spot" : `${spots} spots`;
  };

  // Form state
  const [mode, setMode] = useState<InquiryMode>(preselectedWorkshop ? "scheduled" : "scheduled");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | "">(preselectedWorkshop?.id || "");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Get workshops with upcoming schedules
  const workshopsWithSchedules = workshops.filter(w => {
    const next = getNextSchedule(w);
    return next && getAvailableSpots(next) > 0;
  });

  // Build mailto link
  const buildMailtoLink = () => {
    const subject = mode === "scheduled" 
      ? `${t("emailSubjectBooking")}: ${workshops.find(w => w.id === selectedWorkshopId)?.title || ""}`
      : `${t("emailSubjectCustom")}: ${eventTypes.find(e => e.id === selectedEventType)?.[locale === "en" ? "en" : "sl"] || ""}`;
    
    let body = `${t("name")}: ${name}\n`;
    body += `${t("email")}: ${email}\n`;
    body += `${t("phone")}: ${phone}\n\n`;

    if (mode === "scheduled") {
      const workshop = workshops.find(w => w.id === selectedWorkshopId);
      const next = workshop ? getNextSchedule(workshop) : null;
      body += `${t("selectedWorkshop")}: ${workshop?.title || ""}\n`;
      if (next) {
        const dateStr = locale === "en" ? formatDateEn(next.date) : formatDateSl(next.date);
        body += `${t("date")}: ${dateStr} ${t("at")} ${next.time}\n`;
      }
    } else {
      const eventType = eventTypes.find(e => e.id === selectedEventType);
      body += `${t("eventType")}: ${eventType?.[locale === "en" ? "en" : "sl"] || ""}\n`;
      body += `${t("numberOfPeople")}: ${numberOfPeople}\n`;
      body += `${t("preferredDate")}: ${preferredDate}\n`;
    }

    if (message) {
      body += `\n${t("message")}:\n${message}`;
    }

    return `mailto:info@doriseinfalt.art?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Open mailto link
    window.location.href = buildMailtoLink();
    
    // Show success after a short delay
    setTimeout(() => {
      setSubmitStatus("success");
      setIsSubmitting(false);
    }, 500);
  };

  const isFormValid = () => {
    if (!name || !email || !phone) return false;
    if (mode === "scheduled" && !selectedWorkshopId) return false;
    if (mode === "custom" && !selectedEventType) return false;
    return true;
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
      <h3 className="text-3xl md:text-4xl font-semibold text-stone-900 mb-6">{t("title")}</h3>

      {/* Mode selector */}
      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => setMode("scheduled")}
          className={`flex-1 py-3 px-4 rounded-lg font-medium text-base transition-all ${
            mode === "scheduled"
              ? "bg-accent text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <span style={{ marginTop: '2pt', display: 'block' }}>{t("modeScheduled")}</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("custom")}
          className={`flex-1 py-3 px-4 rounded-lg font-medium text-base transition-all ${
            mode === "custom"
              ? "bg-accent text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <span style={{ marginTop: '2pt', display: 'block' }}>{t("modeCustom")}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Common fields */}
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

        {/* Scheduled course mode */}
        {mode === "scheduled" && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              {t("selectWorkshop")} *
            </label>
            <div className="relative">
              <select
                value={selectedWorkshopId}
                onChange={(e) => setSelectedWorkshopId(Number(e.target.value) || "")}
                required
                className="w-full px-4 py-3 pr-10 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white appearance-none"
                style={{ paddingTop: 'calc(0.75rem + 2pt)', paddingBottom: 'calc(0.75rem + 2pt)' }}
              >
                <option value="">{t("selectWorkshopPlaceholder")}</option>
                {workshopsWithSchedules.map((workshop) => {
                  const next = getNextSchedule(workshop);
                  const spots = next ? getAvailableSpots(next) : 0;
                  const dateStr = next 
                    ? (locale === "en" ? formatDateEn(next.date) : formatDateSl(next.date))
                    : "";
                  const title = locale === "en" && workshop.titleEn ? workshop.titleEn : workshop.title;
                  
                  return (
                    <option key={workshop.id} value={workshop.id}>
                      {title} ({dateStr} - {formatSpotsText(spots, locale)})
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginTop: '2pt' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Custom event mode */}
        {mode === "custom" && (
          <>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {t("eventType")} *
              </label>
              <div className="relative">
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-10 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white appearance-none"
                  style={{ paddingTop: 'calc(0.75rem + 2pt)', paddingBottom: 'calc(0.75rem + 2pt)' }}
                >
                  <option value="">{t("eventTypePlaceholder")}</option>
                  {eventTypes.map((eventType) => (
                    <option key={eventType.id} value={eventType.id}>
                      {locale === "en" ? eventType.en : eventType.sl}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginTop: '2pt' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  {t("numberOfPeople")}
                </label>
                <input
                  type="number"
                  min="1"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  placeholder={t("numberOfPeoplePlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  {t("preferredDate")}
                </label>
                <input
                  type="text"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  placeholder={t("preferredDatePlaceholder")}
                />
              </div>
            </div>
          </>
        )}

        {/* Message */}
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

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              isFormValid() && !isSubmitting
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            <span style={{ marginTop: '2pt', display: 'block' }}>{isSubmitting ? t("sending") : t("submit")}</span>
          </button>
          
          <a
            href="mailto:info@doriseinfalt.art"
            className="flex-1 py-3 px-6 rounded-lg font-medium text-center border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <span style={{ marginTop: '2pt', display: 'block' }}>{t("directEmail")}</span>
          </a>
        </div>

        {submitStatus === "success" && (
          <p className="text-accent text-sm text-center mt-4 py-2 px-4 rounded-lg bg-accent/5">
            {t("successMessage")}
          </p>
        )}
      </form>
    </div>
  );
}

