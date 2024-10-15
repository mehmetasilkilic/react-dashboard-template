import { ColumnDef, Table, SortingState, PaginationState } from '@tanstack/react-table';

export interface TableState<T> {
    data: T[];
    totalItems: number;
    isLoading: boolean;
}

export interface TableActions {
    sorting: SortingState;
    pagination: PaginationState;
    columnFilters: { id: string; value: string }[];
}

export interface TableProps<T extends object> {
    columns: (ColumnDef<T> & { showOptionsButton?: boolean })[];
    state: TableState<T>;
    onStateChange: (actions: TableActions) => void;
    pageSize: number;
    pageIndex: number;
}

export interface TableLogicProps<T extends object> extends TableProps<T> { }

export interface TableLogicReturn<T extends object> {
    table: Table<T>;
    sorting: SortingState;
    pagination: PaginationState;
    columnFilters: { id: string; value: string }[];
    handleSearch: (columnId: string, value: string) => void;
    clearSort: (columnId: string) => void;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    setColumnFilters: React.Dispatch<React.SetStateAction<{ id: string; value: string }[]>>;
}

export interface TableHeaderProps<T extends object> {
    headerGroups: ReturnType<Table<T>['getHeaderGroups']>;
    onSearch: (columnId: string, value: string) => void;
    onClearSort: (columnId: string) => void;
}

export interface TableBodyProps<T extends object> {
    rows: ReturnType<Table<T>['getRowModel']>['rows'];
    isLoading: boolean;
    pageSize: number;
    columns: (ColumnDef<T> & { showOptionsButton?: boolean })[];
}

export interface TablePaginationProps<T extends object> {
    table: Table<T>;
    state: TableState<T>;
    pagination: PaginationState;
}