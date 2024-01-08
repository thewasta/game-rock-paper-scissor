export const useUUID = (): string => {
    return crypto.randomUUID()
}