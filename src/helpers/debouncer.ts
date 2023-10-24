export default function debounce<Func extends (...args: any[]) => any, This>(
  func: Func,
  delay: number
): (...args: Parameters<Func>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return function debounced(this: This, ...args: Parameters<Func>) {
    const context = this
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(context, args), delay)
  }
}
