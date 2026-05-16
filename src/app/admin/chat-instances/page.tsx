"use client";

import { useState, useEffect, useCallback } from "react";
import AdminShell from "@/components/AdminShell";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Play,
  Square,
  Trash2,
  Power,
  PowerOff,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface ChatInstance {
  name: string;
  port: string;
  status: string;
  disabled: boolean;
  cmsSlug: string;
  ownerUsername: string;
  displayName: string;
}

export default function ChatInstancesPage() {
  const [instances, setInstances] = useState<ChatInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const getToken = () => localStorage.getItem("chatserver_admin_token");

  const showFlash = (type: "success" | "error", msg: string) => {
    setFlash({ type, msg });
    setTimeout(() => setFlash(null), 3000);
  };

  const fetchInstances = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chat-proxy/instances", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInstances(data.instances || []);
    } catch {
      showFlash("error", "Failed to load chat instances");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  const doAction = async (name: string, action: string) => {
    setActionLoading(`${name}-${action}`);
    try {
      const res = await fetch(`/api/admin/chat-proxy/instances/${name}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      showFlash("success", `${action} successful for ${name}`);
      fetchInstances();
    } catch (err) {
      showFlash("error", err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteInstance = async (name: string) => {
    if (!confirm(`Delete chat instance "${name}"? This cannot be undone.`)) return;
    setActionLoading(`${name}-delete`);
    try {
      const res = await fetch(`/api/admin/chat-proxy/instances/${name}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      showFlash("success", `${name} deleted`);
      fetchInstances();
    } catch {
      showFlash("error", "Failed to delete instance");
    } finally {
      setActionLoading(null);
    }
  };

  const statusColor = (status: string, disabled: boolean) => {
    if (disabled) return "bg-red-100 text-red-700";
    if (status === "online") return "bg-emerald-100 text-emerald-700";
    return "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#0ea5e9]" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      {flash && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          flash.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {flash.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {flash.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Chat Instances</h1>
          <p className="text-sm text-[#64748b] mt-1">Manage deployed chat server instances</p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchInstances(); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0ea5e9] text-white rounded-lg text-sm font-medium hover:bg-[#0284c7] transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {instances.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <MessageSquare className="h-12 w-12 text-[#94a3b8] mx-auto mb-4" />
          <p className="text-[#64748b]">No chat instances deployed yet.</p>
          <p className="text-sm text-[#94a3b8] mt-1">Instances are created automatically when orders are confirmed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instances.map((inst) => (
            <div key={inst.name} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0ea5e9]/10">
                    <MessageSquare className="h-4 w-4 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#0f172a]">{inst.displayName || inst.name}</h3>
                    <p className="text-xs text-[#94a3b8]">Port {inst.port}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase ${statusColor(inst.status, inst.disabled)}`}>
                  {inst.disabled ? "Disabled" : inst.status}
                </span>
              </div>
              <div className="px-5 py-3 space-y-1.5 text-xs text-[#64748b]">
                <div className="flex justify-between">
                  <span>Owner</span>
                  <span className="font-medium text-[#0f172a]">{inst.ownerUsername || "—"}</span>
                </div>
                {inst.cmsSlug && (
                  <div className="flex justify-between">
                    <span>Slug</span>
                    <span className="font-mono text-[#0f172a]">{inst.cmsSlug}</span>
                  </div>
                )}
              </div>
              <div className="px-5 py-3 border-t border-[#f1f5f9] flex items-center gap-2">
                {inst.status !== "online" && !inst.disabled && (
                  <button
                    onClick={() => doAction(inst.name, "start")}
                    disabled={actionLoading === `${inst.name}-start`}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === `${inst.name}-start` ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                    Start
                  </button>
                )}
                {inst.status === "online" && (
                  <button
                    onClick={() => doAction(inst.name, "stop")}
                    disabled={actionLoading === `${inst.name}-stop`}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === `${inst.name}-stop` ? <Loader2 className="h-3 w-3 animate-spin" /> : <Square className="h-3 w-3" />}
                    Stop
                  </button>
                )}
                {!inst.disabled ? (
                  <button
                    onClick={() => doAction(inst.name, "disable")}
                    disabled={!!actionLoading}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <PowerOff className="h-3 w-3" />
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={() => doAction(inst.name, "enable")}
                    disabled={!!actionLoading}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                  >
                    <Power className="h-3 w-3" />
                    Enable
                  </button>
                )}
                <button
                  onClick={() => deleteInstance(inst.name)}
                  disabled={actionLoading === `${inst.name}-delete`}
                  className="ml-auto flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {actionLoading === `${inst.name}-delete` ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
