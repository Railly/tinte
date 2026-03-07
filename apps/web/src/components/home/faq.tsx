"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusIcon } from "lucide-react";
import { motion } from "motion/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

interface FAQItem {
  id: string;
  question: string;
  sub: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "What is Tinte?",
    sub: "Agent-native design system infrastructure",
    answer:
      "Tinte is agent-native design system infrastructure for shadcn/ui. It maintains a theme graph of 13 semantic OKLCH color tokens that compiles to shadcn presets, VS Code themes, terminal configs, and 19+ formats from one source of truth. Install with one command via shadcn CLI v4.",
  },
  {
    id: "2",
    question: "How do I install a preset?",
    sub: "One command via shadcn CLI v4",
    answer:
      "Run npx shadcn@latest add https://tinte.dev/api/preset/{slug} to install any preset. For fonts, add https://tinte.dev/api/preset/{slug}/font?variable=sans. Get the full pack (base + fonts + commands) via GET /api/preset/{slug}?type=pack.",
  },
  {
    id: "3",
    question: "What makes Tinte different from shadcn/create?",
    sub: "Semantic color model vs color picker",
    answer:
      "Tinte uses a 13-token semantic OKLCH color model with perceptual ramp generation, producing 30+ CSS variables with mathematical consistency. Unlike simple color pickers, Tinte outputs distributable presets, supports 19 export targets, and has an image-to-preset pipeline via Ray.",
  },
  {
    id: "4",
    question: "What's in a Tinte preset?",
    sub: "Colors, fonts, radius, shadows from 13 tokens",
    answer:
      "Every preset includes 30+ CSS variables in OKLCH for light and dark mode, font families (sans, serif, mono), border radius, and shadow configurations. All derived from 13 semantic tokens: 2 backgrounds, 3 UI surfaces, 3 text levels, primary, secondary, and 3 accents.",
  },
  {
    id: "5",
    question: "How does the agent skill work?",
    sub: "AI coding agents can discover and install presets",
    answer:
      "Install the skill with npx skills add Railly/tinte. Agents (Claude Code, Cursor, Windsurf) can then browse themes via the API, install presets, extract themes from images via Ray, and take screenshots for visual verification. The skill documents all available workflows.",
  },
  {
    id: "6",
    question: "What is the Tinte ecosystem?",
    sub: "Tinte + Elements + Ray",
    answer:
      "Tinte generates and compiles design systems. Elements (tryelements.dev) provides 227+ full-stack shadcn components that inherit your Tinte tokens. Ray (ray.tinte.dev) offers code screenshots with any theme and image-to-theme extraction. Together: generate, install, preview.",
  },
  {
    id: "7",
    question: "Is Tinte free?",
    sub: "Open source, free presets, premium features coming",
    answer:
      "Yes. 500+ presets, AI generation, all export formats including shadcn presets and VS Code themes are free. The preset API and skill are free. Premium features like brand-to-preset, private presets, team workspaces, and analytics are coming soon.",
  },
  {
    id: "8",
    question: "Can I extract a theme from an image?",
    sub: "Image-to-preset pipeline via Ray",
    answer:
      "Yes. POST an image to ray.tinte.dev/api/v1/extract-theme to extract a TinteBlock color palette. This can then be used to create a full Tinte preset with all 13 tokens, which compiles to a distributable shadcn preset. No other tool offers this pipeline.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-12 sm:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-left sm:text-center mb-10 sm:mb-16"
        >
          <div className="flex items-center gap-2 sm:justify-center mb-4 sm:mb-6">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <h2 className="text-xl font-medium">Frequently Asked Questions</h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl sm:mx-auto">
            Everything you need to know about Tinte and the design system
            ecosystem.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="1"
          >
            {faqItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <AccordionItem value={item.id} className="py-2">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                      <span className="flex flex-col space-y-1">
                        <span>{item.question}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          {item.sub}
                        </span>
                      </span>
                      <PlusIcon
                        size={16}
                        className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                        aria-hidden="true"
                      />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent className="text-muted-foreground pb-2">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
