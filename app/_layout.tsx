
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { View } from 'react-native';
// import 'react-native-reanimated';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       setIsAuthenticated(!!token);
//     } catch (error) {
//       console.error('Auth check error:', error);
//       setIsAuthenticated(false);
//     }
//   };

//   if (!loaded || isAuthenticated === null) {
//     return null; // Or a loading screen
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
//         <StatusBar style="auto" />
//         <Stack>
//           <Stack.Screen 
//             name="index" 
//             options={{ headerShown: false }} 
//           />
//           <Stack.Screen 
//             name="Splash" 
//             options={{ headerShown: false }} 
//           />
//           <Stack.Screen 
//             name="LoginScreen" 
//             options={{ headerShown: false }} 
//           />
//           <Stack.Screen 
//             name="CalculatorScreen" 
//             options={{ headerShown: false }} 
//           />
//           <Stack.Screen
//             name="Additional_user_inputs"
//             options={{headerShown: false}}
//           />
//           <Stack.Screen 
//             name="+not-found" 
//             options={{ headerShown: false }} 
//           />
//         </Stack>
//       </View>
//     </ThemeProvider>
//   );
// }


import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { checkAppExpiry } from '@/utils/appExpiry';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isExpired, setIsExpired] = useState<boolean | null>(null);

  useEffect(() => {
    const expired = checkAppExpiry();

    setIsExpired(expired);

    if (!expired) {
      checkAuthStatus();
    }
  }, []);

  // ==========================================
  // CHECK AUTHENTICATION
  // ==========================================
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Auth check error:', error);

      setIsAuthenticated(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (!loaded || isExpired === null) {
    return null;
  }

  if (!isExpired && isAuthenticated === null) {
    return null;
  }

  // ==========================================
  // APP EXPIRED
  // ==========================================
  if (isExpired) {
    return (
      <View style={styles.expiredContainer}>
        <Text style={styles.expiredTitle}>
          Access to this app is expired.
        </Text>

        <Text style={styles.expiredMessage}>
          This application is no longer available.
        </Text>

        <Text style={styles.expiredMessage}>
          Please contact the administrator.
        </Text>
      </View>
    );
  }

  // ==========================================
  // NORMAL APP
  // ==========================================
  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <View
        style={{
          flex: 1,
          backgroundColor:
            colorScheme === 'dark' ? '#000' : '#fff',
        }}
      >
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
            options={{ headerShown: false }}
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

const styles = StyleSheet.create({
  expiredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },

  expiredTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  expiredMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
});