import React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export type SelectFloatingProps = {
  name?: string
  value?: string
  error?: string
  label?: string
  loading?: boolean
  hasMore?: boolean
  className?: string
  disabled?: boolean
  searchValue?: string
  placeholder?: string
  style?: React.CSSProperties
  containerClassName?: string
  hideDisabledInDropdown?: boolean
  options: Array<{ value: string; label: string; disabled?: boolean }>
  onScroll?: () => void
  onSearch?: (query: string) => void
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void
}

export const SelectFloating = React.forwardRef<HTMLDivElement, SelectFloatingProps>(
  (
    {
      label,
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
      placeholder = 'Select an option',
      hideDisabledInDropdown = false,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedValue, setSelectedValue] = React.useState(value || '')
    const [internalSearchQuery, setInternalSearchQuery] = React.useState('')
    const [highlightedIndex, setHighlightedIndex] = React.useState(0)
    const [dropdownPosition, setDropdownPosition] = React.useState({
      top: 0,
      left: 0,
      width: 0,
    })

    const triggerRef = React.useRef<HTMLDivElement>(null)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)
    const searchInputRef = React.useRef<HTMLInputElement>(null)

    const searchQuery = onSearch ? searchValue || '' : internalSearchQuery

    const filteredOptions = onSearch
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()),
        )

    const visibleOptions = hideDisabledInDropdown
      ? filteredOptions.filter((opt) => !opt.disabled || opt.value === '')
      : filteredOptions

    const selectedOption = options.find((opt) => opt.value === selectedValue)

    React.useEffect(() => {
      if (value !== undefined) setSelectedValue(value)
    }, [value])

    const emitChange = React.useCallback(
      (nextValue: string) => {
        setSelectedValue(nextValue)
        onChange?.(nextValue)
        setIsOpen(false)
        setInternalSearchQuery('')
      },
      [onChange],
    )

    React.useEffect(() => {
      if (!isOpen) return

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev < visibleOptions.length - 1 ? prev + 1 : prev,
          )
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        } else if (e.key === 'Enter') {
          e.preventDefault()
          const opt = visibleOptions[highlightedIndex]
          if (opt && !opt.disabled) emitChange(opt.value)
          else if (onSearch && searchQuery && visibleOptions.length === 0) {
            emitChange(searchQuery)
          }
        } else if (e.key === 'Escape') {
          e.preventDefault()
          setIsOpen(false)
        }
      }

      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }, [isOpen, highlightedIndex, visibleOptions, searchQuery, onSearch, emitChange])

    React.useEffect(() => {
      setHighlightedIndex(0)
    }, [searchQuery])

    React.useEffect(() => {
      if (!isOpen || !scrollContainerRef.current) return
      const el = scrollContainerRef.current.children[highlightedIndex] as
        | HTMLElement
        | undefined
      el?.scrollIntoView({ block: 'nearest' })
    }, [highlightedIndex, isOpen])

    React.useEffect(() => {
      const onDocMouseDown = (event: MouseEvent) => {
        const target = event.target as Node
        if (
          dropdownRef.current?.contains(target) ||
          triggerRef.current?.contains(target)
        ) {
          return
        }
        setIsOpen(false)
      }
      document.addEventListener('mousedown', onDocMouseDown)
      return () => document.removeEventListener('mousedown', onDocMouseDown)
    }, [])

    const updateDropdownPosition = React.useCallback(() => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      const dropdownHeight = dropdownRef.current?.offsetHeight || 320
      const placeTop = window.innerHeight - rect.bottom < dropdownHeight
      // fixed = viewport coords; never add scrollY
      setDropdownPosition({
        top: placeTop ? rect.top - dropdownHeight : rect.bottom,
        left: rect.left,
        width: rect.width,
      })
    }, [])

    React.useEffect(() => {
      if (!isOpen) return
      updateDropdownPosition()
      const t = window.setTimeout(updateDropdownPosition, 0)
      const onMove = () => requestAnimationFrame(updateDropdownPosition)
      window.addEventListener('scroll', onMove, true)
      window.addEventListener('resize', onMove)
      return () => {
        window.clearTimeout(t)
        window.removeEventListener('scroll', onMove, true)
        window.removeEventListener('resize', onMove)
      }
    }, [isOpen, updateDropdownPosition])

    const onListScroll = React.useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        if (!onScroll || !hasMore || loading) return
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
        if (scrollHeight - scrollTop <= clientHeight + 10) onScroll()
      },
      [onScroll, hasMore, loading],
    )

    return (
      <div className={cn('relative', containerClassName)} ref={ref}>
        {label ? (
          <label
            className={cn(
              'absolute left-3 transition-all duration-200 pointer-events-none z-10',
              isOpen || selectedValue || placeholder
                ? '-top-2 text-[10px] px-1 py-px'
                : 'top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground',
              error ? 'text-destructive' : 'text-primary',
            )}
            style={
              isOpen || selectedValue || placeholder
                ? { backgroundColor: 'hsl(var(--card))' }
                : undefined
            }
          >
            {label}
          </label>
        ) : null}

        <div className="relative" ref={triggerRef}>
          <div
            style={style}
            className={cn(
              'flex items-center h-10 w-full rounded-lg border border-border bg-card pl-3 pr-8 text-xs',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              error ? 'border-destructive' : '',
              className,
            )}
            onClick={(e) => {
              if (disabled) return
              e.preventDefault()
              e.stopPropagation()
              setIsOpen((prev) => !prev)
            }}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              {loading ? '…' : '▾'}
            </div>
          </div>

          {isOpen
            ? createPortal(
                <div
                  ref={dropdownRef}
                  data-select-floating-dropdown="true"
                  className="fixed z-[9999] rounded-lg shadow-lg border border-border overflow-hidden flex flex-col pointer-events-auto"
                  style={{
                    backgroundColor: 'hsl(var(--card))',
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                    width: dropdownPosition.width,
                    maxHeight: 300,
                    pointerEvents: 'auto',
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <div className="p-2 border-b border-border flex-shrink-0">
                    <input
                      ref={searchInputRef}
                      type="text"
                      className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
                      style={{ backgroundColor: 'hsl(var(--card))' }}
                      placeholder="Search or type custom..."
                      value={searchQuery}
                      onChange={(e) => {
                        if (onSearch) onSearch(e.target.value)
                        else setInternalSearchQuery(e.target.value)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </div>
                  <div
                    ref={scrollContainerRef}
                    className="py-1 overflow-auto flex-1"
                    onScroll={onListScroll}
                  >
                    {visibleOptions.length === 0 && !loading ? (
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        {searchQuery && onSearch ? (
                          <div
                            className="cursor-pointer hover:bg-secondary -mx-4 px-4 py-2"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              emitChange(searchQuery)
                            }}
                          >
                            Create: &quot;{searchQuery}&quot;
                          </div>
                        ) : (
                          'No options found'
                        )}
                      </div>
                    ) : (
                      <>
                        {visibleOptions.map((option, index) => (
                          <div
                            key={`${option.value}-${index}`}
                            className={cn(
                              'px-4 py-2 text-sm cursor-pointer',
                              index === highlightedIndex
                                ? 'bg-secondary'
                                : 'hover:bg-secondary',
                              option.value === selectedValue
                                ? 'bg-primary/10 text-primary'
                                : '',
                              option.disabled
                                ? 'opacity-50 cursor-not-allowed'
                                : '',
                            )}
                            onMouseDown={(e) => {
                              if (option.disabled) return
                              e.preventDefault()
                              e.stopPropagation()
                              emitChange(option.value)
                            }}
                            onMouseEnter={() => setHighlightedIndex(index)}
                          >
                            {option.label}
                          </div>
                        ))}
                        {loading && hasMore ? (
                          <div className="px-4 py-2 text-sm text-muted-foreground text-center">
                            Loading more...
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>,
                document.body,
              )
            : null}
        </div>

        {error ? (
          <p className="mt-1 text-xs text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

SelectFloating.displayName = 'SelectFloating'

export default SelectFloating
