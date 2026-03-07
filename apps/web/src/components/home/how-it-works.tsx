"use client";

import { Eye, Sparkles, Terminal } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    icon: Sparkles,
    title: "Create",
    description:
      "Generate a complete design system with AI. Describe your brand, pick colors, or start from 500+ community presets.",
  },
  {
    icon: Eye,
    title: "Preview",
    description:
      "See your preset applied to real shadcn/ui components in real-time. Tweak colors, fonts, radius, and shadows until it's perfect.",
  },
  {
    icon: Terminal,
    title: "Install",
    description:
      "One command to apply your entire design system. Works with shadcn CLI v4's --preset flag out of the box.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-xl font-medium mb-3">How It Works</h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            From idea to production design system in under a minute.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-medium">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
