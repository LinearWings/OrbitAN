"use client";

import { useState } from "react";
import { useDailyReminders } from "@/hooks/useDailyReminders";
import { useLanguage } from "@/hooks/useLanguage";
import { getTaskColor, getTaskLabel } from "@/utils/colors";
import { loadCustomTypes } from "@/utils/storage";
import { FOCUS_METHOD_COLORS, FOCUS_METHOD_LABELS } from "@/data/focus-defaults";
import type { FocusMethodId } from "@/types/focus";
import type { DailyReminder } from "@/types";

interface ReminderDetailViewProps {
  onClose: () => void;
  onMethodologySelect: (method: FocusMethodId, reminders: DailyReminder[]) => void;
}

const METHODS: FocusMethodId[] = ["gtd", "pomodoro", "pareto", "moffatt", "howell", "swot"];

export default function ReminderDetailView({ onClose, onMethodologySelect }: ReminderDetailViewProps) {
  const { todayReminders, toggleReminder, deleteReminder, updateReminder } = useDailyReminders();
  const lang = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTag, setEditTag] = useState("");
  const [editDuration, setEditDuration] = useState<number | undefined>(undefined);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const allTypes = ["work", "study", "meeting", "personal", ...loadCustomTypes().map(ct => ct.name)];
  const DURATION_PRESETS = [5, 10, 15, 30, 45, 60, 90, 120];
  const incompleteReminders = todayReminders.filter(r => !r.done);

  const startEdit = (r: DailyReminder) => {
    setEditingId(r.id);
    setEditName(r.name);
    setEditTag(r.tag || "");
    setEditDuration(r.estimatedDuration);
    setShowTagPicker(false);
    setShowDurationPicker(false);
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateReminder(editingId, {
      name: editName.trim() || undefined,
      tag: editTag || undefined,
      estimatedDuration: editDuration,
    });
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(6,6,10,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-clash text-xl font-semibold text-white/90">
              {lang === "zh" ? "今日提醒" : "Today's Reminders"}
            </h2>
            <p className="text-[0.7rem] text-white/30 mt-1">
              {todayReminders.filter(r => r.done).length}/{todayReminders.length} {lang === "zh" ? "已完成" : "completed"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </svg>
          </button>
        </div>

        {/* Reminder list */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-6">
          {todayReminders.length === 0 ? (
            <div className="text-center py-12 text-white/20 text-sm">
              {lang === "zh" ? "暂无提醒事项" : "No reminders yet"}
            </div>
          ) : (
            todayReminders.map((r) => (
              <div
                key={r.id}
                className="rounded-xl p-3 transition-all duration-200 group"
                style={{
                  background: r.done ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${r.done ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                {editingId === r.id ? (
                  /* Edit mode */
                  <div className="space-y-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingId(null); }}
                      className="w-full bg-transparent outline-none text-sm text-white/80 border-b border-white/10 pb-1"
                      autoFocus
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Tag picker */}
                      <div className="relative">
                        <button
                          onClick={() => setShowTagPicker(!showTagPicker)}
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-white/50 hover:text-white/70 transition-colors"
                          style={{ background: "rgba(255,255,255,0.06)" }}
                        >
                          {editTag ? (
                            <>
                              <span className="w-2.5 h-2.5 rounded-full" style={{ background: getTaskColor(editTag) }} />
                              {getTaskLabel(editTag).zh}
                            </>
                          ) : (lang === "zh" ? "选择标签" : "Select Tag")}
                        </button>
                        {showTagPicker && (
                          <div className="absolute bottom-full left-0 mb-2 flex gap-1.5 p-2 rounded-lg z-10"
                            style={{ background: "rgba(20,20,30,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            {allTypes.map(at => (
                              <button
                                key={at}
                                onClick={() => { setEditTag(at); setShowTagPicker(false); }}
                                className="w-5 h-5 rounded-full transition-transform hover:scale-125"
                                style={{ background: getTaskColor(at), boxShadow: editTag === at ? `0 0 8px ${getTaskColor(at)}` : "none" }}
                                title={getTaskLabel(at).zh}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Duration picker */}
                      <div className="relative">
                        <button
                          onClick={() => setShowDurationPicker(!showDurationPicker)}
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-white/50 hover:text-white/70 transition-colors"
                          style={{ background: "rgba(255,255,255,0.06)" }}
                        >
                          {editDuration ? `${editDuration}min` : (lang === "zh" ? "预计时长" : "Duration")}
                        </button>
                        {showDurationPicker && (
                          <div className="absolute bottom-full left-0 mb-2 flex gap-1.5 p-2 rounded-lg z-10"
                            style={{ background: "rgba(20,20,30,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            {DURATION_PRESETS.map(d => (
                              <button
                                key={d}
                                onClick={() => { setEditDuration(d); setShowDurationPicker(false); }}
                                className="px-2 py-1 rounded text-xs font-mono transition-colors"
                                style={{
                                  background: editDuration === d ? "rgba(255,255,255,0.12)" : "transparent",
                                  color: editDuration === d ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
                                }}
                              >
                                {d}m
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={saveEdit}
                        className="ml-auto text-xs text-amber-500/60 hover:text-amber-500/90 transition-colors"
                      >
                        {lang === "zh" ? "保存" : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display mode */
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleReminder(r.id)}
                      className="w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all duration-200"
                      style={{
                        borderColor: r.done
                          ? (r.tag ? getTaskColor(r.tag) : "rgba(255,255,255,0.2)")
                          : "rgba(255,255,255,0.15)",
                        background: r.done
                          ? (r.tag ? `${getTaskColor(r.tag)}30` : "rgba(255,255,255,0.08)")
                          : "transparent",
                      }}
                    >
                      {r.done && (
                        <svg width="10" height="10" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <polyline points="1,4 3,6 7,2" />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {r.tag && (
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: getTaskColor(r.tag) }} />
                        )}
                        <span className={`text-sm truncate ${r.done ? "line-through text-white/25" : "text-white/70"}`}>
                          {r.name}
                        </span>
                      </div>
                      {r.estimatedDuration && (
                        <span className="text-[0.6rem] font-mono text-white/20 mt-0.5 block">
                          {r.estimatedDuration}min
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(r)}
                        className="text-white/20 hover:text-white/50 transition-colors p-1"
                      >
                        <svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M7,1 L9,3 L4,8 L2,8 L2,6 Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteReminder(r.id)}
                        className="text-white/20 hover:text-red-400/60 transition-colors p-1"
                      >
                        <svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <line x1="2" y1="2" x2="8" y2="8" />
                          <line x1="8" y1="2" x2="2" y2="8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Methodology buttons */}
        {incompleteReminders.length > 0 && (
          <div className="shrink-0">
            <p className="text-[0.65rem] text-white/25 mb-3 text-center">
              {lang === "zh" ? "选择方法论开始执行" : "Select a methodology to begin"}
            </p>
            <div className="flex items-center justify-center gap-3">
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => onMethodologySelect(m, incompleteReminders)}
                  className="group/btn relative flex flex-col items-center gap-1.5"
                  title={FOCUS_METHOD_LABELS[m][lang === "zh" ? "zh" : "en"]}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group-hover/btn:scale-110"
                    style={{
                      background: `${FOCUS_METHOD_COLORS[m]}15`,
                      border: `1.5px solid ${FOCUS_METHOD_COLORS[m]}40`,
                      boxShadow: `0 0 12px ${FOCUS_METHOD_COLORS[m]}10`,
                    }}
                  >
                    <span
                      className="text-xs font-bold font-mono"
                      style={{ color: FOCUS_METHOD_COLORS[m] }}
                    >
                      {m === "gtd" ? "G" : m === "pomodoro" ? "P" : m === "pareto" ? "Pa" : m === "moffatt" ? "M" : m === "howell" ? "H" : "S"}
                    </span>
                  </div>
                  <span className="text-[0.5rem] text-white/30 group-hover/btn:text-white/50 transition-colors">
                    {FOCUS_METHOD_LABELS[m][lang === "zh" ? "zh" : "en"]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
