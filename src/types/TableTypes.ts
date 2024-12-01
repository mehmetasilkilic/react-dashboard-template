import { ColumnDef, Table, SortingState, PaginationState } from '@tanstack/react-table';
import { Dispatch, SetStateAction } from 'react';

// Size variants for the table
export type Size = 'sm' | 'md' | 'lg';

// Base column definition with optional properties
export interface ExtendedColumnDef {
    showOptionsButton?: boolean;
    truncate?: boolean;
}

// State of the table
export interface TableState<T> {
    data: T[];
    totalItems: number;
    isLoading: boolean;
}

// Actions that can change the table state
export interface TableActions {
    sorting: SortingState;
    pagination: PaginationState;
    columnFilters: ColumnFilter[];
}

// Column filter
export interface ColumnFilter {
    id: string;
    value: string;
}

// Props for the main FlexibleTable component
export interface TableProps<T extends object> {
    columns: (ColumnDef<T> & ExtendedColumnDef)[];
    state: TableState<T>;
    onStateChange: (actions: TableActions) => void;
    pageSize: number;
    pageIndex: number;
    onExport?: (exportData: ExportData) => void;
    size?: Size;
}

// Data passed to the export function
export interface ExportData {
    sorting: SortingState;
    columnFilters: ColumnFilter[];
}

// Props for the useTableLogic hook
export type TableLogicProps<T extends object> = TableProps<T>;

// Return type of the useTableLogic hook
export interface TableLogicReturn<T extends object> {
    table: Table<T>;
    sorting: SortingState;
    pagination: PaginationState;
    columnFilters: ColumnFilter[];
    handleSearch: (columnId: string, value: string) => void;
    clearSort: (columnId: string) => void;
    setSorting: Dispatch<SetStateAction<SortingState>>;
    setPagination: Dispatch<SetStateAction<PaginationState>>;
    setColumnFilters: Dispatch<SetStateAction<ColumnFilter[]>>;
    handleExport: () => void;
}

// Props for the TableHeader component
export interface TableHeaderProps<T extends object> {
    headerGroups: ReturnType<Table<T>['getHeaderGroups']>;
    onSearch: (columnId: string, value: string) => void;
    onClearSort: (columnId: string) => void;
    onExport?: () => void;
    size?: Size;
}

// Props for the TableBody component
export interface TableBodyProps<T extends object> {
    rows: ReturnType<Table<T>['getRowModel']>['rows'];
    isLoading: boolean;
    pageSize: number;
    columns: (ColumnDef<T> & ExtendedColumnDef)[];
    size?: Size;
}

// Props for the TablePagination component
export interface TablePaginationProps<T extends object> {
    table: Table<T>;
    state: TableState<T>;
    pagination: PaginationState;
    size?: Size;
}

// Configuration for different size variants
export interface SizeConfig {
    headerText: string;
    cellText: string;
    padding: string;
    buttonPadding: string;
    paginationText: string;
    iconSize: string;
    dropdownPadding: string;
    inputHeight: string;
}

// Size configuration mapping
export type SizeConfigMap = {
    [key in Size]: SizeConfig;
};