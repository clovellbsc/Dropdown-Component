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

export interface IAsyncFunctionReturn {
  error?: null | Error
  data?: IObjectItem[]
}

export interface IAsyncState {
  loading: boolean
  error: null | Error
  data: IObjectItem[]
  selectedItems: IObjectItem[]
}

export interface IStylingClassnames {
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

export interface IDropdownProps {
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

export interface IUseDropdownProps {
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

export interface IDropdownItemProps {
  item: IObjectItem
  highlighted: boolean
  selected: boolean
  highlightColor: string
  highlightTextColor: string
  dropdownItemClassnames?: string
}

export interface IDropdownListProps {
  filterText: string
  minimumSearchQuery?: number
  data: IObjectItem[]
  emptySearchPhrase?: string
  noResultsPhrase?: string
  handleClick: (item: IObjectItem) => void
  dropdownClassnames: string
  loading?: boolean
  highlightedIndex?: number
  handleMouseOver: (index: number) => void
  selected: IObjectItem | null | IObjectItem[]
  highlightColor: string
  highlightTextColor: string
  dropdownItemClassnames?: string
}

export interface IDropDownLabelItemProps {
  handleRemoveSingle: (item: any) => void
  item: IObjectItem
  containerStyles: string
  iconContainerStyles: string
  iconStyles: string
  iconColour: string
}

export interface IDropdownToggleProps {
  label: string
  placeholder: string
  handleRemoveSelected?: () => void
  removeSearchText: () => void
  isOpen: boolean
  iconColour?: string
  handleToggle: () => void
  clearable: boolean
}

export interface IMultiDropdownToggleProps {
  label: string | IObjectItem[]
  iconColour?: string
  handleRemoveSingle: (item: IObjectItem) => void
  stylingClassnames?: IStylingClassnames
  searchable?: boolean
}

export interface IRequestParams {
  url: string
  method: string
  query?: Record<string, any>
  body?: object
  headers?: object
}

export interface IHttpResponse {
  data?: { [key: string]: any } | any[]
  error?: string
}
