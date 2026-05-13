"use client";
import React, { useState } from "react";
import { docsChapters } from "@/data/docs-content";
import DocsNav from "./DocsNav";
import DocsContent from "./DocsContent";

export default function DocsPage() {
  const [activeId, setActiveId] = useState(docsChapters[0]?.id ?? "overview");
  const chapter = docsChapters.find((c) => c.id === activeId) ?? docsChapters[0]!;

  return (
    <div className="flex flex-1 overflow-hidden">
      <DocsNav chapters={docsChapters} activeId={activeId} onSelect={setActiveId} />
      <div className="flex-1 overflow-y-auto p-6">
        <DocsContent markdown={chapter.content} />
      </div>
    </div>
  );
}
