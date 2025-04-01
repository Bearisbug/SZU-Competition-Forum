'use client'

import { ReactNode, useState } from 'react'
import { Button, Input, Checkbox, Chip } from "@heroui/react"
import { Accordion, AccordionItem } from "@heroui/react"

type FilterCategory = 'goals' | 'requirements' | 'roles'
export type FilterOption = { category: FilterCategory; label: string; value: string }

type FilterCategoryData = {
  title: string
  category: FilterCategory
  options: { label: string; value: string }[]
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterOption[], peopleNeeded: string) => void
  filterCategories: FilterCategoryData[]
}

export function FilterSidebar({ onFilterChange, filterCategories }: FilterSidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([])
  const [peopleNeeded, setPeopleNeeded] = useState('')

  const handleFilterChange = (category: FilterCategory, label: string, value: string, checked: boolean) => {
    let newFilters: FilterOption[]
    if (checked) {
      newFilters = [...selectedFilters, { category, label, value }]
    } else {
      newFilters = selectedFilters.filter(filter => filter.value !== value)
    }
    setSelectedFilters(newFilters)
    onFilterChange(newFilters, peopleNeeded)
  }

  const handleRemoveFilter = (value: string) => {
    const newFilters = selectedFilters.filter(filter => filter.value !== value)
    setSelectedFilters(newFilters)
    onFilterChange(newFilters, peopleNeeded)
  }

  const handlePeopleNeededChange = (value: string) => {
    setPeopleNeeded(value)
    onFilterChange(selectedFilters, value)
  }

  const getChipColor = (category: FilterCategory) => {
    switch (category) {
      case 'goals':
        return 'danger'
      case 'requirements':
        return 'success'
      case 'roles':
        return 'primary'
      default:
        return 'default'
    }
  }
  return (
    <div className="w-64 p-4">
      <h2 className="text-lg font-semibold mb-4">过滤器</h2>
      <Accordion>
        {filterCategories.map((category) => (
          <AccordionItem key={category.title} aria-label={category.title} title={category.title}>
            <div className="flex flex-col mx-auto gap-2">
              {category.options.map(({ label, value }) => (
                <Checkbox
                  key={value}
                  onChange={(e) => handleFilterChange(category.category, label, value, e.target.checked)}
                >
                  {label}
                </Checkbox>
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">已选择的条件：</h3>
        <div className="flex flex-wrap gap-2">
          {selectedFilters.map(({ category, label, value }) => (
            <Chip
              key={value}
              onClose={() => handleRemoveFilter(value)}
              color={getChipColor(category)}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  )
}

