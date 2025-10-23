export interface PagedResult<T> {
  items: T[];
  total: number;
}

export interface Attachment {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}