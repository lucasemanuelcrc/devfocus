'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

// O Provider deve envolver toda a aplicação (vamos colocar no layout)
export const TooltipProvider = TooltipPrimitive.Provider;

// O "gatilho" é o elemento que o usuário passa o mouse
export const TooltipTrigger = TooltipPrimitive.Trigger;

// O conteúdo do tooltip em si (a caixinha preta)
export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  // Portal garante que o tooltip fique por cima de tudo (z-index alto)
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        // Estilos do Tailwind para o Tooltip
        'z-50 overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border border-slate-800',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Um componente Helper simples para facilitar o uso
interface SimpleTooltipProps {
    children: React.ReactNode;
    content: string;
    side?: "top" | "right" | "bottom" | "left";
}

export function SimpleTooltip({ children, content, side = "top" }: SimpleTooltipProps) {
  return (
    <TooltipPrimitive.Root delayDuration={300}> {/* Delay de 300ms para não piscar */}
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side}>
        {content}
      </TooltipContent>
    </TooltipPrimitive.Root>
  )
}