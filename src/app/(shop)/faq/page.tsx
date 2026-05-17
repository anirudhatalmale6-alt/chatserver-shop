"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/faq")
      .then((r) => r.json())
      .then((d) => setFaqs(d || []))
      .catch(() => {});
  }, []);

  const toggle = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <div>
      <section className="pt-28 pb-10 sm:pt-32 sm:pb-12 bg-gradient-to-br from-[#ecfdf5] via-[#f0f9ff] to-[#ecfeff]">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#10b981]">// FAQ</span>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 tracking-tight">
            Frequently Asked <span className="text-[#0ea5e9]">Questions</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500 leading-relaxed">
            Find answers to common questions about our chat hosting services.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          {faqs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No FAQs available yet.</p>
              <p className="text-sm mt-2">Check back soon for answers to common questions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "border-[#0ea5e9]/30 shadow-lg shadow-[#0ea5e9]/5 bg-white"
                        : "border-gray-100 bg-white hover:border-[#0ea5e9]/20"
                    }`}
                  >
                    <button
                      onClick={() => toggle(faq.id)}
                      className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left"
                    >
                      <span className={`text-sm sm:text-base font-bold transition-colors ${
                        isOpen ? "text-[#0ea5e9]" : "text-gray-800"
                      }`}>
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-[#0ea5e9]" : "text-gray-400"
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
