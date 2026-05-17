"use client";

import { useState, useEffect, useCallback } from "react";
import AdminShell from "@/components/AdminShell";
import { Plus, Trash2, Save, HelpCircle, GripVertical } from "lucide-react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  active: boolean;
  sortOrder: number;
}

export default function FaqAdmin() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = () => localStorage.getItem("chatserver_admin_token") || "";

  const load = useCallback(() => {
    fetch("/api/admin/faq", { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((d) => { setFaqs(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const sorted = [...faqs].sort((a, b) => a.sortOrder - b.sortOrder);

  const addFaq = async () => {
    const res = await fetch("/api/admin/faq", {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ question: "New Question?", answer: "Answer here...", sortOrder: faqs.length }),
    });
    if (res.ok) load();
  };

  const updateFaq = (id: number, field: keyof FaqItem, value: string | boolean | number) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const saveAll = async () => {
    setSaving(true);
    for (const faq of faqs) {
      await fetch("/api/admin/faq", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
        body: JSON.stringify(faq),
      });
    }
    setSaving(false);
  };

  const deleteFaq = async (id: number) => {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/admin/faq?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` },
    });
    load();
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-indigo-500" />
          <h1 className="text-2xl font-bold">FAQ Management</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={addFaq} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Add FAQ
          </button>
          <button onClick={saveAll} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No FAQs yet. Click &quot;Add FAQ&quot; to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((faq) => (
            <div key={faq.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <GripVertical className="h-5 w-5 mt-2 text-gray-300 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={faq.sortOrder}
                      onChange={(e) => updateFaq(faq.id, "sortOrder", parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center"
                      title="Sort order"
                    />
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                      placeholder="Question"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={faq.active}
                        onChange={(e) => updateFaq(faq.id, "active", e.target.checked)}
                        className="rounded"
                      />
                      Active
                    </label>
                    <button onClick={() => deleteFaq(faq.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                    placeholder="Answer..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-y"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
