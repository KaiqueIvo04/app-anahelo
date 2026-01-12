export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  formatter?: (
    value: any,
    row?: any
  ) =>
    | string
    | number
    | {
        label: string;
        class?: string;
        icon?: string;
      };
}
