import { FileText } from "lucide-react";
import { serializeUnknownValue } from "../../../utils/unknownValue";

interface UnknownDataListProps {
  items: unknown[] | null | undefined;
  emptyMessage: string;
  itemLabel: string;
}

export function UnknownDataList({
  items,
  emptyMessage,
  itemLabel,
}: UnknownDataListProps) {
  const values = Array.isArray(items) ? items : [];

  if (values.length === 0) {
    return (
      <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-3 py-3 text-xs leading-5 text-slate-500">
        <FileText aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span>{emptyMessage}</span>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {values.map((item, index) => {
        const serialized = serializeUnknownValue(item);
        const isStructured = typeof item === "object" && item !== null;

        return (
          <li
            key={index}
            className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"
          >
            <p className="mb-1.5 text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
              {itemLabel} {index + 1}
            </p>
            {isStructured ? (
              <pre className="scrollbar-thin max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-5 text-slate-600">
                {serialized}
              </pre>
            ) : (
              <p className="text-sm leading-6 break-words text-slate-700">
                {serialized}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
