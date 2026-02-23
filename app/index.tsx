import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Always navigate to Splash screen first
    setTimeout(() => {
      router.replace('/Splash');
      setIsLoading(false);
    }, 500); // Small delay for smooth transition
  }, []);

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#000' 
      }}>
        <ActivityIndicator size="large" color="#FF4D57" />
      </View>
    );
  }

  return null;
}