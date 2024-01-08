import { IObjectItem } from '../types/dropdown'

function mergeArraysWithoutDuplicate(arr: IObjectItem[], key: string) {
  const uniqueArr: IObjectItem[] = []
  arr.forEach((item) => {
    if (!uniqueArr.includes(item[key])) {
      uniqueArr.push(item[key])
    }
  })
  return uniqueArr
}

export default mergeArraysWithoutDuplicate
