import { h } from "preact";

export type TooltipProps = {
  children: any;
  message: string;
  className?: string;
};

export const Tooltip = ({
  children,
  message,
  className = "",
}: TooltipProps) => {
  return (
    <div className="relative flex group">
      {children}
      <span className={`tooltip ${className}`}>{message}</span>
    </div>
  );
};
