interface EyeDropperOptions {
  signal?: AbortSignal;
}

interface EyeDropperResult {
  sRGBHex: string;
}

interface EyeDropper {
  open(options?: EyeDropperOptions): Promise<EyeDropperResult>;
}

interface Window {
  EyeDropper: {
    new (): EyeDropper;
  };
}

declare module "*.svg" {
  import React from "react";
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
