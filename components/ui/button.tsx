import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline-solid";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, variant = "default", size = "md", className, ...props }, ref) => {
    const classes = [
      "btn",
      variant === "outline-solid" ? "btn-outline-solid" : "btn-default",
      size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "btn-md",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (asChild) {
      return (
        <span className={classes} ref={ref as any} {...props} />
      );
    }
    return (
      <button className={classes} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button"; 