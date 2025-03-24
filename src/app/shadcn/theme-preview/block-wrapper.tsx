import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, ComputerIcon } from "lucide-react";
import { codeToHtml } from "shiki";
import { CopyCodeButton } from "./copy-code-button";
interface BlockWrapperProps {
  children: React.ReactNode;
  title: string;
  componentCode: string;
}

export const BlockWrapper = ({
  children,
  title,
  componentCode,
}: BlockWrapperProps) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border">
      <Tabs defaultValue="preview" className="w-full">
        <div className="flex items-center justify-between bg-muted p-4">
          <h3 className="font-semibold text-sm">{title}</h3>
          <div className="flex flex-none items-center">
            <TabsList className="mr-2 h-8 w-min">
              <TabsTrigger value="preview" className="h-8">
                <ComputerIcon className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="h-8">
                <CodeIcon className="mr-2 h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>
            <CopyCodeButton code={componentCode} />
          </div>
        </div>
        <TabsContent value="preview" className="mt-0">
          <div className="p-4">{children}</div>
        </TabsContent>
        <TabsContent value="code" className="mt-0">
          <div className="flex h-full w-full flex-col">
            <div className="h-[80vh] overflow-auto">
              <CodeBlock>{componentCode}</CodeBlock>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface Props {
  children: string;
}

async function CodeBlock(props: Props) {
  const out = await codeToHtml(props.children, {
    lang: "tsx",
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  });

  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
  return <div dangerouslySetInnerHTML={{ __html: out }} />;
}
