"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function GeneralContactForm() {
  const t = useTranslations("contact.form");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // In a real application, you would send this data to an API endpoint
    const formData = {
      name,
      email,
      phone,
      subject,
      message,
    };

    console.log("Form submitted:", formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (Math.random() > 0.1) { // Simulate 90% success rate
      setSubmitStatus("success");
      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } else {
      setSubmitStatus("error");
    }
    setIsSubmitting(false);
  };

  const isFormValid = () => {
    return name && email && message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
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

      {/* Email */}
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

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          {t("phone")}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          placeholder={t("phonePlaceholder")}
        />
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          {t("subject")}
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          placeholder={t("subjectPlaceholder")}
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          {t("message")} *
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-none"
          placeholder={t("messagePlaceholder")}
        />
      </div>

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
        <span style={{ marginTop: '2pt', display: 'block' }}>
          {isSubmitting ? t("sending") : t("submit")}
        </span>
      </button>

      {/* Status messages */}
      {submitStatus === "success" && (
        <p className="text-accent bg-accent/5 py-2 px-4 rounded-lg text-sm text-center">
          {t("successMessage")}
        </p>
      )}
      {submitStatus === "error" && (
        <p className="text-red-500 bg-red-50 py-2 px-4 rounded-lg text-sm text-center">
          {t("errorMessage")}
        </p>
      )}
    </form>
  );
}

