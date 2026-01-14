export interface Setting {
    id: 'global';
    columnsOrder: string[];
    darkMode: boolean;

    sync: {
        syncServerUrl: string;
        syncSecretKey: string;
        isSyncEnabled: boolean;
    };
}
