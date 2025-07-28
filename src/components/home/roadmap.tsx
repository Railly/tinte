'use client';

import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const roadmapSections = {
  'Being Worked On 🔥': [
    {
      id: '1',
      title: 'AI Theme Generator',
      description: 'Generate beautiful themes using AI prompts with advanced color theory',
      status: 'in-progress' as const,
      category: 'Core'
    },
    {
      id: '2', 
      title: 'shadcn/ui Export',
      description: 'Export themes directly as shadcn/ui compatible CSS variables',
      status: 'in-progress' as const,
      category: 'Export'
    }
  ],
  'Planned 📋': [
    {
      id: '3',
      title: 'VS Code Theme Export',
      description: 'Generate and export complete VS Code editor themes',
      status: 'planned' as const,
      category: 'Export'
    },
    {
      id: '4',
      title: 'Community Marketplace',
      description: 'Browse and share themes created by the community',
      status: 'planned' as const,
      category: 'Social'
    },
    {
      id: '5',
      title: 'Real-time Preview',
      description: 'Live preview of theme changes across multiple components',
      status: 'planned' as const,
      category: 'Editor'
    },
    {
      id: '6',
      title: 'Figma Integration',
      description: 'Import color palettes directly from Figma design files',
      status: 'planned' as const,
      category: 'Integration'
    }
  ],
  'Completed 🎉': [
    {
      id: '7',
      title: 'Color Palette Generation',
      description: 'Generate harmonious color palettes with accessibility checks',
      status: 'completed' as const,
      category: 'Core'
    },
    {
      id: '8',
      title: 'Theme Browsing',
      description: 'Browse and preview community themes in grid and table views',
      status: 'completed' as const,
      category: 'Browse'
    }
  ]
};

const getCategoryBadge = (category: string) => {
  const badgeStyles = {
    'Core': 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    'Export': 'bg-green-500/10 text-green-500 border border-green-500/20', 
    'Social': 'bg-purple-500/10 text-purple-500 border border-purple-500/20',
    'Editor': 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    'Integration': 'bg-pink-500/10 text-pink-500 border border-pink-500/20',
    'Browse': 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'
  };
  
  return badgeStyles[category as keyof typeof badgeStyles] || 'bg-muted text-muted-foreground';
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
                Follow here what we are doing now in this project and what we will do in the future.
              </p>
              <p className="text-muted-foreground text-sm">
                Follow us on X to stay up to date with updates.
              </p>
            </div>
            <Button variant="outline" className="gap-2 h-9 text-sm w-full sm:w-auto" onClick={() => console.log('Suggest feature')}>
              <Plus className="w-4 h-4" />
              Suggest a Feature
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Object.entries(roadmapSections).map(([sectionTitle, items], sectionIndex) => (
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
                    transition={{ duration: 0.4, delay: (sectionIndex * 0.1) + (index * 0.05) }}
                    viewport={{ once: true }}
                    className="bg-background/50 border border-border/50 rounded-lg p-4 hover:border-border/80 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium">{item.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-md ${getCategoryBadge(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}