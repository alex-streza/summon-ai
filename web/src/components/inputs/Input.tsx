import * as Label from "@radix-ui/react-label";
import { forwardRef, HTMLProps, ReactNode } from "react";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  error?: string;
  icon?: ReactNode;
  iconLeft?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, error, className = "", iconLeft, icon, id, ...rest } = props;

  return (
    <div className="relative flex flex-col">
      {label && (
        <Label.Root htmlFor={id} className="mb-2 text-gray-500">
          {label}
        </Label.Root>
      )}
      <input
        ref={ref}
        id={id}
        {...rest}
        className={`rounded-md border border-gray-700 bg-gray-800 transition-all duration-150 ${
          icon ? "pr-11" : ""
        } peer p-3 text-white outline-none placeholder:text-gray-600 ${className}`}
      />
      {icon && (
        <span
          className={`absolute bottom-3 h-6 w-6 text-gray-600 ${
            iconLeft ? "left-5" : "right-5"
          }`}
        >
          {icon}
        </span>
      )}
    </div>
  );
});

export default Input;
