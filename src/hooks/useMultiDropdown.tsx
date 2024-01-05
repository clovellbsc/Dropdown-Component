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
  // const [selectedItems, setSelectedItems] = useState<IObjectItem[]>([])

  const handleDeselection = useCallback(
    (item: IObjectItem) => {
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
      if (selectRef?.current?.children) {
        const childArray = Array.from(selectRef.current.children)
        childArray.forEach((child) => {
          const option = child as HTMLOptionElement
          console.log('option', option)
          console.log('item', item)
          if (item === null) {
            option.selected = false
            return
          }
          if (option.value === item.value) {
            console.log('option.selected', option.selected)
            option.selected === true
              ? handleDeselection(item)
              : (option.selected = true)
            console.log('option.selected after', option.selected)
            return
          }
        })
        console.log('selectRef.current', selectRef.current)
        selectRef.current.dispatchEvent(new Event('change', { bubbles: true }))
      }
      setFilterText('')
      dropdownRef.current?.blur()
      inputRef.current?.blur()
    },
    [dropdownRef, inputRef, selectRef, handleDeselection]
  )

  const handleRemoveAllSelected = () => {
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
    handleSelection,
    handleDeselection,
    handleRemoveAllSelected,
  }
}

export default useMultiDropdown
