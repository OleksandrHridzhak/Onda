export interface Setting {
    id: 'global';
    layout: {
        columnsOrder: string[];
    };
    sync: {
        serverUrl: string;
        secretKey: string;
        enabled: boolean;
        version?: number;
        lastSync?: string | null;
        autoSync?: boolean;
        syncInterval?: number;
    };
}
