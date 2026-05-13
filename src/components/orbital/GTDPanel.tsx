"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { GTDItem } from "@/types";
import { loadMethodologyData, saveMethodologyData } from "@/utils/storage";
import { uid } from "@/utils/uid";

type GTDColumn = "inbox" | "next" | "waiting" | "someday" | "done";

type GTDState = {
  items: GTDItem[];
};

const METHODOLOGY_KEY = "gtd";

function initialState(): GTDState {
  // Seed with a couple items for demonstration
  const t = Date.now();
  const seed: GTDItem[] = [
    { id: uid(), content: "头脑风暴：Orbit Mode 的交互设计", stage: "inbox", createdAt: new Date(t).toISOString() },
    { id: uid(), content: "整理：GTD 面板数据结构", stage: "next", createdAt: new Date(t).toISOString() },
  ];
  return { items: seed };
}

function Column({ title, count, dragOver, children, onDragOver, onDrop }: { title: string; count: number; dragOver?: boolean; children: React.ReactNode; onDragOver?: (e: React.DragEvent) => void; onDrop?: (e: React.DragEvent) => void }) {
  return (
    <div
      className={"flex-1 min-w-0 p-2" + (dragOver ? " border border-white/40 bg-white/10" : "")}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-white/60 select-none">
        <span>{title}</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.7em]">{count}</span>
      </div>
      <div className="flex-1 space-y-3 max-h-[60vh] overflow-y-auto pl-1 pr-2">{children}</div>
    </div>
  );
}
function Card({ item, onMove, onDelete, onDragStart, onDragEnd, isDragging }: { item: GTDItem; onMove: (id: string, dir: -1 | 1) => void; onDelete: (id: string) => void; onDragStart?: (id: string) => void; onDragEnd?: () => void; isDragging?: boolean }) {
  return (
    <div
      className="rounded-lg border border-white/6 bg-white/10 p-3 text-sm text-white/90 shadow-glass"
      draggable
      onDragStart={(e) => {
        // Ensure we carry the item id for drop handling
        e.dataTransfer.setData("text/plain", item.id);
        if (onDragStart) onDragStart(item.id);
      }}
      onDragEnd={() => {
        if (onDragEnd) onDragEnd();
      }}
      style={isDragging ? { opacity: 0.5 } : undefined}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="whitespace-pre-wrap flex-1">{item.content}</div>
        <button
          aria-label="delete"
          onClick={() => onDelete(item.id)}
          className="ml-2 text-white/40 hover:text-red-400 transition-colors shrink-0"
          type="button"
        >
          ✕
        </button>
      </div>
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        <div className="flex items-center gap-2">
          <button aria-label="move left" onClick={() => onMove(item.id, -1)} className="rounded bg-white/10 px-2 py-0.5" type="button">◀</button>
          <span className="px-2">{item.stage}</span>
          <button aria-label="move right" onClick={() => onMove(item.id, 1)} className="rounded bg-white/10 px-2 py-0.5" type="button">▶</button>
        </div>
      </div>
    </div>
  );
}

export default function GTDPanel() {
  const [state, setState] = useState<GTDState>(() => {
    const saved = loadMethodologyData<GTDState>(METHODOLOGY_KEY);
    if (saved?.items?.length) return saved;
    return initialState();
  });

  // Drag-and-drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<GTDColumn | null>(null);

  useEffect(() => {
    saveMethodologyData(METHODOLOGY_KEY, state);
  }, [state]);

  const columns = useMemo(() => {
    const byStage: Record<string, GTDItem[]> = {
      inbox: [],
      next: [],
      waiting: [],
      someday: [],
      done: [],
    };
    state.items.forEach((it) => {
      byStage[it.stage].push(it);
    });
    return {
      inbox: byStage.inbox,
      next: byStage.next,
      waiting: byStage.waiting,
      someday: byStage.someday,
      done: byStage.done,
    };
  }, [state.items]);

  function addItem(content: string) {
    const newItem: GTDItem = { id: uid(), content, stage: "inbox", createdAt: new Date().toISOString() };
    setState((s) => ({ items: [newItem, ...s.items] }));
  }

  function deleteItem(id: string) {
    setState((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  }

  // onMove handler to shift items between stages
  function onMove(id: string, dir: -1 | 1) {
    setState((s) => {
      const idx = s.items.findIndex((i) => i.id === id);
      if (idx === -1) return s;
      const item = s.items[idx];
      const order: GTDColumn[] = ["inbox", "next", "waiting", "someday", "done"];
      const currentIndex = order.indexOf(item.stage);
      const nextIndex = Math.max(0, Math.min(order.length - 1, currentIndex + dir));
      const nextStage = order[nextIndex];
      const updated = [...s.items];
      updated[idx] = { ...item, stage: nextStage };
      return { items: updated };
    });
  }

  // Drag start from Card: identify the dragged item's index
  function handleDragStartForItem(id: string) {
    setDraggedId(id);
  }

  function handleDragEndAll() {
    setDraggedId(null);
    setDragOverColumn(null);
  }

  // Column drop handling
  function handleDragOverColumn(column: GTDColumn) {
    return (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverColumn(column);
    };
  }

  function handleDropOnColumn(column: GTDColumn) {
    return (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedId) {
        setDragOverColumn(null);
        return;
      }
      setState((s) => {
        const idx = s.items.findIndex((i) => i.id === draggedId);
        if (idx === -1) return s;
        const item = s.items[idx];
        const order: GTDColumn[] = ["inbox", "next", "waiting", "someday", "done"];
        if (order.indexOf(item.stage) === order.indexOf(column)) return s;
        const updated = [...s.items];
        updated[idx] = { ...item, stage: column };
        return { items: updated };
      });
      setDraggedId(null);
      setDragOverColumn(null);
    };
  }

  // Add input bar on top of Inbox column
  const [draft, setDraft] = useState("");
  function onKeyDownDraft(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && draft.trim()) {
      addItem(draft.trim());
      setDraft("");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 h-full">
      <div className="mb-4 text-white/60 text-sm">GTD 看板（数据本地持久）</div>
      <div className="flex gap-4 min-h-[360px] flex-1 overflow-hidden">
        <Column
          title="收集"
          count={state.items.filter((i) => i.stage === "inbox").length}
          
          dragOver={dragOverColumn === "inbox"}
          onDragOver={handleDragOverColumn("inbox")}
          onDrop={handleDropOnColumn("inbox")}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDownDraft}
            placeholder="输入新任务，按 Enter 添加"
            className="w-full rounded bg-white/10 border border-white/20 px-3 py-2 text-sm text-white/90 focus:outline-none"
          />
          <div className="space-y-2 mt-2">
            {columns.inbox.map((it) => (
              <Card
                key={it.id}
                item={it}
                onMove={onMove}
                onDelete={deleteItem}
                onDragStart={handleDragStartForItem}
                onDragEnd={handleDragEndAll}
                isDragging={draggedId === it.id}
              />
            ))}
          </div>
        </Column>
        <Column
          title="整理"
          count={state.items.filter((i) => i.stage === "next").length}
          
          dragOver={dragOverColumn === "next"}
          onDragOver={handleDragOverColumn("next")}
          onDrop={handleDropOnColumn("next")}
        >
          <div className="space-y-2 mt-2">
            {columns.next.map((it) => (
              <Card
                key={it.id}
                item={it}
                onMove={onMove}
                onDelete={deleteItem}
                onDragStart={handleDragStartForItem}
                onDragEnd={handleDragEndAll}
                isDragging={draggedId === it.id}
              />
            ))}
          </div>
        </Column>
        <Column
          title="组织"
          count={state.items.filter((i) => i.stage === "waiting").length}
          
          dragOver={dragOverColumn === "waiting"}
          onDragOver={handleDragOverColumn("waiting")}
          onDrop={handleDropOnColumn("waiting")}
        >
          <div className="space-y-2 mt-2">
            {columns.waiting.map((it) => (
              <Card
                key={it.id}
                item={it}
                onMove={onMove}
                onDelete={deleteItem}
                onDragStart={handleDragStartForItem}
                onDragEnd={handleDragEndAll}
                isDragging={draggedId === it.id}
              />
            ))}
          </div>
        </Column>
        <Column
          title="回顾"
          count={state.items.filter((i) => i.stage === "someday").length}
          
          dragOver={dragOverColumn === "someday"}
          onDragOver={handleDragOverColumn("someday")}
          onDrop={handleDropOnColumn("someday")}
        >
          <div className="space-y-2 mt-2">
            {columns.someday.map((it) => (
              <Card
                key={it.id}
                item={it}
                onMove={onMove}
                onDelete={deleteItem}
                onDragStart={handleDragStartForItem}
                onDragEnd={handleDragEndAll}
                isDragging={draggedId === it.id}
              />
            ))}
          </div>
        </Column>
        <Column
          title="执行"
          count={state.items.filter((i) => i.stage === "done").length}
          
          dragOver={dragOverColumn === "done"}
          onDragOver={handleDragOverColumn("done")}
          onDrop={handleDropOnColumn("done")}
        >
          <div className="space-y-2 mt-2">
            {columns.done.map((it) => (
              <Card
                key={it.id}
                item={it}
                onMove={onMove}
                onDelete={deleteItem}
                onDragStart={handleDragStartForItem}
                onDragEnd={handleDragEndAll}
                isDragging={draggedId === it.id}
              />
            ))}
          </div>
        </Column>
      </div>
    </div>
  );
}
