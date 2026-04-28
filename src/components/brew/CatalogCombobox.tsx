"use client"

import { useMemo, useState } from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox"

export type CatalogGroup = {
  label: string
  items: { value: string; label: string }[]
}

type ItemShape = { value: string; label: string }

export function CatalogCombobox({
  value,
  onValueChange,
  groups,
  customOption,
  placeholder = "Select...",
}: {
  value: string
  onValueChange: (value: string) => void
  groups: CatalogGroup[]
  customOption?: ItemShape
  placeholder?: string
}) {
  const [query, setQuery] = useState("")

  const allItems = useMemo<ItemShape[]>(
    () => [...groups.flatMap((g) => g.items), ...(customOption ? [customOption] : [])],
    [groups, customOption]
  )

  const selectedItem = useMemo(
    () => allItems.find((i) => i.value === value) ?? null,
    [allItems, value]
  )

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return groups
    const q = query.toLowerCase()
    return groups
      .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0)
  }, [groups, query])

  const showCustom =
    !query.trim() ||
    Boolean(customOption?.label.toLowerCase().includes(query.toLowerCase()))

  const hasResults = filteredGroups.length > 0 || (Boolean(customOption) && showCustom)

  function handleChange(item: ItemShape | null) {
    onValueChange(item?.value ?? "")
  }

  return (
    <Combobox
      value={selectedItem}
      onValueChange={handleChange}
      onInputValueChange={(v) => setQuery(v)}
      onOpenChange={(open) => { if (!open) setQuery("") }}
      isItemEqualToValue={(item: ItemShape, val: ItemShape) => item.value === val.value}
    >
      <ComboboxInput
        showTrigger={true}
        showClear={false}
        placeholder={placeholder}
        className="h-8 sm:h-7"
      />
      <ComboboxContent className="w-auto min-w-64">
        <ComboboxList>
          {filteredGroups.map((group) => (
            <ComboboxGroup key={group.label}>
              <ComboboxLabel>{group.label}</ComboboxLabel>
              {group.items.map((item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          ))}
          {customOption && showCustom && (
            <>
              <ComboboxSeparator />
              <ComboboxItem value={customOption}>
                {customOption.label}
              </ComboboxItem>
            </>
          )}
          {!hasResults && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </p>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
