'use client';

import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessAlertProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

export function SuccessAlert({ message, className, onDismiss }: SuccessAlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-green-500',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4" />
        <p className="text-sm font-medium">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto text-green-500/70 hover:text-green-500"
          >
            <span className="sr-only">Dismiss</span>
            ×
          </button>
        )}
      </div>
    </div>
  );
} 