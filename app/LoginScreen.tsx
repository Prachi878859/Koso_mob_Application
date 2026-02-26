import React, { useState } from 'react';
import { Image } from 'react-native';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ImageBackground,
  useWindowDimensions,
  type ViewStyle,
  type DimensionValue,
} from 'react-native';
import { router } from 'expo-router';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import api from './axiosInstance'; // Adjust the path as needed

// Import icon library (you need to install one, I'm using Ionicons as an example)
// You can install: expo install @expo/vector-icons
// Or use: npm install react-native-vector-icons
import { Ionicons } from '@expo/vector-icons';

// Define types for the API response
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      Name: string;
      Email: string;
      created_at: string;
      updated_at: string;
    };
    token: string;
  };
}

// Define type for Axios error
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  request?: any;
  message?: string;
}

// Breakpoints for responsive design
const BREAKPOINTS = {
  SMALL: 480,   // Mobile
  MEDIUM: 768,  // Tablet
  LARGE: 1024,  // Desktop
  XLARGE: 1280, // Large Desktop
};

// Color constants
const COLORS = {
  PRIMARY_RED: '#FF4D57',       // Red for default border
  DARKER_RED: '#E63946',        // Darker red for focused state
  LIGHT_RED_BG: 'rgba(230, 57, 70, 0.1)', // Light background for focused state
  RED_TRANSPARENT: 'rgba(255, 77, 87, 0.7)', // Red with transparency for default state
  WHITE: '#FFFFFF',
  WHITE_LIGHT_BG: 'rgba(255, 255, 255, 0.15)',
  WHITE_PLACEHOLDER: 'rgba(255, 255, 255, 0.7)',
  BLACK: '#000000',
  BLACK_ICON: '#1A1A1A', // Dark black color for better visibility
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Get window dimensions for responsive design
  const { width, height } = useWindowDimensions();
  
  // Determine screen size category
  const isSmallScreen = width < BREAKPOINTS.SMALL;
  const isMediumScreen = width >= BREAKPOINTS.SMALL && width < BREAKPOINTS.MEDIUM;
  const isLargeScreen = width >= BREAKPOINTS.MEDIUM && width < BREAKPOINTS.LARGE;
  const isXLargeScreen = width >= BREAKPOINTS.LARGE;
  const isLandscape = width > height;

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      showMessage({
        message: 'Error',
        description: 'Please enter both email and password',
        type: 'danger',
        icon: 'auto',
        duration: 3000,
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      showMessage({
        message: 'Error',
        description: 'Please enter a valid email address',
        type: 'danger',
        icon: 'auto',
        duration: 3000,
      });
      return;
    }

    const userEmail = email.toLowerCase();
    setLoading(true);

    try {
      const response = await api.post<LoginResponse>('/users/login', {
        Email: userEmail,
        Password: password,
      });

      if (response.data.success) {
        // Store token and user data
        const { token, user } = response.data.data;
        
        // Show success message with sweet alert
        showMessage({
          message: 'Success!',
          description: 'Login successful! Redirecting...',
          type: 'success',
          icon: 'success',
          duration: 2000,
        });

        // Navigate after 2 seconds (after the sweet alert is shown)
        setTimeout(() => {
          router.replace('/Additional_user_inputs');
        }, 2000);
        
      } else {
        showMessage({
          message: 'Error',
          description: response.data.message || 'Login failed',
          type: 'danger',
          icon: 'auto',
          duration: 3000,
        });
      }
    } catch (error) {
      // Type assertion to ApiError
      const apiError = error as ApiError;
      
      console.error('Login error:', apiError);
      
      // Handle different error cases
      if (apiError.response) {
        // Server responded with error status
        const errorMessage = apiError.response.data?.message || 'Login failed';
        showMessage({
          message: 'Error',
          description: errorMessage,
          type: 'danger',
          icon: 'auto',
          duration: 3000,
        });
      } else if (apiError.request) {
        // Request made but no response
        showMessage({
          message: 'Network Error',
          description: 'Unable to connect to server. Please check your connection.',
          type: 'danger',
          icon: 'auto',
          duration: 3000,
        });
      } else {
        // Something else happened
        showMessage({
          message: 'Error',
          description: apiError.message || 'An unexpected error occurred',
          type: 'danger',
          icon: 'auto',
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Add forgot password logic here
    showMessage({
      message: 'Forgot Password',
      description: 'Password reset functionality will be implemented soon.',
      type: 'info',
      icon: 'auto',
      duration: 3000,
    });
  };

  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Get input border style based on focus state
  const getInputBorderStyle = (inputName: string) => {
  if (focusedInput === inputName) {
    return {
      borderColor: COLORS.DARKER_RED,   // Focus -> Red
      borderWidth: 2,
      backgroundColor: COLORS.LIGHT_RED_BG,
    };
  }

  return {
    borderColor: 'rgba(255,255,255,0.6)', // Default -> White border
    borderWidth: 1,
    backgroundColor: COLORS.WHITE_LIGHT_BG,
  };
};

  // Get responsive padding for container
  const getContainerPadding = (): number => {
    if (isSmallScreen) return 20;
    if (isMediumScreen) return 24;
    if (isLargeScreen) return 32;
    return 40;
  };

  // Get responsive content max width - FIXED TYPE
  const getContentMaxWidth = (): DimensionValue => {
    if (isSmallScreen) return '100%';
    if (isMediumScreen) return 380;
    if (isLargeScreen) return 420;
    return 500;
  };

  // Get responsive padding vertical for content
  const getContentPaddingVertical = (): number => {
    if (isLandscape && width < BREAKPOINTS.LARGE) {
      return 20;
    }
    if (isSmallScreen) return 30;
    if (isMediumScreen) return 40;
    if (isLargeScreen) return 50;
    return 60;
  };

  // Get responsive title font size
  const getTitleFontSize = (): number => {
    if (isSmallScreen) return 28;
    if (isMediumScreen) return 32;
    if (isLargeScreen) return 36;
    return 40;
  };

  // Get responsive subtitle font size
  const getSubtitleFontSize = (): number => {
    if (isSmallScreen) return 14;
    if (isMediumScreen) return 16;
    if (isLargeScreen) return 18;
    return 18;
  };

  // Get responsive form padding
  const getFormPadding = (): number => {
    if (isSmallScreen) return 20;
    if (isMediumScreen) return 24;
    if (isLargeScreen) return 28;
    return 32;
  };

  // Get responsive input label font size
  const getInputLabelFontSize = (): number => {
    if (isSmallScreen) return 14;
    return 16;
  };

  // Get responsive input padding
  const getInputPadding = (): number => {
    if (isSmallScreen) return 14;
    if (isMediumScreen) return 16;
    return 18;
  };

  // Get responsive input font size
  const getInputFontSize = (): number => {
    if (isSmallScreen) return 14;
    return 16;
  };

  // Get responsive input min height
  const getInputMinHeight = (): number => {
    if (isSmallScreen) return 50;
    if (isMediumScreen) return 56;
    return 60;
  };

  // Get responsive input border radius
  const getInputBorderRadius = (): number => {
    if (isSmallScreen) return 8;
    return 10;
  };

  // Get responsive options row margin
  const getOptionsRowMargin = () => {
    return {
      marginBottom: isSmallScreen ? 24 : 32,
      marginTop: isSmallScreen ? 4 : 8,
    };
  };

  // Get responsive checkbox size
  const getCheckboxSize = (): number => {
    return isSmallScreen ? 18 : 20;
  };

  // Get responsive text font sizes
  const getTextFontSize = (type: 'rememberMe' | 'forgotPassword'): number => {
    if (isSmallScreen) return 13;
    return 14;
  };

  // Get responsive button padding
  const getButtonPadding = (): number => {
    if (isSmallScreen) return 16;
    if (isMediumScreen) return 18;
    return 20;
  };

  // Get responsive button min height
  const getButtonMinHeight = (): number => {
    if (isSmallScreen) return 50;
    if (isMediumScreen) return 56;
    return 60;
  };

  // Get responsive button border radius
  const getButtonBorderRadius = (): number => {
    if (isSmallScreen) return 25;
    return 30;
  };

  // Get responsive button text font size
  const getButtonTextFontSize = (): number => {
    if (isSmallScreen) return 16;
    if (isMediumScreen) return 18;
    return 18;
  };

  // Get responsive scroll container style
  const getScrollContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexGrow: 1,
      justifyContent: 'center',
      minHeight: height,
    };

    if (isLandscape && width < BREAKPOINTS.LARGE) {
      return {
        ...baseStyle,
        justifyContent: 'center' as const,
        paddingVertical: 20,
      };
    }

    return baseStyle;
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? (isSmallScreen ? 40 : 20) : 0}
        >
          <ScrollView 
            contentContainerStyle={getScrollContainerStyle()}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="always"
          >
            {/* Centered Container */}
            <View style={[
              styles.container,
              { 
                paddingHorizontal: getContainerPadding(),
                flex: 1,
                justifyContent: 'center',
              }
            ]}>
              {/* Main Content - Centered */}
              <View style={[
                styles.content,
                { 
                  maxWidth: getContentMaxWidth() as DimensionValue,
                  paddingVertical: getContentPaddingVertical(),
                  marginTop: isLandscape ? 0 : -20,
                }
              ]}>
                {/* Title Section */}
                <View style={styles.titleSection}>

  {/* LOGO */}
  <Image
    source={require('../assets/images/koso-logo.png')} // logo path
    style={{
      width: isSmallScreen ? 180 : 200,
      height: isSmallScreen ?130: 160,
      resizeMode: 'contain',
      marginBottom: 15,
    }}
  />

  <Text style={[
    styles.title,
    { 
      fontSize: getTitleFontSize(),
      marginBottom: isSmallScreen ? 6 : 8
    }
  ]}>
    Login
  </Text>

                  <Text style={[
                    styles.subtitle,
                    { fontSize: getSubtitleFontSize() }
                  ]}>
                    Please login to your account
                  </Text>
                </View>

                {/* Form Section - Completely transparent with no shadow */}
                <View style={[
                  styles.formSection,
                  { 
                    padding: getFormPadding(),
                    marginBottom: isSmallScreen ? 16 : 20
                  }
                ]}>
                  {/* Email Input */}
                  <Text style={[
                    styles.inputLabel,
                    { 
                      fontSize: getInputLabelFontSize(),
                      marginBottom: isSmallScreen ? 6 : 8
                    }
                  ]}>
                    Email
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        padding: getInputPadding(),
                        fontSize: getInputFontSize(),
                        minHeight: getInputMinHeight(),
                        marginBottom: isSmallScreen ? 20 : 24,
                        borderRadius: getInputBorderRadius(),
                      },
                      getInputBorderStyle('email')
                    ]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email id"
                    placeholderTextColor={COLORS.WHITE_PLACEHOLDER}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                    selectionColor={COLORS.DARKER_RED}
                    onFocus={() => handleInputFocus('email')}
                    onBlur={handleInputBlur}
                  />
                  
                  {/* Password Input with Eye Icon */}
                  <Text style={[
                    styles.inputLabel,
                    { 
                      fontSize: getInputLabelFontSize(),
                      marginBottom: isSmallScreen ? 6 : 8
                    }
                  ]}>
                    Password
                  </Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.passwordInput,
                        { 
                          padding: getInputPadding(),
                          fontSize: getInputFontSize(),
                          minHeight: getInputMinHeight(),
                          marginBottom: 0,
                          borderRadius: getInputBorderRadius(),
                          paddingRight: 50, // Add padding for the eye icon
                        },
                        getInputBorderStyle('password')
                      ]}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor={COLORS.WHITE_PLACEHOLDER}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      editable={!loading}
                      selectionColor={COLORS.DARKER_RED}
                      onFocus={() => handleInputFocus('password')}
                      onBlur={handleInputBlur}
                    />
                    <TouchableOpacity
                      style={[
                        styles.eyeIconContainer,
                        { 
                          height: getInputMinHeight(),
                        }
                      ]}
                      onPress={toggleShowPassword}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={isSmallScreen ? 20 : 22}
                        color={COLORS.BLACK_ICON} // Changed to black color
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Remember Me & Forgot Password */}
                  <View style={[
                    styles.optionsRow,
                    getOptionsRowMargin()
                  ]}>
                    <TouchableOpacity 
                      style={styles.rememberMeContainer}
                      onPress={() => setRememberMe(!rememberMe)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.checkbox,
                        { 
                          width: getCheckboxSize(),
                          height: getCheckboxSize()
                        },
                        rememberMe && styles.checkboxChecked
                      ]}>
                        {rememberMe && <View style={styles.checkboxInner} />}
                      </View>
                      <Text style={[
                        styles.rememberMeText,
                        { fontSize: getTextFontSize('rememberMe') }
                      ]}>
                        Remember Me
                      </Text>
                    </TouchableOpacity>
                    
                    
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity 
                    style={[
                      styles.loginButton,
                      { 
                        padding: getButtonPadding(),
                        minHeight: getButtonMinHeight(),
                        borderRadius: getButtonBorderRadius()
                      },
                      (!email || !password || loading) && styles.loginButtonDisabled
                    ]} 
                    onPress={handleLogin}
                    disabled={!email || !password || loading}
                    activeOpacity={0.9}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.WHITE} size="small" />
                    ) : (
                      <Text style={[
                        styles.loginButtonText,
                        { fontSize: getButtonTextFontSize() }
                      ]}>
                        LOGIN
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        {/* FlashMessage component for displaying alerts */}
        <FlashMessage position="top" />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 50,   // spacing increase
  marginTop: 30, 
  },
  title: {
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: '#EEE',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // Form Section - COMPLETELY transparent with no shadow or background
  formSection: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  inputLabel: {
    color: '#FFF',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    color: '#FFF',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  passwordInput: {
    width: '100%',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    backgroundColor: 'transparent',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  checkboxChecked: {
    borderColor: '#E63946',
    backgroundColor: '#E63946',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  rememberMeText: {
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  forgotPasswordText: {
    color: '#E63946',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  // Login Button
  loginButton: {
    backgroundColor: '#E63946',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});