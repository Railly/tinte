// Base dock components (MacDock/Dock for general use)
export { MacDock, DockIcon, dockVariants, MacDock as Dock } from "./base-dock";

// Workbench-specific dock
export { Dock as WorkbenchDock } from "./workbench-dock";

// Dock sections
export { DockMain } from "./dock-main";
export { DockExport } from "./dock-export";
export { DockMore } from "./dock-more";

// Supporting components
export { InstallGuideModal } from "./install-guide-modal";
export { SuccessAnimation } from "./success-animation";