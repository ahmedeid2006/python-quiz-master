import { useState, useEffect } from "react";

/**
 * يولد بصمة فريدة للجهاز باستخدام معلومات المتصفح
 * هذا يساعد في منع التلاعب بالنتائج من نفس الجهاز
 */
export const useDeviceFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string>("");

  useEffect(() => {
    const generateFingerprint = async () => {
      const components = [
        // معلومات الشاشة
        screen.width,
        screen.height,
        screen.colorDepth,
        screen.pixelDepth,
        // معلومات المتصفح
        navigator.userAgent,
        navigator.language,
        navigator.languages?.join(","),
        navigator.hardwareConcurrency,
        navigator.platform,
        // المنطقة الزمنية
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        // دعم التقنيات
        "ontouchstart" in window ? "touch" : "no-touch",
        navigator.cookieEnabled ? "cookies" : "no-cookies",
        // Canvas fingerprint
        await getCanvasFingerprint(),
      ];

      // تحويل إلى hash
      const hash = await hashString(components.join("|"));
      setFingerprint(hash);
    };

    generateFingerprint();
  }, []);

  return fingerprint;
};

/**
 * يولد بصمة Canvas فريدة
 */
const getCanvasFingerprint = async (): Promise<string> => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";

    // رسم نص فريد
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("Fingerprint", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("Canvas", 4, 17);

    return canvas.toDataURL().slice(-50);
  } catch {
    return "canvas-error";
  }
};

/**
 * تحويل النص إلى hash باستخدام SHA-256
 */
const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * يحفظ ويسترجع اسم اللاعب من localStorage
 */
export const usePlayerNameStorage = () => {
  const STORAGE_KEY = "quiz_player_name";

  const getSavedName = (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  };

  const saveName = (name: string): void => {
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {
      console.error("Could not save name to localStorage");
    }
  };

  const clearName = (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      console.error("Could not clear name from localStorage");
    }
  };

  return { getSavedName, saveName, clearName };
};

/**
 * يولد session ID فريد لكل جلسة اختبار
 */
export const generateSessionId = (): string => {
  return crypto.randomUUID();
};
