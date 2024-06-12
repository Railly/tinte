import { CodeEditor } from "./code-editor";

interface PreviewProps {
  theme: any;
  code?: string;
  updateCode: (value: string | undefined) => void;
  setColorPickerShouldBeHighlighted: React.Dispatch<
    React.SetStateAction<{
      key: string;
      value: boolean;
    }>
  >;
  selectedLanguage: string;
}

export const Preview = ({
  theme,
  updateCode,
  code,
  setColorPickerShouldBeHighlighted,
  selectedLanguage,
}: PreviewProps) => {
  return (
    <div className="flex gap-4 w-full h-full">
      <CodeEditor
        theme={theme}
        code={code}
        onCodeChange={updateCode}
        language={selectedLanguage}
        setColorPickerShouldBeHighlighted={setColorPickerShouldBeHighlighted}
      />
    </div>
  );
};
