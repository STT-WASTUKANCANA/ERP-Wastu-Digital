export interface MailCategory {
    id: number;
    name: string;
    type: string;
    type_name: string;
}

export interface MailTableProps<T> {
    mails: T[];
    onMailCreated: () => void;
    isLoading: boolean;
    type: 'incoming' | 'outgoing' | 'decision';
    onSearch?: (query: string) => void;
    onFilterApply?: (filters: any) => void;
}
