import { ReactNode } from 'react'

export interface IObjectItem {
  icon?: {
    alt: string
    url: string
  }
  value: string
  label: string
  [key: string]: any
}

export type StringClickHandler = (item: string) => void

export type ObjectClickHandler = (
  e: React.ChangeEvent<HTMLSelectElement>
) => void

interface IAsyncFunctionReturn {
  error?: null | Error
  data?: IObjectItem[]
}

interface IAsyncState {
  loading: boolean
  error: null | Error
  data: IObjectItem[]
  selectedItems: IObjectItem[]
}

interface IStylingClassnames {
  container?: string
  input?: string
  dropdown?: string
  dropdownItem?: string
  iconColour?: string
  rounded?: string
  shadow?: string
  highlightColor?: string
  highlightTextColor?: string
  multi?: {
    multiLabelContainer?: string
    selectedItemContainer?: string
    selectedItemIconBox?: string
    selectedItemIcon?: string
  }
}

interface IDropdownProps {
  placeholder: string
  items?: IObjectItem[]
  onChange: ObjectClickHandler
  searchable?: boolean
  emptySearchPhrase?: string
  noResultsPhrase?: string
  minimumSearchQuery?: number
  alternate?: boolean
  name?: string
  initialValue?: string

  asyncFunction?: (query: string) => Promise<IAsyncFunctionReturn>

  clearable?: boolean

  roundedClass?: string
  stylingClassnames?: IStylingClassnames

  isMulti?: boolean
  value: string | string[]
}

interface IUseDropdownProps {
  items?: IObjectItem[]
  searchable?: boolean
  emptySearchPhrase?: string
  noResultsPhrase?: string
  minimumSearchQuery?: number
  alternate?: boolean

  asyncFunction?: (query: string) => Promise<IAsyncFunctionReturn>

  stylingClassnames?: IStylingClassnames

  isMulti?: boolean
  children?: ReactNode
  value: string | string[]
}
