export type MenuItem = {
    key: string;
    label: string;
};
export declare function createUi(): {
    ask: (prompt: string) => Promise<string>;
    title: (text: string) => void;
    info: (text: string) => void;
    warn: (text: string) => void;
    error: (text: string) => void;
    json: (obj: unknown) => void;
    menu: (titleText: string, items: MenuItem[]) => Promise<string>;
    confirm: (prompt?: string) => Promise<boolean>;
    close: () => void;
};
//# sourceMappingURL=ui.d.ts.map