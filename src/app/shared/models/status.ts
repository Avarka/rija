export interface Status {
    id: string;
    name: string;
    color: string;
    previousStatuses: Array<string>;
    nextStatuses: Array<string>;
}
