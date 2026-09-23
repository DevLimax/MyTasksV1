import { forwardRef, useState, type InputHTMLAttributes } from 'react'

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, id, value, onChange, onFocus, onBlur, className = '', ...props }, ref) => {
    const [focused, setFocused] = useState(false)
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    const isFloating = focused || (typeof value === 'string' ? value.length > 0 : !!value)

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className={[
            'text-sm font-medium transition-colors duration-200',
            isFloating ? 'text-blue-300' : 'text-white/40',
          ].join(' ')}
        >
          {label}
        </label>

        <input
          ref={ref}
          id={inputId}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          placeholder=""
          className={[
            'w-full rounded-lg border bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none backdrop-blur-sm transition-all',
            error
              ? 'border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
              : 'border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />

        {error && <p className="text-xs text-red-300">{error}</p>}
      </div>
    )
  },
)

GlassInput.displayName = 'GlassInput'

export default GlassInput
