import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  isSelect?: boolean;
  options?: { label: string; value: string; disabled?: boolean }[];
}

export function FormField({
  label,
  icon,
  rightElement,
  isSelect,
  options,
  className = "",
  ...props
}: FormFieldProps) {
  const inputClassName = `w-full ${icon ? "pl-10" : "px-4"} ${
    rightElement ? "pr-10" : "pr-4"
  } py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none ${
    isSelect ? "appearance-none font-medium" : ""
  } ${className}`;

  return (
    <div>
      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
            {icon}
          </div>
        )}
        
        {isSelect ? (
          <select className={inputClassName} {...(props as any)}>
            {options?.map((opt, i) => (
              <option key={i} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input className={inputClassName} {...(props as any)} />
        )}

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
