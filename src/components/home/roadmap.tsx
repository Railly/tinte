"use client";

import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ROADMAP_SECTIONS } from "./constants";

const getCategoryBadge = (category: string) => {
  const badgeStyles = {
    Core: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    Export: "bg-green-500/10 text-green-500 border border-green-500/20",
    Social: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
    Editor: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
    Integration: "bg-pink-500/10 text-pink-500 border border-pink-500/20",
    Browse: "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20",
  };

  return (
    badgeStyles[category as keyof typeof badgeStyles] ||
    "bg-muted text-muted-foreground"
  );
};

export function Roadmap() {
  return (
    <section id="roadmap" className="py-24 bg-muted/20">
      <div className="px-4 max-w-7xl mx-auto">
        <div className="space-y-6 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <h2 className="text-xl font-medium">Roadmap</h2>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Follow here what we are doing now in this project and what we
                will do in the future.
              </p>
              <p className="text-muted-foreground text-sm">
                Follow us on X to stay up to date with updates.
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-2 h-9 text-sm w-full sm:w-auto"
              onClick={() => window.open("https://github.com/Railly/tinte/issues", "_blank")}
            >
              <Plus className="w-4 h-4" />
              Suggest a Feature
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Object.entries(ROADMAP_SECTIONS).map(
            ([sectionTitle, items], sectionIndex) => (
              <motion.div
                key={sectionTitle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold">{sectionTitle}</h3>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: sectionIndex * 0.1 + index * 0.05,
                      }}
                      viewport={{ once: true }}
                      className="bg-background/50 border border-border/50 rounded-lg p-4 hover:border-border/80 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium">{item.title}</h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-md ${getCategoryBadge(item.category)}`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
