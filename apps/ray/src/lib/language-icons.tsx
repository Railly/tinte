import type React from "react";
import { TypescriptLogo } from "@/components/logos/typescript";
import { JavascriptLogo } from "@/components/logos/javascript";
import { PythonLogo } from "@/components/logos/python";
import { RustLogo } from "@/components/logos/rust";
import { GoLogo } from "@/components/logos/go";
import { HtmlLogo } from "@/components/logos/html";
import { CssLogo } from "@/components/logos/css";
import { JsonLogo } from "@/components/logos/json";
import { BashLogo } from "@/components/logos/bash";
import { SqlLogo } from "@/components/logos/sql";
import { JavaLogo } from "@/components/logos/java";
import { CplusplusLogo } from "@/components/logos/cplusplus";
import { RubyLogo } from "@/components/logos/ruby";
import { SwiftLogo } from "@/components/logos/swift";
import { KotlinLogo } from "@/components/logos/kotlin";

export const LANGUAGE_ICONS: Record<
  string,
  (props: { className?: string }) => React.ReactElement
> = {
  tsx: TypescriptLogo,
  typescript: TypescriptLogo,
  javascript: JavascriptLogo,
  python: PythonLogo,
  rust: RustLogo,
  go: GoLogo,
  html: HtmlLogo,
  css: CssLogo,
  json: JsonLogo,
  bash: BashLogo,
  sql: SqlLogo,
  java: JavaLogo,
  cpp: CplusplusLogo,
  ruby: RubyLogo,
  swift: SwiftLogo,
  kotlin: KotlinLogo,
};
