export interface DownloadOptions {
  content: string;
  filename: string;
  mimeType: string;
}

export function downloadFile({ content, filename, mimeType }: DownloadOptions): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const element = document.createElement('a');
  
  element.href = url;
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(url);
}

export function downloadMultipleFiles(files: DownloadOptions[]): void {
  files.forEach(file => downloadFile(file));
}

export function downloadJSON(data: unknown, filename: string): void {
  downloadFile({
    content: JSON.stringify(data, null, 2),
    filename: filename.endsWith('.json') ? filename : `${filename}.json`,
    mimeType: 'application/json'
  });
}