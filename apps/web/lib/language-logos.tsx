import React from "react";

import HTMLIcon from "@/public/logos/html.svg";
import CSSIcon from "@/public/logos/css.svg";
import TSXIcon from "@/public/logos/tsx.svg";
import JSXIcon from "@/public/logos/jsx.svg";
import VueIcon from "@/public/logos/vue.svg";
import TypeScriptIcon from "@/public/logos/typescript.svg";
import JavaScriptIcon from "@/public/logos/javascript.svg";
import JSONIcon from "@/public/logos/json.svg";
import PHPIcon from "@/public/logos/php.svg";
import SQLIcon from "@/public/logos/sql.svg";
import GoIcon from "@/public/logos/go.svg";
import RustIcon from "@/public/logos/rust.svg";
import PythonIcon from "@/public/logos/python.svg";
import RubyIcon from "@/public/logos/ruby.svg";
import DartIcon from "@/public/logos/dart.svg";
import SwiftIcon from "@/public/logos/swift.svg";
import KotlinIcon from "@/public/logos/kotlin.svg";
import JavaIcon from "@/public/logos/java.svg";
import CSharpIcon from "@/public/logos/csharp.svg";
import CIcon from "@/public/logos/c.svg";
import CPPIcon from "@/public/logos/cpp.svg";
import RIcon from "@/public/logos/r.svg";
import ZigIcon from "@/public/logos/zig.svg";
import AngularIcon from "@/public/logos/angular.svg";
// import AssemblyIcon from "@/public/logos/assembly.svg";
import AstroIcon from "@/public/logos/astro.svg";
import BashIcon from "@/public/logos/bash.svg";
// import LaTeXIcon from "@/public/logos/latex.svg";
import LuaIcon from "@/public/logos/lua.svg";
import MarkdownIcon from "@/public/logos/markdown.svg";
import OCamlIcon from "@/public/logos/ocaml.svg";
import ScalaIcon from "@/public/logos/scala.svg";
import SolidityIcon from "@/public/logos/solidity.svg";
import SvelteIcon from "@/public/logos/svelte.svg";
import TOMLIcon from "@/public/logos/toml.svg";
// import XMLIcon from "@/public/logos/xml.svg";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export const LanguageLogos: Record<string, IconComponent> = {
  html: HTMLIcon,
  css: CSSIcon,
  tsx: TSXIcon,
  jsx: JSXIcon,
  vue: VueIcon,
  typescript: TypeScriptIcon,
  javascript: JavaScriptIcon,
  json: JSONIcon,
  php: PHPIcon,
  sql: SQLIcon,
  go: GoIcon,
  rust: RustIcon,
  python: PythonIcon,
  ruby: RubyIcon,
  dart: DartIcon,
  swift: SwiftIcon,
  kotlin: KotlinIcon,
  java: JavaIcon,
  "c#": CSharpIcon,
  c: CIcon,
  "c++": CPPIcon,
  r: RIcon,
  zig: ZigIcon,
  angular: AngularIcon,
  //   assembly: AssemblyIcon,
  astro: AstroIcon,
  bash: BashIcon,
  lua: LuaIcon,
  markdown: MarkdownIcon,
  ocaml: OCamlIcon,
  scala: ScalaIcon,
  solidity: SolidityIcon,
  svelte: SvelteIcon,
  toml: TOMLIcon,
  //   xml: XMLIcon,
};

export const DefaultIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14z" />
    <path d="M9.5 15.5L11 14l1.5 1.5L15 12l3 3H6l3.5-3.5z" />
  </svg>
);
