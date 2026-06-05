export type DbResult<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
};
