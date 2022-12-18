import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";

export interface BackButtonProps {
  label: string;
  href: string;
  className?: string;
}

export const BackButton = ({
  label,
  href,
  className = "",
}: BackButtonProps) => {
  return (
    <Link
      href={href}
      className={`${className} flex w-fit flex-col items-end text-white`}
    >
      <svg
        width="142"
        height="8"
        viewBox="0 0 142 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.78756 3.64645C0.592298 3.84171 0.592298 4.15829 0.78756 4.35355L3.96954 7.53553C4.1648 7.7308 4.48138 7.7308 4.67665 7.53553C4.87191 7.34027 4.87191 7.02369 4.67665 6.82843L1.84822 4L4.67665 1.17157C4.87191 0.976311 4.87191 0.659728 4.67665 0.464466C4.48138 0.269204 4.1648 0.269204 3.96954 0.464466L0.78756 3.64645ZM1.14111 4.5H141.141V3.5H1.14111V4.5Z"
          fill="#FBFBFB"
        />
      </svg>
      <span>{label}</span>
    </Link>
  );
};
