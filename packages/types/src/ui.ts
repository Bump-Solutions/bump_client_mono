export interface PaginatedListProps<T> {
  pages: T[];
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}

export interface ColorData {
  dominantColor: string;
  palette: string[];
}
