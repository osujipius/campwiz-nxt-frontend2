export interface ResponseSingle<T> {
    data: T;
}
export interface ResponseError {
    detail: string;
}
export type ResponseMultiple<T> = {
    data: T[];
    total: number;
};
export type ResponseList<T> = {
    data: T[];
    next?: string;
    prev?: string;
};