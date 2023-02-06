import * as Label from "@radix-ui/react-label";
import { forwardRef, HTMLProps, ReactNode } from "react";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  error?: string;
  icon?: ReactNode;
  containerClassName?: string;
  iconLeft?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, error, className = "", iconLeft, icon, id, ...rest } = props;

  return (
    <div className={`relative flex flex-col ${props.containerClassName ?? ""}`}>
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
        <div
          className={`absolute bottom-0 right-0 grid h-12 w-12 place-content-center rounded-r-md ${
            iconLeft ? "left-0 pl-5" : "right-0 pr-5"
          }`}
        >
          <div className="absolute h-11 w-4 -translate-x-3.5 bg-gray-800 bg-opacity-50 backdrop-blur-[1px]" />
          <span className="grid w-6 h-6 text-gray-600 bg-gray-700 border-gray-600 rounded-md place-content-center">
            {icon}
          </span>
        </div>
      )}
    </div>
  );
});

export default Input;
