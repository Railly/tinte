import React, { memo, lazy, Suspense, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ThemeMode, ThemeDensity } from '@/lib/providers/types';
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ComponentWrapper } from './demos/component-wrapper';

// Lazy load all demo components
const AccordionDemo = lazy(() => import('./demos/accordion-demo').then(m => ({ default: m.AccordionDemo })));
const AlertDemo = lazy(() => import('./demos/alert-demo').then(m => ({ default: m.AlertDemo })));
const AlertDialogDemo = lazy(() => import('./demos/alert-dialog-demo').then(m => ({ default: m.AlertDialogDemo })));
const AppSidebar = lazy(() => import('./demos/app-sidebar').then(m => ({ default: m.AppSidebar })));
const AspectRatioDemo = lazy(() => import('./demos/aspect-ratio-demo').then(m => ({ default: m.AspectRatioDemo })));
const AvatarDemo = lazy(() => import('./demos/avatar-demo').then(m => ({ default: m.AvatarDemo })));
const BadgeDemo = lazy(() => import('./demos/badge-demo').then(m => ({ default: m.BadgeDemo })));
const BreadcrumbDemo = lazy(() => import('./demos/breadcrumb-demo').then(m => ({ default: m.BreadcrumbDemo })));
const ButtonDemo = lazy(() => import('./demos/button-demo').then(m => ({ default: m.ButtonDemo })));
const CalendarDemo = lazy(() => import('./demos/calendar-demo').then(m => ({ default: m.CalendarDemo })));
const CardDemo = lazy(() => import('./demos/card-demo').then(m => ({ default: m.CardDemo })));
const CarouselDemo = lazy(() => import('./demos/carousel-demo').then(m => ({ default: m.CarouselDemo })));
const ChartDemo = lazy(() => import('./demos/chart-demo').then(m => ({ default: m.ChartDemo })));
const CheckboxDemo = lazy(() => import('./demos/checkbox-demo').then(m => ({ default: m.CheckboxDemo })));
const CollapsibleDemo = lazy(() => import('./demos/collapsible-demo').then(m => ({ default: m.CollapsibleDemo })));
const ComboboxDemo = lazy(() => import('./demos/combobox-demo').then(m => ({ default: m.ComboboxDemo })));
const CommandDemo = lazy(() => import('./demos/command-demo').then(m => ({ default: m.CommandDemo })));
const ContextMenuDemo = lazy(() => import('./demos/context-menu-demo').then(m => ({ default: m.ContextMenuDemo })));
const DatePickerDemo = lazy(() => import('./demos/date-picker-demo').then(m => ({ default: m.DatePickerDemo })));
const DialogDemo = lazy(() => import('./demos/dialog-demo').then(m => ({ default: m.DialogDemo })));
const DrawerDemo = lazy(() => import('./demos/drawer-demo').then(m => ({ default: m.DrawerDemo })));
const DropdownMenuDemo = lazy(() => import('./demos/dropdown-menu-demo').then(m => ({ default: m.DropdownMenuDemo })));
const FormDemo = lazy(() => import('./demos/form-demo').then(m => ({ default: m.FormDemo })));
const HoverCardDemo = lazy(() => import('./demos/hover-card-demo').then(m => ({ default: m.HoverCardDemo })));
const InputDemo = lazy(() => import('./demos/input-demo').then(m => ({ default: m.InputDemo })));
const InputOTPDemo = lazy(() => import('./demos/input-otp-demo').then(m => ({ default: m.InputOTPDemo })));
const LabelDemo = lazy(() => import('./demos/label-demo').then(m => ({ default: m.LabelDemo })));
const MenubarDemo = lazy(() => import('./demos/menubar-demo').then(m => ({ default: m.MenubarDemo })));
const NavigationMenuDemo = lazy(() => import('./demos/navigation-menu-demo').then(m => ({ default: m.NavigationMenuDemo })));
const PaginationDemo = lazy(() => import('./demos/pagination-demo').then(m => ({ default: m.PaginationDemo })));
const PopoverDemo = lazy(() => import('./demos/popover-demo').then(m => ({ default: m.PopoverDemo })));
const ProgressDemo = lazy(() => import('./demos/progress-demo').then(m => ({ default: m.ProgressDemo })));
const RadioGroupDemo = lazy(() => import('./demos/radio-group-demo').then(m => ({ default: m.RadioGroupDemo })));
const ResizableDemo = lazy(() => import('./demos/resizable-demo').then(m => ({ default: m.ResizableDemo })));
const ScrollAreaDemo = lazy(() => import('./demos/scroll-area-demo').then(m => ({ default: m.ScrollAreaDemo })));
const SelectDemo = lazy(() => import('./demos/select-demo').then(m => ({ default: m.SelectDemo })));
const SeparatorDemo = lazy(() => import('./demos/separator-demo').then(m => ({ default: m.SeparatorDemo })));
const SheetDemo = lazy(() => import('./demos/sheet-demo').then(m => ({ default: m.SheetDemo })));
const SkeletonDemo = lazy(() => import('./demos/skeleton-demo').then(m => ({ default: m.SkeletonDemo })));
const SliderDemo = lazy(() => import('./demos/slider-demo').then(m => ({ default: m.SliderDemo })));
const SonnerDemo = lazy(() => import('./demos/sonner-demo').then(m => ({ default: m.SonnerDemo })));
const SwitchDemo = lazy(() => import('./demos/switch-demo').then(m => ({ default: m.SwitchDemo })));
const TableDemo = lazy(() => import('./demos/table-demo').then(m => ({ default: m.TableDemo })));
const TabsDemo = lazy(() => import('./demos/tabs-demo').then(m => ({ default: m.TabsDemo })));
const TextareaDemo = lazy(() => import('./demos/textarea-demo').then(m => ({ default: m.TextareaDemo })));
const ToggleDemo = lazy(() => import('./demos/toggle-demo').then(m => ({ default: m.ToggleDemo })));
const ToggleGroupDemo = lazy(() => import('./demos/toggle-group-demo').then(m => ({ default: m.ToggleGroupDemo })));
const TooltipDemo = lazy(() => import('./demos/tooltip-demo').then(m => ({ default: m.TooltipDemo })));

// Loading component for Suspense fallback
const ComponentLoader = memo(() => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
));

ComponentLoader.displayName = 'ComponentLoader';

// Intersection Observer Hook
const useIntersectionObserver = (callback: () => void, options: IntersectionObserverInit = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callbackRef.current();
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [options]);

  return ref;
};

// Performance monitoring hook
const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const loadTime = Date.now() - startTime.current;
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${componentName} loaded in ${loadTime}ms`);
    }
  }, [componentName]);
};

// Enhanced Lazy Component Wrapper with performance monitoring
interface LazyComponentProps {
  name: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  className?: string;
}

const LazyComponent = memo<LazyComponentProps>(({ name, component: Component, className }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasError, setHasError] = useState(false);

  usePerformanceMonitor(name);

  const intersectionRef = useIntersectionObserver(() => {
    setShouldLoad(true);
  }, { rootMargin: '100px' });

  const handleLoad = useCallback(() => {
    // Component loaded successfully
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <ComponentWrapper name={name}>
        <div className="flex items-center justify-center p-8 text-red-500">
          <div className="text-sm">Failed to load {name}</div>
        </div>
      </ComponentWrapper>
    );
  }

  return (
    <div ref={intersectionRef} className={className}>
      {shouldLoad ? (
        <ComponentWrapper name={name}>
          <Suspense fallback={<ComponentLoader />}>
            <ErrorBoundary onError={handleError}>
              <Component onLoad={handleLoad} />
            </ErrorBoundary>
          </Suspense>
        </ComponentWrapper>
      ) : (
        <ComponentWrapper name={name}>
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/20 animate-pulse"></div>
          </div>
        </ComponentWrapper>
      )}
    </div>
  );
});

// Simple Error Boundary for lazy components
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError();
    if (process.env.NODE_ENV === 'development') {
      console.error('Lazy component error:', error);
    }
  }

  render() {
    if (this.state.hasError) {
      return null; // Let parent handle the error display
    }

    return this.props.children;
  }
}

LazyComponent.displayName = 'LazyComponent';

interface KitchenSinkProps {
  mode: ThemeMode;
  density: ThemeDensity;
}

// Component definitions for easy mapping
const componentDefinitions: Array<{
  name: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  className?: string;
}> = [
    { name: 'accordion', component: AccordionDemo },
    { name: 'alert', component: AlertDemo },
    { name: 'alert-dialog', component: AlertDialogDemo },
    { name: 'aspect-ratio', component: AspectRatioDemo },
    { name: 'avatar', component: AvatarDemo },
    { name: 'badge', component: BadgeDemo },
    { name: 'breadcrumb', component: BreadcrumbDemo },
    { name: 'button', component: ButtonDemo },
    { name: 'calendar', component: CalendarDemo },
    { name: 'card', component: CardDemo },
    { name: 'carousel', component: CarouselDemo },
    { name: 'chart', component: ChartDemo, className: 'w-full' },
    { name: 'checkbox', component: CheckboxDemo },
    { name: 'collapsible', component: CollapsibleDemo },
    { name: 'combobox', component: ComboboxDemo },
    { name: 'command', component: CommandDemo },
    { name: 'context-menu', component: ContextMenuDemo },
    { name: 'date-picker', component: DatePickerDemo },
    { name: 'dialog', component: DialogDemo },
    { name: 'drawer', component: DrawerDemo },
    { name: 'dropdown-menu', component: DropdownMenuDemo },
    { name: 'form', component: FormDemo },
    { name: 'hover-card', component: HoverCardDemo },
    { name: 'input', component: InputDemo },
    { name: 'input-otp', component: InputOTPDemo },
    { name: 'label', component: LabelDemo },
    { name: 'menubar', component: MenubarDemo },
    { name: 'navigation-menu', component: NavigationMenuDemo },
    { name: 'pagination', component: PaginationDemo },
    { name: 'popover', component: PopoverDemo },
    { name: 'progress', component: ProgressDemo },
    { name: 'radio-group', component: RadioGroupDemo },
    { name: 'resizable', component: ResizableDemo },
    { name: 'scroll-area', component: ScrollAreaDemo },
    { name: 'select', component: SelectDemo },
    { name: 'separator', component: SeparatorDemo },
    { name: 'sheet', component: SheetDemo },
    { name: 'skeleton', component: SkeletonDemo },
    { name: 'slider', component: SliderDemo },
    { name: 'sonner', component: SonnerDemo },
    { name: 'switch', component: SwitchDemo },
    { name: 'table', component: TableDemo },
    { name: 'tabs', component: TabsDemo },
    { name: 'textarea', component: TextareaDemo },
    { name: 'toggle', component: ToggleDemo },
    { name: 'toggle-group', component: ToggleGroupDemo },
    { name: 'tooltip', component: TooltipDemo },
  ];

export const KitchenSink = memo<KitchenSinkProps>(({ mode, density }) => {
  // Memoize the component definitions to prevent unnecessary re-renders
  const memoizedComponentDefinitions = useMemo(() => componentDefinitions, []);
  return (
    <div className="w-full h-[600px] relative isolate" style={{ contain: 'layout style' }}>
      <SidebarProvider defaultOpen={false} className="theme-container w-full h-full">
        <Suspense fallback={<ComponentLoader />}>
          <AppSidebar />
        </Suspense>
        <SidebarInset className="w-full h-full overflow-y-auto">
          <header className="bg-background sticky top-0 z-10 flex h-14 items-center border-b p-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-4 ml-2 !h-4" />
            <h1 className="text-base font-medium">shadcn/ui Components</h1>
          </header>
          <div className={`@container grid flex-1 gap-4 p-4 ${density === 'compact' ? 'text-sm [&_*]:py-1 [&_input]:h-8' : ''}`}>
            {memoizedComponentDefinitions.map(({ name, component, className }) => (
              <LazyComponent
                key={name}
                name={name}
                component={component}
                className={className}
              />
            ))}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
});

KitchenSink.displayName = 'KitchenSink';