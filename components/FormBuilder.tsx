'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Save } from 'lucide-react'

export type FieldType = 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio'

export interface FormField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[] // For select, radio
  validation?: (value: any) => string | null // Custom validation
  disabled?: boolean
  defaultValue?: any
  rows?: number // For textarea
  min?: number // For number
  max?: number // For number
  step?: number // For number
  className?: string
}

export interface FormBuilderProps {
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => void | Promise<void>
  onCancel?: () => void
  initialData?: Record<string, any>
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
  title?: string
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function FormBuilder({
  fields,
  onSubmit,
  onCancel,
  initialData = {},
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  title,
  columns = 2,
  className = '',
}: FormBuilderProps) {
  const [formData, setFormData] = useState<Record<string, any>>(
    fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: initialData[field.name] ?? field.defaultValue ?? '',
    }), {})
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    fields.forEach(field => {
      const value = formData[field.name]

      // Required validation
      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field.name] = 'This field is required'
        return
      }

      // Custom validation
      if (field.validation && value) {
        const error = field.validation(value)
        if (error) {
          newErrors[field.name] = error
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      await onSubmit(formData)
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.name]
    const error = errors[field.name]

    switch (field.type) {
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(val) => handleChange(field.name, val)}
            disabled={field.disabled}
          >
            <SelectTrigger className={error ? 'border-red-400 bg-red-50' : ''}>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            rows={field.rows || 3}
            className={error ? 'border-red-400 bg-red-50' : ''}
          />
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={value}
              onCheckedChange={(checked) => handleChange(field.name, checked)}
              disabled={field.disabled}
            />
            <Label
              htmlFor={field.name}
              className="text-sm font-normal cursor-pointer"
            >
              {field.label}
            </Label>
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.name}-${opt.value}`}
                  name={field.name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={field.disabled}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <Label
                  htmlFor={`${field.name}-${opt.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        )

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            min={field.min}
            max={field.max}
            step={field.step}
            className={error ? 'border-red-400 bg-red-50' : ''}
          />
        )

      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={error ? 'border-red-400 bg-red-50' : ''}
          />
        )
    }
  }

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <div className={`bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      {(title || onCancel) && (
        <div className="flex items-center justify-between px-4 py-3 bg-blue-600 border-b border-blue-700">
          {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-blue-200 hover:text-white transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className={`grid ${gridColsClass} gap-4`}>
          {fields.map(field => (
            <div
              key={field.name}
              className={field.type === 'checkbox' ? '' : field.className || ''}
            >
              {field.type !== 'checkbox' && (
                <Label className="block mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              )}
              {renderField(field)}
              {errors[field.name] && (
                <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="min-w-[100px]"
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[100px] bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {submitLabel}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
