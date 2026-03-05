export interface PaginatedListProps<T> {
  pages: T[];
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export interface ColorData {
  dominantColor: string;
  palette: string[];
}
