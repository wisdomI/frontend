# Filter Components

This directory contains reusable filter components that were extracted from the monolithic FilterModal component to improve maintainability and reusability.

## Components

### FilterSection
A collapsible section wrapper with a title and toggle functionality.

**Props:**
- `title: string` - The section title
- `isOpen: boolean` - Whether the section is expanded
- `onToggle: () => void` - Function to toggle the section
- `children: ReactNode` - Content to display when expanded

### CheckboxGroup
A reusable checkbox group component for selecting multiple items.

**Props:**
- `items: string[]` - Array of items to display as checkboxes
- `selectedItems: string[]` - Array of currently selected items
- `onItemToggle: (item: string) => void` - Function called when an item is toggled
- `className?: string` - Optional additional CSS classes

### RangeSlider
A custom range slider component for selecting min/max values.

**Props:**
- `min: number` - Current minimum value
- `max: number` - Current maximum value
- `onMinChange: (value: number) => void` - Function called when min value changes
- `onMaxChange: (value: number) => void` - Function called when max value changes
- `minLimit?: number` - Minimum allowed value (default: 1)
- `maxLimit?: number` - Maximum allowed value (default: 100)
- `label?: string` - Label for the slider (default: "Distance")
- `unit?: string` - Unit to display (default: "km")

### LocationDropdown
A dropdown component for selecting locations.

**Props:**
- `locations: string[]` - Array of available locations
- `selectedLocation: string` - Currently selected location
- `isOpen: boolean` - Whether the dropdown is open
- `onToggle: () => void` - Function to toggle dropdown
- `onLocationSelect: (location: string) => void` - Function called when location is selected
- `placeholder?: string` - Placeholder text (default: "Select Location")

### DateRangePicker
A component for selecting start and end dates.

**Props:**
- `startDate: string` - Current start date (YYYY-MM-DD format)
- `endDate: string` - Current end date (YYYY-MM-DD format)
- `onStartDateChange: (date: string) => void` - Function called when start date changes
- `onEndDateChange: (date: string) => void` - Function called when end date changes
- `label?: string` - Label for the date picker (default: "Availability")

## Types

All TypeScript types are defined in `types/filter.ts` and exported from the index file.

## Usage

```tsx
import { 
  FilterSection, 
  CheckboxGroup, 
  RangeSlider, 
  LocationDropdown, 
  DateRangePicker 
} from '@/components/ui/filter'

// Use the components in your filter UI
<FilterSection title="Categories" isOpen={true} onToggle={() => {}}>
  <CheckboxGroup 
    items={categories} 
    selectedItems={selectedCategories} 
    onItemToggle={handleToggle} 
  />
</FilterSection>
```

## Benefits of Refactoring

1. **Reusability**: Components can be used in other parts of the application
2. **Maintainability**: Smaller, focused components are easier to maintain
3. **Testability**: Individual components can be tested in isolation
4. **Type Safety**: Proper TypeScript types ensure type safety
5. **Separation of Concerns**: Each component has a single responsibility
6. **Code Organization**: Related functionality is grouped together
