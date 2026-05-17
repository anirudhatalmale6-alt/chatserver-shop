"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Send, CheckCircle, Loader2, Mail, User,
  MessageSquare, MapPin, Phone, Clock, ArrowRight, RefreshCw,
} from "lucide-react";

interface ContactSettings {
  contactPageTitle?: string;
  contactPageSubtitle?: string;
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactHours?: string;
}

const infoBadges = [
  {
    icon: MapPin,
    label: "ADDRESS",
    fallback: "Istanbul, Turkey",
    key: "contactAddress" as const,
    color: "from-[#0ea5e9] to-[#38bdf8]",
  },
  {
    icon: Phone,
    label: "PHONE",
    fallback: "+31 6 12345678",
    key: "contactPhone" as const,
    color: "from-[#10b981] to-[#34d399]",
  },
  {
    icon: Mail,
    label: "EMAIL",
    fallback: "info@chatserver.tr",
    key: "contactEmail" as const,
    color: "from-[#8b5cf6] to-[#a78bfa]",
  },
  {
    icon: Clock,
    label: "WORKING HOURS",
    fallback: "Mon - Fri: 09:00 - 18:00",
    key: "contactHours" as const,
    color: "from-[#f59e0b] to-[#fbbf24]",
  },
];

export default function ContactPage() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<ContactSettings>({});

  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const loadCaptcha = useCallback(() => {
    fetch("/api/captcha")
      .then((r) => r.json())
      .then((d) => {
        setCaptchaCode(d.code || "");
        setCaptchaToken(d.token || "");
        setCaptchaInput("");
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data.departments || []);
        if (data.departments?.length) setDepartment(data.departments[0]);
      })
      .catch(() => {});
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d))
      .catch(() => {});
    loadCaptcha();
  }, [loadCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !department || !subject.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (captchaInput.toLowerCase() !== captchaCode.toLowerCase()) {
      setError("Captcha verification failed. Please type the code exactly as shown.");
      loadCaptcha();
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          department,
          subject: subject.trim(),
          message: message.trim(),
          captchaInput: captchaInput.toLowerCase(),
          captchaToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send message.");
        if (data.error?.includes("aptcha")) loadCaptcha();
        return;
      }
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center pt-20">
        <div className="max-w-md mx-auto px-5 text-center">
          <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-sm">
            <div className="flex justify-center mb-5">
              <div className="h-16 w-16 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-[#10b981]" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Thank you for contacting us. Our team will review your message and get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const pageTitle = settings.contactPageTitle || "Get In Touch";
  const pageSubtitle = settings.contactPageSubtitle || "Have a question or need help? Select a department and send us a message.";

  return (
    <div>
      <section className="pt-28 pb-10 sm:pt-32 sm:pb-12 bg-gradient-to-br from-[#ecfdf5] via-[#f0f9ff] to-[#ecfeff]">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#10b981]">// Contact</span>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 tracking-tight">
            {pageTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500 leading-relaxed">
            {pageSubtitle}
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

            <div className="lg:col-span-1 flex flex-col gap-5">
              {infoBadges.map((info) => (
                <div
                  key={info.label}
                  className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 transition-all duration-300 hover:border-[#0ea5e9]/30 hover:shadow-lg hover:shadow-[#0ea5e9]/5"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${info.color} shadow-sm`}>
                    <info.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-1">
                      {info.label}
                    </h3>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      {(settings as Record<string, string>)[info.key] || info.fallback}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">

                {departments.length > 0 && (
                  <div className="mb-7">
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                      Select Department
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => setDepartment(dept)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            department === dept
                              ? "bg-gradient-to-r from-[#0ea5e9] to-[#10b981] text-white shadow-md shadow-[#0ea5e9]/20"
                              : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-[#0ea5e9]/40 hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/5"
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#0ea5e9] focus:bg-white focus:ring-2 focus:ring-[#0ea5e9]/10 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#0ea5e9] focus:bg-white focus:ring-2 focus:ring-[#0ea5e9]/10 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="How can we help?"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 px-4 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#0ea5e9] focus:bg-white focus:ring-2 focus:ring-[#0ea5e9]/10 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-300" />
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        placeholder="Describe your question or issue..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#0ea5e9] focus:bg-white focus:ring-2 focus:ring-[#0ea5e9]/10 focus:outline-none transition-all resize-y"
                      />
                    </div>
                  </div>

                  {/* Captcha */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                      Security Verification
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 px-5 py-3 rounded-xl bg-gray-100 border border-gray-200 select-none">
                        <span
                          className="text-lg font-mono font-bold tracking-[0.3em] text-gray-700"
                          style={{ letterSpacing: "0.25em", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}
                        >
                          {captchaCode || "..."}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={loadCaptcha}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/5 transition-colors"
                        title="Refresh captcha"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <input
                        type="text"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Type the code above"
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50/50 py-3 px-4 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#0ea5e9] focus:bg-white focus:ring-2 focus:ring-[#0ea5e9]/10 focus:outline-none transition-all"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-[#0ea5e9] to-[#10b981] text-white text-sm font-bold rounded-xl uppercase tracking-wider hover:shadow-lg hover:shadow-[#0ea5e9]/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {submitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="h-4 w-4" /> Send Message <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
