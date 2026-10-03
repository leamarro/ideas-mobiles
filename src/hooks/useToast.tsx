"use client";

import { useState, useCallback } from "react";

interface ToastData {
  message: string;
  type: "success" | "error" | "info";
}

let toastTimeout: ReturnType<typeof setTimeout>;

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, type: ToastData["type"] = "info") => {
    clearTimeout(toastTimeout);
    setToast({ message, type });
    toastTimeout = setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  return {
    toast,
    showToast,
  };
}

export function Toast() {
  const { toast } = useToast();

  if (!toast) return null;

  const bgColors = {
    success: "bg-green-600",
    error: "bg-brand-red-500",
    info: "bg-brand-black",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${bgColors[toast.type]} text-white px-6 py-3.5 rounded-xl shadow-pop animate-slide-up max-w-sm text-sm font-medium border border-white/10`}
      role="alert"
    >
      {toast.message}
    </div>
  );
}
