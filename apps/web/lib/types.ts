export type MonacoToken = {
  text: string;
  type: string;
  className?: string | null;
  foreground?: string | null;
  lineNumber: number;
  tokenIndex: number;
};
