export interface FilterState {
  categories: string[]
  budgets: string[]
  filter: string
  distance: {
    min: number
    max: number
  }
  dates: {
    start: string
    end: string
  }
  location: string
}

export interface FilterOptions {
  categories: string[]
  budgetRanges: string[]
  filterOptions: string[]
  locations: string[]
}

export interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters?: (filters: FilterState) => void
  initialFilters?: Partial<FilterState>
  filterOptions?: FilterOptions
}

export interface RangeSliderProps {
  min: number
  max: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
  minLimit?: number
  maxLimit?: number
  label?: string
  unit?: string
}

export interface CheckboxGroupProps {
  items: string[]
  selectedItems: string[]
  onItemToggle: (item: string) => void
  className?: string
}

export interface LocationDropdownProps {
  locations: string[]
  selectedLocation: string
  isOpen: boolean
  onToggle: () => void
  onLocationSelect: (location: string) => void
  placeholder?: string
}

export interface DateRangePickerProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  label?: string
}

export interface FilterSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}
