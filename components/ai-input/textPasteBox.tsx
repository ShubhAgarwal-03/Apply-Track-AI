"use client";

interface TextPasteBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextPasteBox({ value, onChange }: TextPasteBoxProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Text Input</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste job description text here..."
        rows={6}
        className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
      />
    </div>
  );
}
