export function baseUrl() {
    const loc = window.location
    const base = `${loc.protocol}//${loc.host}`
    return base
}

export function mod(v: number, m: number): number {
    return ((v % m) + m) % m
}