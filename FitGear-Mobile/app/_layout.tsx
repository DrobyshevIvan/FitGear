import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ProductProvider } from './context/ProductContext';
import { ReviewProvider } from './context/ReviewContext';

export default function RootLayout() {
  const [showWelcome, setShowWelcome] = useState(true);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'nunito': require('./../assets/fonts/Nunito-Regular.ttf'),
    'nunito-medium': require('./../assets/fonts/Nunito-Medium.ttf'),
    'nunito-bold': require('./../assets/fonts/Nunito-Bold.ttf'),
    'nunito-extrabold': require('./../assets/fonts/Nunito-ExtraBold.ttf')
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <ProductProvider>
          <BookingProvider>
            <ReviewProvider>
          <Stack>
            {showWelcome ? (
              <Stack.Screen name='(auth)/entrancepage' options={{ headerShown: false }} />) : (
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />)}
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name='(auth)/authentication' options={{ headerShown: false }} />
            <Stack.Screen name='(auth)/register' options={{ headerShown: false }} />
            <Stack.Screen name='usermenu/editprofilescreen' options={{ headerShown: false }} />
            <Stack.Screen name='forbookings/announcementdetail' options={{headerShown: false}}/>
            <Stack.Screen name='forbookings/bookingscreen' options={{headerShown: false}}/>
            <Stack.Screen name='forbookings/paymentscreen' options={{headerShown: false}}/>
            <Stack.Screen name='usermenu/bookinghistoryscreen' options={{ headerShown: false }} />
            <Stack.Screen name='forbookings/reviewlistscreen' options={{headerShown: false}}/>
          </Stack>
          <StatusBar style="auto" />
          </ReviewProvider>
          </BookingProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
