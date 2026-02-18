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
    question: "What is Tinte and how does it work?",
    sub: "AI-powered theme generation for modern applications",
    answer:
      "Tinte is an AI-powered theme editor that generates beautiful, consistent themes for your applications. Simply describe your desired aesthetic in natural language, and our AI will create a complete theme with color palettes, component styles, and export options for popular platforms like shadcn/ui and VS Code.",
  },
  {
    id: "2",
    question: "Is Tinte free to use?",
    sub: "Pricing and premium features",
    answer:
      "Yes! Tinte offers a generous free tier that includes basic theme generation, community theme browsing, and standard export formats. We also offer premium plans with advanced features like unlimited generations, priority support, and exclusive AI models.",
  },
  {
    id: "3",
    question: "What platforms and frameworks does Tinte support?",
    sub: "Supported design systems and integrations",
    answer:
      "Currently, Tinte supports shadcn/ui components, VS Code themes, and CSS variables. We're actively working on expanding support to include Tailwind CSS, Material-UI, Chakra UI, and other popular design systems. Check our roadmap for upcoming integrations.",
  },
  {
    id: "4",
    question: "Can I customize themes after they're generated?",
    sub: "Fine-tuning and editing capabilities",
    answer:
      "Absolutely! While our AI creates excellent starting points, you can fine-tune every aspect of your theme. Our visual editor allows you to adjust colors, spacing, typography, and component styles. You can also import existing themes and modify them to match your brand.",
  },
  {
    id: "5",
    question: "How does the community marketplace work?",
    sub: "Sharing and discovering community themes",
    answer:
      "Our community marketplace allows creators to share their themes with others. You can browse, download, and remix themes created by the community. Theme creators can showcase their work, receive feedback, and build their reputation within the Tinte ecosystem.",
  },
  {
    id: "6",
    question: "Can I use Tinte themes in commercial projects?",
    sub: "Licensing and commercial usage rights",
    answer:
      "Yes! All themes generated with Tinte can be used in both personal and commercial projects without attribution requirements. Community themes may have their own licensing terms, which are clearly displayed on each theme's page.",
  },
  {
    id: "7",
    question: "How accurate is the AI theme generation?",
    sub: "Quality and reliability of AI-generated themes",
    answer:
      "Our AI is trained on thousands of high-quality design patterns and color theories. It understands context, brand guidelines, and accessibility requirements to generate themes that not only look great but also provide excellent user experiences. The accuracy continues to improve with each update.",
  },
  {
    id: "8",
    question: "Do you offer API access for developers?",
    sub: "Developer integrations and API availability",
    answer:
      "We're currently developing a comprehensive API that will allow developers to integrate Tinte's theme generation capabilities directly into their applications. This will be available in Q3 2025 as part of our platform integrations initiative.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <h2 className="text-xl font-medium">Frequently Asked Questions</h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Everything you need to know about Tinte. Can't find the answer
            you're looking for? Reach out to our support team.
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
