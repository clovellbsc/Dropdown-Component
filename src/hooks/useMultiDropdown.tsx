import { IObjectItem } from '../types/dropdown'
import { useCallback, useState } from 'react'

function useMultiDropdown({
  selectRef,
  dropdownRef,
  inputRef,
  setFilterText,
}: {
  selectRef: React.RefObject<HTMLSelectElement>
  dropdownRef: React.RefObject<HTMLInputElement>
  inputRef: React.RefObject<HTMLInputElement>
  setFilterText: React.Dispatch<React.SetStateAction<string>>
}) {
  const [selectedItems, setSelectedItems] = useState<IObjectItem[]>([])

  const handleDeselection = useCallback(
    (item: IObjectItem) => {
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
    },
    [selectRef]
  )

  const handleSelection = useCallback(
    (item: IObjectItem | null) => {
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
      setFilterText('')
      dropdownRef.current?.blur()
      inputRef.current?.blur()
    },
    [dropdownRef, inputRef, selectRef, handleDeselection]
  )

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
