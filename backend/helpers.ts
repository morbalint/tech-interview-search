export function Str2PositiveUIntSafe(text: string, fallback: number = 1): number {
    const num = Number(text)
    return Number.isInteger(num) && num > 0 ? num : fallback
}