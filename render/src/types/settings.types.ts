export interface Setting {
    id: 'global';
    layout: {
        columnsOrder: string[];
    };
    sync: {
        syncServerUrl: string;
        syncSecretKey: string;
        isSyncEnabled: boolean;
        version?: number;
        lastSync?: string | null;
        autoSync?: boolean;
        syncInterval?: number;
    };
}
