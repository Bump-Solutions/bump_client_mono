export interface FormErrors {
  [field: string]: string;
}

export interface FileUpload {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
  size: number;
  type: string;
}
