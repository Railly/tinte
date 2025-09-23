"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { motion } from "motion/react";
import { Loader2, Sparkles, Palette } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/home/header";
import { useThemeContext } from "@/providers/theme";
import { useThemeSlugRedirect } from "@/hooks/use-theme-slug-redirect";

interface WorkbenchPromptGeneratorProps {
  prompt: string;
}

export function WorkbenchPromptGenerator({ prompt }: WorkbenchPromptGeneratorProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [chatId] = useState(() => nanoid());
  const { tinteTheme, currentMode, fonts, radius, shadows } = useThemeContext();

  // Real AI chat integration
  const { messages, sendMessage, status: chatStatus } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        currentTheme: {
          tinteTheme,
          currentMode,
          fonts,
          radius,
          shadows,
        },
      },
    }),
  });

  // Use the real slug redirect hook
  useThemeSlugRedirect({
    chatId,
    enabled: true,
    messages,
  });

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (hasStarted) return; // Prevent multiple starts

    let statusTimeout: NodeJS.Timeout;

    const startGeneration = async () => {
      setHasStarted(true);

      // Start real AI generation
      console.log("🚀 Starting real AI theme generation with prompt:", prompt);

      // Send the prompt to AI
      sendMessage({
        text: prompt.trim(),
      });

      // Show progress steps while AI is working
      const steps = [
        { progress: 20, status: "Analyzing prompt...", delay: 500 },
        { progress: 40, status: "Generating color palette...", delay: 1200 },
        { progress: 60, status: "Creating theme variations...", delay: 1500 },
        { progress: 80, status: "Optimizing for accessibility...", delay: 1000 },
      ];

      for (const step of steps) {
        await new Promise(resolve => {
          statusTimeout = setTimeout(() => {
            setStatus(step.status);
            setProgress(step.progress);
            resolve(void 0);
          }, step.delay);
        });

        // Break early if AI has completed
        if (chatStatus === "ready") break;
      }
    };

    startGeneration();

    return () => {
      if (statusTimeout) clearTimeout(statusTimeout);
    };
  }, []); // Empty dependency array - only run once

  // Monitor for AI completion and theme generation
  useEffect(() => {
    // Check if AI has generated a theme
    const generatedThemeMessage = messages.find(message =>
      message.role === "assistant" &&
      message.parts.some(part =>
        part.type === "tool-generateTheme" &&
        part.state === "output-available"
      )
    );

    if (generatedThemeMessage) {
      const themePart = generatedThemeMessage.parts.find(part =>
        part.type === "tool-generateTheme" &&
        part.state === "output-available"
      );

      if (themePart && themePart.output?.slug) {
        setProgress(100);
        setStatus("Theme generated successfully!");
        console.log("✅ AI theme generation completed, redirecting to slug:", themePart.output.slug);

        // Redirect to the generated theme slug
        setTimeout(() => {
          router.push(`/workbench/${themePart.output.slug}`);
        }, 1000);
      }
    }
  }, [messages, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </motion.div>
              </motion.div>

              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Generating Theme
                </CardTitle>
                <CardDescription className="text-base">
                  Creating your custom theme from prompt
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Prompt Display */}
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-start gap-3">
                  <Palette className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Your Prompt</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "{prompt}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Progress</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>

                <Progress value={progress} className="h-2" />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-4 h-4" />
                  </motion.div>
                  <span>{status}</span>
                </div>
              </div>

              {/* Cancel option */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/workbench')}
                >
                  Cancel Generation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-6 text-sm text-muted-foreground"
          >
            This usually takes 3-5 seconds. Your theme will be ready soon!
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}