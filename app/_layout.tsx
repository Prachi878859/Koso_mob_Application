// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { View } from 'react-native';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   if (!loaded) {
//     // Async font loading only occurs in development.
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
//       <Stack>
//         <Stack.Screen name="Splash" options={{ headerShown: false }} />

//          <Stack.Screen name="index" options={{ headerShown: false }} />
//         {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
//         <Stack.Screen name="+not-found" options={{headerShown:false}} />
//       </Stack>

//       <StatusBar style="auto" />
//       </View>
//     </ThemeProvider>
//   );
// }


import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  if (!loaded || isAuthenticated === null) {
    return null; // Or a loading screen
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Splash" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="LoginScreen" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="CalculatorScreen" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="Additional_user_inputs"
            options={{headerShown: false}}
          />
          <Stack.Screen 
            name="+not-found" 
            options={{ headerShown: false }} 
          />
        </Stack>
      </View>
    </ThemeProvider>
  );
}