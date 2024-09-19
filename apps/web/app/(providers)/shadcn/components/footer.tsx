"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconTinte, IconGithub, IconTwitter } from "@/components/ui/icons";
import { SubscriptionForm } from "@/components/subscription-form";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background border-t"
    >
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <IconTinte className="h-6 w-6" />
              <span className="text-xl font-bold">Tinte</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Create beautiful themes with ease. Customize your development
              environment in style.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Theme Generators</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/vscode" className="text-sm hover:underline">
                  VS Code Themes
                </Link>
              </li>
              <li>
                <Link href="/shadcn" className="text-sm hover:underline">
                  Shadcn UI Themes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Railly/tinte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  Contribute on GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <SubscriptionForm />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tinte. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <motion.a
              href="https://github.com/Railly/tinte"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconGithub className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="https://x.com/raillyhugo"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconTwitter className="h-5 w-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
