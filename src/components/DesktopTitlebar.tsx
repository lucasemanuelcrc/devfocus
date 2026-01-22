"use client";

import { useEffect, useState } from "react";
import { Maximize2, Minimize2, Minus, Square, X } from "lucide-react";

type WindowState = { isMaximized: boolean; isFullScreen: boolean };

export default function DesktopTitlebar({ enabled }: { enabled: boolean }) {
  const [state, setState] = useState<WindowState>({
    isMaximized: false,
    isFullScreen: false,
  });

  useEffect(() => {
    if (!enabled) return;

    let unsubscribe: (() => void) | undefined;
    (async () => {
      const initial =
        typeof window !== "undefined"
          ? await window.desktop?.window?.getState?.()
          : undefined;
      if (initial) setState(initial);
      unsubscribe =
        typeof window !== "undefined"
          ? window.desktop?.window?.onStateChanged?.((s) => setState(s))
          : undefined;
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [enabled]);

  if (!enabled) return null;

  const w = typeof window !== "undefined" ? window.desktop?.window : undefined;
  const onDoubleClick = () => {
    // Common desktop behavior: double-click titlebar toggles maximize
    w?.toggleMaximize?.();
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[36px] electron-titlebar bg-focus-base/90 backdrop-blur supports-[backdrop-filter]:bg-focus-base/60 border-b border-white/5" onDoubleClick={onDoubleClick}>
      <div className="flex h-full items-center justify-between px-3">
        <div className="flex items-center gap-2 select-none">
          <div className="w-2 h-2 rounded-full bg-cyan-400/80" />
          <span className="text-xs tracking-[0.35em] text-slate-200/80">
            FOCUS
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="no-drag inline-flex h-8 w-10 items-center justify-center rounded-md hover:bg-white/5"
            onClick={() => w?.minimize?.()}
            aria-label="Minimizar"
            title="Minimizar"
            type="button"
          >
            <Minus size={16} />
          </button>

          <button
            className="no-drag inline-flex h-8 w-10 items-center justify-center rounded-md hover:bg-white/5"
            onClick={() => w?.toggleMaximize?.()}
            aria-label={state.isMaximized ? "Restaurar" : "Maximizar"}
            title={state.isMaximized ? "Restaurar" : "Maximizar"}
            type="button"
          >
            {state.isMaximized ? <Minimize2 size={16} /> : <Square size={15} />}
          </button>

          <button
            className="no-drag inline-flex h-8 w-10 items-center justify-center rounded-md hover:bg-white/5"
            onClick={() => w?.toggleFullscreen?.()}
            aria-label={state.isFullScreen ? "Sair do Fullscreen" : "Fullscreen"}
            title={state.isFullScreen ? "Sair do Fullscreen" : "Fullscreen"}
            type="button"
          >
            {state.isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button
            className="no-drag inline-flex h-8 w-10 items-center justify-center rounded-md hover:bg-red-500/20 hover:text-red-200"
            onClick={() => w?.close?.()}
            aria-label="Fechar"
            title="Fechar"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
