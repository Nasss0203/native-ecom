// src/components/layout/ScreenLayout.tsx
import React from 'react';
import { ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeInsetsProvider } from '../../context/SafeInsetsContext';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function ScreenLayout({ children, style }: Props) {
  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={[
        { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 4 },
        style,
      ]}
    >
      <SafeInsetsProvider>{children}</SafeInsetsProvider>
    </SafeAreaView>
  );
}
