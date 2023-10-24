export default function useDropdownData(): {
    getDropdownData: ({ config, label, value, }: {
        config: any;
        label: string | Array<string>;
        value: string | undefined;
    }) => Promise<{
        error: any;
        data?: undefined;
    } | {
        data: any;
        error?: undefined;
    }>;
};
