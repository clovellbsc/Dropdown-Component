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

interface IAsyncConfig {
  label: string | Array<string>
  url: string
  value?: string
  query?: {
    [key: string]: any
  }
}

interface IAsyncState {
  loading: boolean
  error: null | Error
  data: IObjectItem[]
}

interface IAsyncState {
  loading: boolean
  error: null | Error
  data: IObjectItem[]
}

interface IStylingClassnames {
  container?: string
  input?: string
  dropdown?: string
  iconColour?: string
  rounded?: string
  shadow?: string
  highlightColor?: string
  highlightTextColor?: string
  multi?: {
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

  asyncConfig?: IAsyncConfig

  clearable?: boolean

  roundedClass?: string
  stylingClassnames?: IStylingClassnames

  isMulti?: boolean
}

interface IUseDropdownProps {
  items?: IObjectItem[]
  searchable?: boolean
  emptySearchPhrase?: string
  noResultsPhrase?: string
  minimumSearchQuery?: number
  alternate?: boolean
  initialValue?: string

  asyncConfig?: IAsyncConfig

  stylingClassnames?: IStylingClassnames

  isMulti?: boolean
  children?: ReactNode
}
