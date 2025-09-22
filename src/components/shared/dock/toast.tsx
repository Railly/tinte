"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Info, Loader } from "lucide-react"
import SaveButton from "./save-button"

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="text-green-500">
    <title>circle-check-3</title>
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor">
      <circle cx="9" cy="9" r="7.25"></circle>
      <path d="M5.5,9c.863,.867,1.537,1.868,2.1,2.962,1.307-2.491,2.94-4.466,4.9-5.923"></path>
    </g>
  </svg>
)

interface ToastProps {
  onReset?: () => void
  onSave?: () => void
  hasChanges: boolean
  canSave: boolean
  unsavedChanges: boolean
  isSaving: boolean
}

const saveStates = {
  initial: {
    icon: <Info className="w-[18px] h-[18px] text-white" />,
    text: "Unsaved changes",
  },
  loading: {
    icon: <Loader className="w-[15px] h-[15px] animate-spin text-white" />,
    text: "Saving",
  },
  success: {
    icon: <CheckIcon />,
    text: "Changes Saved",
  },
}

export function Toast({
  onReset,
  onSave,
  hasChanges,
  canSave,
  unsavedChanges,
  isSaving
}: ToastProps) {
  const [state, setState] = React.useState<"initial" | "loading" | "success">("initial")

  // Manejar los estados basado en las props
  React.useEffect(() => {
    if (isSaving) {
      setState("loading")
    } else if (hasChanges) {
      setState("initial")
    }
  }, [isSaving, hasChanges])

  const currentState = saveStates[state]

  const handleSave = () => {
    if (onSave && canSave && hasChanges) {
      setState("loading")
      onSave()

      // Simular éxito después de un tiempo
      setTimeout(() => {
        setState("success")
        setTimeout(() => {
          setState("initial")
        }, 2000)
      }, 1000)
    }
  }

  // Solo mostrar cuando hay cambios reales o se está guardando/éxito
  // Si hasChanges es false, ignoramos unsavedChanges porque puede estar desincronizado
  const shouldShow = hasChanges || isSaving || state === "loading" || state === "success"

  // Debug - remover después
  React.useEffect(() => {
    console.log('Toast state:', { hasChanges, unsavedChanges, isSaving, state, shouldShow })
  }, [hasChanges, unsavedChanges, isSaving, state, shouldShow])

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-4"
        >
          <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 flex items-center gap-3 shadow-lg">
            <motion.div
              className="flex items-center gap-2"
              layout
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={state}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                  >
                    {currentState.icon}
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={state}
                    className="text-white font-medium text-sm whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentState.text}
                  </motion.span>
                </AnimatePresence>

                <AnimatePresence>
                  {state === "initial" && hasChanges && (
                    <motion.div
                      className="inline-flex items-center gap-2 pl-0 pr-px py-0"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <Button
                        variant="ghost"
                        className="h-7 px-3 text-[13px] text-white hover:bg-white/10 hover:text-white rounded-[99px] transition-colors duration-200"
                        onClick={onReset}
                        disabled={!hasChanges}
                      >
                        Reset
                      </Button>
                      <SaveButton onClick={handleSave} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}