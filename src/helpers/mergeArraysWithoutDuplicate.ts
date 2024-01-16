import { IObjectItem } from '../types/dropdown'

function mergeArraysWithoutDuplicate(arr: IObjectItem[], key: string) {
  const uniqueArr: IObjectItem[] = []

  arr.forEach((item) => {
    if (!uniqueArr.find((uniqueItem) => uniqueItem[key] === item[key])) {
      uniqueArr.push(item)
    }
  })

  return uniqueArr
}

export default mergeArraysWithoutDuplicate
