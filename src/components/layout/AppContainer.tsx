'use client';

import { View } from 'reshaped';
import { CSSProperties, ReactNode } from 'react';

type AppContainerProps = {
  children: ReactNode;
  maxWidth?: number;
  padding?: number;
};

export function AppContainer({ children, maxWidth = 1200, padding = 4 }: AppContainerProps) {
  return (
    <View 
      width="100%" 
      attributes={{
        style: {
          maxWidth: `${maxWidth}px`,
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: `${padding * 4}px`
        } as CSSProperties
      }}
    >
      {children}
    </View>
  );
} 