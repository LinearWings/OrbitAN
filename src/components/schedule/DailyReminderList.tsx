"use client";

import { useState, useRef } from "react";
import { useDailyReminders } from "@/hooks/useDailyReminders";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { getTaskColor, getTaskLabel } from "@/utils/colors";
import { loadCustomTypes } from "@/utils/storage";
import type { DailyReminder } from "@/types";

const DURATION_PRESETS = [5, 10, 15, 30, 45, 60, 90, 120];

interface DailyReminderListProps {
  isOrbitMode?: boolean;
  onReminderClick?: (reminder: DailyReminder) => void;
  onViewAll?: () => void;
}

export default function DailyReminderList({ isOrbitMode, onReminderClick, onViewAll }: DailyReminderListProps) {
  const { todayReminders, addReminder, toggleReminder, deleteReminder, updateReminder } = useDailyReminders();
  const lang = useLanguage();
  const t = getT(lang);
  const [newName, setNewName] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTag, setEditTag] = useState("");
  const [editDuration, setEditDuration] = useState<number | undefined>(undefined);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allTypes = ["work", "study", "meeting", "personal", ...loadCustomTypes().map(ct => ct.name)];

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    addReminder(name);
    setNewName("");
    inputRef.current?.focus();
  };

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

  const doneCount = todayReminders.filter((r) => r.done).length;
  const total = todayReminders.length;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: isOrbitMode
          ? "rgba(245,158,11,0.04)"
          : "rgba(255,255,255,0.02)",
        border: isOrbitMode
          ? "1px solid rgba(245,158,11,0.12)"
          : "1px solid rgba(255,255,255,0.04)",
        boxShadow: isOrbitMode
          ? "0 0 20px rgba(245,158,11,0.06)"
          : "none",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-[0.7rem] font-medium text-white/50 font-satoshi">
            {lang === "zh" ? "今日提醒" : "Today's Reminders"}
          </span>
          {total > 0 && (
            <span className="text-[0.6rem] font-mono text-white/25">
              {doneCount}/{total}
            </span>
          )}
          {isOrbitMode && total > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {isOrbitMode && total > 0 && onViewAll && (
            <button
              onClick={(e) => { e.stopPropagation(); onViewAll(); }}
              className="text-[0.55rem] font-mono text-amber-500/40 hover:text-amber-500/70 transition-colors"
            >
              {lang === "zh" ? "查看全部" : "View All"}
            </button>
          )}
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            className="text-white/20 transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <polyline points="2,3.5 5,7 8,3.5" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-1">
          {/* Reminder list */}
          {todayReminders.map((r) => (
            <div key={r.id} className="group">
              {editingId === r.id ? (
                /* Edit mode */
                <div className="space-y-1.5 py-1">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingId(null); }}
                    onBlur={saveEdit}
                    className="w-full bg-transparent outline-none text-[0.75rem] text-white/70 border-b border-white/10 pb-0.5"
                    autoFocus
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Tag picker */}
                    <div className="relative">
                      <button
                        onClick={() => setShowTagPicker(!showTagPicker)}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.55rem] text-white/40 hover:text-white/60 transition-colors"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        {editTag ? (
                          <>
                            <span className="w-2 h-2 rounded-full" style={{ background: getTaskColor(editTag) }} />
                            {getTaskLabel(editTag).zh}
                          </>
                        ) : (lang === "zh" ? "标签" : "Tag")}
                      </button>
                      {showTagPicker && (
                        <div className="absolute bottom-full left-0 mb-1 flex gap-1 p-1.5 rounded-lg z-10"
                          style={{ background: "rgba(20,20,30,0.95)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {allTypes.map(at => {
                            const c = getTaskColor(at);
                            return (
                              <button
                                key={at}
                                onClick={() => { setEditTag(at); setShowTagPicker(false); }}
                                className="w-4 h-4 rounded-full transition-transform hover:scale-125"
                                style={{ background: c, boxShadow: editTag === at ? `0 0 6px ${c}` : "none" }}
                                title={getTaskLabel(at).zh}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {/* Duration picker */}
                    <div className="relative">
                      <button
                        onClick={() => setShowDurationPicker(!showDurationPicker)}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.55rem] text-white/40 hover:text-white/60 transition-colors"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        {editDuration ? `${editDuration}m` : (lang === "zh" ? "时长" : "Duration")}
                      </button>
                      {showDurationPicker && (
                        <div className="absolute bottom-full left-0 mb-1 flex gap-1 p-1.5 rounded-lg z-10"
                          style={{ background: "rgba(20,20,30,0.95)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {DURATION_PRESETS.map(d => (
                            <button
                              key={d}
                              onClick={() => { setEditDuration(d); setShowDurationPicker(false); }}
                              className="px-1.5 py-0.5 rounded text-[0.5rem] font-mono transition-colors"
                              style={{
                                background: editDuration === d ? "rgba(255,255,255,0.1)" : "transparent",
                                color: editDuration === d ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                              }}
                            >
                              {d}m
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Display mode */
                <div className="flex items-center gap-2">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleReminder(r.id)}
                    className="w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all duration-200"
                    style={{
                      borderColor: r.done
                        ? (r.tag ? getTaskColor(r.tag) : "rgba(255,255,255,0.2)")
                        : "rgba(255,255,255,0.1)",
                      background: r.done
                        ? (r.tag ? `${getTaskColor(r.tag)}30` : "rgba(255,255,255,0.08)")
                        : "transparent",
                    }}
                  >
                    {r.done && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <polyline points="1,4 3,6 7,2" />
                      </svg>
                    )}
                  </button>

                  {/* Tag dot */}
                  {r.tag && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: getTaskColor(r.tag) }} />
                  )}

                  {/* Name */}
                  <button
                    onClick={() => isOrbitMode && onReminderClick?.(r)}
                    className={`flex-1 text-[0.75rem] text-left transition-all duration-200 ${
                      r.done ? "line-through text-white/20" : "text-white/60"
                    } ${isOrbitMode ? "cursor-pointer hover:text-white/80" : ""}`}
                  >
                    {r.name}
                  </button>

                  {/* Duration */}
                  {r.estimatedDuration && (
                    <span className="text-[0.55rem] font-mono text-white/20">
                      {r.estimatedDuration}m
                    </span>
                  )}

                  {/* Edit */}
                  <button
                    onClick={() => startEdit(r)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/20 hover:text-white/50"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M7,1 L9,3 L4,8 L2,8 L2,6 Z" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteReminder(r.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/20 hover:text-red-400/60"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <line x1="2" y1="2" x2="8" y2="8" />
                      <line x1="8" y1="2" x2="2" y2="8" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add new */}
          <div className="flex items-center gap-2 pt-1">
            <input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              placeholder={lang === "zh" ? "添加提醒…" : "Add reminder…"}
              className="flex-1 bg-transparent outline-none text-[0.75rem] text-white/40 placeholder-white/15"
            />
            {newName.trim() && (
              <button
                onClick={handleAdd}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="6" y1="1" x2="6" y2="11" />
                  <line x1="1" y1="6" x2="11" y2="6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
