import { Button } from "@/components/ui/button"

interface ProductFormActionsProps {
  isSubmitting?: boolean
  onCancel?: () => void
  className?: string
}

export function ProductFormActions({ isSubmitting, onCancel, className }: ProductFormActionsProps) {
  return (
    <div className={`flex flex-col gap-2 w-full sm:flex-row sm:justify-end ${className ?? ''}`}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      )}
      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Saving...
          </span>
        ) : (
          'Save'
        )}
      </Button>
    </div>
  )
}
