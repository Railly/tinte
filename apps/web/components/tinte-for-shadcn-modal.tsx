"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const steps = [
  {
    title: "Introducing Tinte for Shadcn",
    description:
      "Create beautiful themes for your Shadcn UI projects with ease!",
    image: "/tinte-1.png",
  },
  {
    title: "Customize with Precision",
    description:
      "Fine-tune every aspect of your theme to match your brand perfectly.",
    image: "/tinte-2.png",
  },
  {
    title: "Easy Installation Coming Soon!",
    description:
      "You'll be able to install your own theme using the Shadcn CLI!.",
    extraContent: (
      <div className="mt-4 p-4 bg-secondary rounded-md text-left">
        <pre className="text-sm font-bold text-secondary-foreground font-mono break-all">
          npx shadcn add https://tinte.dev/t/theme.json
        </pre>
      </div>
    ),
  },
];

export function TinteForShadcnModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenModal = document.cookie.includes(
      "hasSeenTinteForShadcnModal=true",
    );
    if (hasSeenModal) {
      setIsOpen(false);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    document.cookie =
      "hasSeenTinteForShadcnModal=true; path=/; max-age=31536000";
  };

  const handleNextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handlePreviousStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleStepClick = (index: number) => setCurrentStep(index);

  const currentStepData = steps[currentStep];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] flex flex-col items-center text-center p-6">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {currentStepData?.image && (
          <div className="overflow-hidden mb-2">
            <img
              src={currentStepData?.image || "/placeholder.svg"}
              alt="Step illustration"
              width={430}
            />
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {currentStepData?.title}
          </DialogTitle>
          <DialogDescription className="text-md mt-2">
            {currentStepData?.description}
          </DialogDescription>
        </DialogHeader>

        {currentStepData?.extraContent}

        <div className="flex space-x-2 my-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentStep
                  ? "bg-primary"
                  : "bg-muted hover:bg-accent"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex space-x-4 mt-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePreviousStep}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNextStep}>Next</Button>
          ) : (
            <Link href="/shadcn" passHref>
              <Button onClick={handleClose}>Let's go!</Button>
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
