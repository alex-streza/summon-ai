import { cva, type VariantProps } from "cva";
import { ButtonHTMLAttributes } from "react";
import Spinner from "../loading/Spinner";

const button = cva("button", {
  variants: {
    intent: {
      primary: "bg-gray-800 border border-gray-700 text-gray-400",
      text: "font-medium w-fit !px-0 !py-1",
      secondary: "bg-gray-500",
    },
    size: {
      small: "px-3 py-1.5 text-xs",
      medium: "px-6 py-3 text-base",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed",
    },
    loading: {
      true: "cursor-not-allowed",
    },
  },
  compoundVariants: [
    {
      intent: "primary",
      size: "medium",
    },
    {
      loading: true,
      disabled: true,
      class: "opacity-100",
    },
  ],
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof button> {}

export const Button = ({
  children,
  className,
  intent = "primary",
  size,
  loading,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`flex h-fit w-fit items-center gap-2 rounded-md border-transparent font-semibold text-white outline-none transition-all duration-150 ${button(
        { intent, size, disabled, loading, class: className }
      )}`}
      disabled={disabled ?? false}
      {...props}
    >
      {!loading && children}
      {loading && <Spinner isSmall={size === "small"} />}
    </button>
  );
};
