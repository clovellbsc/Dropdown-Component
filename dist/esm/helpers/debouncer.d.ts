export default function debounce<Func extends (...args: any[]) => any, This>(func: Func, delay: number): (...args: Parameters<Func>) => void;
