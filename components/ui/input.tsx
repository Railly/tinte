import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  startAddon?: React.ReactNode;
  endAddon?: React.ReactNode;
  startInline?: React.ReactNode;
  endInline?: React.ReactNode;
}

function Input({
  className,
  type,
  size: _size, // Destructure and ignore HTML size attribute
  startAddon,
  endAddon,
  startInline,
  endInline,
  ...props
}: InputProps) {
  // If no add-ons, return simple input
  if (!startAddon && !endAddon && !startInline && !endInline) {
    return (
      <input
        type={type}
        className={cn(
          // base
          "flex h-9 w-full min-w-0 rounded-xl border border-border-base bg-ui-base px-3 py-1 text-sm shadow-xs outline-none",
          "transition-[color,box-shadow] duration-200 ease-out",
          // text and placeholder
          "text-text-base placeholder:text-text-soft/70",
          // file input styles
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-base",
          // focus
          "focus-visible:border-primary-base focus-visible:ring-primary-base/50 focus-visible:ring-[3px]",
          // disabled
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-ui-subtle",
          // error states
          "aria-invalid:border-error-base aria-invalid:ring-error-base/20",
          "dark:aria-invalid:ring-error-base/40",
          className,
        )}
        {...props}
      />
    );
  }

  // Calculate input padding based on inline add-ons
  const inputPadding = cn(
    startInline && "ps-8",
    endInline && "pe-8",
    !startInline && !endInline && "px-3"
  );

  // Calculate input border radius based on external add-ons
  const inputRadius = cn(
    startAddon && "rounded-s-none",
    endAddon && "rounded-e-none",
    !startAddon && !endAddon && "rounded-xl",
    startAddon && !endAddon && "rounded-e-xl",
    !startAddon && endAddon && "rounded-s-xl"
  );

  return (
    <div className="flex rounded-xl shadow-xs">
      {/* Start Add-on */}
      {startAddon && (
        <span className="inline-flex items-center rounded-s-xl border border-border-base border-r-0 bg-ui-subtle px-3 text-sm text-text-soft">
          {startAddon}
        </span>
      )}

      {/* Input Container with Inline Add-ons */}
      <div className="relative flex-1">
        {/* Start Inline Add-on */}
        {startInline && (
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-text-soft z-30">
            {startInline}
          </span>
        )}

        {/* Input Element */}
        <input
          type={type}
          className={cn(
            // base
            "flex h-9 w-full min-w-0 border border-border-base bg-ui-base py-1 text-sm shadow-none outline-none relative",
            "transition-[color,box-shadow] duration-200 ease-out",
            // text and placeholder
            "text-text-base placeholder:text-text-soft/70",
            // file input styles
            "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-base",
            // focus
            "focus-visible:border-primary-base focus-visible:ring-primary-base/50 focus-visible:ring-[3px] focus-visible:z-20",
            // disabled
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-ui-subtle",
            // error states
            "aria-invalid:border-error-base aria-invalid:ring-error-base/20",
            "dark:aria-invalid:ring-error-base/40",
            // dynamic padding and radius
            inputPadding,
            inputRadius,
            className,
          )}
          {...props}
        />

        {/* End Inline Add-on */}
        {endInline && (
          <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-text-soft z-10">
            {endInline}
          </span>
        )}
      </div>

      {/* End Add-on */}
      {endAddon && (
        <span className="inline-flex items-center rounded-e-xl border border-border-base border-l-0 bg-ui-subtle px-3 text-sm text-text-soft">
          {endAddon}
        </span>
      )}
    </div>
  );
}

export { Input };
export type { InputProps };
