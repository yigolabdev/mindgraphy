'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Check, ChevronDown, Search } from 'lucide-react'

interface AutocompleteOption {
  value: string
  label: string
  description?: string
}

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  options: AutocompleteOption[]
  placeholder?: string
  label?: string
  required?: boolean
  optional?: boolean
  className?: string
  allowCustomValue?: boolean
  maxSuggestions?: number
}

/**
 * 자동완성 Input 컴포넌트
 * 
 * 예식장, 작가 등의 이름을 입력할 때 자동완성 제안
 * 
 * 사용 예시:
 * ```tsx
 * const venues = [
 *   { value: 'venue1', label: '그랜드워커힐', description: '서울 광진구' },
 *   { value: 'venue2', label: '신라호텔', description: '서울 중구' }
 * ]
 * 
 * <AutocompleteInput
 *   label="예식장"
 *   value={venue}
 *   onChange={setVenue}
 *   options={venues}
 *   allowCustomValue
 * />
 * ```
 */
export function AutocompleteInput({
  value,
  onChange,
  options,
  placeholder,
  label,
  required,
  optional,
  className,
  allowCustomValue = true,
  maxSuggestions = 5
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // 입력값으로 필터링된 옵션들
  const filteredOptions = options
    .filter(option => 
      option.label.toLowerCase().includes(value.toLowerCase()) ||
      option.description?.toLowerCase().includes(value.toLowerCase())
    )
    .slice(0, maxSuggestions)

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true)
      return
    }

    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => prev > 0 ? prev - 1 : 0)
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex].label)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setFocusedIndex(-1)
        break
    }
  }

  const handleSelect = (selectedLabel: string) => {
    onChange(selectedLabel)
    setIsOpen(false)
    setFocusedIndex(-1)
    inputRef.current?.blur()
  }

  const handleInputChange = (newValue: string) => {
    onChange(newValue)
    setIsOpen(true)
    setFocusedIndex(-1)
  }

  const handleFocus = () => {
    if (filteredOptions.length > 0) {
      setIsOpen(true)
    }
  }

  return (
    <div className="relative space-y-2">
      {label && (
        <label className="block text-sm font-medium text-zinc-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {optional && !required && (
            <span className="text-zinc-400 font-normal ml-1">(선택)</span>
          )}
        </label>
      )}

      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn("pr-10", className)}
          autoComplete="off"
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && filteredOptions.length > 0 && (
            <Search className="h-4 w-4 text-zinc-400" />
          )}
          <ChevronDown 
            className={cn(
              "h-4 w-4 text-zinc-400 transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </div>
      </div>

      {/* Dropdown List */}
      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2"
        >
          {filteredOptions.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.label)}
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors first:rounded-t-lg last:rounded-b-lg",
                index === focusedIndex && "bg-zinc-100",
                value === option.label && "bg-blue-50"
              )}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-medium text-sm text-zinc-900">
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {option.description}
                    </div>
                  )}
                </div>
                {value === option.label && (
                  <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && filteredOptions.length === 0 && value && !allowCustomValue && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg p-4 text-center text-sm text-zinc-500">
          검색 결과가 없습니다
        </div>
      )}

      {/* Custom value allowed message */}
      {isOpen && filteredOptions.length === 0 && value && allowCustomValue && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg p-4 text-center text-sm text-zinc-600">
          <div className="font-medium">"{value}"</div>
          <div className="text-xs text-zinc-500 mt-1">직접 입력하여 사용합니다</div>
        </div>
      )}
    </div>
  )
}

/**
 * Multi-select Autocomplete (여러 개 선택)
 */
interface MultiAutocompleteInputProps extends Omit<AutocompleteInputProps, 'value' | 'onChange'> {
  values: string[]
  onChange: (values: string[]) => void
}

export function MultiAutocompleteInput({
  values,
  onChange,
  ...props
}: MultiAutocompleteInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSelect = (value: string) => {
    if (!values.includes(value)) {
      onChange([...values, value])
    }
    setInputValue('')
  }

  const handleRemove = (valueToRemove: string) => {
    onChange(values.filter(v => v !== valueToRemove))
  }

  return (
    <div className="space-y-2">
      {props.label && (
        <label className="block text-sm font-medium text-zinc-700">
          {props.label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Selected Items */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
          {values.map(value => (
            <div
              key={value}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-zinc-300 rounded-md text-sm"
            >
              <span>{value}</span>
              <button
                type="button"
                onClick={() => handleRemove(value)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <AutocompleteInput
        {...props}
        value={inputValue}
        onChange={setInputValue}
        options={props.options.filter(opt => !values.includes(opt.label))}
        label=""
      />
    </div>
  )
}
