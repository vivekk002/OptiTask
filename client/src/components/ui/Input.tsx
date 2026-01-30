import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-slate-700 dark:text-emerald-100/70 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          placeholder={props.placeholder || label}
          className={cn(
            "input-field",
            error && "border-rose-500 focus:ring-rose-500",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
      </div>
    );
  },
);
