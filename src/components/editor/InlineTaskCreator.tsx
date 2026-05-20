"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRightIcon } from "@/components/ui/Icons";
import type { CustomTypeDef } from "@/types";
import { getTaskColor, getTaskLabel, CUSTOM_TYPE_PALETTE, setCustomTypeCache } from "@/utils/colors";
import { timeToMinutes } from "@/utils/time";
import { loadCustomTypes, saveCustomTypes } from "@/utils/storage";
import { uid } from "@/utils/uid";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface InlineTaskCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: { name: string; type: string; startTime: string; endTime: string }) => void;
  clickPhase: "idle" | "start" | "end";
  pendingStartTime: string | null;
  pendingEndTime: string | null;
  onNudgeTime?: (field: "start" | "end", delta: number) => void;
  onTypeChange?: (type: string) => void;
}

const BUILT_IN_TYPES = ["work", "study", "meeting", "personal"];

// ── Wheel column with native wheel listener (passive:false) ──
function WheelColumn({
  value,
  range,
  onChange,
}: {
  value: number;
  range: number;
  onChange: (v: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    valueRef.current = value;
    onChangeRef.current = onChange;
  }, [value, onChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY === 0) return;
      const v = valueRef.current;
      const nxt = (v + 1) % range;
      const prv = ((v - 1) % range + range) % range;
      onChangeRef.current(e.deltaY > 0 ? nxt : prv);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [range]);

  const prev = ((value - 1) % range + range) % range;
  const next = (value + 1) % range;

  return (
    <div
      ref={ref}
      className="flex flex-col items-center select-none py-1 px-1.5 rounded-lg"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onChange(prev); }}
        className="text-[0.65rem] leading-none font-mono text-white/20 hover:text-white/50 active:text-white/70 transition-colors min-h-[20px] min-w-[28px]"
        aria-label="Decrease"
      >
        {String(prev).padStart(2, "0")}
      </button>
      <span className="text-lg font-semibold font-mono tabular-nums leading-tight text-white/90 my-0.5 pointer-events-none">
        {String(value).padStart(2, "0")}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onChange(next); }}
        className="text-[0.65rem] leading-none font-mono text-white/20 hover:text-white/50 active:text-white/70 transition-colors min-h-[20px] min-w-[28px]"
        aria-label="Increase"
      >
        {String(next).padStart(2, "0")}
      </button>
    </div>
  );
}

function TimeWheelPicker({
  label,
  time,
  onNudge,
}: {
  label: string;
  time: string;
  onNudge: (delta: number) => void;
}) {
  const [h, m] = time.split(":").map(Number);
  const onNudgeRef = useRef(onNudge);

  useEffect(() => {
    onNudgeRef.current = onNudge;
  }, [onNudge]);

  const setHour = useCallback((v: number) => {
    // Only change the hour, keep the current minute
    const currMin = String(m ?? 0).padStart(2, "0");
    const newTime = `${String(v).padStart(2, "0")}:${currMin}`;
    const currTime = `${String(h ?? 0).padStart(2, "0")}:${currMin}`;
    const total = timeToMinutes(newTime);
    const currTotal = timeToMinutes(currTime);
    const diff = total - currTotal;
    // Choose shortest wrap direction
    if (diff > 720) onNudgeRef.current(diff - 1440);
    else if (diff < -720) onNudgeRef.current(diff + 1440);
    else onNudgeRef.current(diff);
  }, [h, m]);

  const setMinute = useCallback((v: number) => {
    // Only change the minute, keep the current hour
    const currHour = String(h ?? 0).padStart(2, "0");
    const newTime = `${currHour}:${String(v).padStart(2, "0")}`;
    const currTime = `${currHour}:${String(m ?? 0).padStart(2, "0")}`;
    const total = timeToMinutes(newTime);
    const currTotal = timeToMinutes(currTime);
    const diff = total - currTotal;
    // Choose shortest wrap direction
    if (diff > 720) onNudgeRef.current(diff - 1440);
    else if (diff < -720) onNudgeRef.current(diff + 1440);
    else onNudgeRef.current(diff);
  }, [h, m]);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-white/35 tracking-[0.1em] uppercase" style={{ fontFamily: "'Inter', 'Microsoft YaHei', sans-serif" }}>{label}</span>
      <div className="flex items-center gap-1">
        <WheelColumn value={h ?? 0} range={24} onChange={setHour} />
        <span className="text-white/35 text-base font-mono mt-[-10px]">:</span>
        <WheelColumn value={m ?? 0} range={60} onChange={setMinute} />
      </div>
    </div>
  );
}

export default function InlineTaskCreator({
  isOpen,
  onClose,
  onCreate,
  clickPhase,
  pendingStartTime,
  pendingEndTime,
  onNudgeTime,
  onTypeChange,
}: InlineTaskCreatorProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("work");
  const handleTypeChange = useCallback((t: string) => {
    setType(t);
    onTypeChange?.(t);
  }, [onTypeChange]);
  const [customTypes, setCustomTypes] = useState<CustomTypeDef[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newCustomName, setNewCustomName] = useState("");
  const [newCustomColor, setNewCustomColor] = useState(CUSTOM_TYPE_PALETTE[0] ?? "#EC4899");
  const [customTypeError, setCustomTypeError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const customNameRef = useRef<HTMLInputElement>(null);
  const typeColor = getTaskColor(type);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const effectiveOnNudge = useCallback((field: "start" | "end", delta: number) => {
    if (isMobile && !pendingStartTime) {
      onNudgeTime?.("start", 0);
      onNudgeTime?.("end", 0);
    }
    onNudgeTime?.(field, delta);
  }, [isMobile, pendingStartTime, onNudgeTime]);

  // Load custom types from storage
  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => setCustomTypes(loadCustomTypes()));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(""); setType("work"); setShowCustomForm(false); setNewCustomName(""); setNewCustomColor(CUSTOM_TYPE_PALETTE[0] ?? "#EC4899"); setCustomTypeError("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const effectiveStartTime = isMobile
    ? (pendingStartTime ?? "09:00")
    : pendingStartTime;
  const effectiveEndTime = isMobile
    ? (pendingEndTime ?? "10:00")
    : pendingEndTime;

  const duration = (effectiveStartTime && effectiveEndTime)
    ? (timeToMinutes(effectiveEndTime) - timeToMinutes(effectiveStartTime) + 1440) % 1440
    : 0;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && name.trim() && effectiveStartTime && effectiveEndTime) {
      onCreate({ name: name.trim(), type, startTime: effectiveStartTime, endTime: effectiveEndTime });
    }
    if (e.key === "Escape") onClose();
  }, [name, type, effectiveStartTime, effectiveEndTime, onCreate, onClose]);

  const canConfirm = name.trim().length > 0 && effectiveStartTime && effectiveEndTime;

  const handleConfirm = useCallback(() => {
    if (canConfirm) {
      onCreate({ name: name.trim(), type, startTime: effectiveStartTime, endTime: effectiveEndTime });
    }
  }, [canConfirm, name, type, effectiveStartTime, effectiveEndTime, onCreate]);

  // All available types: built-in + custom
  const allTypes = [...BUILT_IN_TYPES, ...customTypes.map((ct) => ct.name)];
  const trimmedCustomName = newCustomName.trim();
  const customTypeExists = allTypes.some((existing) =>
    existing.trim().toLowerCase() === trimmedCustomName.toLowerCase(),
  );

  // Custom type creation
  const handleAddCustomType = useCallback(() => {
    const nameTrimmed = newCustomName.trim();
    if (!nameTrimmed) {
      setCustomTypeError("请输入类别名称");
      return;
    }
    if (customTypeExists) {
      setCustomTypeError("类别名称已存在");
      return;
    }

    const newType: CustomTypeDef = {
      id: uid(),
      name: nameTrimmed,
      color: newCustomColor,
    };
    const updated = [...customTypes, newType];
    setCustomTypes(updated);
    saveCustomTypes(updated);
    setCustomTypeCache(updated);
    handleTypeChange(nameTrimmed);
    setShowCustomForm(false);
    setNewCustomName("");
    setCustomTypeError("");
  }, [newCustomName, newCustomColor, customTypes, customTypeExists]);

  // Pick next available color from palette
  const getNextColor = useCallback((): string => {
    const usedColors = new Set(customTypes.map((ct) => ct.color));
    for (const c of CUSTOM_TYPE_PALETTE) {
      if (!usedColors.has(c)) return c;
    }
    return CUSTOM_TYPE_PALETTE[0] ?? "#EC4899";
  }, [customTypes]);

  const handleOpenCustomForm = useCallback(() => {
    setNewCustomColor(getNextColor());
    setCustomTypeError("");
    setShowCustomForm(true);
    setTimeout(() => customNameRef.current?.focus(), 100);
  }, [getNextColor]);

  if (!isOpen) return null;

  return (
    <>
      {/* Task creation card — floating on the original interface */}
      <div
        className="fixed z-50"
        style={{
          left: isMobile ? "50%" : "18%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "min(90vw, 380px)" : "min(36vw, 340px)",
        }}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${typeColor}12 0%, rgba(255,255,255,0.03) 100%)`,
            border: `1px solid ${typeColor}25`,
            boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 60px ${typeColor}10`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${typeColor}20 0%, transparent 70%)` }}
          />

          <div className="relative p-5 space-y-4">
            {/* Name input */}
            <div>
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="任务名称…"
                className="w-full bg-transparent outline-none text-white placeholder-white/20"
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  textShadow: name ? `0 0 30px ${typeColor}20` : "none",
                }}
              />
              <div
                className="h-[2px] rounded-full mt-2 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${typeColor}60 50%, transparent 100%)`,
                  opacity: name ? 0.8 : 0.3,
                }}
              />
            </div>

            {/* Category selector — Apple Calendar-like horizontal scrollable row */}
            <div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin" style={{ scrollbarWidth: "thin" }}>
                {allTypes.map((t) => {
                  const color = getTaskColor(t);
                  const label = getTaskLabel(t);
                  const sel = type === t;
                  const customDef = customTypes.find((ct) => ct.name === t);
                  const dotColor = customDef ? customDef.color : color;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTypeChange(t)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200 flex-shrink-0"
                      style={{
                        background: sel ? `${dotColor}20` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${sel ? `${dotColor}50` : "rgba(255,255,255,0.06)"}`,
                        boxShadow: sel ? `0 0 12px ${dotColor}30` : "none",
                      }}
                    >
                      {/* Color dot with glow when selected */}
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: dotColor,
                          boxShadow: sel ? `0 0 6px ${dotColor}` : "none",
                        }}
                      />
                      <span
                        className="text-[0.6rem] font-medium whitespace-nowrap"
                        style={{ color: sel ? dotColor : "rgba(255,255,255,0.45)" }}
                      >
                        {label.zh}
                      </span>
                    </button>
                  );
                })}

                {/* "+" button to create custom type */}
                {!showCustomForm && (
                  <button
                    type="button"
                    onClick={handleOpenCustomForm}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-full transition-all duration-200 flex-shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px dashed rgba(255,255,255,0.12)",
                    }}
                    title="创建新类别"
                  >
                    <span className="text-white/40 text-xs leading-none font-medium">+</span>
                  </button>
                )}
              </div>

              {/* Inline custom type creation form */}
              {showCustomForm && (
                <div
                  className="mt-2 p-2 rounded-xl transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      ref={customNameRef}
                      value={newCustomName}
                      onChange={(e) => {
                        setNewCustomName(e.target.value);
                        setCustomTypeError("");
                      }}
                      aria-invalid={!!customTypeError || customTypeExists}
                      aria-describedby="custom-type-error"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleAddCustomType(); }
                        if (e.key === "Escape") { setShowCustomForm(false); setCustomTypeError(""); }
                      }}
                      placeholder="类别名称…"
                      className="flex-1 bg-transparent outline-none text-white/70 placeholder-white/15 text-[0.7rem] font-medium"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomType}
                      disabled={!trimmedCustomName || customTypeExists}
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        background: trimmedCustomName && !customTypeExists ? "#EAB308" : "rgba(255,255,255,0.08)",
                        color: trimmedCustomName && !customTypeExists ? "#000" : "rgba(255,255,255,0.2)",
                      }}
                      aria-label="保存自定义类别"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="1,5 4,8 9,1" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowCustomForm(false); setCustomTypeError(""); }}
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <line x1="1" y1="1" x2="7" y2="7" />
                        <line x1="7" y1="1" x2="1" y2="7" />
                      </svg>
                    </button>
                  </div>
                  {(customTypeError || customTypeExists) && (
                    <div id="custom-type-error" className="mt-1 text-[0.65rem] text-red-300/80">
                      {customTypeError || "类别名称已存在"}
                    </div>
                  )}

                  {/* Color swatches */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {CUSTOM_TYPE_PALETTE.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewCustomColor(c)}
                        className="w-4 h-4 rounded-full transition-all duration-200"
                        style={{
                          backgroundColor: c,
                          boxShadow: newCustomColor === c ? `0 0 8px ${c}, 0 0 0 2px rgba(255,255,255,0.3)` : "none",
                          transform: newCustomColor === c ? "scale(1.2)" : "scale(1)",
                        }}
                      />
                    ))}
                    {/* Custom color picker */}
                    <label
                      className="w-4 h-4 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200"
                      style={{
                        background: `conic-gradient(red, yellow, lime, aqua, blue, magenta, red)`,
                        boxShadow: !CUSTOM_TYPE_PALETTE.includes(newCustomColor) ? `0 0 8px ${newCustomColor}, 0 0 0 2px rgba(255,255,255,0.3)` : "none",
                        transform: !CUSTOM_TYPE_PALETTE.includes(newCustomColor) ? "scale(1.2)" : "scale(1)",
                      }}
                    >
                      <input
                        type="color"
                        value={newCustomColor}
                        onChange={(e) => setNewCustomColor(e.target.value)}
                        className="absolute w-0 h-0 opacity-0 pointer-events-none"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Time display & wheel pickers */}
            <div
              className="px-3 py-2 rounded-xl"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {(effectiveStartTime && effectiveEndTime) ? (
                <div className="flex items-center justify-center gap-3">
                  <TimeWheelPicker
                    label="开始"
                    time={effectiveStartTime}
                    onNudge={(d) => effectiveOnNudge("start", d)}
                  />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-white/20 text-[0.4rem]">&nbsp;</span>
                    <span className="text-white/25 text-xs mt-[-6px]"><ArrowRightIcon size={12} /></span>
                    <span className="text-white/25 text-[0.55rem] font-mono">{duration}min</span>
                  </div>
                  <TimeWheelPicker
                    label="结束"
                    time={effectiveEndTime}
                    onNudge={(d) => effectiveOnNudge("end", d)}
                  />
                </div>
            ) : (
                <div className="text-center">
                  <span style={{ fontFamily: "'Inter', 'Microsoft YaHei', sans-serif" }} className="text-xs text-white/30">
                    {clickPhase === "end" ? "点击表盘选择终点" : "点击表盘选择起点"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm + Cancel */}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontFamily: "'Clash Display', sans-serif",
                }}
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="flex-1 py-2.5 rounded-full text-xs font-semibold transition-all duration-300"
                style={{
                  background: canConfirm
                    ? `linear-gradient(135deg, ${typeColor}, ${typeColor}bb)`
                    : "rgba(255,255,255,0.05)",
                  color: canConfirm ? "#000" : "rgba(255,255,255,0.2)",
                  boxShadow: canConfirm ? `0 4px 20px ${typeColor}30` : "none",
                  fontFamily: "'Clash Display', sans-serif",
                  cursor: canConfirm ? "pointer" : "not-allowed",
                }}
              >
                完成
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
