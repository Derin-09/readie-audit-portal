import { cn } from "../../utils/cn";

interface RoomIdentifierProps {
  value: string;
  className?: string;
  wrap?: boolean;
}

export function RoomIdentifier({
  value,
  className,
  wrap = false,
}: RoomIdentifierProps) {
  return (
    <span
      title={value}
      className={cn(
        "block font-mono text-[11px] md:text-base tracking-tight text-slate-500",
        wrap ? "break-all" : "truncate",
        className,
      )}
    >
      {value}
    </span>
  );
}
