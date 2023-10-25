import { IObjectItem } from '../types/dropdown'
import { useCallback, useState } from 'react'

function useMultiDropdown({
  selectRef,
  dropdownRef,
  inputRef,
}: {
  selectRef: React.RefObject<HTMLSelectElement>
  dropdownRef: React.RefObject<HTMLInputElement>
  inputRef: React.RefObject<HTMLInputElement>
}) {
  const [selectedItems, setSelectedItems] = useState<IObjectItem[]>([])

  const handleSelection = useCallback((item: IObjectItem | null) => {
    item !== null
      ? setSelectedItems((prev) => [...prev, item])
      : setSelectedItems([])
    if (selectRef?.current?.children) {
      const childArray = Array.from(selectRef.current.children)
      childArray.forEach((child) => {
        const option = child as HTMLOptionElement
        if (item === null) {
          option.selected = false
          return
        }
        if (option.value === item.value) {
          option.selected === true
            ? handleDeselection(item)
            : (option.selected = true)
          return
        }
      })
      selectRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }
    dropdownRef.current?.blur()
    inputRef.current?.blur()
  }, [])

  const handleDeselection = (item: IObjectItem) => {
    setSelectedItems((prev) =>
      prev.filter((selectedItem) => selectedItem.value !== item.value)
    )
    if (selectRef?.current?.children) {
      const childArray = Array.from(selectRef.current.children)
      childArray.forEach((child) => {
        const option = child as HTMLOptionElement
        if (option.value === item.value) {
          option.selected = false
        }
      })
      selectRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  const handleRemoveAllSelected = () => {
    setSelectedItems([])
    if (selectRef?.current?.children) {
      const childArray = Array.from(selectRef.current.children)
      childArray.forEach((child) => {
        const option = child as HTMLOptionElement
        option.selected = false
      })
      selectRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  return {
    selectedItems,
    handleSelection,
    handleDeselection,
    handleRemoveAllSelected,
  }
}

export default useMultiDropdown
