export interface Status {
    id: string;
    name: string;
    color: string;
    previousStatuses: Array<Status>;
    nextStatuses: Array<Status>;
}
