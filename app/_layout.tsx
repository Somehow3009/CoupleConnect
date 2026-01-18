import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="chat/[id]" options={{ headerShown: true, title: 'Chat' }} />
            <Stack.Screen 
              name="chat/customize/[id]" 
              options={{ 
                headerShown: false,
                presentation: 'modal' 
              }} 
            />
            <Stack.Screen 
              name="theme-settings" 
              options={{ 
                headerShown: false,
                presentation: 'modal' 
              }} 
            />
          </Stack>
        </SafeAreaProvider>
      </ThemeProvider>
    </AlertProvider>
  );
}
