import { IObjectItem } from '../types/dropdown'

function mergeArraysWithoutDuplicate(arr: IObjectItem[], key: string) {
  return [...new Map(arr.map((item) => [item[key], item])).values()]
}

export default mergeArraysWithoutDuplicate
