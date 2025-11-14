import { nanoid } from "nanoid";

export function generateThemeId(): string {
  return `theme_${nanoid()}`;
}
