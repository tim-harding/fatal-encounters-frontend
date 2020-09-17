export function baseUrl() {
    const loc = window.location
    const base = `${loc.protocol}//${loc.host}`
    return base
}