"use client";

import { ArrowRight, Camera, Layers, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { ElementsIcon } from "@/components/shared/icons";
import { Logo } from "@/components/shared/layout";

const products = [
  {
    icon: Logo,
    iconProps: { size: 20 },
    name: "Tinte",
    role: "Generate & Compile",
    description:
      "13 semantic OKLCH tokens compile to 30+ CSS variables, fonts, radius, and shadows. One source of truth for 19 export formats.",
    url: "https://tinte.dev",
    command: "npx shadcn@latest add https://tinte.dev/api/preset/{slug}",
    features: [
      "AI-powered generation",
      "OKLCH color model",
      "19 export targets",
    ],
  },
  {
    icon: ElementsIcon,
    iconProps: { className: "size-5" },
    name: "Elements",
    role: "Install & Compose",
    description:
      "227+ full-stack shadcn components that inherit your Tinte design tokens. Install presets, then add components.",
    url: "https://tryelements.dev",
    command: "npx shadcn@latest add https://tryelements.dev/r/{component}",
    features: ["227+ components", "Full-stack ready", "Token inheritance"],
  },
  {
    icon: Camera,
    iconProps: { className: "size-5" },
    name: "Ray",
    role: "Preview & Extract",
    description:
      "Code screenshots with any Tinte theme applied. Extract color themes from images. Visual proof for your design system.",
    url: "https://ray.tinte.dev",
    command: "POST ray.tinte.dev/api/v1/screenshot",
    features: ["500+ syntax themes", "Image extraction", "REST API"],
  },
];

export function Ecosystem() {
  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-medium">Ecosystem</h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Tinte generates the system. Elements installs it. Ray shows it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.a
              key={product.name}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col rounded-xl border border-border/50 bg-card/50 p-6 hover:border-primary/30 hover:bg-card/80 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                  <product.icon {...product.iconProps} />
                </div>
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {product.role}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {product.description}
              </p>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {product.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-muted/80 text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground/60 truncate">
                  <Terminal className="w-3 h-3 shrink-0" />
                  <span className="truncate">{product.command}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-4 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>{product.url.replace("https://", "")}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 py-2.5 rounded-lg bg-muted/30 border border-border/30 text-xs text-muted-foreground font-mono">
            <span>npx skills add Railly/tinte</span>
            <span className="text-border hidden sm:inline">|</span>
            <span className="text-center">
              Agent skill for Claude Code, Cursor, Windsurf
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
