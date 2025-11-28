// src/context/SafeInsetsContext.tsx
import React, { createContext, useContext } from 'react';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

const Ctx = createContext<EdgeInsets | null>(null);

export function SafeInsetsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return <Ctx.Provider value={insets}>{children}</Ctx.Provider>;
}

export function useSafeInsets() {
  const v = useContext(Ctx);
  if (!v)
    throw new Error('useSafeInsets must be used within SafeInsetsProvider');
  return v;
}
