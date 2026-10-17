"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Eye,
  Heading2,
  Italic,
  Link2,
  List,
  PencilLine,
  Quote,
} from "lucide-react";
import ArticleContent from "@/components/blog/article-content";
import { cn } from "@/lib/utils";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const editorTools = [
  {
    label: "تیتر",
    icon: Heading2,
    before: "## ",
    after: "",
    placeholder: "عنوان بخش",
  },
  { label: "ضخیم", icon: Bold, before: "**", after: "**", placeholder: "متن" },
  { label: "مورب", icon: Italic, before: "_", after: "_", placeholder: "متن" },
  {
    label: "فهرست",
    icon: List,
    before: "- ",
    after: "",
    placeholder: "مورد فهرست",
  },
  {
    label: "نقل‌قول",
    icon: Quote,
    before: "> ",
    after: "",
    placeholder: "نقل‌قول",
  },
  {
    label: "پیوند",
    icon: Link2,
    before: "[",
    after: "](https://)",
    placeholder: "عنوان پیوند",
  },
] as const;

export function MarkdownEditor({
  value,
  onChange,
  disabled,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  const insert = (before: string, after = "", placeholder = "متن") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const next =
      value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      );
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#173f37]/15 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-[#faf9f6] p-2">
        <div className="flex flex-wrap gap-1">
          {editorTools.map(
            ({ label, icon: Icon, before, after, placeholder }) => (
              <button
                key={label}
                type="button"
                onClick={() => insert(before, after, placeholder)}
                disabled={disabled || preview}
                title={label}
                className="grid size-9 place-items-center rounded-lg hover:bg-[#173f37]/8 disabled:opacity-35"
              >
                <Icon className="size-4" />
              </button>
            ),
          )}
        </div>
        <div className="flex rounded-lg border bg-white p-1 text-xs">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={cn(
              "flex items-center gap-1 rounded-md px-3 py-1.5",
              !preview && "bg-[#173f37] text-white",
            )}
          >
            <PencilLine className="size-3.5" /> نوشتن
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={cn(
              "flex items-center gap-1 rounded-md px-3 py-1.5",
              preview && "bg-[#173f37] text-white",
            )}
          >
            <Eye className="size-3.5" /> پیش‌نمایش
          </button>
        </div>
      </div>
      {preview ? (
        <div className="max-h-[34rem] min-h-80 overflow-y-auto p-6">
          {value.trim() ? (
            <ArticleContent content={value} />
          ) : (
            <p className="text-sm text-[#173f37]/45">
              هنوز متنی نوشته نشده است.
            </p>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          maxLength={100000}
          rows={18}
          placeholder="متن مقاله را بنویسید. برای تیتر، فهرست، لینک و تأکید از نوار ابزار استفاده کنید…"
          className="min-h-80 w-full resize-y bg-white p-5 font-sans leading-8 outline-none disabled:opacity-50"
        />
      )}
    </div>
  );
}
