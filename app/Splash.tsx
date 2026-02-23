// import { useEffect } from "react";
// import { useRouter } from "expo-router";
// import {
//   ImageBackground,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function Splash() {
//   const router = useRouter();

//   useEffect(() => {
//     // Check if user is already authenticated
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       if (token) {
//         // If already authenticated, navigate to CalculatorScreen
//         setTimeout(() => {
//           router.replace('/CalculatorScreen');
//         }, 2000); // Show splash for 2 seconds then auto-navigate
//       }
//     } catch (error) {
//       console.error('Auth check error in Splash:', error);
//     }
//   };

//   const handleGetStarted = () => {
//     // Navigate to LoginScreen when button is pressed
//     router.replace('/LoginScreen');
//   };

//   return (
//     <ImageBackground
//       source={require("../assets/images/bg.png")} 
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <View style={styles.overlay} />

//       <View style={styles.content}>
//         {/* Logo */}
//         <Text style={styles.logo}>KOSO</Text>

//         {/* Tagline */}
//         <Text style={styles.tagline}>
//           Built on Innovation. Sustained by Trust.
//         </Text>

//         {/* Button */}
//         <TouchableOpacity
//           style={styles.button}
//           onPress={handleGetStarted}
//         >
//           <Text style={styles.buttonText}>Let's Get Started →</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.7)",
//   },
//   content: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   logo: {
//     fontSize: 64,
//     fontWeight: "bold",
//     color: "#FF4D57",
//     marginBottom: 12,
//   },
//   tagline: {
//     fontSize: 14,
//     color: "#FFFFFF",
//     marginBottom: 80,
//     textAlign: "center",
//     lineHeight: 20,
//   },
//   button: {
//     backgroundColor: "#FF4D57",
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 30,
//     position: "absolute",
//     bottom: 80,
//     alignSelf: "center",
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#FFFFFF",
//   },
// });




import { useEffect } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  ImageBackground,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SPLASH_DELAY = 2 * 1000;

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, SPLASH_DELAY); // 👈 splash visible for 10 minutes

    return () => clearTimeout(timer);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const loginTime = await AsyncStorage.getItem("loginTime");

      const now = Date.now();

      if (token && loginTime) {
        const diff = now - Number(loginTime);

        if (diff < SPLASH_DELAY) {
          router.replace("/CalculatorScreen");
          return;
        }
      }

      await AsyncStorage.multiRemove(["authToken", "loginTime"]);
      router.replace("/LoginScreen");

    } catch (error) {
      console.error("Auth check error in Splash:", error);
      router.replace("/LoginScreen");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/koso_splash_image.png")}
        style={styles.background}
        imageStyle={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    alignSelf: "center",

    ...(Platform.OS === "web" && {
      maxWidth: 1200,
      marginHorizontal: "auto",
    }),
  },
});
