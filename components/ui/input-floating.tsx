import React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
  multiline?: boolean;
  rows?: number;
  icon?: React.ReactNode;
  containerClassName?: string;
}

const FLOATING_LABEL_TYPES = ['date', 'datetime-local', 'time', 'month', 'week', 'tel', 'number', 'url'];

export const InputFloating = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, InputProps>(
  ({ className, error, icon, label, containerClassName, type = 'text', multiline = false, rows, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value);

    React.useEffect(() => {
      setHasValue(!!props.value);
    }, [props.value]);

    const shouldFloatByDefault = FLOATING_LABEL_TYPES.includes(type);
    const showFloatingLabel = isFocused || hasValue || shouldFloatByDefault;

    /**
     * When an icon is present alongside a label, the label acts as a
     * static inline placeholder (sits next to the icon, fades on focus/value).
     * This matches how search inputs look — icon left, text right.
     * No floating behaviour when icon is present: avoids the label
     * riding up over the border and misaligning with the icon.
     */
    const iconWithLabel = !!icon && !!label;

    return (
      <div className={cn("relative", containerClassName)}>

        {/* Standard floating label (no icon, or icon-only with no label) */}
        {label && !iconWithLabel && (
          <label
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none z-10",
              showFloatingLabel
                ? "-top-2 text-[10px] px-1 py-px text-primary"
                : "top-2.5 text-xs text-muted-foreground"
            )}
            style={showFloatingLabel ? { backgroundColor: 'hsl(var(--card))' } : undefined}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}

        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}

        {/* Static placeholder-style label next to icon */}
        {iconWithLabel && !isFocused && !hasValue && (
          <span
            className="absolute left-10 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none select-none"
          >
            {label}
          </span>
        )}

        {multiline ? (
          <textarea
            className={cn(
              "h-10 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs leading-6 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-y-auto",
              icon ? "pl-10" : "",
              error ? "border-destructive" : "",
              className
            )}
            rows={rows}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e as unknown as React.FocusEvent<HTMLInputElement>);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e as unknown as React.FocusEvent<HTMLInputElement>);
            }}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={cn(
              "h-10 w-full rounded-lg border border-border bg-card px-3 text-xs leading-10 ring-offset-white file:border-0 file:bg-transparent file:text-xs file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
              icon ? "pl-10" : "",
              error ? "border-destructive" : "",
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            type={type}
            placeholder=""
            ref={ref as React.Ref<HTMLInputElement>}
            {...props}
          />
        )}
        {error && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

InputFloating.displayName = "InputFloating";

export default InputFloating;
