export type FileType = string;

export interface FilesType extends File {
  file_name: string; // Required
  file_size: number; // Required
  from: string; // Required
  to?: string | null; // Optional
  file_type: string; // Required
  file: File; // Required
  is_converted?: boolean; // Optional
  is_converting?: boolean; // Optional
  is_error?: boolean; // Optional
  url?: string; // Optional
  output?: string; // Optional
}
