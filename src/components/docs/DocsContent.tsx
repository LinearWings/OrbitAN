"use client";
import React from "react";

interface DocsContentProps {
  markdown: string;
}

/** Split inline text on **bold** and \`code\` patterns, returning React nodes. */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // First split on **bold**
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of boldParts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(<strong key={nodes.length}>{part.slice(2, -2)}</strong>);
    } else {
      // Then split on `code`
      const codeParts = part.split(/(`[^`]+`)/g);
      for (const cp of codeParts) {
        if (cp.startsWith("`") && cp.endsWith("`")) {
          nodes.push(
            <code
              key={nodes.length}
              className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.75rem] text-amber-300/80 border border-white/[0.04]"
            >
              {cp.slice(1, -1)}
            </code>
          );
        } else if (cp) {
          nodes.push(<span key={nodes.length}>{cp}</span>);
        }
      }
    }
  }
  if (nodes.length === 0) nodes.push(<span key={0}>{text}</span>);
  return nodes;
}

export default function DocsContent({ markdown }: DocsContentProps) {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    const trimmed = line.trim();

    // Empty line → spacing
    if (trimmed === "") {
      elements.push(<div key={`empty-${i}`} className="h-3" />);
      i++;
      continue;
    }

    // Code block fence (skip)
    if (trimmed.startsWith("```")) {
      // Skip until next ``` or end
      i++;
      while (i < lines.length && !lines[i]!.trim().startsWith("```")) {
        i++;
      }
      i++; // skip closing fence
      continue;
    }

    // # heading
    if (trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="font-clash text-2xl font-bold text-white mb-4 mt-2 pb-3 border-b border-white/[0.06]">
          {renderInline(trimmed.slice(2).trim())}
        </h1>
      );
      i++;
      continue;
    }

    // ## heading
    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="font-clash text-lg font-semibold text-white/90 mb-3 mt-8 pl-3 border-l-2 border-amber-500/40">
          {renderInline(trimmed.slice(3).trim())}
        </h2>
      );
      i++;
      continue;
    }

    // ### heading
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="font-clash text-base font-semibold text-white/80 mb-2 mt-5">
          {renderInline(trimmed.slice(4).trim())}
        </h3>
      );
      i++;
      continue;
    }

    // Table row detection — collect contiguous table lines
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableRows: string[] = [];
      while (i < lines.length && lines[i]!.trim().startsWith("|") && lines[i]!.trim().endsWith("|")) {
        tableRows.push(lines[i]!.trim());
        i++;
      }
      const tableEl = renderTable(tableRows, `table-${i}`);
      elements.push(<div key={`table-wrap-${i}`} className="my-4 overflow-x-auto">{tableEl}</div>);
      continue;
    }

    // Unordered list — collect contiguous list items
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const listItems: string[] = [];
      while (i < lines.length) {
        const li = lines[i]!.trim();
        if (li.startsWith("- ") || li.startsWith("* ")) {
          listItems.push(li.slice(2).trim());
          i++;
        } else if (li === "") {
          // empty line breaks list
          break;
        } else {
          break;
        }
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-none pl-4 my-3 space-y-1.5 text-[0.875rem] text-white/55">
          {listItems.map((item, idx) => (
            <li key={idx} className="relative pl-3 before:content-['·'] before:absolute before:left-0 before:text-amber-500/60 before:font-bold">{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list — collect contiguous numbered items
    if (/^\d+[.)]\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length) {
        const li = lines[i]!.trim();
        if (/^\d+[.)]\s/.test(li)) {
          listItems.push(li.replace(/^\d+[.)]\s/, ""));
          i++;
        } else if (li === "") {
          break;
        } else {
          break;
        }
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-none pl-4 my-3 space-y-1.5 text-[0.875rem] text-white/55 counter-reset-docs-list">
          {listItems.map((item, idx) => (
            <li key={idx} className="relative pl-6 before:content-[counter(docs-list)'.'] before:counter-increment-docs-list before:absolute before:left-0 before:text-blue-400/50 before:font-mono before:text-xs">{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length) {
        const ql = lines[i]!.trim();
        if (ql.startsWith("> ")) {
          quoteLines.push(ql.slice(2).trim());
          i++;
        } else if (ql.startsWith(">")) {
          quoteLines.push(ql.slice(1).trim());
          i++;
        } else {
          break;
        }
      }
      elements.push(
        <blockquote key={`quote-${i}`} className="border-l-2 border-amber-500/30 pl-4 my-4 py-2 text-[0.875rem] text-white/45 italic bg-amber-500/[0.02] rounded-r-lg">
          {quoteLines.map((ql, idx) => (
            <span key={idx}>
              {renderInline(ql)}
              {idx < quoteLines.length - 1 && <br />}
            </span>
          ))}
        </blockquote>
      );
      continue;
    }

    // Horizontal rule
    if (/^-{3,}$/.test(trimmed)) {
      elements.push(<hr key={`hr-${i}`} className="border-white/[0.06] my-6" />);
      i++;
      continue;
    }

    // Default: paragraph
    elements.push(
      <p key={`p-${i}`} className="text-[0.875rem] text-white/55 leading-[1.75] mb-4">
        {renderInline(trimmed)}
      </p>
    );
    i++;
  }

  return <div className="max-w-3xl">{elements}</div>;
}

/** Parse markdown table rows into a React <table>. */
function renderTable(rows: string[], key: string): React.ReactNode {
  if (rows.length === 0) return null;

  // Parse a table row into cells
  const parseRow = (row: string): string[] => {
    const inner = row.replace(/^\||\|$/g, "");
    return inner.split("|").map((s) => s.trim());
  };

  const headerCells = parseRow(rows[0]!);
  let bodyStart = 1;

  // Skip separator row (| --- | --- |)
  if (rows[1] && /^[\s:|:-]+$/.test(rows[1]!.replace(/^\||\|$/g, "").trim())) {
    bodyStart = 2;
  }

  const bodyRows = rows.slice(bodyStart);

  return (
    <table key={key} className="w-full text-[0.8125rem] border-collapse">
      {headerCells.length > 0 && (
        <thead>
          <tr>
            {headerCells.map((cell, ci) => (
              <th
                key={ci}
                className="border border-white/[0.06] bg-amber-500/[0.04] px-3 py-2.5 text-left font-semibold text-white/75 text-xs uppercase tracking-wider"
              >
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
      )}
      {bodyRows.length > 0 && (
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri} className="hover:bg-white/[0.02] transition-colors">
              {parseRow(row).map((cell, ci) => (
                <td
                  key={ci}
                  className="border border-white/[0.04] px-3 py-2 text-white/50"
                >
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
}
