

// import { useRef, useState } from "react";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";

// import Reanimated, {
//   FadeIn,
//   Easing as ReanimatedEasing,
//   useAnimatedStyle,
//   withRepeat,
//   withTiming,
// } from "react-native-reanimated";
// import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Polygon, Stop } from "react-native-svg";

// const StaticGasCylinder = ({ isLeakingAnimated, hasWarning }) => {
//   const warningAnimatedStyle = useAnimatedStyle(() => {
//     return {
//       opacity: withRepeat(withTiming(hasWarning ? 1 : 0, { duration: 500, easing: ReanimatedEasing.linear }), -1, true),
//     }
//   })

//   const smokeAnimatedStyle = useAnimatedStyle(() => {
//     const translateY = withRepeat(
//       withTiming(isLeakingAnimated ? -40 : 0, { duration: 1500, easing: ReanimatedEasing.linear }),
//       -1,
//       false,
//     )
//     const opacity = withRepeat(
//       withTiming(isLeakingAnimated ? 1 : 0, { duration: 1500, easing: ReanimatedEasing.linear }),
//       -1,
//       false,
//     )
//     const scale = withRepeat(
//       withTiming(isLeakingAnimated ? 1.5 : 0, { duration: 1500, easing: ReanimatedEasing.linear }),
//       -1,
//       false,
//     )
//     return {
//       transform: [{ translateY }, { scale }],
//       opacity,
//     }
//   })

//   return (
//     <View style={styles.cylinderWrapper}>
//       <Svg width="180" height="180" viewBox="0 0 220 220">
//         <Defs>
//           <LinearGradient id="gradBigRed" x1="0" y1="0" x2="0" y2="1">
//             <Stop offset="0%" stopColor="#F44336" />
//             <Stop offset="100%" stopColor="#B71C1C" />
//           </LinearGradient>
//           <LinearGradient id="gradSmallYellow" x1="0" y1="0" x2="0" y2="1">
//             <Stop offset="0%" stopColor="#FFEB3B" />
//             <Stop offset="100%" stopColor="#FBC02D" />
//           </LinearGradient>
//         </Defs>

//         {/* Big Cylinder (Red) */}
//         <G>
//           <Path d="M100 40 H160 V160 H100 Z" stroke="#333" strokeWidth="2" fill="url(#gradBigRed)" />
//           <Path d="M100 40 Q130 20 160 40 Z" fill="url(#gradBigRed)" stroke="#333" strokeWidth="2" />
//           <Path d="M100 160 Q130 180 160 160 Z" fill="url(#gradBigRed)" stroke="#333" strokeWidth="2" />
//         </G>

//         {/* Small Cylinder (Yellow) */}
//         <G>
//           <Path d="M40 90 H80 V150 H40 Z" fill="url(#gradSmallYellow)" stroke="#333" strokeWidth="2" />
//           <Path d="M40 90 Q60 75 80 90 Z" fill="url(#gradSmallYellow)" stroke="#333" strokeWidth="2" />
//           <Path d="M40 150 Q60 165 80 150 Z" fill="url(#gradSmallYellow)" stroke="#333" strokeWidth="2" />
//           <Path d="M45 150 V160 H50 V150 Z" fill="#FBC02D" />
//           <Path d="M70 150 V160 H75 V150 Z" fill="#FBC02D" />
//         </G>

//         {/* Valve + Gauge */}
//         <G>
//           <Path d="M120 15 H140 V25 H120 Z" fill="#FFD54F" stroke="#333" strokeWidth="1" />
//           <Path d="M125 5 H135 V15 H125 Z" fill="#FFD54F" stroke="#333" strokeWidth="1" />
//           <Circle cx="150" cy="10" r="8" fill="#fff" stroke="#333" strokeWidth="1" />
//           <Line x1="150" y1="10" x2="154" y2="6" stroke="#333" strokeWidth="1" />
//         </G>

//         {/* Pipe connecting cylinders */}
//         <G>
//           <Line x1="80" y1="120" x2="100" y2="120" stroke="#FFD54F" strokeWidth="5" />
//           <Line x1="100" y1="120" x2="100" y2="40" stroke="#FFD54F" strokeWidth="5" />
//           <Line x1="100" y1="40" x2="120" y2="40" stroke="#FFD54F" strokeWidth="5" />
//         </G>

//         {/* Broken Pipe and Smoke guide lines */}
//         <G>
//           <Path d="M100 35 C95 30, 90 30, 85 35 S 80 40, 75 35" fill="none" stroke="#9E9E9E" strokeWidth="3" />
//           <Path d="M100 38 C95 33, 90 33, 85 38 S 80 43, 75 38" fill="none" stroke="#9E9E9E" strokeWidth="3" />
//           <Path d="M100 41 C95 36, 90 36, 85 41 S 80 46, 75 41" fill="none" stroke="#9E9E9E" strokeWidth="3" />
//         </G>
//       </Svg>

//       {/* Warning icon */}
//       {hasWarning && (
//         <Reanimated.View style={[styles.warningIconContainer, warningAnimatedStyle]}>
//           <Svg width="30" height="30" viewBox="0 0 24 24">
//             <Polygon points="12 2 1 21 23 21 12 2" fill="#FFC107" stroke="#333" strokeWidth="1" />
//             <Line x1="12" y1="9" x2="12" y2="14" stroke="#333" strokeWidth="2" />
//             <Circle cx="12" cy="17" r="1.5" fill="#333" />
//           </Svg>
//         </Reanimated.View>
//       )}

//       {/* Smoke puffs (removed stray string child that caused the RN <Text> warning) */}
//       <Reanimated.View style={[styles.smokeContainer, smokeAnimatedStyle]}>
//         <Svg width="60" height="60" viewBox="0 0 100 100">
//           {/* Increased SVG size */}
//           <Circle cx="50" cy="80" r="15" fill="#ccc" opacity="0.8" />
//           <Circle cx="40" cy="60" r="12" fill="#ccc" opacity="0.6" />
//           <Circle cx="60" cy="50" r="18" fill="#ccc" opacity="0.7" />
//           <Circle cx="50" cy="30" r="14" fill="#ccc" opacity="0.5" />
//         </Svg>
//       </Reanimated.View>
//     </View>
//   )
// }

// const validateInputs = (p1, p2, t1, t2, tmix, wcrh, d2, wcrUnit) => {
//   const warningsByField = {
//     P1: undefined as string | undefined,
//     P2: undefined as string | undefined,
//     T1: undefined as string | undefined,
//     T2: undefined as string | undefined,
//     Tmix: undefined as string | undefined,
//     WCRH: undefined as string | undefined,
//     D2: undefined as string | undefined,
//   }
//   let leakRateOutput: string | null = null

//   // P1
//   if (p1 < 80) warningsByField.P1 = "P1 out of bounds (LOW) - (80-280)"
//   if (p1 > 280) warningsByField.P1 = "P1 out of bounds (HIGH) - (80-280)"

//   // P2
//   if (p2 < 20) warningsByField.P2 = "P-CRH out of bounds (LOW) - (20-60)"
//   if (p2 > 60) warningsByField.P2 = "P-CRH out of bounds (HIGH) - (20-60)"

//   // P1/P2
//   if (p1 / p2 < 2) warningsByField.P2 = "(P1/P2-CRH) ratio out of bounds (LOW) - (2-6)"
//   if (p1 / p2 > 6) warningsByField.P2 = "(P1/P2-CRH) ratio out of bounds (HIGH) - (2-6)"

//   // T1
//   if (t1 < 500) warningsByField.T1 = "T1 out of bounds (LOW) - (500-600)"  
//   if (t1 > 600) warningsByField.T1 = "T1 out of bounds (HIGH) - (500-600)"

//   // T2
//   if (t2 < 300) warningsByField.T2 = "T2 out of bounds (LOW) - (300-425)"
//   if (t2 > 425) warningsByField.T2 = "T2 out of bounds (HIGH) - (300-425)"

//   // Tmix
//   if (tmix < 300) warningsByField.Tmix = "T_M out of bounds (LOW) - (300-450)"
//   if (tmix > 450) warningsByField.Tmix = "T_M out of bounds (HIGH) - (300-450)"

//   if (t2 - tmix > 4) {
//     warningsByField.Tmix = "T_M temperature error (less than T-CRH) "
//   }
//   if (Math.abs(t2 - tmix) < 4) {
//     warningsByField.T2 = "Possible inaccuracy in T2 and/or T_M"
//     warningsByField.Tmix = "Possible inaccuracy in T2 and/or T_M"
//     leakRateOutput = "0.00"
//   }

//   // W bounds (normalize to T/HR)
//   // const wInTH = wcrUnit === "KG/HR" ? wcrh / 1000 : wcrh
//   // if (wInTH < 100) warningsByField.WCRH = "W out of bounds (LOW)"
//   // if (wInTH > 4000) warningsByField.WCRH = "W out of bounds (HIGH)"

//   if (wcrh < 100) warningsByField.WCRH = "W out of bounds (LOW) - (100-4000)"
//   if (wcrh > 4000) warningsByField.WCRH = "W out of bounds (HIGH) - (100-4000)"

//   // D
//   if (d2 < 300) warningsByField.D2 = "D out of bounds (LOW) - (300-600)"
//   if (d2 > 600) warningsByField.D2 = "D out of bounds (HIGH) - (300-600)"

//   const CONST_K = wcrUnit === "T/HR" ? 0.145 : 145

//   const anyWarning = Object.values(warningsByField).some(Boolean)
//   return { warningsByField, leakRateOutput, anyWarning }
// }

// export default function Index() {
//   const [P1, setP1] = useState("")
//   const [P2, setP2] = useState("")
//   const [T1, setT1] = useState("")
//   const [T2, setT2] = useState("")
//   const [Tmix, setTmix] = useState("")
//   const [WCRH, setWCRH] = useState("")
//   const [D2, setD2] = useState("")

//   const [showOutput, setShowOutput] = useState(false)
//   const [open, setOpen] = useState(false)
//   const [wcrUnit, setWcrUnit] = useState("T/HR") // Default unit
//   const [items, setItems] = useState([
//     { label: "T/HR", value: "T/HR" },
//     { label: "KG/HR", value: "KG/HR" },
//   ])

//   const [result, setResult] = useState("0.00")
//   const [message, setMessage] = useState("")
//   const [hasWarning, setHasWarning] = useState(false)

//   const [inputErrors, setInputErrors] = useState<{
//     P1?: string
//     P2?: string
//     T1?: string
//     T2?: string
//     Tmix?: string
//     WCRH?: string
//     D2?: string
//   }>({})

//   const CONST_54 = 54
//   const CONST_8275 = 827.5
//   const CONST_2733 = 273.3
//   const CONST_1690 = 1690
//   const CONST_6332 = 633.2
//   const CONST_500 = 500
//   const CONST_K = wcrUnit === "T/HR" ? 0.145 : 145

//   const isLeakingAnimated = Number.parseFloat(result) > 0 && !hasWarning && message === ""

//   const scrollRef = useRef<ScrollView>(null)

//   const scrollToTop = () => {
//     requestAnimationFrame(() => {
//       scrollRef.current?.scrollTo({ y: 0, animated: true })
//     })
//   }

//   const fieldPositions = useRef<Record<string, number>>({}).current
//   const rememberY = (key: string) => (e) => {
//     fieldPositions[key] = e.nativeEvent.layout.y
//   }

//   // Real-time validation function
//   const validateFieldInRealTime = (fieldName: string, value: string) => {
//     if (!value.trim()) {
//       // Clear error if field is empty
//       setInputErrors(prev => ({ ...prev, [fieldName]: undefined }));
//       return;
//     }

//     const numValue = parseFloat(value);
//     if (isNaN(numValue)) {
//       setInputErrors(prev => ({ ...prev, [fieldName]: "Must be a number" }));
//       return;
//     }

//     let error = undefined;

//     switch (fieldName) {
//       case 'P1':
//         if (numValue < 80) error = "P1 out of bounds (LOW) - (80-280)";
//         if (numValue > 280) error = "P1 out of bounds (HIGH) - (80-280)";
//         break;
//       case 'P2':
//         if (numValue < 20) error = "P-CRH out of bounds (LOW) - (20-60)";
//         if (numValue > 60) error = "P-CRH out of bounds (HIGH) - (20-60)";
//         break;
//       case 'T1':
//         if (numValue < 500) error = "T1 out of bounds (LOW) - (500-600)";
//         if (numValue > 600) error = "T1 out of bounds (HIGH) - (500-600)";
//         break;
//       case 'T2':
//         if (numValue < 300) error = "T2 out of bounds (LOW) - (300-425)";
//         if (numValue > 425) error = "T2 out of bounds (HIGH) - (300-425)";
//         break;
//       case 'Tmix':
//         if (numValue < 300) error = "T_M out of bounds (LOW) - (300-450)";
//         if (numValue > 450) error = "T_M out of bounds (HIGH) - (300-450)";
//         break;
//       case 'WCRH':
//         if (numValue < 100) error = "W out of bounds (LOW) - (100-4000)";
//         if (numValue > 4000) error = "W out of bounds (HIGH) - (100-4000)";
//         break;
//       case 'D2':
//         if (numValue < 300) error = "D out of bounds (LOW) - (300-600)";
//         if (numValue > 600) error = "D out of bounds (HIGH) - (300-600)";
//         break;
//     }

//     setInputErrors(prev => ({ ...prev, [fieldName]: error }));
//   };

//   // Format result based on unit
//   const formatResult = (resultValue, unit) => {
//     if (resultValue === "NA" || resultValue === "0.00") return resultValue;

//     const numericValue = parseFloat(resultValue);

//     if (unit === "KG/HR") {
//       // For KG/HR, remove decimal digits and show only integer part
//       return Math.floor(numericValue).toString();
//     } else {
//       // For T/HR, show with decimal digits as before
//       return numericValue.toFixed(2);
//     }
//   };

//   const calculateLeakFlow = () => {
//     const empties = {
//       P1: !P1.trim() ? "Required" : undefined,
//       P2: !P2.trim() ? "Required" : undefined,
//       T1: !T1.trim() ? "Required" : undefined,
//       T2: !T2.trim() ? "Required" : undefined,
//       Tmix: !Tmix.trim() ? "Required" : undefined,
//       WCRH: !WCRH.trim() ? "Required" : undefined,
//       D2: !D2.trim() ? "Required" : undefined,
//     }

//     const hasEmpty = Object.values(empties).some(Boolean)
//     if (hasEmpty) {
//       setInputErrors(empties)
//       setHasWarning(true)
//       setResult("NA")
//       setShowOutput(false)
//       const firstKey = Object.keys(empties).find((k) => (empties as any)[k])
//       if (firstKey && fieldPositions[firstKey] !== undefined) {
//         requestAnimationFrame(() =>
//           scrollRef.current?.scrollTo({ y: Math.max(fieldPositions[firstKey] - 24, 0), animated: true }),
//         )
//       }
//       return
//     }

//     const p1 = Number.parseFloat(P1)
//     const p2 = Number.parseFloat(P2)
//     const t1 = Number.parseFloat(T1)
//     const t2 = Number.parseFloat(T2)
//     const tmix = Number.parseFloat(Tmix)
//     const wcrh = Number.parseFloat(WCRH)
//     const d2 = Number.parseFloat(D2)

//     // Check for cross-field validations
//     const { warningsByField, leakRateOutput, anyWarning } = validateInputs(p1, p2, t1, t2, tmix, wcrh, d2, wcrUnit)

//     if (anyWarning) {
//       setInputErrors(warningsByField)
//       setHasWarning(true)
//       setShowOutput(true)
//       setResult(leakRateOutput !== null ? leakRateOutput : "NA")
//       const firstWarnKey = Object.keys(warningsByField).find((k) => (warningsByField as any)[k])
//       if (firstWarnKey && fieldPositions[firstWarnKey] !== undefined) {
//         requestAnimationFrame(() =>
//           scrollRef.current?.scrollTo({ y: Math.max(fieldPositions[firstWarnKey] - 24, 0), animated: true }),
//         )
//       }
//       return
//     }

//     const T1is = t1 - ((p1 - p2) / 20) * (25.1 - 0.03 * t1)
//     const K1 = (p2 / CONST_54) * (CONST_8275 / (T1is + CONST_2733))
//     const K2 = Math.pow(wcrh / CONST_1690, 2) * (CONST_54 / p2) * ((t2 + 273.2) / CONST_6332)
//     const K3 = Math.pow(d2 / CONST_500, 2)
//     const leakRate = CONST_K * (tmix - t2) * K1 * K2 * K3

//     // Format based on unit before setting result
//     let finalResult;
//     if (wcrUnit === "KG/HR") {
//       finalResult = Math.floor(leakRate).toString();
//     } else {
//       finalResult = leakRate.toFixed(2);
//     }

//     setResult(finalResult)
//     setMessage("")
//     setHasWarning(false)
//     setShowOutput(true)

//     scrollToTop()
//   }

//   const resetAll = () => {
//     setP1("")
//     setP2("")
//     setT1("")
//     setT2("")
//     setTmix("")
//     setWCRH("")
//     setD2("")
//     setResult("0.00")
//     setMessage("")
//     setHasWarning(false)
//     setInputErrors({})
//     setShowOutput(false)
//     scrollToTop()
//   }

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
//       <View style={styles.header}>
//         <Text style={styles.logo}>KOSO</Text>
//         <View style={styles.stationUnitContainer}>
//           <Text style={styles.station}>BASHP OORJA STATION</Text>
//           <View style={styles.underline} />
//           <Text style={styles.unit}>UNIT 4</Text>
//         </View>
//       </View>
//       <ScrollView
//         ref={scrollRef}
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.container}>
//           <View style={styles.boilerContainer}>
//             <StaticGasCylinder isLeakingAnimated={isLeakingAnimated} hasWarning={hasWarning} />
//           </View>

//           <Text style={styles.sectionTitle}>APPLICATION - HP BYPASS</Text>

//           <View style={styles.row}>
//             <View onLayout={rememberY("P1")} style={styles.inputFieldContainer}>
//               <InputField
//                 label="P1 (HP Inlet Pressure)"
//                 value={P1}
//                 onChangeText={(t) => {
//                   setP1(t)
//                   validateFieldInRealTime("P1", t)
//                   setShowOutput(false)
//                 }}
//                 errorText={inputErrors.P1}
//               />
//             </View>

//             <View onLayout={rememberY("T1")} style={styles.inputFieldContainer}>
//               <InputField
//                 label="T1 (HP Steam °C)"
//                 value={T1}
//                 onChangeText={(t) => {
//                   setT1(t)
//                   validateFieldInRealTime("T1", t)
//                   setShowOutput(false)
//                 }}
//                 errorText={inputErrors.T1}
//               />
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View onLayout={rememberY("P2")} style={styles.inputFieldContainer}>
//               <InputField
//                 label="P2 (CRH Outlet Pressure)"
//                 value={P2}
//                 onChangeText={(t) => {
//                   setP2(t)
//                   validateFieldInRealTime("P2", t)
//                   setShowOutput(false)
//                 }}
//                 errorText={inputErrors.P2}
//               />
//             </View>

//             <View onLayout={rememberY("T2")} style={styles.inputFieldContainer}>
//               <InputField
//                 label="T2 (°C)"
//                 value={T2}
//                 onChangeText={(t) => {
//                   setT2(t)
//                   validateFieldInRealTime("T2", t)
//                   setShowOutput(false)
//                 }}
//                 errorText={inputErrors.T2}
//               />
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View onLayout={rememberY("WCRH")} style={styles.inputFieldContainer}>
//               <InputField
//                 label="W-CRH"
//                 value={WCRH}
//                 onChangeText={(t) => {
//                   setWCRH(t)
//                   validateFieldInRealTime("WCRH", t)
//                   setShowOutput(false)
//                 }}
//                 errorText={inputErrors.WCRH}
//               />
//             </View>

//             <View onLayout={rememberY("Unit")} style={{ flex: 1, marginRight: 8, zIndex: 3000 }}>
//               <Text style={styles.inputLabels}>Unit</Text>
//               <DropDownPicker
//                 open={open}
//                 value={wcrUnit}
//                 items={items}
//                 setOpen={setOpen}
//                 setValue={(value) => {
//                   setWcrUnit(value)
//                   setShowOutput(false)
//                 }}
//                 setItems={setItems}
//                 style={styles.dropdown}
//                 dropDownContainerStyle={styles.dropdownList}
//                 textStyle={styles.dropdownText}
//                 placeholderStyle={styles.dropdownText}
//                 listMode="SCROLLVIEW"
//                 zIndex={3000}
//                 zIndexInverse={1000}
//               />
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View onLayout={rememberY("D2")} style={styles.inputFieldContainer}>
//               <InputField
//                 label="D2 (MM)"
//                 value={D2}
//                 onChangeText={(t) => {
//                   setD2(t)
//                   validateFieldInRealTime("D2", t)
//                   setShowOutput(false)
//                 }}
//                 errorText={inputErrors.D2}
//               />
//             </View>

//             <View onLayout={rememberY("Tmix")} style={styles.inputFieldContainer}>
//               <InputField
//                 label="T-MIX (°C)"
//                 value={Tmix}
//                 onChangeText={(t) => {
//                   setTmix(t)
//                   validateFieldInRealTime("Tmix", t)
//                   setShowOutput(false)
//                 }}
//                 errorText={inputErrors.Tmix}
//               />
//             </View>
//           </View>

          // {/* Show Output Box only when we have valid result and showOutput is true */}
          // {showOutput && (
          //   <Reanimated.View entering={FadeIn.duration(500)} style={styles.outputBox}>
          //     <View style={styles.outputInnerBox}>
          //       <Text style={styles.outputLabel}>LEAK RATE :</Text>
          //       <Text
          //         style={[
          //           styles.outputValueText,
          //           result === "NA" && { color: "red" }
          //         ]}
          //       >
          //         {result === "NA" ? (
          //           <>
          //             NA <Text style={{ fontSize: 12 }}>(Check Inputs)</Text>
          //           </>
          //         ) : (
          //           `${formatResult(result, wcrUnit)} ${wcrUnit === "T/HR" ? "T/H" : "kg/hr"
          //           }`
          //         )}
          //       </Text>
          //     </View>

          //     {hasWarning && message ? <Text style={styles.outputWarningText}>Warning : {message}</Text> : null}
          //   </Reanimated.View>
          // )}

          // {/* Show Calculate Button only when output is not showing */}
          // {!showOutput && (
          //   <TouchableOpacity style={styles.calculateBtn} onPress={calculateLeakFlow} accessibilityRole="button">
          //     <Text style={styles.calculateText}>Calculate</Text>
          //   </TouchableOpacity>
          // )}

          // <TouchableOpacity onPress={resetAll} accessibilityRole="button">
          //   <Text style={styles.resetText}>Reset Value</Text>
          // </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   )
// }

// function InputField({
//   label,
//   value,
//   onChangeText,
//   errorText,
// }: {
//   label: string
//   value: string
//   onChangeText: (t: string) => void
//   errorText?: string
// }) {
//   return (
//     <View style={styles.inputFieldContainer}>
//       <Text style={styles.inputLabel}>{label}</Text>
//       <TextInput
//         style={[styles.input, errorText ? styles.inputError : null]}
//         keyboardType="numeric"
//         value={value}
//         onChangeText={onChangeText}
//         placeholder="00"
//         placeholderTextColor="#9E9E9E"
//       />
//       {errorText ? <Text style={styles.fieldErrorText}>{errorText}</Text> : null}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   scrollContent: {
//     flexGrow: 1,
//   },
//   container: {
//     backgroundColor: "#FFFFFF",
//     padding: 15,
//     flexGrow: 1,
//   },
//   header: {
//     backgroundColor: "#000000",
//     paddingVertical: 18,
//     paddingHorizontal: 18,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   logo: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#FF4D57",
//   },
  // stationUnitContainer: {
  //   alignItems: "flex-end",
  // },
  // station: {
  //   fontSize: 15,
  //   color: "#D3D3D3",
  // },
  // underline: {
  //   height: 1,
  //   width: "80%",
  //   backgroundColor: "#D3D3D3",
  //   marginVertical: 2,
  // },
  // unit: {
  //   fontSize: 13,
  //   color: "#D3D3D3",
  // },
//   boilerContainer: {
//     position: "relative",
//     width: "60%",
//     height: 130,
//     alignSelf: "center",
//     justifyContent: "center",
//     alignItems: "center",
//     marginVertical: 10,
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   cylinderWrapper: {
//     width: "100%",
//     height: "120%",
//     position: "relative",
//   },
//   warningIconContainer: {
//     position: "absolute",
//     top: 30,
//     left: 80,
//     zIndex: 10,
//   },
//   smokeContainer: {
//     position: "absolute",
//     top: 10,
//     left: 70,
//     zIndex: 5,
//   },
//   outputBox: {
//     marginTop: 10,
//     marginBottom: 10,
//     alignItems: "center",
//     backgroundColor: "rgba(255, 77, 87, 0.1)",
//     borderColor: "#FF4D57",
//     borderWidth: 1,
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     borderRadius: 50,
//     width: "80%",
//     alignSelf: "center",
//   },
//   outputInnerBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   outputLabel: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#000000",
//     marginRight: 5,
//   },
//   outputValueText: {
//     color: "#066e2cff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   outputWarningText: {
//     fontSize: 13,
//     color: "#FF4D57",
//     marginTop: 5,
//     textAlign: "center",
//   },
//   sectionTitle: {
//     backgroundColor: "#ECE9E9",
//     padding: 10,
//     fontSize: 15,
//     color: "#FF4D57",
//     marginVertical: 10,
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   inputFieldContainer: {
//     flex: 1,
//     marginHorizontal: 2,
//   },
//   inputLabel: {
//     color: "#080808",
//     marginBottom: 5,
//     fontSize: 11,
//   },
//   inputLabels: {
//     color: "#080808",
//     marginBottom: 5,
//     fontSize: 11,
//   },
//   input: {
//     backgroundColor: "#F5EAEA",
//     color: "#2e2a2aff",
//     padding: 8,
//     borderRadius: 0,
//     fontSize: 14,
//     borderWidth: 0,
//     borderColor: "#E6E6E6",
//   },
//   inputError: {
//     borderColor: "#D60000",
//     borderWidth: 0.2,
//   },
//   fieldErrorText: {
//     color: "#D60000",
//     marginTop: 3,
//     fontSize: 11,
//   },
//   dropdown: {
//     backgroundColor: "#F1E4E4",
//     borderRadius: 0,
//     borderWidth: 0,
//     borderColor: "#E6E6E6",
//     height: 35,
//     minHeight: 35,
//   },
//   dropdownList: {
//     backgroundColor: "#F1E4E4",
//     borderRadius: 0,
//     zIndex: 3000,
//     fontSize: 11,
//   },
//   dropdownText: {
//     color: "#e93434ff",
//     fontSize: 11,
//     lineHeight: 18,
//   },
//   calculateBtn: {
//     backgroundColor: "#FF4D57",
//     padding: 8,
//     borderRadius: 30,
//     marginTop: 15,
//     width: "55%",
//     alignSelf: "center",
//     alignItems: "center",
//   },
//   calculateText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   resetText: {
//     color: "#111111",
//     fontSize: 11,
//     textAlign: "center",
//     marginTop: 8,
//   },
// })


import React, { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
// Reanimated imports are now unused and removed.
import Reanimated, { FadeIn } from "react-native-reanimated";


// ⚠️ REPLACE THIS WITH YOUR ACTUAL IMAGE IMPORT
 const LeakDiagramImage = require('../assets/images/image.png'); 
// const LeakDiagramImage = { uri: "https://i.imgur.com/your_leak_diagram_image.png" }; 
// Using a placeholder URI or a local require is necessary for a real app.


// Removed StaticGasCylinder component and its Reanimated dependencies as it's being replaced by a static image.

const validateInputs = (p1, p2, t1, t2, tmix, wcrh, d2, wcrUnit) => {
  const warningsByField = {
    P1: undefined,
    P2: undefined,
    T1: undefined,
    T2: undefined,
    Tmix: undefined,
    WCRH: undefined,
    D2: undefined,
  };
  let leakRateOutput = null;

  // P1
  if (p1 < 80) warningsByField.P1 = "P1 out of bounds (LOW) - (80-280)";
  if (p1 > 280) warningsByField.P1 = "P1 out of bounds (HIGH) - (80-280)";

  // P2
  if (p2 < 20) warningsByField.P2 = "P-CRH out of bounds (LOW) - (20-60)";
  if (p2 > 60) warningsByField.P2 = "P-CRH out of bounds (HIGH) - (20-60)";

  // P1/P2
  // Check if P2 is non-zero before division
  if (p2 !== 0) {
    if (p1 / p2 < 2) warningsByField.P2 = "(P1/P2-CRH) ratio out of bounds (LOW) - (2-6)";
    if (p1 / p2 > 6) warningsByField.P2 = "(P1/P2-CRH) ratio out of bounds (HIGH) - (2-6)";
  } else {
    // Handle division by zero case for ratio check
    warningsByField.P2 = "P2 cannot be zero for ratio check";
  }


  // T1
  if (t1 < 500) warningsByField.T1 = "T1 out of bounds (LOW) - (500-600)";
  if (t1 > 600) warningsByField.T1 = "T1 out of bounds (HIGH) - (500-600)";

  // T2
  if (t2 < 300) warningsByField.T2 = "T2 out of bounds (LOW) - (300-425)";
  if (t2 > 425) warningsByField.T2 = "T2 out of bounds (HIGH) - (300-425)";

  // Tmix
  if (tmix < 300) warningsByField.Tmix = "T_M out of bounds (LOW) - (300-450)";
  if (tmix > 450) warningsByField.Tmix = "T_M out of bounds (HIGH) - (300-450)";

  // Tmix checks
  if (t2 - tmix > 4) {
    warningsByField.Tmix = "T_M temperature error (less than T-CRH) ";
  }
  if (Math.abs(t2 - tmix) < 4) {
    warningsByField.T2 = "Possible inaccuracy in T2 and/or T_M";
    warningsByField.Tmix = "Possible inaccuracy in T2 and/or T_M";
    leakRateOutput = "0.00";
  }

  // W bounds (normalize to T/HR)
  if (wcrh < 100) warningsByField.WCRH = "W out of bounds (LOW) - (100-4000)";
  if (wcrh > 4000) warningsByField.WCRH = "W out of bounds (HIGH) - (100-4000)";

  // D
  if (d2 < 300) warningsByField.D2 = "D out of bounds (LOW) - (300-600)";
  if (d2 > 600) warningsByField.D2 = "D out of bounds (HIGH) - (300-600)";

  const anyWarning = Object.values(warningsByField).some(Boolean);
  return { warningsByField, leakRateOutput, anyWarning };
};

export default function Index() {
  const [P1, setP1] = useState("");
  const [P2, setP2] = useState("");
  const [T1, setT1] = useState("");
  const [T2, setT2] = useState("");
  const [Tmix, setTmix] = useState("");
  const [WCRH, setWCRH] = useState("");
  const [D2, setD2] = useState("");

  const [showOutput, setShowOutput] = useState(false);
  const [open, setOpen] = useState(false);
  const [wcrUnit, setWcrUnit] = useState("T/HR"); // Default unit
  const [items, setItems] = useState([
    { label: "T/HR", value: "T/HR" },
    { label: "KG/HR", value: "KG/HR" },
  ]);

  const [result, setResult] = useState("0.00");
  const [message, setMessage] = useState("");
  const [hasWarning, setHasWarning] = useState(false);

  const [inputErrors, setInputErrors] = useState({});

  // Constants for calculation
  const CONST_54 = 54;
  const CONST_8275 = 827.5;
  const CONST_2733 = 273.3;
  const CONST_1690 = 1690;
  const CONST_6332 = 633.2;
  const CONST_500 = 500;
  const CONST_K = wcrUnit === "T/HR" ? 0.145 : 145;

  // Animation flag is no longer directly needed for the image, but kept for logic (if ever re-introduced)
  // const isLeakingAnimated = Number.parseFloat(result) > 0 && !hasWarning && message === ""

  const scrollRef = useRef(null);

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  };

  const fieldPositions = useRef({}).current;
  const rememberY = (key) => (e) => {
    fieldPositions[key] = e.nativeEvent.layout.y;
  };

  // Real-time validation function
  const validateFieldInRealTime = (fieldName, value) => {
    if (!value.trim()) {
      // Clear error if field is empty
      setInputErrors(prev => ({ ...prev, [fieldName]: undefined }));
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setInputErrors(prev => ({ ...prev, [fieldName]: "Must be a number" }));
      return;
    }

    let error = undefined;

    switch (fieldName) {
      case 'P1':
        if (numValue < 80) error = "P1 out of bounds (LOW) - (80-280)";
        if (numValue > 280) error = "P1 out of bounds (HIGH) - (80-280)";
        break;
      case 'P2':
        if (numValue < 20) error = "P-CRH out of bounds (LOW) - (20-60)";
        if (numValue > 60) error = "P-CRH out of bounds (HIGH) - (20-60)";
        break;
      case 'T1':
        if (numValue < 500) error = "T1 out of bounds (LOW) - (500-600)";
        if (numValue > 600) error = "T1 out of bounds (HIGH) - (500-600)";
        break;
      case 'T2':
        if (numValue < 300) error = "T2 out of bounds (LOW) - (300-425)";
        if (numValue > 425) error = "T2 out of bounds (HIGH) - (300-425)";
        break;
      case 'Tmix':
        if (numValue < 300) error = "T_M out of bounds (LOW) - (300-450)";
        if (numValue > 450) error = "T_M out of bounds (HIGH) - (300-450)";
        break;
      case 'WCRH':
        if (numValue < 100) error = "W out of bounds (LOW) - (100-4000)";
        if (numValue > 4000) error = "W out of bounds (HIGH) - (100-4000)";
        break;
      case 'D2':
        if (numValue < 300) error = "D out of bounds (LOW) - (300-600)";
        if (numValue > 600) error = "D out of bounds (HIGH) - (300-600)";
        break;
    }

    setInputErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Format result based on unit
  const formatResult = (resultValue, unit) => {
    if (resultValue === "NA" || resultValue === "0.00") return resultValue;

    const numericValue = parseFloat(resultValue);

    if (unit === "KG/HR") {
      // For KG/HR, show with no decimal digits (e.g., floor the value)
      return Math.floor(numericValue).toString();
    } else {
      // For T/HR, show with two decimal digits
      return numericValue.toFixed(2);
    }
  };

  const calculateLeakFlow = () => {
    const empties = {
      P1: !P1.trim() ? "Required" : undefined,
      P2: !P2.trim() ? "Required" : undefined,
      T1: !T1.trim() ? "Required" : undefined,
      T2: !T2.trim() ? "Required" : undefined,
      Tmix: !Tmix.trim() ? "Required" : undefined,
      WCRH: !WCRH.trim() ? "Required" : undefined,
      D2: !D2.trim() ? "Required" : undefined,
    };

    const hasEmpty = Object.values(empties).some(Boolean);
    if (hasEmpty) {
      setInputErrors(empties);
      setHasWarning(true);
      setResult("NA");
      setShowOutput(false);
      const firstKey = Object.keys(empties).find((k) => (empties)[k]);
      if (firstKey && fieldPositions[firstKey] !== undefined) {
        requestAnimationFrame(() =>
          scrollRef.current?.scrollTo({ y: Math.max(fieldPositions[firstKey] - 24, 0), animated: true }),
        );
      }
      return;
    }

    const p1 = Number.parseFloat(P1);
    const p2 = Number.parseFloat(P2);
    const t1 = Number.parseFloat(T1);
    const t2 = Number.parseFloat(T2);
    const tmix = Number.parseFloat(Tmix);
    const wcrh = Number.parseFloat(WCRH);
    const d2 = Number.parseFloat(D2);

    // Check for cross-field validations
    const { warningsByField, leakRateOutput, anyWarning } = validateInputs(p1, p2, t1, t2, tmix, wcrh, d2, wcrUnit);

    if (anyWarning) {
      // Merge real-time errors with cross-field warnings
      setInputErrors({ ...inputErrors, ...warningsByField });
      setHasWarning(true);
      setShowOutput(true);
      setResult(leakRateOutput !== null ? leakRateOutput : "NA");
      const firstWarnKey = Object.keys(warningsByField).find((k) => (warningsByField)[k]);
      if (firstWarnKey && fieldPositions[firstWarnKey] !== undefined) {
        requestAnimationFrame(() =>
          scrollRef.current?.scrollTo({ y: Math.max(fieldPositions[firstWarnKey] - 24, 0), animated: true }),
        );
      }
      return;
    }

    // Calculation logic
    const T1is = t1 - ((p1 - p2) / 20) * (25.1 - 0.03 * t1);
    const K1 = (p2 / CONST_54) * (CONST_8275 / (T1is + CONST_2733));
    const K2 = Math.pow(wcrh / CONST_1690, 2) * (CONST_54 / p2) * ((t2 + 273.2) / CONST_6332);
    const K3 = Math.pow(d2 / CONST_500, 2);
    const leakRate = CONST_K * (tmix - t2) * K1 * K2 * K3;

    // Format based on unit before setting result
    let finalResult;
    if (wcrUnit === "KG/HR") {
      finalResult = Math.floor(leakRate).toString();
    } else {
      finalResult = leakRate.toFixed(2);
    }

    setResult(finalResult);
    setMessage("");
    setHasWarning(false);
    setShowOutput(true);
    setInputErrors({}); // Clear all errors on successful calculation

    scrollToTop();
  };

  const resetAll = () => {
    setP1("");
    setP2("");
    setT1("");
    setT2("");
    setTmix("");
    setWCRH("");
    setD2("");
    setResult("0.00");
    setMessage("");
    setHasWarning(false);
    setInputErrors({});
    setShowOutput(false);
    scrollToTop();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <Text style={styles.logo}>KOSO</Text>
        <View style={styles.stationUnitContainer}>
          {/* Updated text to match image: "BASHP OORJA UNIT" */}
          <Text style={styles.station}>BASHP OORJA STATION - UNIT 4</Text>
          <View style={styles.underline} />
          {/* <Text style={styles.unit}>UNIT 4</Text> */}
        </View>
      </View>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Replaced StaticGasCylinder with the Image component */}
          <View style={styles.diagramImageContainer}>
             <Image 
                source={LeakDiagramImage} 
                style={styles.diagramImage}
                resizeMode="contain"
             />
          </View>

          <Text style={styles.sectionTitle}>APPLICATION - HP BYPASS</Text>

          <View style={styles.row}>
            <View onLayout={rememberY("P1")} style={styles.inputWrapper}>
              <InputField
                label="P1 (HP Inlet Pressure)"
                value={P1}
                onChangeText={(t) => {
                  setP1(t);
                  validateFieldInRealTime("P1", t);
                  setShowOutput(false);
                }}
                errorText={inputErrors.P1}
              />
            </View>

            <View onLayout={rememberY("T1")} style={styles.inputWrapper}>
              <InputField
                label="T1 (HP Steam °C)"
                value={T1}
                onChangeText={(t) => {
                  setT1(t);
                  validateFieldInRealTime("T1", t);
                  setShowOutput(false);
                }}
                errorText={inputErrors.T1}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View onLayout={rememberY("P2")} style={styles.inputWrapper}>
              <InputField
                label="P2 (CRH Outlet Pressure)"
                value={P2}
                onChangeText={(t) => {
                  setP2(t);
                  validateFieldInRealTime("P2", t);
                  setShowOutput(false);
                }}
                errorText={inputErrors.P2}
              />
            </View>

            <View onLayout={rememberY("T2")} style={styles.inputWrapper}>
              <InputField
                label="T2 (°C)"
                value={T2}
                onChangeText={(t) => {
                  setT2(t);
                  validateFieldInRealTime("T2", t);
                  setShowOutput(false);
                }}
                errorText={inputErrors.T2}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View onLayout={rememberY("WCRH")} style={styles.inputWrapper}>
              <InputField
                label="W-CRH"
                value={WCRH}
                onChangeText={(t) => {
                  setWCRH(t);
                  validateFieldInRealTime("WCRH", t);
                  setShowOutput(false);
                }}
                errorText={inputErrors.WCRH}
              />
            </View>

            <View onLayout={rememberY("Unit")} style={{ flex: 1, marginRight: 8, zIndex: 3000 }}>
              <Text style={styles.inputLabels}>Unit</Text>
              <DropDownPicker
                open={open}
                value={wcrUnit}
                items={items}
                setOpen={setOpen}
                setValue={(value) => {
                  setWcrUnit(value);
                  setShowOutput(false);
                }}
                setItems={setItems}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                textStyle={styles.dropdownText}
                placeholderStyle={styles.dropdownText}
                listMode="SCROLLVIEW"
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View onLayout={rememberY("D2")} style={styles.inputWrapper}>
              <InputField
                label="D2 (MM)"
                value={D2}
                onChangeText={(t) => {
                  setD2(t);
                  validateFieldInRealTime("D2", t);
                  setShowOutput(false);
                }}
                errorText={inputErrors.D2}
              />
            </View>

            <View onLayout={rememberY("Tmix")} style={styles.inputWrapper}>
              <InputField
                label="T-MIX (°C)"
                value={Tmix}
                onChangeText={(t) => {
                  setTmix(t);
                  validateFieldInRealTime("Tmix", t);
                  setShowOutput(false);
                }}
                errorText={inputErrors.Tmix}
              />
            </View>
          </View>

          {/* Show Output Box only when we have valid result and showOutput is true */}
          {showOutput && (
            <Reanimated.View entering={FadeIn.duration(500)} style={styles.outputBox}>
              <View style={styles.outputInnerBox}>
                <Text style={styles.outputLabel}>LEAK RATE :</Text>
                <Text
                  style={[
                    styles.outputValueText,
                    result === "NA" && { color: "red" }
                  ]}
                >
                  {result === "NA" ? (
                    <>
                      NA <Text style={{ fontSize: 12 }}>(Check Inputs)</Text>
                    </>
                  ) : (
                    `${formatResult(result, wcrUnit)} ${wcrUnit === "T/HR" ? "T/H" : "KG/HR"
                    }`
                  )}
                </Text>
              </View>

              {hasWarning && message ? <Text style={styles.outputWarningText}>Warning : {message}</Text> : null}
            </Reanimated.View>
          )}

          {/* Show Calculate Button only when output is not showing */}
          {!showOutput && (
            <TouchableOpacity style={styles.calculateBtn} onPress={calculateLeakFlow} accessibilityRole="button">
              <Text style={styles.calculateText}>Calculate</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={resetAll} accessibilityRole="button">
            <Text style={styles.resetText}>Reset Value</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  errorText,
}) {
  return (
    <View style={styles.inputFieldContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, errorText ? styles.inputError : null]}
        keyboardType="numeric"
        value={value}
        onChangeText={onChangeText}
        placeholder="00"
        placeholderTextColor="#FF4D57" // Changed placeholder color to match the image
      />
      {errorText ? <Text style={styles.fieldErrorText}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 18,
    // flexDirection: "row",
    // alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  logo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF4D57",
        alignItems: "flex-start",
        marginTop:10,

  },
  



   stationUnitContainer: {
    alignItems: "center",
    // marginTop:12,
  },
  station: {
    fontSize: 15,
    color: "#D3D3D3",
        alignItems: "center",
        fontWeight: "bold",

  },
  underline: {
    height: 1,
    width: "65%",
    backgroundColor: "#D3D3D3",
    marginVertical: 2,
  },
  unit: {
    fontSize: 13,
    color: "#D3D3D3",
  },
  // --- New styles for Image Diagram ---
  diagramImageContainer: {
    alignSelf: "center",
    width: "170%",
    height: 250, // Adjusted height to fit the diagram
    marginVertical: 1,
    marginTop: 2,
    marginBottom: 5,
  },
  diagramImage: {
    width: '105%',
    height: '100%',
  },
  // --- End new styles for Image Diagram ---
  outputBox: {
    marginTop: 15, // Increased margin to separate from inputs
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "rgba(255, 77, 87, 0.1)",
    borderColor: "#FF4D57",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5, // Made it less rounded
    width: "95%",
    alignSelf: "center",
  },
  outputInnerBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  outputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginRight: 5,
  },
  outputValueText: {
    color: "#066e2cff",
    fontSize: 18,
    fontWeight: "bold",
  },
  outputWarningText: {
    fontSize: 13,
    color: "#FF4D57",
    marginTop: 5,
    textAlign: "center",
  },
  sectionTitle: {
    backgroundColor: "#ECE9E9",
    padding: 10,
    fontSize: 15,
    color: "#FF4D57",
    marginVertical: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 2,
  },
  inputFieldContainer: {
    flex: 1,
    marginHorizontal: 2,
  },
  inputLabel: {
    color: "#080808",
    marginBottom: 2,
    fontSize: 11,
    marginRight: 8, 
    marginLeft: 8,
    
  },
  inputLabels: { // Used for 'Unit' dropdown label
    color: "#080808",
    marginBottom: 5,
    fontSize: 11,
    // marginRight: 8, 
    marginLeft:15,
  },
  // --- Input field style changes for bottom line ---
  input: {
    backgroundColor: "transparent", // Set background to transparent
    color: "#8d8484ff", // Set text color to red/pink for the '00' look
    padding: 8,
    borderRadius: 0,
    // margin:5,
    fontSize: 14,
    borderWidth: 0,
    borderBottomWidth: 1, // Add bottom border
    borderColor: "#FF4D57", // Bottom border color
    paddingBottom: 4, // Adjust padding to make it look like a line
    height: 35, // Give it a fixed height
    marginRight: 8, 
    marginLeft: 8,
  },
  inputError: {
    borderColor: "#D60000",
    borderBottomWidth: 1.5,
    marginRight: 8, 
    marginLeft: 8,
  },
  // --- End Input field style changes ---
  fieldErrorText: {
    color: "#D60000",
    marginTop: 3,
    fontSize: 11,
    marginRight: 8, 
    marginLeft: 8,
  },
  dropdown: {
    backgroundColor: "transparent", // Transparent background for dropdown
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1, // Add bottom border
    borderColor: "#FF4D57",
    height: 35,
    width: '90%',
    minHeight: 35,
    marginRight: 8, 
    marginLeft: 8,
  },
  dropdownList: {
    // backgroundColor: "#F1E4E4",
    borderRadius: 0,
    zIndex: 3000,
    borderColor: "#FF4D57",
    marginRight: 8, 
    marginLeft: 8,
  },
  dropdownText: {
    color: "#FF4D57", // Red text for dropdown value
    fontSize: 11,
    lineHeight: 18,
  },
  calculateBtn: {
    backgroundColor: "#FF4D57",
    padding: 12, // Increased padding
    borderRadius: 30,
    marginTop: 15, // Increased margin
    width: "55%",
    alignSelf: "center",
    alignItems: "center",
  },
  calculateText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  resetText: {
    color: "#111111",
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },
});


// import React, { useRef, useState } from "react";
// import {
//   Image,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// import Reanimated, { FadeIn } from "react-native-reanimated";

// // ⚠️ REPLACE THIS WITH YOUR ACTUAL IMAGE IMPORT
// const LeakDiagramImage = require('../assets/images/image.png'); 

// const validateInputs = (p1, p2, t1, t2, tmix, wcrh, d2, wcrUnit) => {
//   const warningsByField = {
//     P1: undefined,
//     P2: undefined,
//     T1: undefined,
//     T2: undefined,
//     Tmix: undefined,
//     WCRH: undefined,
//     D2: undefined,
//   };
//   let leakRateOutput = null;

//   // P1
//   if (p1 < 80) warningsByField.P1 = "P1 out of bounds (LOW) - (80-280)";
//   if (p1 > 280) warningsByField.P1 = "P1 out of bounds (HIGH) - (80-280)";

//   // P2
//   if (p2 < 20) warningsByField.P2 = "P-CRH out of bounds (LOW) - (20-60)";
//   if (p2 > 60) warningsByField.P2 = "P-CRH out of bounds (HIGH) - (20-60)";

//   // P1/P2
//   if (p2 !== 0) {
//     if (p1 / p2 < 2) warningsByField.P2 = "(P1/P2-CRH) ratio out of bounds (LOW) - (2-6)";
//     if (p1 / p2 > 6) warningsByField.P2 = "(P1/P2-CRH) ratio out of bounds (HIGH) - (2-6)";
//   } else {
//     warningsByField.P2 = "P2 cannot be zero for ratio check";
//   }

//   // T1
//   if (t1 < 500) warningsByField.T1 = "T1 out of bounds (LOW) - (500-600)";
//   if (t1 > 600) warningsByField.T1 = "T1 out of bounds (HIGH) - (500-600)";

//   // T2
//   if (t2 < 300) warningsByField.T2 = "T2 out of bounds (LOW) - (300-425)";
//   if (t2 > 425) warningsByField.T2 = "T2 out of bounds (HIGH) - (300-425)";

//   // Tmix
//   if (tmix < 300) warningsByField.Tmix = "T_M out of bounds (LOW) - (300-450)";
//   if (tmix > 450) warningsByField.Tmix = "T_M out of bounds (HIGH) - (300-450)";

//   // Tmix checks
//   if (t2 - tmix > 4) {
//     warningsByField.Tmix = "T_M temperature error (less than T-CRH) ";
//   }
//   if (Math.abs(t2 - tmix) < 4) {
//     warningsByField.T2 = "Possible inaccuracy in T2 and/or T_M";
//     warningsByField.Tmix = "Possible inaccuracy in T2 and/or T_M";
//     leakRateOutput = "0.00";
//   }

//   // W bounds (normalize to T/HR)
//   if (wcrh < 100) warningsByField.WCRH = "W out of bounds (LOW) - (100-4000)";
//   if (wcrh > 4000) warningsByField.WCRH = "W out of bounds (HIGH) - (100-4000)";

//   // D
//   if (d2 < 300) warningsByField.D2 = "D out of bounds (LOW) - (300-600)";
//   if (d2 > 600) warningsByField.D2 = "D out of bounds (HIGH) - (300-600)";

//   const anyWarning = Object.values(warningsByField).some(Boolean);
//   return { warningsByField, leakRateOutput, anyWarning };
// };

// export default function Index() {
//   const [P1, setP1] = useState("");
//   const [P2, setP2] = useState("");
//   const [T1, setT1] = useState("");
//   const [T2, setT2] = useState("");
//   const [Tmix, setTmix] = useState("");
//   const [WCRH, setWCRH] = useState("");
//   const [D2, setD2] = useState("");

//   const [showOutput, setShowOutput] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [wcrUnit, setWcrUnit] = useState("T/HR");
//   const [items, setItems] = useState([
//     { label: "T/HR", value: "T/HR" },
//     { label: "KG/HR", value: "KG/HR" },
//   ]);

//   const [result, setResult] = useState("0.00");
//   const [message, setMessage] = useState("");
//   const [hasWarning, setHasWarning] = useState(false);

//   const [inputErrors, setInputErrors] = useState({});

//   // Constants for calculation
//   const CONST_54 = 54;
//   const CONST_8275 = 827.5;
//   const CONST_2733 = 273.3;
//   const CONST_1690 = 1690;
//   const CONST_6332 = 633.2;
//   const CONST_500 = 500;
//   const CONST_K = wcrUnit === "T/HR" ? 0.145 : 145;

//   const scrollRef = useRef(null);
//   const outputRef = useRef(null);

//   const fieldPositions = useRef({}).current;
//   const rememberY = (key) => (e) => {
//     fieldPositions[key] = e.nativeEvent.layout.y;
//   };

//   // Store output position for scrolling
//   const rememberOutputPosition = (e) => {
//     fieldPositions.output = e.nativeEvent.layout.y;
//   };

//   // Scroll to output function
//   const scrollToOutput = () => {
//     requestAnimationFrame(() => {
//       if (fieldPositions.output !== undefined) {
//         scrollRef.current?.scrollTo({ 
//           y: Math.max(fieldPositions.output - 100, 0), 
//           animated: true 
//         });
//       }
//     });
//   };

//   const scrollToTop = () => {
//     requestAnimationFrame(() => {
//       scrollRef.current?.scrollTo({ y: 0, animated: true });
//     });
//   };

//   // Real-time validation function
//   const validateFieldInRealTime = (fieldName, value) => {
//     if (!value.trim()) {
//       setInputErrors(prev => ({ ...prev, [fieldName]: undefined }));
//       return;
//     }

//     const numValue = parseFloat(value);
//     if (isNaN(numValue)) {
//       setInputErrors(prev => ({ ...prev, [fieldName]: "Must be a number" }));
//       return;
//     }

//     let error = undefined;

//     switch (fieldName) {
//       case 'P1':
//         if (numValue < 80) error = "P1 out of bounds (LOW) - (80-280)";
//         if (numValue > 280) error = "P1 out of bounds (HIGH) - (80-280)";
//         break;
//       case 'P2':
//         if (numValue < 20) error = "P-CRH out of bounds (LOW) - (20-60)";
//         if (numValue > 60) error = "P-CRH out of bounds (HIGH) - (20-60)";
//         break;
//       case 'T1':
//         if (numValue < 500) error = "T1 out of bounds (LOW) - (500-600)";
//         if (numValue > 600) error = "T1 out of bounds (HIGH) - (500-600)";
//         break;
//       case 'T2':
//         if (numValue < 300) error = "T2 out of bounds (LOW) - (300-425)";
//         if (numValue > 425) error = "T2 out of bounds (HIGH) - (300-425)";
//         break;
//       case 'Tmix':
//         if (numValue < 300) error = "T_M out of bounds (LOW) - (300-450)";
//         if (numValue > 450) error = "T_M out of bounds (HIGH) - (300-450)";
//         break;
//       case 'WCRH':
//         if (numValue < 100) error = "W out of bounds (LOW) - (100-4000)";
//         if (numValue > 4000) error = "W out of bounds (HIGH) - (100-4000)";
//         break;
//       case 'D2':
//         if (numValue < 300) error = "D out of bounds (LOW) - (300-600)";
//         if (numValue > 600) error = "D out of bounds (HIGH) - (300-600)";
//         break;
//     }

//     setInputErrors(prev => ({ ...prev, [fieldName]: error }));
//   };

//   // Format result based on unit
//   const formatResult = (resultValue, unit) => {
//     if (resultValue === "NA" || resultValue === "0.00") return resultValue;

//     const numericValue = parseFloat(resultValue);

//     if (unit === "KG/HR") {
//       return Math.floor(numericValue).toString();
//     } else {
//       return numericValue.toFixed(2);
//     }
//   };

//   const calculateLeakFlow = () => {
//     // Dismiss keyboard first
//     Keyboard.dismiss();

//     const empties = {
//       P1: !P1.trim() ? "Required" : undefined,
//       P2: !P2.trim() ? "Required" : undefined,
//       T1: !T1.trim() ? "Required" : undefined,
//       T2: !T2.trim() ? "Required" : undefined,
//       Tmix: !Tmix.trim() ? "Required" : undefined,
//       WCRH: !WCRH.trim() ? "Required" : undefined,
//       D2: !D2.trim() ? "Required" : undefined,
//     };

//     const hasEmpty = Object.values(empties).some(Boolean);
//     if (hasEmpty) {
//       setInputErrors(empties);
//       setHasWarning(true);
//       setResult("NA");
//       setShowOutput(false);
//       const firstKey = Object.keys(empties).find((k) => (empties)[k]);
//       if (firstKey && fieldPositions[firstKey] !== undefined) {
//         requestAnimationFrame(() =>
//           scrollRef.current?.scrollTo({ y: Math.max(fieldPositions[firstKey] - 24, 0), animated: true }),
//         );
//       }
//       return;
//     }

//     const p1 = Number.parseFloat(P1);
//     const p2 = Number.parseFloat(P2);
//     const t1 = Number.parseFloat(T1);
//     const t2 = Number.parseFloat(T2);
//     const tmix = Number.parseFloat(Tmix);
//     const wcrh = Number.parseFloat(WCRH);
//     const d2 = Number.parseFloat(D2);

//     // Check for cross-field validations
//     const { warningsByField, leakRateOutput, anyWarning } = validateInputs(p1, p2, t1, t2, tmix, wcrh, d2, wcrUnit);

//     if (anyWarning) {
//       setInputErrors({ ...inputErrors, ...warningsByField });
//       setHasWarning(true);
//       setShowOutput(true);
//       setResult(leakRateOutput !== null ? leakRateOutput : "NA");
//       const firstWarnKey = Object.keys(warningsByField).find((k) => (warningsByField)[k]);
//       if (firstWarnKey && fieldPositions[firstWarnKey] !== undefined) {
//         requestAnimationFrame(() =>
//           scrollRef.current?.scrollTo({ y: Math.max(fieldPositions[firstWarnKey] - 24, 0), animated: true }),
//         );
//       } else {
//         // If no specific field to scroll to, scroll to output
//         setTimeout(scrollToOutput, 100);
//       }
//       return;
//     }

//     // Calculation logic
//     const T1is = t1 - ((p1 - p2) / 20) * (25.1 - 0.03 * t1);
//     const K1 = (p2 / CONST_54) * (CONST_8275 / (T1is + CONST_2733));
//     const K2 = Math.pow(wcrh / CONST_1690, 2) * (CONST_54 / p2) * ((t2 + 273.2) / CONST_6332);
//     const K3 = Math.pow(d2 / CONST_500, 2);
//     const leakRate = CONST_K * (tmix - t2) * K1 * K2 * K3;

//     let finalResult;
//     if (wcrUnit === "KG/HR") {
//       finalResult = Math.floor(leakRate).toString();
//     } else {
//       finalResult = leakRate.toFixed(2);
//     }

//     setResult(finalResult);
//     setMessage("");
//     setHasWarning(false);
//     setShowOutput(true);
//     setInputErrors({});

//     // Scroll to output after a short delay to ensure the output is rendered
//     setTimeout(scrollToOutput, 100);
//   };

//   const resetAll = () => {
//     // Dismiss keyboard when resetting
//     Keyboard.dismiss();
    
//     setP1("");
//     setP2("");
//     setT1("");
//     setT2("");
//     setTmix("");
//     setWCRH("");
//     setD2("");
//     setResult("0.00");
//     setMessage("");
//     setHasWarning(false);
//     setInputErrors({});
//     setShowOutput(false);
//     scrollToTop();
//   };

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
//       <View style={styles.header}>
//         <Text style={styles.logo}>KOSO</Text>
//         <View style={styles.stationUnitContainer}>
//           <Text style={styles.station}>BASHP OORJA STATION - UNIT 4</Text>
//           <View style={styles.underline} />
//         </View>
//       </View>
//       <ScrollView
//         ref={scrollRef}
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.container}>
//           <View style={styles.diagramImageContainer}>
//              <Image 
//                 source={LeakDiagramImage} 
//                 style={styles.diagramImage}
//                 resizeMode="contain"
//              />
//           </View>

//           <Text style={styles.sectionTitle}>APPLICATION - HP BYPASS</Text>

//           <View style={styles.row}>
//             <View onLayout={rememberY("P1")} style={styles.inputWrapper}>
//               <InputField
//                 label="P1 (HP Inlet Pressure)"
//                 value={P1}
//                 onChangeText={(t) => {
//                   setP1(t);
//                   validateFieldInRealTime("P1", t);
//                   setShowOutput(false);
//                 }}
//                 errorText={inputErrors.P1}
//               />
//             </View>

//             <View onLayout={rememberY("T1")} style={styles.inputWrapper}>
//               <InputField
//                 label="T1 (HP Steam °C)"
//                 value={T1}
//                 onChangeText={(t) => {
//                   setT1(t);
//                   validateFieldInRealTime("T1", t);
//                   setShowOutput(false);
//                 }}
//                 errorText={inputErrors.T1}
//               />
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View onLayout={rememberY("P2")} style={styles.inputWrapper}>
//               <InputField
//                 label="P2 (CRH Outlet Pressure)"
//                 value={P2}
//                 onChangeText={(t) => {
//                   setP2(t);
//                   validateFieldInRealTime("P2", t);
//                   setShowOutput(false);
//                 }}
//                 errorText={inputErrors.P2}
//               />
//             </View>

//             <View onLayout={rememberY("T2")} style={styles.inputWrapper}>
//               <InputField
//                 label="T2 (°C)"
//                 value={T2}
//                 onChangeText={(t) => {
//                   setT2(t);
//                   validateFieldInRealTime("T2", t);
//                   setShowOutput(false);
//                 }}
//                 errorText={inputErrors.T2}
//               />
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View onLayout={rememberY("WCRH")} style={styles.inputWrapper}>
//               <InputField
//                 label="W-CRH"
//                 value={WCRH}
//                 onChangeText={(t) => {
//                   setWCRH(t);
//                   validateFieldInRealTime("WCRH", t);
//                   setShowOutput(false);
//                 }}
//                 errorText={inputErrors.WCRH}
//               />
//             </View>

//             <View onLayout={rememberY("Unit")} style={{ flex: 1, marginRight: 8, zIndex: 3000 }}>
//               <Text style={styles.inputLabels}>Unit</Text>
//               <DropDownPicker
//                 open={open}
//                 value={wcrUnit}
//                 items={items}
//                 setOpen={setOpen}
//                 setValue={(value) => {
//                   setWcrUnit(value);
//                   setShowOutput(false);
//                 }}
//                 setItems={setItems}
//                 style={styles.dropdown}
//                 dropDownContainerStyle={styles.dropdownList}
//                 textStyle={styles.dropdownText}
//                 placeholderStyle={styles.dropdownText}
//                 listMode="SCROLLVIEW"
//                 zIndex={3000}
//                 zIndexInverse={1000}
//               />
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View onLayout={rememberY("D2")} style={styles.inputWrapper}>
//               <InputField
//                 label="D2 (MM)"
//                 value={D2}
//                 onChangeText={(t) => {
//                   setD2(t);
//                   validateFieldInRealTime("D2", t);
//                   setShowOutput(false);
//                 }}
//                 errorText={inputErrors.D2}
//               />
//             </View>

//             <View onLayout={rememberY("Tmix")} style={styles.inputWrapper}>
//               <InputField
//                 label="T-MIX (°C)"
//                 value={Tmix}
//                 onChangeText={(t) => {
//                   setTmix(t);
//                   validateFieldInRealTime("Tmix", t);
//                   setShowOutput(false);
//                 }}
//                 errorText={inputErrors.Tmix}
//               />
//             </View>
//           </View>

//           {/* Show Output Box only when we have valid result and showOutput is true */}
//           {showOutput && (
//             <Reanimated.View 
//               ref={outputRef}
//               onLayout={rememberOutputPosition}
//               entering={FadeIn.duration(500)} 
//               style={styles.outputBox}
//             >
//               <View style={styles.outputInnerBox}>
//                 <Text style={styles.outputLabel}>LEAK RATE :</Text>
//                 <Text
//                   style={[
//                     styles.outputValueText,
//                     result === "NA" && { color: "red" }
//                   ]}
//                 >
//                   {result === "NA" ? (
//                     <>
//                       NA <Text style={{ fontSize: 12 }}>(Check Inputs)</Text>
//                     </>
//                   ) : (
//                     `${formatResult(result, wcrUnit)} ${wcrUnit === "T/HR" ? "T/H" : "KG/HR"
//                     }`
//                   )}
//                 </Text>
//               </View>

//               {hasWarning && message ? <Text style={styles.outputWarningText}>Warning : {message}</Text> : null}
//             </Reanimated.View>
//           )}

//           {/* Show Calculate Button only when output is not showing */}
//           {!showOutput && (
//             <TouchableOpacity 
//               style={styles.calculateBtn} 
//               onPress={calculateLeakFlow} 
//               accessibilityRole="button"
//             >
//               <Text style={styles.calculateText}>Calculate</Text>
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity onPress={resetAll} accessibilityRole="button">
//             <Text style={styles.resetText}>Reset Value</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// function InputField({
//   label,
//   value,
//   onChangeText,
//   errorText,
// }) {
//   return (
//     <View style={styles.inputFieldContainer}>
//       <Text style={styles.inputLabel}>{label}</Text>
//       <TextInput
//         style={[styles.input, errorText ? styles.inputError : null]}
//         keyboardType="numeric"
//         value={value}
//         onChangeText={onChangeText}
//         placeholder="00"
//         placeholderTextColor="#FF4D57"
//       />
//       {errorText ? <Text style={styles.fieldErrorText}>{errorText}</Text> : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: {
//     flexGrow: 1,
//   },
//   container: {
//     backgroundColor: "#FFFFFF",
//     padding: 15,
//     flexGrow: 1,
//   },
//   header: {
//     backgroundColor: "#000000",
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   logo: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#FF4D57",
//     alignItems: "flex-start",
//     marginTop:10,
//   },
//   stationUnitContainer: {
//     alignItems: "center",
//   },
//   station: {
//     fontSize: 15,
//     color: "#D3D3D3",
//     alignItems: "center",
//     fontWeight: "bold",
//   },
//   underline: {
//     height: 1,
//     width: "65%",
//     backgroundColor: "#D3D3D3",
//     marginVertical: 2,
//   },
//   diagramImageContainer: {
//     alignSelf: "center",
//     width: "170%",
//     height: 250,
//     marginVertical: 1,
//     marginTop:-10,
//     marginBottom: 0,
//   },
//   diagramImage: {
//     width: '105%',
//     height: '100%',
//   },
//   outputBox: {
//     marginTop: 15,
//     marginBottom: 10,
//     alignItems: "center",
//     backgroundColor: "rgba(255, 77, 87, 0.1)",
//     borderColor: "#FF4D57",
//     borderWidth: 1,
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     width: "95%",
//     alignSelf: "center",
//   },
//   outputInnerBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   outputLabel: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#000000",
//     marginRight: 5,
//   },
//   outputValueText: {
//     color: "#066e2cff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   outputWarningText: {
//     fontSize: 13,
//     color: "#FF4D57",
//     marginTop: 5,
//     textAlign: "center",
//   },
//   sectionTitle: {
//     backgroundColor: "#ECE9E9",
//     padding: 10,
//     fontSize: 15,
//     color: "#FF4D57",
//     marginVertical: 10,
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   inputWrapper: {
//     flex: 1,
//     marginHorizontal: 2,
//   },
//   inputFieldContainer: {
//     flex: 1,
//     marginHorizontal: 2,
//   },
//   inputLabel: {
//     color: "#080808",
//     marginBottom: 2,
//     fontSize: 11,
//     marginRight: 8, 
//     marginLeft: 8,
//   },
//   inputLabels: {
//     color: "#080808",
//     marginBottom: 5,
//     fontSize: 11,
//     marginLeft:15,
//   },
//   input: {
//     backgroundColor: "transparent",
//     color: "#8d8484ff",
//     padding: 8,
//     borderRadius: 0,
//     fontSize: 14,
//     borderWidth: 0,
//     borderBottomWidth: 1,
//     borderColor: "#FF4D57",
//     paddingBottom: 4,
//     height: 35,
//     marginRight: 8, 
//     marginLeft: 8,
//   },
//   inputError: {
//     borderColor: "#D60000",
//     borderBottomWidth: 1.5,
//     marginRight: 8, 
//     marginLeft: 8,
//   },
//   fieldErrorText: {
//     color: "#D60000",
//     marginTop: 3,
//     fontSize: 11,
//     marginRight: 8, 
//     marginLeft: 8,
//   },
//   dropdown: {
//     backgroundColor: "transparent",
//     borderRadius: 0,
//     borderWidth: 0,
//     borderBottomWidth: 1,
//     borderColor: "#FF4D57",
//     height: 35,
//     width: '90%',
//     minHeight: 35,
//     marginRight: 8, 
//     marginLeft: 8,
//   },
//   dropdownList: {
//     borderRadius: 0,
//     zIndex: 3000,
//     borderColor: "#FF4D57",
//     marginRight: 8, 
//     marginLeft: 8,
//   },
//   dropdownText: {
//     color: "#FF4D57",
//     fontSize: 11,
//     lineHeight: 18,
//   },
//   calculateBtn: {
//     backgroundColor: "#FF4D57",
//     padding: 12,
//     borderRadius: 30,
//     marginTop: 10,
//     width: "55%",
//     alignSelf: "center",
//     alignItems: "center",
//   },
//   calculateText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   resetText: {
//     color: "#111111",
//     fontSize: 11,
//     textAlign: "center",
//     marginTop: 8,
//   },
// });