export interface Setting {
    id: 'global';
    layout: {
        columnsOrder: string[];
    };
    sync: {
        syncServerUrl: string;
        syncSecretKey: string;
        isSyncEnabled: boolean;
    };
}
