'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorAlertProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

export function ErrorAlert({ message, className, onDismiss }: ErrorAlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <p className="text-sm font-medium">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto text-destructive/70 hover:text-destructive"
          >
            <span className="sr-only">Dismiss</span>
            ×
          </button>
        )}
      </div>
    </div>
  );
} 