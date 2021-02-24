export interface ServerResponce<T> {
    count: number
    next: string
    previous: null
    results: T
}