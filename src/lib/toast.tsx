'use client';

import { useToast } from 'reshaped';
import { CheckCircle, Warning, Info } from 'phosphor-react';

export interface ToastOptions {
  timeout?: number | 'short' | 'long';
}

export function useAppToast() {
  const toast = useToast();

  const showSuccess = (text: string, options?: ToastOptions) => {
    toast.show({
      text,
      icon: CheckCircle,
      color: 'positive',
      timeout: options?.timeout || 4000,
    });
  };

  const showError = (text: string, options?: ToastOptions) => {
    toast.show({
      text,
      icon: Warning,
      color: 'critical',
      timeout: options?.timeout || 'long',
    });
  };

  const showInfo = (text: string, options?: ToastOptions) => {
    toast.show({
      text,
      icon: Info,
      color: 'neutral',
      timeout: options?.timeout || 'short',
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
}