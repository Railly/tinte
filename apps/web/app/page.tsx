"use client";
import React from "react";
import { motion } from "framer-motion";
import { GeneralHeader } from "@/components/general-header";
import { DynamicAccentTitle } from "@/components/dynamic-accent-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconVSCode,
  IconShadcn,
  IconNeovim,
  IconJetBrains,
  IconGithub,
} from "@/components/ui/icons";
import { useThemeApplier } from "@/lib/hooks/use-theme-applier";
import { Badge } from "@/components/ui/badge";
import { Footer } from "./(providers)/shadcn/components/footer";
import AnimatedIconTinte from "@/components/logo-3d";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SubscriptionForm } from "@/components/subscription-form";

interface PlatformCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  comingSoon?: boolean;
  href?: string;
  newFeature?: boolean;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  icon: Icon,
  name,
  comingSoon = false,
  href,
  newFeature = false,
}) => {
  const cardAnimation = {
    initial: { rotate: 0, filter: "brightness(100%)" },
    animate: {
      rotate: [0, 2, 0],
      filter: ["brightness(100%)", "brightness(110%)", "brightness(100%)"],
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const CardContentWrapper = (
    <Card className="w-32 h-32 flex flex-col items-center justify-center relative overflow-hidden">
      <CardContent className="p-4 flex flex-col items-center">
        <Icon className={cn("w-16 h-16 mb-2", comingSoon && "grayscale")} />
        <span className="text-sm font-medium text-center">{name}</span>
      </CardContent>
      {comingSoon && (
        <Badge
          variant="outline"
          className="absolute top-2 left-2 text-xs bg-muted"
        >
          Soon
        </Badge>
      )}
      {newFeature && (
        <Badge
          variant="default"
          className="absolute top-2 left-2 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          New
        </Badge>
      )}
    </Card>
  );

  const MotionWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div initial="initial" whileHover="animate" variants={cardAnimation}>
      {children}
    </motion.div>
  );

  if (comingSoon || !href) {
    return <MotionWrapper>{CardContentWrapper}</MotionWrapper>;
  }

  return (
    <Link href={href} passHref>
      <MotionWrapper>{CardContentWrapper}</MotionWrapper>
    </Link>
  );
};

const LandingPage: React.FC = () => {
  const { currentChartTheme } = useThemeApplier();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GeneralHeader />

      <main className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-76px)] pb-24 md:pb-48">
        <AnimatedIconTinte />
        <div className="max-w-4xl mx-auto text-center">
          <DynamicAccentTitle
            theme={currentChartTheme}
            isTextareaFocused={false}
            words={["Create", "Customize", "Share"]}
            accentColors={["chart-1", "chart-2", "chart-3"]}
            intervalDuration={2000}
            subtitle="stunning themes across multiple platforms"
          />

          <motion.p
            className="mt-6 text-md md:text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Elevate your coding experience with Tinte's powerful theming
            capabilities
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <PlatformCard icon={IconVSCode} name="VS Code" href="/vscode" />
            <PlatformCard
              icon={IconShadcn}
              name="shadcn/ui"
              href="/shadcn"
              newFeature
            />
            <PlatformCard icon={IconNeovim} name="Neovim" comingSoon />
            <PlatformCard icon={IconJetBrains} name="JetBrains" comingSoon />
          </motion.div>

          <motion.div
            className="mt-16 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-4">
              Stay Updated & Contribute
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg">
              Be the first to know about new features, themes, and when new
              providers become available. Your input shapes the future of Tinte!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SubscriptionForm />
              <Button
                variant="outline"
                size="lg"
                className="flex w-full items-center gap-2"
                asChild
              >
                <Link
                  href="https://github.com/Railly/tinte/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconGithub className="w-5 h-5" />
                  Suggest Feature
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
