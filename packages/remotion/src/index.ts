import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);

export { RemotionRoot } from "./Root";
export { AnimatedIde } from "./compositions/AnimatedIde";
export { tinteToRawTheme, extractThemeColors, loadTinteThemeFromJson } from "./lib/tinte-theme-bridge";
export { calculateAnimatedIdeMetadata } from "./lib/calculate-metadata";
export type { AnimatedIdeProps, AnimatedIdeStep, AnimatedIdeSettings, ThemeColors } from "./types";
export { AnimatedIdePropsSchema } from "./schema";
