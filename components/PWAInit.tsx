"use client";
import { useEffect, useState } from "react";

export function PWAInit() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register SW
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          reg.addEventListener("updatefound", () => {
            const nw = reg.installing;
            if (!nw) return;
            nw.addEventListener("statechange", () => {
              if (nw.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateReady(true);
              }
            });
          });
        })
        .catch(() => {});
    }

    // Listen for install prompt
    const onBip = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      const dismissed = localStorage.getItem("pwa-dismissed");
      const already = window.matchMedia("(display-mode: standalone)").matches;
      if (!dismissed && !already) setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setShowBanner(false);
  };
  const dismiss = () => {
    localStorage.setItem("pwa-dismissed", "1");
    setShowBanner(false);
  };

  return (
    <>
      {showBanner && (
        <div
          role="dialog"
          aria-label="安裝 App"
          style={{
            position: "fixed",
            left: 12,
            right: 12,
            bottom: "calc(env(safe-area-inset-bottom) + 12px)",
            zIndex: 200,
            background: "var(--card-bg, #fffaec)",
            border: "1px solid var(--rule, #c9b890)",
            borderRadius: 16,
            padding: "14px 16px",
            boxShadow: "0 8px 32px rgba(60,40,10,.2)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "var(--font-serif, serif)",
          }}
        >
          <div style={{ fontSize: 28 }}>🗺️</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink, #2d2419)" }}>加到主畫面</div>
            <div style={{ fontSize: 13, color: "var(--ink-soft, #5a4a35)" }}>離線也能看行程</div>
          </div>
          <button
            onClick={dismiss}
            style={{
              minHeight: 40,
              padding: "0 12px",
              borderRadius: 12,
              background: "transparent",
              border: "1px solid var(--rule, #c9b890)",
              color: "var(--ink-soft, #5a4a35)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            之後
          </button>
          <button
            onClick={install}
            style={{
              minHeight: 40,
              padding: "0 16px",
              borderRadius: 12,
              background: "var(--ocean, #2e6b8a)",
              color: "#fff",
              border: 0,
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            安裝
          </button>
        </div>
      )}
      {updateReady && (
        <div
          style={{
            position: "fixed",
            top: "calc(env(safe-area-inset-top) + 12px)",
            left: 12,
            right: 12,
            zIndex: 210,
            background: "var(--ocean, #2e6b8a)",
            color: "#fff",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 4px 14px rgba(0,0,0,.2)",
          }}
        >
          <span style={{ flex: 1 }}>有新版本,重新整理套用</span>
          <button
            onClick={() => location.reload()}
            style={{
              minHeight: 36,
              padding: "0 14px",
              borderRadius: 10,
              background: "#fff",
              color: "var(--ocean, #2e6b8a)",
              border: 0,
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            更新
          </button>
        </div>
      )}
    </>
  );
}
