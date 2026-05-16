"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CloseIcon, ArrowLeftIcon } from "@/components/ui/Icons";
import MethodSelector from "./MethodSelector";
import GTDPanel from "./GTDPanel";
import PomodoroPanel from "./PomodoroPanel";
import ParetoPanel from "./ParetoPanel";
import MoffattPanel from "./MoffattPanel";
import HowellMatrix from "./HowellMatrix";
import SWOTPanel from "./SWOTPanel";
import type { FocusMethodId } from "@/types/focus";

interface MethodologyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  methodId: FocusMethodId | null;
  onSelectMethod?: (id: FocusMethodId | null) => void;
}

const panels: Record<FocusMethodId, React.ReactNode> = {
  gtd: <GTDPanel />,
  pomodoro: <PomodoroPanel />,
  pareto: <ParetoPanel />,
  moffatt: <MoffattPanel />,
  howell: <HowellMatrix />,
  swot: <SWOTPanel />,
};

export default function MethodologyDrawer({
  isOpen,
  onClose,
  methodId,
  onSelectMethod,
}: MethodologyDrawerProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    }, 60);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = drawerRef.current
        ? Array.from(drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )).filter((el) => el.getClientRects().length > 0)
        : [];

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  const showMethodSelector = !methodId;

  return (
    <>
      <div
        className="fixed inset-0 z-[90] transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.4)",
        }}
        onClick={onClose}
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="methodology-drawer-title"
        onClick={(e) => e.stopPropagation()}
        className={isMobile
          ? "fixed bottom-0 inset-x-0 z-[91] transition-transform duration-300 ease-out overflow-hidden rounded-t-3xl"
          : "fixed top-0 right-0 h-full z-[91] transition-transform duration-300 ease-out overflow-hidden"
        }
        style={isMobile ? {
          height: "85vh",
          transform: "translateY(0)",
          background: "rgba(10,10,15,0.96)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
        } : {
          width: "min(480px, 85vw)",
          transform: "translateX(0)",
          background: "rgba(10,10,15,0.96)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
        }}
      >
        {isMobile && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/15" />
          </div>
        )}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
            <h2 id="methodology-drawer-title" className="font-clash text-lg font-semibold text-white/90">
              {showMethodSelector ? "选择方法论" : "方法面板"}
            </h2>
            <button
              type="button"
              aria-label="关闭方法论面板"
              onClick={onClose}
              className="text-white/30 hover:text-white/70 text-sm"
            >
              <CloseIcon size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {showMethodSelector ? (
              <MethodSelector onSelect={(id) => onSelectMethod?.(id as FocusMethodId)} />
            ) : (
              <div>
                <button
                  onClick={() => onSelectMethod?.(null)}
                  className="mb-4 flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
                >
                  <ArrowLeftIcon size={12} className="inline-block mr-0.5" /> 返回方法论列表
                </button>
                {methodId && (panels[methodId] ?? (
                  <div className="text-white/40 text-sm">该方法论尚未实现</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
