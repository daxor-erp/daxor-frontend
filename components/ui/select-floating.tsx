import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export type SelectFloatingProps = {
  name?: string;
  value?: string;
  error?: string;
  label?: string;
  loading?: boolean;
  hasMore?: boolean;
  className?: string;
  disabled?: boolean;
  searchValue?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  containerClassName?: string;
  hideDisabledInDropdown?: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;

  onScroll?: () => void;
  onSearch?: (query: string) => void;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectFloating = React.forwardRef<HTMLDivElement, SelectFloatingProps>(
  ({
    label,
    name,
    error,
    style,
    value,
    options,
    loading,
    onChange,
    disabled,
    className,
    onSearch,
    onScroll,
    searchValue,
    hasMore = false,
    containerClassName,
    placeholder = "Select an option",
    hideDisabledInDropdown = false,
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value || "");
    const [internalSearchQuery, setInternalSearchQuery] = React.useState("");
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);
    const [dropdownPosition, setDropdownPosition] = React.useState({
      top: 0,
      left: 0,
      width: 0,
      placement: 'bottom'
    });

    const triggerRef = React.useRef<HTMLDivElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const searchQuery = onSearch ? (searchValue || "") : internalSearchQuery;

    const filteredOptions = onSearch
      ? options
      : options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const selectedOption = options.find(opt => opt.value === selectedValue);

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    React.useEffect(() => {
      if (value && options.length > 0) {
        const optionExists = options.find(opt => opt.value === value);
        if (optionExists) {
          setSelectedValue(value);
        }
      }
    }, [value, options]);

    React.useEffect(() => {
      if (onSearch && searchValue === "") {
        setInternalSearchQuery("");
      }
    }, [onSearch, searchValue]);

    React.useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setHighlightedIndex(prev => 
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
            break;
          case 'ArrowUp':
            e.preventDefault();
            setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
            break;
          case 'Enter':
            e.preventDefault();
            if (filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex].disabled) {
              handleSelect(filteredOptions[highlightedIndex].value);
            } else if (onSearch && searchQuery && filteredOptions.length === 0) {
              handleSelect(searchQuery);
            }
            break;
          case 'Escape':
            e.preventDefault();
            setIsOpen(false);
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, highlightedIndex, filteredOptions, searchQuery]);

    React.useEffect(() => {
      setHighlightedIndex(0);
    }, [searchQuery]);

    React.useEffect(() => {
      if (isOpen && scrollContainerRef.current) {
        const highlightedElement = scrollContainerRef.current.children[highlightedIndex] as HTMLElement;
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }, [highlightedIndex, isOpen]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    React.useEffect(() => {
      if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const dropdownHeight = 320;
        const windowHeight = window.innerHeight;
        const spaceBelow = windowHeight - rect.bottom;

        const placement = spaceBelow < dropdownHeight ? 'top' : 'bottom';

        setDropdownPosition({
          top: placement === 'top'
            ? rect.top + window.scrollY - dropdownHeight
            : rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          placement
        });
      }
    }, [isOpen]);

    const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
      if (!onScroll || !hasMore || loading) {
        return;
      }

      const threshold = 10;
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + threshold;

      if (isNearBottom) {
        onScroll();
      }
    }, [onScroll, hasMore, loading]);

    const updateDropdownPosition = React.useCallback(() => {
      if (isOpen && dropdownRef.current && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const spaceBelow = windowHeight - rect.bottom;

        const placement = spaceBelow < dropdownHeight ? 'top' : 'bottom';

        setDropdownPosition({
          top: placement === 'top'
            ? rect.top + window.scrollY - dropdownHeight
            : rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          placement
        });
      }
    }, [isOpen]);

    React.useEffect(() => {
      if (isOpen && dropdownRef.current) {
        const timeoutId = setTimeout(updateDropdownPosition, 0);
        return () => clearTimeout(timeoutId);
      }
    }, [isOpen, updateDropdownPosition]);

    React.useEffect(() => {
      const handlePositionUpdate = () => {
        if (isOpen && triggerRef.current && dropdownRef.current) {
          requestAnimationFrame(updateDropdownPosition);
        }
      };

      window.addEventListener('scroll', handlePositionUpdate, true);
      window.addEventListener('resize', handlePositionUpdate);
      return () => {
        window.removeEventListener('scroll', handlePositionUpdate, true);
        window.removeEventListener('resize', handlePositionUpdate);
      };
    }, [isOpen, updateDropdownPosition]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;

      if (onSearch) {
        onSearch(query);
      } else {
        setInternalSearchQuery(query);
      }
    };

    const handleSelect = (value: string) => {
      setSelectedValue(value);
      if (onChange) {
        const event = {
          target: {
            value,
            name: name || '',
          }
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
      setIsOpen(false);
    };

    return (
      <div className={cn("relative", containerClassName)} ref={ref}>
        {label && (
          <label
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none z-10",
              (isOpen || selectedValue || placeholder) ? "-top-2 text-[10px] px-1 py-px" : "top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground",
              error ? "text-destructive" : "text-primary"
            )}
            style={(isOpen || selectedValue || placeholder) ? { backgroundColor: 'hsl(var(--card))' } : undefined}
          >
            {label}
          </label>
        )}
        <div className="relative" ref={triggerRef}>
          <div
            style={style}
            className={cn(
              "flex items-center h-10 w-full rounded-lg border border-border bg-card pl-3 pr-8 text-xs ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-destructive" : "",
              className
            )}
            onClick={(e) => {
              if (!disabled) {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(prev => !prev);
              }
            }}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              )}
            </div>
          </div>

          {isOpen && createPortal(
            <div
              ref={dropdownRef}
              className="fixed z-[9999] rounded-lg shadow-lg border border-border overflow-hidden flex flex-col"
              style={{
                backgroundColor: 'hsl(var(--card))',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight: '300px'
              }}
            >
              <div className="p-2 border-b border-border flex-shrink-0">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
                  style={{ backgroundColor: 'hsl(var(--card))' }}
                  placeholder="Search or type custom..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
              <div
                ref={scrollContainerRef}
                className="py-1 overflow-auto flex-1"
                onScroll={handleScroll}
              >
                {(hideDisabledInDropdown ? filteredOptions.filter(opt => !opt.disabled || opt.value === '') : filteredOptions).length === 0 && !loading ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    {searchQuery && onSearch ? (
                      <div 
                        className="cursor-pointer hover:bg-secondary -mx-4 px-4 py-2"
                        onClick={() => handleSelect(searchQuery)}
                      >
                        Create: "{searchQuery}"
                      </div>
                    ) : (
                      'No options found'
                    )}
                  </div>
                ) : (
                  <>
                    {(hideDisabledInDropdown ? filteredOptions.filter(opt => !opt.disabled || opt.value === '') : filteredOptions).map((option, index) => (
                      <div
                        key={option.value}
                        className={cn(
                          "px-4 py-2 text-sm cursor-pointer",
                          index === highlightedIndex ? "bg-secondary" : "hover:bg-secondary",
                          option.value === selectedValue ? "bg-primary/10 text-primary" : "",
                          option.disabled ? "opacity-50 cursor-not-allowed" : ""
                        )}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {option.label}
                      </div>
                    ))}
                    {loading && hasMore && (
                      <div className="px-4 py-2 text-sm text-muted-foreground flex items-center justify-center">
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading more...
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>,
            document.body
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-destructive" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

SelectFloating.displayName = "SelectFloating";

export default SelectFloating;
