


// import React, { useRef, useState } from "react";
// import {
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   LayoutChangeEvent,
//   NativeSyntheticEvent,
//   TextInputChangeEventData,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// import Reanimated, { FadeIn } from "react-native-reanimated";

// // ⚠️ REPLACE THIS WITH YOUR ACTUAL IMAGE IMPORT
// const LeakDiagramImage = require('../assets/images/image.png');
// // const LeakDiagramImage = { uri: "https://i.imgur.com/your_leak_diagram_image.png" };
// // Using a placeholder URI or a local require is necessary for a real app.

// interface FieldPositions {
//   [key: string]: number;
// }

// interface InputErrors {
//   [key: string]: string | undefined;
// }

// interface WarningByField {
//   P1?: string;
//   P2?: string;
//   T1?: string;
//   T2?: string;
//   Tmix?: string;
//   WCRH?: string;
//   D2?: string;
// }

// const validateInputs = (
//   p1: number,
//   p2: number,
//   t1: number,
//   t2: number,
//   tmix: number,
//   wcrh: number,
//   d2: number,
//   wcrUnit: string
// ): { warningsByField: WarningByField; leakRateOutput: string | null; anyWarning: boolean } => {
//   const warningsByField: WarningByField = {
//     P1: undefined,
//     P2: undefined,
//     T1: undefined,
//     T2: undefined,
//     Tmix: undefined,
//     WCRH: undefined,
//     D2: undefined,
//   };

//   let leakRateOutput: string | null = null;

//   // P1
//   if (p1 < 80) warningsByField.P1 = "P1 out of bounds (LOW) - (80-280)";
//   if (p1 > 280) warningsByField.P1 = "P1 out of bounds (HIGH) - (80-280)";

//   // P2
//   if (p2 < 20) warningsByField.P2 = "P-CRH out of bounds (LOW) - (20-60)";
//   if (p2 > 60) warningsByField.P2 = "P-CRH out of bounds (HIGH) - (20-60)";

//   // P1/P2
//   // Check if P2 is non-zero before division
//   if (p2 !== 0) {
//     if (p1 / p2 < 2) warningsByField.P2 = "(P1/P2-CRH) ratio out of bounds (LOW) - (2-6)";
//     if (p1 / p2 > 6) warningsByField.P2 = "(P1/P2-CRH) ratio out of bounds (HIGH) - (2-6)";
//   } else {
//     // Handle division by zero case for ratio check
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

// export default function CalculatorScreen() { 
//   const [P1, setP1] = useState("");
//   const [P2, setP2] = useState("");
//   const [T1, setT1] = useState("");
//   const [T2, setT2] = useState("");
//   const [Tmix, setTmix] = useState("");
//   const [WCRH, setWCRH] = useState("");
//   const [D2, setD2] = useState("");

//   const [showOutput, setShowOutput] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [wcrUnit, setWcrUnit] = useState<"T/HR" | "KG/HR">("T/HR"); // Default unit
//   const [items, setItems] = useState([
//     { label: "T/HR", value: "T/HR" },
//     { label: "KG/HR", value: "KG/HR" },
//   ]);

//   const [result, setResult] = useState("0.00");
//   const [message, setMessage] = useState("");
//   const [hasWarning, setHasWarning] = useState(false);

//   const [inputErrors, setInputErrors] = useState<InputErrors>({});

//   // Constants for calculation
//   const CONST_54 = 54;
//   const CONST_8275 = 827.5;
//   const CONST_2733 = 273.3;
//   const CONST_1690 = 1690;
//   const CONST_6332 = 633.2;
//   const CONST_500 = 500;
//   const CONST_K = wcrUnit === "T/HR" ? 0.145 : 145;

//   const scrollRef = useRef<ScrollView>(null);

//   const scrollToTop = () => {
//     requestAnimationFrame(() => {
//       scrollRef.current?.scrollTo({ y: 0, animated: true });
//     });
//   };

//   const fieldPositions = useRef<FieldPositions>({}).current;

//   const rememberY = (key: string) => (e: LayoutChangeEvent) => {
//     fieldPositions[key] = e.nativeEvent.layout.y;
//   };

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

//     let error: string | undefined = undefined;

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
//   const formatResult = (resultValue: string, unit: "T/HR" | "KG/HR") => {
//     if (resultValue === "NA" || resultValue === "0.00") return resultValue;

//     const numericValue = parseFloat(resultValue);

//     if (unit === "KG/HR") {
//       // For KG/HR, show with no decimal digits (e.g., floor the value)
//       return Math.floor(numericValue).toString();
//     } else {
//       // For T/HR, show with two decimal digits
//       return numericValue.toFixed(2);
//     }
//   };

//   const calculateLeakFlow = () => {
//     const empties: InputErrors = {
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
//       const firstKey = Object.keys(empties).find((k) => empties[k]);
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
//       // Merge real-time errors with cross-field warnings
//       setInputErrors({ ...inputErrors, ...warningsByField });
//       setHasWarning(true);
//       setShowOutput(true);
//       setResult(leakRateOutput !== null ? leakRateOutput : "NA");
//       const firstWarnKey = Object.keys(warningsByField).find((k) => warningsByField[k as keyof WarningByField]);
//       if (firstWarnKey && fieldPositions[firstWarnKey] !== undefined) {
//         requestAnimationFrame(() =>
//           scrollRef.current?.scrollTo({ y: Math.max(fieldPositions[firstWarnKey] - 24, 0), animated: true }),
//         );
//       }
//       return;
//     }

//     // Calculation logic
//     const T1is = t1 - ((p1 - p2) / 20) * (25.1 - 0.03 * t1);
//     const K1 = (p2 / CONST_54) * (CONST_8275 / (T1is + CONST_2733));
//     const K2 = Math.pow(wcrh / CONST_1690, 2) * (CONST_54 / p2) * ((t2 + 273.2) / CONST_6332);
//     const K3 = Math.pow(d2 / CONST_500, 2);
//     const leakRate = CONST_K * (tmix - t2) * K1 * K2 * K3;

//     // Format based on unit before setting result
//     let finalResult: string;
//     if (wcrUnit === "KG/HR") {
//       finalResult = Math.floor(leakRate).toString();
//     } else {
//       finalResult = leakRate.toFixed(2);
//     }

//     setResult(finalResult);
//     setMessage("");
//     setHasWarning(false);
//     setShowOutput(true);
//     setInputErrors({}); // Clear all errors on successful calculation

//     scrollToTop();
//   };

//   const resetAll = () => {
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
//           {/* Updated text to match image: "BASHP OORJA UNIT" */}
//           <Text style={styles.station}>BASHP OORJA STATION - UNIT 4</Text>
//           <View style={styles.underline} />
//           {/* <Text style={styles.unit}>UNIT 4</Text> */}
//         </View>
//       </View>
//       <ScrollView
//         ref={scrollRef}
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.container}>
//           {/* Replaced StaticGasCylinder with the Image component */}
//           <View style={styles.diagramImageContainer}>
//             <Image
//               source={LeakDiagramImage}
//               style={styles.diagramImage}
//               resizeMode="contain"
//             />
//           </View>

//           <Text style={styles.sectionTitle}>APPLICATION - HP BYPASS</Text>

//           <View style={styles.row}>
//             <View onLayout={rememberY("P1")} style={styles.inputWrapper}>
//               <InputField
//                 label="P1 (HP Inlet Pressure)"
//                 value={P1}
//                 onChangeText={(t: string) => {
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
//                 onChangeText={(t: string) => {
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
//                 onChangeText={(t: string) => {
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
//                 onChangeText={(t: string) => {
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
//                 onChangeText={(t: string) => {
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
//                 setValue={(callback) => {
//                   const value = callback(wcrUnit);
//                   setWcrUnit(value as "T/HR" | "KG/HR");
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
//                 onChangeText={(t: string) => {
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
//                 onChangeText={(t: string) => {
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
//             <Reanimated.View entering={FadeIn.duration(500)} style={styles.outputBox}>
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
//             <TouchableOpacity style={styles.calculateBtn} onPress={calculateLeakFlow} accessibilityRole="button">
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

// interface InputFieldProps {
//   label: string;
//   value: string;
//   onChangeText: (text: string) => void;
//   errorText?: string;
// }

// function InputField({
//   label,
//   value,
//   onChangeText,
//   errorText,
// }: InputFieldProps) {
//   return (
//     <View style={styles.inputFieldContainer}>
//       <Text style={styles.inputLabel}>{label}</Text>
//       <TextInput
//         style={[styles.input, errorText ? styles.inputError : null]}
//         keyboardType="numeric"
//         value={value}
//         onChangeText={onChangeText}
//         placeholder="00"
//         placeholderTextColor="#FF4D57" // Changed placeholder color to match the image
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
//     marginTop: 10,
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
//   unit: {
//     fontSize: 13,
//     color: "#D3D3D3",
//   },
//   // --- New styles for Image Diagram ---
//   diagramImageContainer: {
//     alignSelf: "center",
//     width: "170%",
//     height: 250, // Adjusted height to fit the diagram
//     marginVertical: 1,
//     marginTop: 2,
//     marginBottom: 5,
//   },
//   diagramImage: {
//     width: '105%',
//     height: '100%',
//   },
//   // --- End new styles for Image Diagram ---
//   outputBox: {
//     marginTop: 15, // Increased margin to separate from inputs
//     marginBottom: 10,
//     alignItems: "center",
//     backgroundColor: "rgba(255, 77, 87, 0.1)",
//     borderColor: "#FF4D57",
//     borderWidth: 1,
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     borderRadius: 5, // Made it less rounded
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
//   inputLabels: { // Used for 'Unit' dropdown label
//     color: "#080808",
//     marginBottom: 5,
//     fontSize: 11,
//     marginLeft: 15,
//   },
//   // --- Input field style changes for bottom line ---
//   input: {
//     backgroundColor: "transparent", // Set background to transparent
//     color: "#8d8484ff", // Set text color to red/pink for the '00' look
//     padding: 8,
//     borderRadius: 0,
//     fontSize: 14,
//     borderWidth: 0,
//     borderBottomWidth: 1, // Add bottom border
//     borderColor: "#FF4D57", // Bottom border color
//     paddingBottom: 4, // Adjust padding to make it look like a line
//     height: 35, // Give it a fixed height
//     marginRight: 8,
//     marginLeft: 8,
//   },
//   inputError: {
//     borderColor: "#D60000",
//     borderBottomWidth: 1.5,
//     marginRight: 8,
//     marginLeft: 8,
//   },
//   // --- End Input field style changes ---
//   fieldErrorText: {
//     color: "#D60000",
//     marginTop: 3,
//     fontSize: 11,
//     marginRight: 8,
//     marginLeft: 8,
//   },
//   dropdown: {
//     backgroundColor: "transparent", // Transparent background for dropdown
//     borderRadius: 0,
//     borderWidth: 0,
//     borderBottomWidth: 1, // Add bottom border
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
//     color: "#FF4D57", // Red text for dropdown value
//     fontSize: 11,
//     lineHeight: 18,
//   },
//   calculateBtn: {
//     backgroundColor: "#FF4D57",
//     padding: 12, // Increased padding
//     borderRadius: 30,
//     marginTop: 15, // Increased margin
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






//////////////////////////////////////////////////////////////////

// import React, { useRef, useState, useEffect } from "react";
// import {
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   LayoutChangeEvent,
//   Modal,
//   Dimensions,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// import Reanimated, { FadeIn } from "react-native-reanimated";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { Ionicons } from '@expo/vector-icons';
// import api from "./axiosInstance";

// // ⚠️ REPLACE THIS WITH YOUR ACTUAL IMAGE IMPORT
// const LeakDiagramImage = require('../assets/images/image.png');

// const { width } = Dimensions.get('window');

// interface FieldPositions {
//   [key: string]: number;
// }

// interface InputErrors {
//   [key: string]: string | undefined;
// }

// interface FieldWarnings {
//   [key: string]: string[];
// }

// interface ValidationResult {
//   warnings: string[];
//   fieldWarnings: FieldWarnings;
//   leakRateOutput: string | null;
//   shouldCalculate: boolean;
//   missingFields: string[];
// }

// export default function CalculatorScreen() {
//   const router = useRouter();
//   const params = useLocalSearchParams();

//   const parsedPowerStationData =
//     params.powerStationData
//       ? JSON.parse(params.powerStationData as string)
//       : {};

//   const {
//     stationName,
//     pipeDiaD2,
//     p1Unit: paramP1Unit,
//     t1Unit: paramT1Unit,
//     wcrhUnit,
//     heatRateValue,
//     plantType,
//     criticalType,
//     currency: paramCurrency,
//     pipeDiaUnit: paramPipeDiaUnit,
//     sellPricePerMWh: paramSellPricePerMWh,
//     productionCost: paramProductionCost,
//     productionCostCurrency: paramProductionCostCurrency,
//     customCurrency: paramCustomCurrency,
//   } = parsedPowerStationData;

//   // Modal state
//   const [modalVisible, setModalVisible] = useState(false);
//   const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
//   const [missingFields, setMissingFields] = useState<string[]>([]);
//   const [initialCalculatorValues, setInitialCalculatorValues] = useState<any>(null);

//   // Input states
//   const [P1, setP1] = useState("");
//   const [P2, setP2] = useState("");
//   const [T1, setT1] = useState("");
//   const [T2p, setT2p] = useState("");
//   const [TCRH, setTCRH] = useState("");
//   const [Tmix, setTmix] = useState("");
//   const [WCRH, setWCRH] = useState("");
//   const [D2, setD2] = useState("");
//   const [tw, setTw] = useState("");
//   const [ww, setWw] = useState("");
//   const [showOutput, setShowOutput] = useState(false);
  

//   // Field-specific warnings state
//   const [fieldWarnings, setFieldWarnings] = useState<FieldWarnings>({
//     P1: [],
//     P2: [],
//     T1: [],
//     T2p: [],
//     TCRH: [],
//     Tmix: [],
//     WCRH: [],
//     D2: [],
//   });

//   // Unit states
//   const [open, setOpen] = useState(false);
//   const [wcrUnit, setWcrUnit] = useState<"T/HR" | "KG/S" | "KPPH/HR" | "LB/S">("T/HR");
//   const [items, setItems] = useState([
//     { label: "T/HR", value: "T/HR" },
//     { label: "KG/S", value: "KG/S" },
//     { label: "KPPH/HR", value: "KPPH/HR" },
//     { label: "LB/S", value: "LB/S" },
//   ]);

//   const [openP1, setOpenP1] = useState(false);
//   const [p1Unit, setP1Unit] = useState<"bara" | "psia">("bara");
//   const [p1Items, setP1Items] = useState([
//     { label: "barA", value: "bara" },
//     { label: "psiA", value: "psia" },
//   ]);

//   const [openT1, setOpenT1] = useState(false);
//   const [t1Unit, setT1Unit] = useState<"C" | "F">("C");
//   const [t1Items, setT1Items] = useState([
//     { label: "°C", value: "C" },
//     { label: "°F", value: "F" },
//   ]);

//   // Additional data states
//   const [currency, setCurrency] = useState("INR");
//   const [heatRateUnit, setHeatRateUnit] = useState("kJ/kW-h");
//   const [productionCost, setProductionCost] = useState("");
//   const [sellPricePerMWh, setSellPricePerMWh] = useState("");
//   const [pipeDiaUnit, setPipeDiaUnit] = useState("MM");
//   const [customCurrency, setCustomCurrency] = useState("");
//   const [plantMCR, setPlantMCR] = useState("");
  

//   // Warning and result states
//   const [warnings, setWarnings] = useState<string[]>([]);
//   const [result, setResult] = useState("0.00");
//   const [hasWarning, setHasWarning] = useState(false);
//   const [inputErrors, setInputErrors] = useState<InputErrors>({});
//   const [calculatedResults, setCalculatedResults] = useState({
//     leakRate: "0.00",
//     mwLoss: "0.00",
//     hrPenalty: "0.00",
//     productionLoss: "0.00",
//     revenueLoss: "0.00",
//     productionCostWasted: "0.00",
//     hasWarning: false,
//     warningMessages: [] as string[]
//   });

//   const scrollRef = useRef<ScrollView>(null);
//   const fieldPositions = useRef<FieldPositions>({}).current;

//   // Create a state to store all calculator input values
// const [calculatorInputs, setCalculatorInputs] = useState({
//   P1: "",
//   P2: "",
//   T1: "",
//   T2p: "",
//   TCRH: "",
//   Tmix: "",
//   WCRH: "",
//   D2: "",
//   tw: "",
//   ww: "",
//   p1Unit: "bara" as "bara" | "psia",
//   t1Unit: "C" as "C" | "F",
//   wcrUnit: "T/HR" as "T/HR" | "KG/S" | "KPPH/HR" | "LB/S"
// });

// // Helper function to format numbers with commas
// const formatNumberWithCommas = (value: string | number): string => {
//   const num = typeof value === 'string' ? parseFloat(value) : value;
//   if (isNaN(num)) return "0";
  
//   // Split into integer and decimal parts
//   const parts = num.toFixed(2).split('.');
//   const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//   const decimalPart = parts[1];
  
//   return `${integerPart}.${decimalPart}`;
// };

// // Helper function to get currency symbol
// const getCurrencySymbol = (currencyCode: string): string => {
//   const symbols: { [key: string]: string } = {
//     'USD': '$',
//     'EUR': '€',
//     'GBP': '£',
//     'JPY': '¥',
//     'INR': '₹',
//     'CNY': '¥',
//     'AUD': 'A$',
//     'CAD': 'C$',
//     'CHF': 'CHF',
//     'custom': '₿' // Default symbol for custom currency
//   };
  
//   // If custom currency, check if customCurrency is provided
//   if (currencyCode === 'custom') {
//     return customCurrency || '$';
//   }
  
//   return symbols[currencyCode] || currencyCode;
// };

// // Update calculator inputs whenever any input changes
// useEffect(() => {
//   setCalculatorInputs({
//     P1, P2, T1, T2p, TCRH, Tmix, WCRH, D2, tw, ww,
//     p1Unit, t1Unit, wcrUnit
//   });
// }, [P1, P2, T1, T2p, TCRH, Tmix, WCRH, D2, tw, ww, p1Unit, t1Unit, wcrUnit]);

//   // Initialize all values from passed parameters
// // In CalculatorScreen.tsx, update the useEffect that initializes from params

// useEffect(() => {
//   console.log("Received params in calculator:", parsedPowerStationData);
  
//   // Basic plant data
//   if (pipeDiaD2) setD2(pipeDiaD2);
//   if (paramPipeDiaUnit) setPipeDiaUnit(paramPipeDiaUnit);

//   if (parsedPowerStationData.plantMCR) {
//     setPlantMCR(parsedPowerStationData.plantMCR);
//   }
  
//   // Unit settings
//   if (paramP1Unit === "barA") setP1Unit("bara");
//   if (paramP1Unit === "psiA") setP1Unit("psia");
//   if (paramT1Unit === "deg C") setT1Unit("C");
//   if (paramT1Unit === "deg F") setT1Unit("F");
//   if (wcrhUnit) setWcrUnit(wcrhUnit as any);
  
//   // Financial data
//   if (paramCurrency) setCurrency(paramCurrency);
//   if (paramSellPricePerMWh) setSellPricePerMWh(paramSellPricePerMWh);
//   if (paramProductionCost) setProductionCost(paramProductionCost);
//   if (paramProductionCostCurrency) setCurrency(paramProductionCostCurrency);
//   if (paramCustomCurrency) setCustomCurrency(paramCustomCurrency);
  
//   // Heat rate
//    if (parsedPowerStationData.heatRateValue) {
//     setHeatRateValue(parsedPowerStationData.heatRateValue);
//   }
//   if (parsedPowerStationData.heatRateUnit) {
//     setHeatRateUnit(parsedPowerStationData.heatRateUnit);
//   }

//   // RESTORE CALCULATOR VALUES - Check if we have saved calculator values
//   if (parsedPowerStationData.p1Value) {
//     console.log("Restoring P1 value:", parsedPowerStationData.p1Value);
//     setP1(parsedPowerStationData.p1Value);
//   }
//   if (parsedPowerStationData.p2Value) {
//     console.log("Restoring P2 value:", parsedPowerStationData.p2Value);
//     setP2(parsedPowerStationData.p2Value);
//   }
//   if (parsedPowerStationData.t1Value) {
//     console.log("Restoring T1 value:", parsedPowerStationData.t1Value);
//     setT1(parsedPowerStationData.t1Value);
//   }
//   if (parsedPowerStationData.t2pValue) {
//     console.log("Restoring T2p value:", parsedPowerStationData.t2pValue);
//     setT2p(parsedPowerStationData.t2pValue);
//   }
//   if (parsedPowerStationData.tcrhValue) {
//     console.log("Restoring TCRH value:", parsedPowerStationData.tcrhValue);
//     setTCRH(parsedPowerStationData.tcrhValue);
//   }
//   if (parsedPowerStationData.tmixValue) {
//     console.log("Restoring Tmix value:", parsedPowerStationData.tmixValue);
//     setTmix(parsedPowerStationData.tmixValue);
//   }
//   if (parsedPowerStationData.wcrhValue) {
//     console.log("Restoring WCRH value:", parsedPowerStationData.wcrhValue);
//     setWCRH(parsedPowerStationData.wcrhValue);
//   }
//   if (parsedPowerStationData.d2Value) {
//     console.log("Restoring D2 value:", parsedPowerStationData.d2Value);
//     setD2(parsedPowerStationData.d2Value);
//   }
//   if (parsedPowerStationData.twValue) {
//     console.log("Restoring Tw value:", parsedPowerStationData.twValue);
//     setTw(parsedPowerStationData.twValue);
//   }
//   if (parsedPowerStationData.wwValue) {
//     console.log("Restoring Ww value:", parsedPowerStationData.wwValue);
//     setWw(parsedPowerStationData.wwValue);
//   }
// }, []);

// useEffect(() => {
//   if (params.calculatorData) {
//     try {
//       const savedCalculatorData = JSON.parse(params.calculatorData as string);
//       setInitialCalculatorValues(savedCalculatorData);
      
//       // Restore all calculator input values
//       setP1(savedCalculatorData.P1 || "");
//       setP2(savedCalculatorData.P2 || "");
//       setT1(savedCalculatorData.T1 || "");
//       setT2p(savedCalculatorData.T2p || "");
//       setTCRH(savedCalculatorData.TCRH || "");
//       setTmix(savedCalculatorData.Tmix || "");
//       setWCRH(savedCalculatorData.WCRH || "");
//       setD2(savedCalculatorData.D2 || "");
//       setTw(savedCalculatorData.tw || "");
//       setWw(savedCalculatorData.ww || "");
//       setP1Unit(savedCalculatorData.p1Unit || "bara");
//       setT1Unit(savedCalculatorData.t1Unit || "C");
//       setWcrUnit(savedCalculatorData.wcrUnit || "T/HR");
//     } catch (error) {
//       console.error("Error parsing calculator data:", error);
//     }
//   }
// }, [params.calculatorData]);

//   // Real-time validation function for individual fields based on the image
//   const validateField = (fieldName: string, value: string, allValues?: any): string[] => {
//     const fieldSpecificWarnings: string[] = [];
//     const numValue = Number.parseFloat(value) || 0;
    
//     if (!value) {
//       return fieldSpecificWarnings; // Don't show warnings for empty fields in real-time
//     }

//     const p1Value = Number.parseFloat(allValues?.P1 || P1) || 0;
//     const p2Value = Number.parseFloat(allValues?.P2 || P2) || 0;
//     const tcrhValue = Number.parseFloat(allValues?.TCRH || TCRH) || 0;
//     const tmixValue = Number.parseFloat(allValues?.Tmix || Tmix) || 0;

//     switch (fieldName) {
//       case 'P1':
//         if (numValue < 80) fieldSpecificWarnings.push("P1 out of bounds (LOW) (80-280)");
//         if (numValue > 280) fieldSpecificWarnings.push("P1 out of bounds (HIGH) (80-280)");
//         break;
//       case 'P2':
//         if (numValue < 20) fieldSpecificWarnings.push("P-CRH out of bounds (LOW) (20-60)");
//         if (numValue > 60) fieldSpecificWarnings.push("P-CRH out of bounds (HIGH) (20-60)");
        
//         // Check P1/P2 ratio if both values exist
//         if (p1Value > 0 && numValue > 0) {
//           const ratio = p1Value / numValue;
//           if (ratio < 2) fieldSpecificWarnings.push("(P1/P-CRH) ratio out of bounds (LOW) (2-6)");
//           if (ratio > 6) fieldSpecificWarnings.push("(P1/P-CRH) ratio out of bounds (HIGH) (2-6)");
//         }
//         break;
//       case 'T1':
//         if (numValue < 500) fieldSpecificWarnings.push("T1 out of bounds (LOW) (500-600)");
//         if (numValue > 600) fieldSpecificWarnings.push("T1 out of bounds (HIGH) (500-600)");
//         break;
//       case 'T2p':
//         if (numValue < 460) fieldSpecificWarnings.push("T2p out of bounds (LOW) (460-560)");
//         if (numValue > 560) fieldSpecificWarnings.push("T2p out of bounds (HIGH) (460-560)");
//         break;
//       case 'TCRH':
//         if (numValue < 300) fieldSpecificWarnings.push("TCRH out of bounds (LOW) (300-425)");
//         if (numValue > 425) fieldSpecificWarnings.push("TCRH out of bounds (HIGH) (300-425)");
        
//         // Check TCRH vs Tmix
//         if (tmixValue > 0) {
//           if (numValue - tmixValue > 2) {
//             fieldSpecificWarnings.push("T_m error (less than T_CRH)");
//           }
//           if (numValue - tmixValue > 4) {
//             fieldSpecificWarnings.push("Possible inaccuracy in T_CRH and/or T_m");
//           }
//         }
//         break;
//       case 'Tmix':
//         if (numValue < 300) fieldSpecificWarnings.push("T_m out of bounds (LOW) (300-450)");
//         if (numValue > 450) fieldSpecificWarnings.push("T_m out of bounds (HIGH) (300-450)");
        
//         // Check Tmix vs TCRH
//         if (tcrhValue > 0) {
//           if (tcrhValue - numValue > 2) {
//             fieldSpecificWarnings.push("T_m error (less than T_CRH)");
//           }
//           if (tcrhValue - numValue > 4) {
//             fieldSpecificWarnings.push("Possible inaccuracy in T_CRH and/or T_m");
//           }
//         }
//         break;
//       case 'WCRH':
//         if (numValue < 500) fieldSpecificWarnings.push("W_CRH out of bounds (LOW) (500-2500)");
//         if (numValue > 2500) fieldSpecificWarnings.push("W_CRH out of bounds (HIGH) (500-2500)");
//         break;
//       case 'D2':
//         if (numValue < 300) fieldSpecificWarnings.push("D2 out of bounds (LOW) (300-600)");
//         if (numValue > 600) fieldSpecificWarnings.push("D2 out of bounds (HIGH) (300-600)");
//         break;
//     }
    
//     return fieldSpecificWarnings;
//   };

//   // Update field warnings when any input changes
//   useEffect(() => {
//     const newFieldWarnings = { ...fieldWarnings };
//     const allValues = { P1, P2, T1, T2p, TCRH, Tmix, WCRH, D2 };
    
//     newFieldWarnings.P1 = validateField('P1', P1, allValues);
//     newFieldWarnings.P2 = validateField('P2', P2, allValues);
//     newFieldWarnings.T1 = validateField('T1', T1, allValues);
//     newFieldWarnings.T2p = validateField('T2p', T2p, allValues);
//     newFieldWarnings.TCRH = validateField('TCRH', TCRH, allValues);
//     newFieldWarnings.Tmix = validateField('Tmix', Tmix, allValues);
//     newFieldWarnings.WCRH = validateField('WCRH', WCRH, allValues);
//     newFieldWarnings.D2 = validateField('D2', D2, allValues);
    
//     setFieldWarnings(newFieldWarnings);
//   }, [P1, P2, T1, T2p, TCRH, Tmix, WCRH, D2]);

//   const rememberY = (key: string) => (e: LayoutChangeEvent) => {
//     fieldPositions[key] = e.nativeEvent.layout.y;
//   };

//   const scrollToTop = () => {
//     requestAnimationFrame(() => {
//       scrollRef.current?.scrollTo({ y: 0, animated: true });
//     });
//   };

//  // Update the goBackToEdit function to preserve all calculator values
// // In CalculatorScreen.tsx, update the goBackToEdit function

// const goBackToEdit = () => {
//   // Prepare all data to send back, including ALL calculator inputs
//   const powerStationData = {
//     // Basic plant data from first screen
//     stationName: stationName,
//     pipeDiaD2: D2,
//     pipeDiaUnit: pipeDiaUnit,
//     plantType: plantType,
//     criticalType: criticalType,
//     plantMCR: plantMCR,
//     heatRateValue: heatRateValue,
//     heatRateUnit: heatRateUnit,
    
//     // Financial data
//     currency: currency,
//     sellPricePerMWh: sellPricePerMWh,
//     productionCost: productionCost,
//     productionCostCurrency: currency,
//     customCurrency: customCurrency,
    
//     // Calculator screen inputs - THESE WILL BE PRESERVED
//     p1Value: P1,
//     p2Value: P2,
//     t1Value: T1,
//     t2pValue: T2p,
//     tcrhValue: TCRH,
//     tmixValue: Tmix,
//     wcrhValue: WCRH,
//     d2Value: D2,
//     twValue: tw,
//     wwValue: ww,
    
//     // Units
//     p1Unit: p1Unit === "bara" ? "barA" : "psiA",
//     t1Unit: t1Unit === "C" ? "deg C" : "deg F",
//     wcrhUnit: wcrUnit,
//   };

//   console.log("Sending back to edit screen:", powerStationData); // Debug log

//   router.push({
//     pathname: "/Additional_user_inputs",
//     params: {
//       powerStationData: JSON.stringify(powerStationData),
//       fromCalculator: 'true' // Flag to indicate we're coming back from calculator
//     }
//   });
// };

// // Add this in CalculatorScreen to verify values are preserved when returning from edit

// useEffect(() => {
//   console.log("Current calculator values:", {
//     P1, P2, T1, T2p, TCRH, Tmix, WCRH, D2, tw, ww,
//     p1Unit, t1Unit, wcrUnit
//   });
// }, [P1, P2, T1, T2p, TCRH, Tmix, WCRH, D2, tw, ww, p1Unit, t1Unit, wcrUnit]);

//   // Unit conversion function
//  const convertUnits = () => {
//   let p1 = Number.parseFloat(P1) || 0;
//   let p2 = Number.parseFloat(P2) || 0;
//   let t1 = Number.parseFloat(T1) || 0;
//   let t2p = Number.parseFloat(T2p) || 0;
//   let t2 = Number.parseFloat(TCRH) || 0;
//   let tmix = Number.parseFloat(Tmix) || 0;
//   let wcrh = Number.parseFloat(WCRH) || 0;
//   let d2 = Number.parseFloat(D2) || 0;

//   // P1/P2 conversion (psiA to barA)
//   if (p1Unit === "psia") {
//     const ConvP = 1/14.5;
//     p1 = p1 * ConvP;
//     p2 = p2 * ConvP;
//   }

//   // Temperature conversion (°F to °C)
//   if (t1Unit === "F") {
//     t1 = (t1 - 32) / 1.8;
//     t2p = (t2p - 32) / 1.8;
//     t2 = (t2 - 32) / 1.8;
//     tmix = (tmix - 32) / 1.8;
//   }

//   // W-CRH conversion to T/HR
//   if (wcrUnit === "KG/S") {
//     wcrh = wcrh * 3.6;
//   } else if (wcrUnit === "KPPH/HR") {
//     wcrh = wcrh * (1/2.24);
//   } else if (wcrUnit === "LB/S") {
//     wcrh = wcrh * (3600/2240);
//   }
//   // For T/HR, keep as is

//   // D2 conversion (IN to MM)
//   if (pipeDiaUnit === "IN") {
//     d2 = d2 * 25.4;
//   }

//   // Heat Rate conversion
//   let hrValue = Number.parseFloat(heatRateValue || "0");
//   if (heatRateUnit === "Btu/kW-h") {
//     hrValue = hrValue * 1.055;
//   } else if (heatRateUnit === "default") {
//     if (plantType === "ccpp") hrValue = 7500;
//     else if (criticalType === "supercritical") hrValue = 8400;
//     else hrValue = 9500;
//   }

//   return { p1, p2, t1, t2p, t2, tmix, wcrh, d2, hrValue };
// };
//   // Check for missing required fields
//   const checkMissingFields = (): string[] => {
//     const missing: string[] = [];
    
//     if (!P1) missing.push("P1 (HP Inlet Pressure)");
//     if (!P2) missing.push("P2 (CRH Outlet Pressure)");
//     if (!T1) missing.push("T1 (HP Steam)");
//     if (!T2p) missing.push("T2p");
//     if (!TCRH) missing.push("TCRH");
//     if (!Tmix) missing.push("T-MIX");
//     if (!WCRH) missing.push("W-CRH");
//     if (!D2) missing.push("D2");
    
//     return missing;
//   };

//   // Validation function based on the image
//   const validateInputs = (): ValidationResult => {
//     const warnings: string[] = [];
//     const fieldSpecificWarnings: FieldWarnings = {
//       P1: [], P2: [], T1: [], T2p: [], TCRH: [], Tmix: [], WCRH: [], D2: []
//     };
//     let leakRateOutput: string | null = null;
//     let shouldCalculate = true;
//     let missingFieldsList: string[] = [];

//     // First check for missing fields
//     missingFieldsList = checkMissingFields();
//     if (missingFieldsList.length > 0) {
//       return { 
//         warnings: [], 
//         fieldWarnings: fieldSpecificWarnings, 
//         leakRateOutput: null, 
//         shouldCalculate: false,
//         missingFields: missingFieldsList 
//       };
//     }

//     const p1 = Number.parseFloat(P1) || 0;
//     const p2 = Number.parseFloat(P2) || 0;
//     const t1 = Number.parseFloat(T1) || 0;
//     const t2p = Number.parseFloat(T2p) || 0;
//     const tcrh = Number.parseFloat(TCRH) || 0;
//     const tmix = Number.parseFloat(Tmix) || 0;
//     const wcrh = Number.parseFloat(WCRH) || 0;
//     const d2 = Number.parseFloat(D2) || 0;

//     // P1 bounds (80-280 barA)
//     if (p1 < 80) {
//       warnings.push("P1 out of bounds (LOW) (80-280)");
//       fieldSpecificWarnings.P1.push("P1 out of bounds (LOW) (80-280)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }
//     if (p1 > 280) {
//       warnings.push("P1 out of bounds (HIGH) (80-280)");
//       fieldSpecificWarnings.P1.push("P1 out of bounds (HIGH) (80-280)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }

//     // P2 bounds (20-60 barA)
//     if (p2 < 20) {
//       warnings.push("P-CRH out of bounds (LOW) (20-60)");
//       fieldSpecificWarnings.P2.push("P-CRH out of bounds (LOW) (20-60)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }
//     if (p2 > 60) {
//       warnings.push("P-CRH out of bounds (HIGH) (20-60)");
//       fieldSpecificWarnings.P2.push("P-CRH out of bounds (HIGH) (20-60)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }

//     // P1/P2 ratio (2-6)
//     if (p2 !== 0) {
//       const ratio = p1 / p2;
//       if (ratio < 2) {
//         warnings.push("(P1/P-CRH) ratio out of bounds (LOW) (2-6)");
//         fieldSpecificWarnings.P2.push("(P1/P-CRH) ratio out of bounds (LOW) (2-6)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (ratio > 6) {
//         warnings.push("(P1/P-CRH) ratio out of bounds (HIGH) (2-6)");
//         fieldSpecificWarnings.P2.push("(P1/P-CRH) ratio out of bounds (HIGH) (2-6)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     }

//     // T1 bounds (500-600 °C)
//     if (t1 < 500) {
//       warnings.push("T1 out of bounds (LOW) (500-600)");
//       fieldSpecificWarnings.T1.push("T1 out of bounds (LOW) (500-600)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }
//     if (t1 > 600) {
//       warnings.push("T1 out of bounds (HIGH) (500-600)");
//       fieldSpecificWarnings.T1.push("T1 out of bounds (HIGH) (500-600)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }

//     // T2p bounds (460-560 °C)
//     if (t2p < 460) {
//       warnings.push("T2p out of bounds (LOW) (460-560)");
//       fieldSpecificWarnings.T2p.push("T2p out of bounds (LOW) (460-560)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }
//     if (t2p > 560) {
//       warnings.push("T2p out of bounds (HIGH) (460-560)");
//       fieldSpecificWarnings.T2p.push("T2p out of bounds (HIGH) (460-560)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }

//     // TCRH bounds (300-425 °C)
//     if (tcrh < 300) {
//       warnings.push("TCRH out of bounds (LOW) (300-425)");
//       fieldSpecificWarnings.TCRH.push("TCRH out of bounds (LOW) (300-425)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }
//     if (tcrh > 425) {
//       warnings.push("TCRH out of bounds (HIGH) (300-425)");
//       fieldSpecificWarnings.TCRH.push("TCRH out of bounds (HIGH) (300-425)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }

//     // Tmix bounds (300-450 °C)
//     if (tmix < 300) {
//       warnings.push("T_M out of bounds (LOW) (300-450)");
//       fieldSpecificWarnings.Tmix.push("T_M out of bounds (LOW) (300-450)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }
//     if (tmix > 450) {
//       warnings.push("T_M out of bounds (HIGH) (300-450)");
//       fieldSpecificWarnings.Tmix.push("T_M out of bounds (HIGH) (300-450)");
//       // Allow calculation but with warning
//     }

//     // Tmix vs TCRH checks
//     if (tcrh - tmix > 2) {
//       warnings.push("T_m error (less than T_CRH)");
//       fieldSpecificWarnings.Tmix.push("T_m error (less than T_CRH)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }
//     if (tcrh - tmix > 4) {
//       warnings.push("Possible inaccuracy in T_CRH and/or T_m");
//       fieldSpecificWarnings.Tmix.push("Possible inaccuracy in T_CRH and/or T_m");
//       leakRateOutput = "0";
//       shouldCalculate = false;
//     }

//     // WCRH bounds (500-2500 T/HR)
//     if (wcrh < 500) {
//       warnings.push("W_CRH out of bounds (LOW) (500-2500)");
//       fieldSpecificWarnings.WCRH.push("W_CRH out of bounds (LOW) (500-2500)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }
//     if (wcrh > 2500) {
//       warnings.push("W_CRH out of bounds (HIGH) (500-2500)");
//       fieldSpecificWarnings.WCRH.push("W_CRH out of bounds (HIGH) (500-2500)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }

//     // D2 bounds (300-600 mm)
//     if (d2 < 300) {
//       warnings.push("D2 out of bounds (LOW) (300-600)");
//       fieldSpecificWarnings.D2.push("D2 out of bounds (LOW) (300-600)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }
//     if (d2 > 600) {
//       warnings.push("D2 out of bounds (HIGH) (300-600)");
//       fieldSpecificWarnings.D2.push("D2 out of bounds (HIGH) (300-600)");
//       leakRateOutput = "NA";
//       shouldCalculate = false;
//     }

//     return { 
//       warnings, 
//       fieldWarnings: fieldSpecificWarnings, 
//       leakRateOutput, 
//       shouldCalculate,
//       missingFields: [] 
//     };
//   };

//   const calculateLeakFlow = () => {
//     // Check for missing fields first
//     const missing = checkMissingFields();
//     if (missing.length > 0) {
//       setMissingFields(missing);
//       setShowMissingFieldsModal(true);
//       return;
//     }

//     // Validate inputs
//     const validation = validateInputs();
    
//     if (validation.warnings.length > 0) {
//       setWarnings(validation.warnings);
//       setHasWarning(true);
//       setResult(validation.leakRateOutput || "0.00");
      
//       // Update field warnings
//       setFieldWarnings(validation.fieldWarnings);
      
//       setCalculatedResults(prev => ({
//         ...prev,
//         hasWarning: true,
//         warningMessages: validation.warnings
//       }));
      
//       scrollToTop();
//       return;
//     }

//     // If no warnings, proceed with calculation
//     performCalculation();
//   };

// const performCalculation = () => {
//   // Convert units for calculation
//   const converted = convertUnits();
//   const { p1, p2, t1, t2p, t2, tmix, wcrh, d2, hrValue } = converted;
  
//   const twValue = Number(tw) || 0;
//   const wwValue = Number(ww) || 0;
//   const mcrFlowRate = Number(plantMCR) || 0; // Plant MCR in mt/h

//   // Calculate T2is (Isentropic temperature)
//   const T2is = t1 - ((p1 - p2) / 20) * (25.1 - 0.03 * t1);
  
//   // Calculate K1, K2, K3
//   const K1 = 15.32 * (p2 / (T2is + 273.2));
//   const K2 = (3 * Math.pow(10, -8)) * (Math.pow(wcrh, 2) / p2) * (t2 + 273.2);
//   const K3 = Math.pow(d2 / 500, 2);
  
//   // Calculate Wraw
//   const Wraw = 0.145 * (tmix - t2) * K1 * K2 * K3;
  
//   // Calculate Wcorr (this is in T/HR)
//   const Wcorr = Wraw * ((T2is - t2) / (t2p - t2));
  
//   // Apply spray water correction if needed
//   const correctionFactor = wwValue !== 0 && twValue !== 0 ? wwValue / twValue : 1;
//   const finalCorrectedLeakRate = Wcorr * correctionFactor;

//   // Calculate CpstH and CpstL
//   const CpstH = 3.521 + 0.00467 * p1 - 0.00274 * t1;
//   const CpstL = 2.784 + 0.01164 * p2 - 0.002 * t2;
  
//   // Convert Wcorr from T/HR to KG/S for MW calculation
//   const wcorrInKgPerSec = finalCorrectedLeakRate / 3.6;
  
//   // MW LOSS calculation
//   const mwLoss = 0.9 * wcorrInKgPerSec * ((CpstH * t1) - (CpstL * t2))/1000;
  
//   // *** FIXED: Heat Rate Penalty calculation ***
//   // Formula: D-HR = HR × MW_loss / MCR
//   // Where MCR is the Plant MCR Flow Rate in mt/h
//   let hrPenalty = 0;
//   if (mcrFlowRate > 0 && mwLoss > 0) {
//     hrPenalty = hrValue * (mwLoss / mcrFlowRate);
//   }
  
//   // Calculate Production Loss per year (8000 hours per year)
//   const productionLossPerYear = mwLoss * 8000;
  
//   // Calculate Revenue Loss per year
//   const sellPriceNum = parseFloat(sellPricePerMWh || "0");
//   const revenueLossPerYear = sellPriceNum * productionLossPerYear;
  
//   // Calculate Production Cost Wasted per year
//   const productionCostNum = parseFloat(productionCost || "50");
//   const productionCostWastedPerYear = productionCostNum * productionLossPerYear;

//   // Convert leak rate to selected unit for display
//   let displayLeakRate = finalCorrectedLeakRate;
//   if (wcrUnit === "KG/S") displayLeakRate = finalCorrectedLeakRate / 3.6;
//   else if (wcrUnit === "KPPH/HR") displayLeakRate = finalCorrectedLeakRate / (1/2.24);
//   else if (wcrUnit === "LB/S") displayLeakRate = finalCorrectedLeakRate / (3600/2240);
//   else displayLeakRate = finalCorrectedLeakRate; // T/HR

//   // Format results
//   const formattedLeakRate = displayLeakRate.toFixed(2);
//   const formattedMwLoss = mwLoss.toFixed(2);
//   const formattedHrPenalty = hrPenalty.toFixed(1);
//   const formattedProductionLoss = productionLossPerYear.toFixed(1);
//   const formattedRevenueLoss = revenueLossPerYear.toFixed(1);
//   const formattedProductionCostWasted = productionCostWastedPerYear.toFixed(1);

//   console.log("Calculation Debug:", {
//     finalCorrectedLeakRate,
//     wcorrInKgPerSec,
//     CpstH,
//     CpstL,
//     mwLoss: mwLoss,
//     hrValue: hrValue,
//     mcrFlowRate: mcrFlowRate,
//     hrPenalty: hrPenalty,
//   });

//   setCalculatedResults({
//     leakRate: formattedLeakRate,
//     mwLoss: formattedMwLoss,
//     hrPenalty: formattedHrPenalty,
//     productionLoss: formattedProductionLoss,
//     revenueLoss: formattedRevenueLoss,
//     productionCostWasted: formattedProductionCostWasted,
//     hasWarning: false,
//     warningMessages: []
//   });

//   setResult(formattedLeakRate);
//   setWarnings([]);
//   setHasWarning(false);
//   setShowOutput(true);
//   setModalVisible(true);
//   scrollToTop();
// };

//  const resetAll = () => {
//   if (initialCalculatorValues) {
//     // Reset to saved values instead of empty
//     setP1(initialCalculatorValues.P1 || "");
//     setP2(initialCalculatorValues.P2 || "");
//     setT1(initialCalculatorValues.T1 || "");
//     setT2p(initialCalculatorValues.T2p || "");
//     setTCRH(initialCalculatorValues.TCRH || "");
//     setTmix(initialCalculatorValues.Tmix || "");
//     setWCRH(initialCalculatorValues.WCRH || "");
//     setD2(initialCalculatorValues.D2 || "");
//     setTw(initialCalculatorValues.tw || "");
//     setWw(initialCalculatorValues.ww || "");
//     setP1Unit(initialCalculatorValues.p1Unit || "bara");
//     setT1Unit(initialCalculatorValues.t1Unit || "C");
//     setWcrUnit(initialCalculatorValues.wcrUnit || "T/HR");
//   } else {
//     // Regular reset to empty
//     setP1("");
//     setP2("");
//     setT1("");
//     setT2p("");
//     setTCRH("");
//     setTmix("");
//     setWCRH("");
//     setD2("");
//     setTw("");
//     setWw("");
//   }
  
//   setResult("0.00");
//   setWarnings([]);
//   setHasWarning(false);
//   setFieldWarnings({
//     P1: [], P2: [], T1: [], T2p: [], TCRH: [], Tmix: [], WCRH: [], D2: []
//   });
//   setInputErrors({});
//   setShowOutput(false);
//   setModalVisible(false);
//   setShowMissingFieldsModal(false);
//   scrollToTop();
// };

//   const handleLogout = () => {
//     router.replace("/LoginScreen");
//   };

//   const calculateAndSave = async () => {
//     calculateLeakFlow();
    
//     try {
//       const finalPayload = {
//         power_station_name: stationName,
//         pipe_dia_d2: D2,
//         pipe_dia_unit: pipeDiaUnit,
//         t2p: T2p,
//         p1: P1,
//         p1_unit: p1Unit,
//         t1: T1,
//         t1_unit: t1Unit,
//         p2: P2,
//         tcrh: TCRH,
//         w_crh: WCRH,
//         w_crh_unit: wcrUnit,
//         tw: tw,
//         ww: ww,
//         t_mix: Tmix,
//         plant_type: plantType,
//         critical_type: criticalType,
//         plant_mcr: plantMCR, 
//         heat_rate_value: heatRateValue,
//         heat_rate_unit: heatRateUnit,
//         production_cost: productionCost,
//         production_cost_currency: currency,
//         custom_currency: currency === "custom" ? customCurrency : currency,
//         sell_price_per_mwh: sellPricePerMWh
//       };

//       console.log("Saving payload:", finalPayload); // For debugging
      
//       const response = await api.post("/power-stations/", finalPayload);
//       console.log("Save response:", response.data);
//     } catch (error: any) {
//       console.log("BACKEND ERROR =>", error.response?.data);
//     }
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const closeMissingFieldsModal = () => {
//     setShowMissingFieldsModal(false);
//   };

//   const setHeatRateValue = (value: string) => {
//     // This function will be implemented to update heat rate
//     console.log("Setting heat rate to:", value);
//   };

//   // Render warning below a field
//   const renderFieldWarning = (fieldName: string) => {
//     if (fieldWarnings[fieldName] && fieldWarnings[fieldName].length > 0) {
//       return (
//         <View style={styles.fieldWarningContainer}>
//           {fieldWarnings[fieldName].map((warning, index) => (
//             <Text key={index} style={styles.fieldWarningText}>⚠ {warning}</Text>
//           ))}
//         </View>
//       );
//     }
//     return null;
//   };

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={goBackToEdit}>
//           <Ionicons name="arrow-back" size={24} color="#FF4D57" />
//           <Text style={styles.backButtonText}>Back</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//         <Text style={styles.logo}>KOSO</Text>
//         <View style={styles.stationUnitContainer}>
//           <Text style={styles.station}>{stationName || "Power Station"}</Text>
//           <View style={styles.underline} />
//         </View>
//       </View>

//       <ScrollView
//         ref={scrollRef}
//         nestedScrollEnabled={true}
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.container}>
//           <View style={styles.diagramImageContainer}>
//             <Image source={LeakDiagramImage} style={styles.diagramImage} resizeMode="contain" />
//           </View>

//           <Text style={styles.sectionTitle}>APPLICATION - HP BYPASS</Text>

//           {/* P1 and T1 Row */}
//           <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
//             <View style={{ flex: 1 }} onLayout={rememberY("P1")}>
//               <Text style={styles.inputLabel}>P1 (HP Inlet Pressure)</Text>
//               <TextInput
//                 style={[styles.input, fieldWarnings.P1.length > 0 && styles.inputError]}
//                 keyboardType="numeric"
//                 value={P1}
//                 onChangeText={setP1}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//               {renderFieldWarning('P1')}
//             </View>
//             <View style={{ width: 90, marginLeft: 6 ,marginTop: 14}}>
//               <Text style={styles.inputLabel}>Unit</Text>
//               <DropDownPicker
//                 open={openP1}
//                 value={p1Unit}
//                 items={p1Items}
//                 setOpen={setOpenP1}
//                 setValue={setP1Unit}
//                 setItems={setP1Items}
//                 style={styles.unitDropdownBox}
//                 dropDownContainerStyle={styles.unitDropdownList}
//                 textStyle={styles.unitDropdownText}
//               />
//             </View>
//             <View style={{ flex: 1, marginLeft: 8 }} onLayout={rememberY("T1")}>
//               <Text style={styles.inputLabel}>T1 (HP Steam)</Text>
//               <TextInput
//                 style={[styles.input, fieldWarnings.T1.length > 0 && styles.inputError]}
//                 keyboardType="numeric"
//                 value={T1}
//                 onChangeText={setT1}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//               {renderFieldWarning('T1')}
//             </View>
//             <View style={{ width: 90, marginLeft: 6,marginTop: 14}}>
//               <Text style={styles.inputLabel}>Unit</Text>
//               <DropDownPicker
//                 open={openT1}
//                 value={t1Unit}
//                 items={t1Items}
//                 setOpen={setOpenT1}
//                 setValue={setT1Unit}
//                 setItems={setT1Items}
//                 style={styles.unitDropdownBox}
//                 dropDownContainerStyle={styles.unitDropdownList}
//                 textStyle={styles.unitDropdownText}
//               />
//             </View>
//           </View>

//           {/* T2p */}
//           <View style={styles.row}>
//             <View onLayout={rememberY("T2p")} style={styles.inputWrapper}>
//               <Text style={styles.inputLabel}>T2p</Text>
//               <TextInput
//                 style={[styles.input, fieldWarnings.T2p.length > 0 && styles.inputError]}
//                 keyboardType="numeric"
//                 value={T2p}
//                 onChangeText={setT2p}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//               {renderFieldWarning('T2p')}
//             </View>
//           </View>

//           {/* P2 and TCRH */}
//           <View style={styles.row}>
//             <View onLayout={rememberY("P2")} style={styles.inputWrapper}>
//               <Text style={styles.inputLabel}>P2 (CRH Outlet Pressure)</Text>
//               <TextInput
//                 style={[styles.input, fieldWarnings.P2.length > 0 && styles.inputError]}
//                 keyboardType="numeric"
//                 value={P2}
//                 onChangeText={setP2}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//               {renderFieldWarning('P2')}
//             </View>
//             <View onLayout={rememberY("TCRH")} style={styles.inputWrapper}>
//               <Text style={styles.inputLabel}>TCRH</Text>
//               <TextInput
//                 style={[styles.input, fieldWarnings.TCRH.length > 0 && styles.inputError]}
//                 keyboardType="numeric"
//                 value={TCRH}
//                 onChangeText={setTCRH}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//               {renderFieldWarning('TCRH')}
//             </View>
//           </View>

//           {/* WCRH and Unit */}
//           <View style={styles.row}>
//             <View onLayout={rememberY("WCRH")} style={styles.inputWrapper}>
//               <Text style={styles.inputLabel}>W-CRH</Text>
//               <TextInput
//                 style={[styles.input, fieldWarnings.WCRH.length > 0 && styles.inputError]}
//                 keyboardType="numeric"
//                 value={WCRH}
//                 onChangeText={setWCRH}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//               {renderFieldWarning('WCRH')}
//             </View>
//             <View onLayout={rememberY("Unit")} style={{ flex: 1, marginRight: 8, zIndex: 3000 }}>
//               <Text style={styles.inputLabels}>Unit</Text>
//               <DropDownPicker
//                 open={open}
//                 value={wcrUnit}
//                 items={items}
//                 setOpen={setOpen}
//                 setValue={setWcrUnit}
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

//           {/* Tw and Ww */}
//           <View style={styles.row}>
//             <View onLayout={rememberY("Tw")} style={styles.inputWrapper}>
//               <Text style={styles.inputLabel}>Tw (Spray Water Temp)</Text>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="numeric"
//                 value={tw}
//                 onChangeText={setTw}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//             </View>
//             <View onLayout={rememberY("Ww")} style={styles.inputWrapper}>
//               <Text style={styles.inputLabel}>Ww (Spray Water Flow)</Text>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="numeric"
//                 value={ww}
//                 onChangeText={setWw}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//             </View>
//           </View>

//           {/* Tmix */}
//           <View style={styles.row}>
//             <View onLayout={rememberY("Tmix")} style={styles.inputWrapper}>
//               <Text style={styles.inputLabel}>T-MIX</Text>
//               <TextInput
//                 style={[styles.input, fieldWarnings.Tmix.length > 0 && styles.inputError]}
//                 keyboardType="numeric"
//                 value={Tmix}
//                 onChangeText={setTmix}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//               {renderFieldWarning('Tmix')}
//             </View>
//           </View>

//           {/* Warning Messages - Only for non-field specific warnings */}
//           {warnings.length > 0 && (
//             <Reanimated.View entering={FadeIn.duration(500)} style={styles.warningContainer}>
//               {warnings.map((warning, index) => (
//                 <Text key={index} style={styles.warningText}>⚠ {warning}</Text>
//               ))}
//             </Reanimated.View>
//           )}

//           {/* Output Box */}
//           {showOutput && (
//             <Reanimated.View entering={FadeIn.duration(500)} style={styles.outputBox}>
//               <View style={styles.outputInnerBox}>
//                 <Text style={styles.outputLabel}>LEAK RATE :</Text>
//                 <Text style={[styles.outputValueText, result === "NA" && { color: "red" }]}>
//                   {result === "NA" ? "NA (Check Inputs)" : `${result} ${wcrUnit}`}
//                 </Text>
//               </View>
//             </Reanimated.View>
//           )}

//           {/* Calculate Button */}
//           {!showOutput && (
//             <TouchableOpacity style={styles.calculateBtn} onPress={calculateAndSave}>
//               <Text style={styles.calculateText}>Calculate</Text>
//             </TouchableOpacity>
//           )}

//           {/* Reset Button */}
//           <TouchableOpacity onPress={resetAll}>
//             <Text style={styles.resetText}>Reset Value</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Missing Fields Modal */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={showMissingFieldsModal}
//         onRequestClose={closeMissingFieldsModal}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, { backgroundColor: '#FFF3CD' }]}>
//             <View style={styles.modalHeader}>
//               <Text style={[styles.modalTitle, { color: '#856404' }]}>Missing Required Fields</Text>
//               <TouchableOpacity onPress={closeMissingFieldsModal} style={styles.closeButton}>
//                 <Text style={styles.closeButtonText}>×</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalBody}>
//               <Text style={{ color: '#856404', fontSize: 14, marginBottom: 10 }}>
//                 Please fill in the following required fields:
//               </Text>
//               {missingFields.map((field, index) => (
//                 <View key={index} style={styles.missingFieldItem}>
//                   <Text style={styles.missingFieldText}>• {field}</Text>
//                 </View>
//               ))}
//             </View>

//             <TouchableOpacity 
//               style={[styles.modalCloseBtn, { backgroundColor: '#856404' }]} 
//               onPress={closeMissingFieldsModal}
//             >
//               <Text style={styles.modalCloseText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Results Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Calculation Results</Text>
//               <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
//                 <Text style={styles.closeButtonText}>×</Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
//               {calculatedResults.hasWarning && calculatedResults.warningMessages.length > 0 && (
//                 <View style={styles.modalWarningContainer}>
//                   {calculatedResults.warningMessages.map((warning, index) => (
//                     <Text key={index} style={styles.modalWarningText}>⚠ {warning}</Text>
//                   ))}
//                 </View>
//               )}

//               <View style={styles.resultItem}>
//                 <Text style={styles.resultLabel}>LEAK RATE:</Text>
//                 <Text style={[styles.resultValue, calculatedResults.hasWarning && { color: "#856404" }]}>
//                   {result === "NA" ? "NA (Check Inputs)" : `${calculatedResults.leakRate} ${wcrUnit}`}
//                 </Text>
//               </View>

//               <View style={styles.resultItem}>
//                 <Text style={styles.resultLabel}>Eq. MW-loss:</Text>
//                 <Text style={styles.resultValue}>{calculatedResults.mwLoss} MW</Text>
//               </View>

//               <View style={styles.resultItem}>
//                 <Text style={styles.resultLabel}>Heat Rate Penalty:</Text>
//                 <Text style={styles.resultValue}>
//                   {calculatedResults.hrPenalty} {heatRateUnit}
//                 </Text>
//               </View>

//               <View style={styles.resultItem}>
//                 <Text style={styles.resultLabel}>Production loss per year:</Text>
//                 <Text style={styles.resultValue}>{formatNumberWithCommas(calculatedResults.productionLoss)} MW-h</Text>
//               </View>

//               <View style={styles.resultItem}>
//                 <Text style={styles.resultLabel}>Revenue loss per year:</Text>
//                 <Text style={styles.resultValue}>
//                   {getCurrencySymbol(currency)} {formatNumberWithCommas(calculatedResults.revenueLoss)}
//                 </Text>
//               </View>

//               <View style={styles.resultItem}>
//                 <Text style={styles.resultLabel}>Production Cost Wasted per year:</Text>
//                 <Text style={styles.resultValue}>
//                   {getCurrencySymbol(currency)} {formatNumberWithCommas(calculatedResults.productionCostWasted)}
//                 </Text>
//               </View>
//             </ScrollView>

//             <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
//               <Text style={styles.modalCloseText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: { flexGrow: 1 },
//   container: { backgroundColor: "#FFFFFF", padding: 15, flexGrow: 1 },
//   header: { 
//     backgroundColor: "#000000", 
//     paddingVertical: 10, 
//     paddingHorizontal: 18, 
//     width: "100%",
//     position: 'relative',
//   },
//   backButton: {
//     position: "absolute",
//     bottom:10,
//     top: 10,
//     left: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//     zIndex: 20,
//   },
//   backButtonText: {
//     color: "#FF4D57",
//     fontSize: 16,
//     marginLeft: 5,
//     fontWeight: '500',
//   },
//   logo: { 
//     fontSize: 26, 
//     fontWeight: "bold", 
//     color: "#FF4D57", 
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   stationUnitContainer: { alignItems: "center" },
//   station: { fontSize: 15, color: "#D3D3D3", fontWeight: "bold" },
//   underline: { height: 1, width: "65%", backgroundColor: "#D3D3D3", marginVertical: 2 },
//   diagramImageContainer: { alignSelf: "center", width: "100%", height: 250, marginVertical: 5 },
//   diagramImage: { width: '105%', height: '100%' },
//   warningContainer: { marginTop: 10, marginBottom: 10, padding: 10, backgroundColor: "#FFF3CD", borderRadius: 5, borderWidth: 1, borderColor: "#FFE58F" },
//   warningText: { color: "#856404", fontSize: 12, marginVertical: 2 },
//   fieldWarningContainer: { marginTop: 2, marginBottom: 4, paddingHorizontal: 8 },
//   fieldWarningText: { color: "#D60000", fontSize: 10, fontStyle: "italic" },
//   outputBox: { marginTop: 15, marginBottom: 10, alignItems: "center", backgroundColor: "rgba(255, 77, 87, 0.1)", borderColor: "#FF4D57", borderWidth: 1, padding: 10, borderRadius: 5, width: "95%", alignSelf: "center" },
//   outputInnerBox: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
//   outputLabel: { fontSize: 16, fontWeight: "bold", color: "#000000", marginRight: 5 },
//   outputValueText: { color: "#066e2cff", fontSize: 18, fontWeight: "bold" },
//   logoutButton: { position: "absolute", top: 10, right: 15, zIndex: 10 },
//   logoutText: { color: "#FF4D57", fontWeight: "bold", fontSize: 15 },
//   sectionTitle: { backgroundColor: "#ECE9E9", padding: 10, fontSize: 15, color: "#FF4D57", marginVertical: 10, textAlign: "center", fontWeight: "bold" },
//   row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, overflow: "visible" },
//   inputWrapper: { flex: 1, marginHorizontal: 2 },
//   inputLabel: { color: "#080808", marginBottom: 2, fontSize: 11, marginHorizontal: 8 },
//   inputLabels: { color: "#080808", marginBottom: 5, fontSize: 11, marginLeft: 15 },
//   input: { backgroundColor: "#FFFFFF", borderRadius: 10, borderWidth: 1, borderColor: "#E5E5E5", paddingHorizontal: 12, height: 42, fontSize: 14, color: "#000", marginHorizontal: 8 },
//   inputError: { borderColor: "#D60000", borderWidth: 1.5 },
//   dropdown: { backgroundColor: "transparent", borderRadius: 0, borderWidth: 0, borderBottomWidth: 1, borderColor: "#FF4D57", height: 35, width: '90%', minHeight: 35, marginHorizontal: 8 },
//   dropdownList: { borderRadius: 0, zIndex: 3000, borderColor: "#FF4D57", marginHorizontal: 8 },
//   dropdownText: { color: "#FF4D57", fontSize: 11, lineHeight: 18 },
//   calculateBtn: { backgroundColor: "#FF4D57", padding: 12, borderRadius: 30, marginTop: 15, width: "55%", alignSelf: "center", alignItems: "center" },
//   calculateText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
//   unitDropdownBox: { borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 8, height: 42, minHeight: 42, backgroundColor: "#fff", justifyContent: "center" },
//   unitDropdownList: { borderRadius: 10, borderColor: "#E5E5E5" },
//   unitDropdownText: { fontSize: 14, color: "#000" },
//   resetText: { color: "#111111", fontSize: 11, textAlign: "center", marginTop: 8 },
  
//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: width * 0.9,
//     maxHeight: '80%',
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E5E5',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#ff4d50',
//   },
//   closeButton: {
//     padding: 5,
//   },
//   closeButtonText: {
//     fontSize: 24,
//     color: '#666',
//   },
//   modalBody: {
//     marginBottom: 15,
//   },
//   resultItem: {
//     marginBottom: 12,
//     padding: 10,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 8,
//   },
//   resultLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 3,
//   },
//   resultValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   modalCloseBtn: {
//     backgroundColor: '#FF4D57',
//     padding: 12,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   modalCloseText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   modalWarningContainer: {
//     backgroundColor: '#FFF3CD',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#FFE58F',
//   },
//   modalWarningText: {
//     color: '#856404',
//     fontSize: 12,
//     marginVertical: 2,
//   },
//   missingFieldItem: {
//     padding: 8,
//     backgroundColor: '#FFE8E8',
//     borderRadius: 5,
//     marginVertical: 3,
//   },
//   missingFieldText: {
//     color: '#856404',
//     fontSize: 13,
//   },
// });


import React, { useRef, useState, useEffect } from "react";
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
  LayoutChangeEvent,
  Modal,
  Dimensions,
  LogBox,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Reanimated, { FadeIn } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import api from "./axiosInstance";

// Ignore the VirtualizedLists warning
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

// ⚠️ REPLACE THIS WITH YOUR ACTUAL IMAGE IMPORT
const LeakDiagramImage = require('../assets/images/image.png');

const { width } = Dimensions.get('window');

interface FieldPositions {
  [key: string]: number;
}

interface InputErrors {
  [key: string]: string | undefined;
}

interface FieldWarnings {
  [key: string]: string[];
}

interface ValidationResult {
  warnings: string[];
  fieldWarnings: FieldWarnings;
  leakRateOutput: string | null;
  shouldCalculate: boolean;
  missingFields: string[];
}


export default function CalculatorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const parsedPowerStationData =
    params.powerStationData
      ? JSON.parse(params.powerStationData as string)
      : {};

  const {
    stationName,
    pipeDiaD2,
    p1Unit: paramP1Unit,
    t1Unit: paramT1Unit,
    wcrhUnit,
    heatRateValue,
    plantType,
    criticalType,
    currency: paramCurrency,
    pipeDiaUnit: paramPipeDiaUnit,
    sellPricePerMWh: paramSellPricePerMWh,
    productionCost: paramProductionCost,
    productionCostCurrency: paramProductionCostCurrency,
    customCurrency: paramCustomCurrency,
  } = parsedPowerStationData;

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [initialCalculatorValues, setInitialCalculatorValues] = useState<any>(null);

  // Input states
  const [P1, setP1] = useState("");
  const [P2, setP2] = useState("");
  const [T1, setT1] = useState("");
  const [T2p, setT2p] = useState("");
  const [TCRH, setTCRH] = useState("");
  const [Tmix, setTmix] = useState("");
  const [WCRH, setWCRH] = useState("");
  const [D2, setD2] = useState("");
  const [tw, setTw] = useState("");
  const [ww, setWw] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  

  // Field-specific warnings state
  const [fieldWarnings, setFieldWarnings] = useState<FieldWarnings>({
    P1: [],
    P2: [],
    T1: [],
    T2p: [],
    TCRH: [],
    Tmix: [],
    WCRH: [],
    D2: [],
  });

  // Unit states
  const [open, setOpen] = useState(false);
  const [wcrUnit, setWcrUnit] = useState<"T/HR" | "KG/S" | "KPPH/HR" | "LB/S">("T/HR");
  const [items, setItems] = useState([
    { label: "T/HR", value: "T/HR" },
    { label: "KG/S", value: "KG/S" },
    { label: "KPPH/HR", value: "KPPH/HR" },
    { label: "LB/S", value: "LB/S" },
  ]);

  const [openP1, setOpenP1] = useState(false);
  const [p1Unit, setP1Unit] = useState<"bara" | "psia">("bara");
  const [p1Items, setP1Items] = useState([
    { label: "barA", value: "bara" },
    { label: "psiA", value: "psia" },
  ]);

  const [openT1, setOpenT1] = useState(false);
  const [t1Unit, setT1Unit] = useState<"C" | "F">("C");
  const [t1Items, setT1Items] = useState([
    { label: "°C", value: "C" },
    { label: "°F", value: "F" },
  ]);

  // D2 Unit states (Pipe Diameter Unit)
  const [openD2Unit, setOpenD2Unit] = useState(false);
  const [d2Unit, setD2Unit] = useState<"MM" | "IN">("MM");
  const [d2UnitItems, setD2UnitItems] = useState([
    { label: "MM", value: "MM" },
    { label: "IN", value: "IN" },
  ]);

  // Additional data states
  const [currency, setCurrency] = useState("INR");
  const [heatRateUnit, setHeatRateUnit] = useState("kJ/kW-h");
  const [productionCost, setProductionCost] = useState("");
  const [sellPricePerMWh, setSellPricePerMWh] = useState("");
  const [pipeDiaUnit, setPipeDiaUnit] = useState("MM");
  const [customCurrency, setCustomCurrency] = useState("");
  const [plantMCR, setPlantMCR] = useState("");
  

  // Warning and result states
  const [warnings, setWarnings] = useState<string[]>([]);
  const [result, setResult] = useState("0.00");
  const [hasWarning, setHasWarning] = useState(false);
  const [inputErrors, setInputErrors] = useState<InputErrors>({});
  const [calculatedResults, setCalculatedResults] = useState({
    leakRate: "0.00",
    mwLoss: "0.00",
    hrPenalty: "0.00",
    productionLoss: "0.00",
    revenueLoss: "0.00",
    productionCostWasted: "0.00",
    hasWarning: false,
    warningMessages: [] as string[]
  });

  const scrollRef = useRef<ScrollView>(null);
  const fieldPositions = useRef<FieldPositions>({}).current;

  // Create a state to store all calculator input values
const [calculatorInputs, setCalculatorInputs] = useState({
  P1: "",
  P2: "",
  T1: "",
  T2p: "",
  TCRH: "",
  Tmix: "",
  WCRH: "",
  D2: "",
  tw: "",
  ww: "",
  p1Unit: "bara" as "bara" | "psia",
  t1Unit: "C" as "C" | "F",
  wcrUnit: "T/HR" as "T/HR" | "KG/S" | "KPPH/HR" | "LB/S",
  d2Unit: "MM" as "MM" | "IN"
});

// Update the formatNumberWithCommas function to handle whole numbers properly
// Update the formatNumberWithCommas function
const formatNumberWithCommas = (value: string | number): string => {
  // Convert to number if string
  let num: number;
  if (typeof value === 'string') {
    num = parseFloat(value);
  } else {
    num = value;
  }
  
  if (isNaN(num)) return "0";
  
  // Check if the number has decimal part
  const hasDecimal = num % 1 !== 0;
  
  if (hasDecimal) {
    // Format with existing decimal places (preserve original decimals)
    const numStr = num.toString();
    const parts = numStr.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const decimalPart = parts[1];
    return `${integerPart}.${decimalPart}`;
  } else {
    // Format without decimal places
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
};

// Helper function to get currency symbol
const getCurrencySymbol = (currencyCode: string): string => {
  const symbols: { [key: string]: string } = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'INR': '₹',
    'CNY': '¥',
    'AUD': 'A$',
    'CAD': 'C$',
    'CHF': 'CHF',
    'custom': '₿' // Default symbol for custom currency
  };
  
  // If custom currency, check if customCurrency is provided
  if (currencyCode === 'custom') {
    return customCurrency || '$';
  }
  
  return symbols[currencyCode] || currencyCode;
};

// Update calculator inputs whenever any input changes
useEffect(() => {
  setCalculatorInputs({
    P1, P2, T1, T2p, TCRH, Tmix, WCRH, D2, tw, ww,
    p1Unit, t1Unit, wcrUnit, d2Unit
  });
}, [P1, P2, T1, T2p, TCRH, Tmix, WCRH, D2, tw, ww, p1Unit, t1Unit, wcrUnit, d2Unit]);

  // Initialize all values from passed parameters
useEffect(() => {
  console.log("Received params in calculator:", parsedPowerStationData);
  
  // Basic plant data
  if (pipeDiaD2) setD2(pipeDiaD2);
  if (paramPipeDiaUnit) {
    setPipeDiaUnit(paramPipeDiaUnit);
    setD2Unit(paramPipeDiaUnit as "MM" | "IN");
  }

  if (parsedPowerStationData.plantMCR) {
    setPlantMCR(parsedPowerStationData.plantMCR);
  }
  
  // Unit settings
  if (paramP1Unit === "barA") setP1Unit("bara");
  if (paramP1Unit === "psiA") setP1Unit("psia");
  if (paramT1Unit === "deg C") setT1Unit("C");
  if (paramT1Unit === "deg F") setT1Unit("F");
  if (wcrhUnit) setWcrUnit(wcrhUnit as any);
  
  // Financial data
  if (paramCurrency) setCurrency(paramCurrency);
  if (paramSellPricePerMWh) setSellPricePerMWh(paramSellPricePerMWh);
  if (paramProductionCost) setProductionCost(paramProductionCost);
  if (paramProductionCostCurrency) setCurrency(paramProductionCostCurrency);
  if (paramCustomCurrency) setCustomCurrency(paramCustomCurrency);
  
  // Heat rate
   if (parsedPowerStationData.heatRateValue) {
    setHeatRateValue(parsedPowerStationData.heatRateValue);
  }
  if (parsedPowerStationData.heatRateUnit) {
    setHeatRateUnit(parsedPowerStationData.heatRateUnit);
  }

  // RESTORE CALCULATOR VALUES - Check if we have saved calculator values
  if (parsedPowerStationData.p1Value) {
    console.log("Restoring P1 value:", parsedPowerStationData.p1Value);
    setP1(parsedPowerStationData.p1Value);
  }
  if (parsedPowerStationData.p2Value) {
    console.log("Restoring P2 value:", parsedPowerStationData.p2Value);
    setP2(parsedPowerStationData.p2Value);
  }
  if (parsedPowerStationData.t1Value) {
    console.log("Restoring T1 value:", parsedPowerStationData.t1Value);
    setT1(parsedPowerStationData.t1Value);
  }
  if (parsedPowerStationData.t2pValue) {
    console.log("Restoring T2p value:", parsedPowerStationData.t2pValue);
    setT2p(parsedPowerStationData.t2pValue);
  }
  if (parsedPowerStationData.tcrhValue) {
    console.log("Restoring TCRH value:", parsedPowerStationData.tcrhValue);
    setTCRH(parsedPowerStationData.tcrhValue);
  }
  if (parsedPowerStationData.tmixValue) {
    console.log("Restoring Tmix value:", parsedPowerStationData.tmixValue);
    setTmix(parsedPowerStationData.tmixValue);
  }
  if (parsedPowerStationData.wcrhValue) {
    console.log("Restoring WCRH value:", parsedPowerStationData.wcrhValue);
    setWCRH(parsedPowerStationData.wcrhValue);
  }
  if (parsedPowerStationData.d2Value) {
    console.log("Restoring D2 value:", parsedPowerStationData.d2Value);
    setD2(parsedPowerStationData.d2Value);
  }
  if (parsedPowerStationData.twValue) {
    console.log("Restoring Tw value:", parsedPowerStationData.twValue);
    setTw(parsedPowerStationData.twValue);
  }
  if (parsedPowerStationData.wwValue) {
    console.log("Restoring Ww value:", parsedPowerStationData.wwValue);
    setWw(parsedPowerStationData.wwValue);
  }
}, []);

useEffect(() => {
  if (params.calculatorData) {
    try {
      const savedCalculatorData = JSON.parse(params.calculatorData as string);
      setInitialCalculatorValues(savedCalculatorData);
      
      // Restore all calculator input values
      setP1(savedCalculatorData.P1 || "");
      setP2(savedCalculatorData.P2 || "");
      setT1(savedCalculatorData.T1 || "");
      setT2p(savedCalculatorData.T2p || "");
      setTCRH(savedCalculatorData.TCRH || "");
      setTmix(savedCalculatorData.Tmix || "");
      setWCRH(savedCalculatorData.WCRH || "");
      setD2(savedCalculatorData.D2 || "");
      setTw(savedCalculatorData.tw || "");
      setWw(savedCalculatorData.ww || "");
      setP1Unit(savedCalculatorData.p1Unit || "bara");
      setT1Unit(savedCalculatorData.t1Unit || "C");
      setWcrUnit(savedCalculatorData.wcrUnit || "T/HR");
      setD2Unit(savedCalculatorData.d2Unit || "MM");
    } catch (error) {
      console.error("Error parsing calculator data:", error);
    }
  }
}, [params.calculatorData]);

  // Real-time validation function for individual fields based on the image
  const validateField = (fieldName: string, value: string, allValues?: any): string[] => {
    const fieldSpecificWarnings: string[] = [];
    const numValue = Number.parseFloat(value) || 0;
    
    if (!value) {
      return fieldSpecificWarnings; // Don't show warnings for empty fields in real-time
    }

    const p1Value = Number.parseFloat(allValues?.P1 || P1) || 0;
    const p2Value = Number.parseFloat(allValues?.P2 || P2) || 0;
    const tcrhValue = Number.parseFloat(allValues?.TCRH || TCRH) || 0;
    const tmixValue = Number.parseFloat(allValues?.Tmix || Tmix) || 0;

    switch (fieldName) {
      case 'P1':
        if (numValue < 80) fieldSpecificWarnings.push("P1 out of bounds (LOW) (80-280)");
        if (numValue > 280) fieldSpecificWarnings.push("P1 out of bounds (HIGH) (80-280)");
        break;
      case 'P2':
        if (numValue < 20) fieldSpecificWarnings.push("P-CRH out of bounds (LOW) (20-60)");
        if (numValue > 60) fieldSpecificWarnings.push("P-CRH out of bounds (HIGH) (20-60)");
        
        // Check P1/P2 ratio if both values exist
        if (p1Value > 0 && numValue > 0) {
          const ratio = p1Value / numValue;
          if (ratio < 2) fieldSpecificWarnings.push("(P1/P-CRH) ratio out of bounds (LOW) (2-6)");
          if (ratio > 6) fieldSpecificWarnings.push("(P1/P-CRH) ratio out of bounds (HIGH) (2-6)");
        }
        break;
      case 'T1':
        if (numValue < 500) fieldSpecificWarnings.push("T1 out of bounds (LOW) (500-600)");
        if (numValue > 600) fieldSpecificWarnings.push("T1 out of bounds (HIGH) (500-600)");
        break;
      case 'T2p':
        if (numValue < 460) fieldSpecificWarnings.push("T2p out of bounds (LOW) (460-560)");
        if (numValue > 560) fieldSpecificWarnings.push("T2p out of bounds (HIGH) (460-560)");
        break;
      case 'TCRH':
        if (numValue < 300) fieldSpecificWarnings.push("TCRH out of bounds (LOW) (300-425)");
        if (numValue > 425) fieldSpecificWarnings.push("TCRH out of bounds (HIGH) (300-425)");
        
        // Check TCRH vs Tmix
        if (tmixValue > 0) {
          if (numValue - tmixValue > 2) {
            fieldSpecificWarnings.push("T_m error (less than T_CRH)");
          }
          if (numValue - tmixValue > 4) {
            fieldSpecificWarnings.push("Possible inaccuracy in T_CRH and/or T_m");
          }
        }
        break;
      case 'Tmix':
        if (numValue < 300) fieldSpecificWarnings.push("T_m out of bounds (LOW) (300-450)");
        if (numValue > 450) fieldSpecificWarnings.push("T_m out of bounds (HIGH) (300-450)");
        
        // Check Tmix vs TCRH
        if (tcrhValue > 0) {
          if (tcrhValue - numValue > 2) {
            fieldSpecificWarnings.push("T_m error (less than T_CRH)");
          }
          if (tcrhValue - numValue > 4) {
            fieldSpecificWarnings.push("Possible inaccuracy in T_CRH and/or T_m");
          }
        }
        break;
      case 'WCRH':
        if (numValue < 500) fieldSpecificWarnings.push("W_CRH out of bounds (LOW) (500-2500)");
        if (numValue > 2500) fieldSpecificWarnings.push("W_CRH out of bounds (HIGH) (500-2500)");
        break;
      case 'D2':
        // Convert to MM for bounds checking if needed
        let d2ValueMM = numValue;
        if (d2Unit === "IN") {
          d2ValueMM = numValue * 25.4;
        }
        if (d2ValueMM < 300) fieldSpecificWarnings.push("D2 out of bounds (LOW) (300-600 MM)");
        if (d2ValueMM > 600) fieldSpecificWarnings.push("D2 out of bounds (HIGH) (300-600 MM)");
        break;
    }
    
    return fieldSpecificWarnings;
  };

  // Update field warnings when any input changes
  useEffect(() => {
    const newFieldWarnings = { ...fieldWarnings };
    const allValues = { P1, P2, T1, T2p, TCRH, Tmix, WCRH, D2 };
    
    newFieldWarnings.P1 = validateField('P1', P1, allValues);
    newFieldWarnings.P2 = validateField('P2', P2, allValues);
    newFieldWarnings.T1 = validateField('T1', T1, allValues);
    newFieldWarnings.T2p = validateField('T2p', T2p, allValues);
    newFieldWarnings.TCRH = validateField('TCRH', TCRH, allValues);
    newFieldWarnings.Tmix = validateField('Tmix', Tmix, allValues);
    newFieldWarnings.WCRH = validateField('WCRH', WCRH, allValues);
    newFieldWarnings.D2 = validateField('D2', D2, allValues);
    
    setFieldWarnings(newFieldWarnings);
  }, [P1, P2, T1, T2p, TCRH, Tmix, WCRH, D2, d2Unit]);

  const rememberY = (key: string) => (e: LayoutChangeEvent) => {
    fieldPositions[key] = e.nativeEvent.layout.y;
  };

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  };

 // Update the goBackToEdit function to preserve all calculator values
const goBackToEdit = () => {
  // Prepare all data to send back, including ALL calculator inputs
  const powerStationData = {
    // Basic plant data from first screen
    stationName: stationName,
    pipeDiaD2: D2,
    pipeDiaUnit: d2Unit,
    plantType: plantType,
    criticalType: criticalType,
    plantMCR: plantMCR,
    heatRateValue: heatRateValue,
    heatRateUnit: heatRateUnit,
    
    // Financial data
    currency: currency,
    sellPricePerMWh: sellPricePerMWh,
    productionCost: productionCost,
    productionCostCurrency: currency,
    customCurrency: customCurrency,
    
    // Calculator screen inputs - THESE WILL BE PRESERVED
    p1Value: P1,
    p2Value: P2,
    t1Value: T1,
    t2pValue: T2p,
    tcrhValue: TCRH,
    tmixValue: Tmix,
    wcrhValue: WCRH,
    d2Value: D2,
    twValue: tw,
    wwValue: ww,
    
    // Units
    p1Unit: p1Unit === "bara" ? "barA" : "psiA",
    t1Unit: t1Unit === "C" ? "deg C" : "deg F",
    wcrhUnit: wcrUnit,
    pipeDiaUnit: d2Unit,
  };

  console.log("Sending back to edit screen:", powerStationData); // Debug log

  router.push({
    pathname: "/Additional_user_inputs",
    params: {
      powerStationData: JSON.stringify(powerStationData),
      fromCalculator: 'true' // Flag to indicate we're coming back from calculator
    }
  });
};

// Add this in CalculatorScreen to verify values are preserved when returning from edit

useEffect(() => {
  console.log("Current calculator values:", {
    P1, P2, T1, T2p, TCRH, Tmix, WCRH, D2, tw, ww,
    p1Unit, t1Unit, wcrUnit, d2Unit
  });
}, [P1, P2, T1, T2p, TCRH, Tmix, WCRH, D2, tw, ww, p1Unit, t1Unit, wcrUnit, d2Unit]);

  // Unit conversion function
 const convertUnits = () => {
  let p1 = Number.parseFloat(P1) || 0;
  let p2 = Number.parseFloat(P2) || 0;
  let t1 = Number.parseFloat(T1) || 0;
  let t2p = Number.parseFloat(T2p) || 0;
  let t2 = Number.parseFloat(TCRH) || 0;
  let tmix = Number.parseFloat(Tmix) || 0;
  let wcrh = Number.parseFloat(WCRH) || 0;
  let d2 = Number.parseFloat(D2) || 0;

  // P1/P2 conversion (psiA to barA)
  if (p1Unit === "psia") {
    const ConvP = 1/14.5;
    p1 = p1 * ConvP;
    p2 = p2 * ConvP;
  }

  // Temperature conversion (°F to °C)
  if (t1Unit === "F") {
    t1 = (t1 - 32) / 1.8;
    t2p = (t2p - 32) / 1.8;
    t2 = (t2 - 32) / 1.8;
    tmix = (tmix - 32) / 1.8;
  }

  // W-CRH conversion to T/HR
  if (wcrUnit === "KG/S") {
    wcrh = wcrh * 3.6;
  } else if (wcrUnit === "KPPH/HR") {
    wcrh = wcrh * (1/2.24);
  } else if (wcrUnit === "LB/S") {
    wcrh = wcrh * (3600/2240);
  }
  // For T/HR, keep as is

  // D2 conversion (IN to MM)
  if (d2Unit === "IN") {
    d2 = d2 * 25.4;
  }

  // Heat Rate conversion
  let hrValue = Number.parseFloat(heatRateValue || "0");
  if (heatRateUnit === "Btu/kW-h") {
    hrValue = hrValue * 1.055;
  } else if (heatRateUnit === "default") {
    if (plantType === "ccpp") hrValue = 7500;
    else if (criticalType === "supercritical") hrValue = 8400;
    else hrValue = 9500;
  }

  return { p1, p2, t1, t2p, t2, tmix, wcrh, d2, hrValue };
};
  // Check for missing required fields
  const checkMissingFields = (): string[] => {
    const missing: string[] = [];
    
    if (!P1) missing.push("P1 (HP Inlet Pressure)");
    if (!P2) missing.push("P2 (CRH Outlet Pressure)");
    if (!T1) missing.push("T1 (HP Steam)");
    if (!T2p) missing.push("T2p");
    if (!TCRH) missing.push("TCRH");
    if (!Tmix) missing.push("T-MIX");
    if (!WCRH) missing.push("W-CRH");
    if (!D2) missing.push("D2 (HP Bypass Outlet Pipe Diameter)");
    
    return missing;
  };

  // Validation function based on the image
  const validateInputs = (): ValidationResult => {
    const warnings: string[] = [];
    const fieldSpecificWarnings: FieldWarnings = {
      P1: [], P2: [], T1: [], T2p: [], TCRH: [], Tmix: [], WCRH: [], D2: []
    };
    let leakRateOutput: string | null = null;
    let shouldCalculate = true;
    let missingFieldsList: string[] = [];

    // First check for missing fields
    missingFieldsList = checkMissingFields();
    if (missingFieldsList.length > 0) {
      return { 
        warnings: [], 
        fieldWarnings: fieldSpecificWarnings, 
        leakRateOutput: null, 
        shouldCalculate: false,
        missingFields: missingFieldsList 
      };
    }

    const p1 = Number.parseFloat(P1) || 0;
    const p2 = Number.parseFloat(P2) || 0;
    const t1 = Number.parseFloat(T1) || 0;
    const t2p = Number.parseFloat(T2p) || 0;
    const tcrh = Number.parseFloat(TCRH) || 0;
    const tmix = Number.parseFloat(Tmix) || 0;
    const wcrh = Number.parseFloat(WCRH) || 0;
    let d2 = Number.parseFloat(D2) || 0;

    // Convert D2 to MM for bounds checking
    if (d2Unit === "IN") {
      d2 = d2 * 25.4;
    }

    // P1 bounds (80-280 barA)
    if (p1 < 80) {
      warnings.push("P1 out of bounds (LOW) (80-280)");
      fieldSpecificWarnings.P1.push("P1 out of bounds (LOW) (80-280)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (p1 > 280) {
      warnings.push("P1 out of bounds (HIGH) (80-280)");
      fieldSpecificWarnings.P1.push("P1 out of bounds (HIGH) (80-280)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // P2 bounds (20-60 barA)
    if (p2 < 20) {
      warnings.push("P-CRH out of bounds (LOW) (20-60)");
      fieldSpecificWarnings.P2.push("P-CRH out of bounds (LOW) (20-60)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (p2 > 60) {
      warnings.push("P-CRH out of bounds (HIGH) (20-60)");
      fieldSpecificWarnings.P2.push("P-CRH out of bounds (HIGH) (20-60)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // P1/P2 ratio (2-6)
    if (p2 !== 0) {
      const ratio = p1 / p2;
      if (ratio < 2) {
        warnings.push("(P1/P-CRH) ratio out of bounds (LOW) (2-6)");
        fieldSpecificWarnings.P2.push("(P1/P-CRH) ratio out of bounds (LOW) (2-6)");
        leakRateOutput = "NA";
        shouldCalculate = false;
      }
      if (ratio > 6) {
        warnings.push("(P1/P-CRH) ratio out of bounds (HIGH) (2-6)");
        fieldSpecificWarnings.P2.push("(P1/P-CRH) ratio out of bounds (HIGH) (2-6)");
        leakRateOutput = "NA";
        shouldCalculate = false;
      }
    }

    // T1 bounds (500-600 °C)
    if (t1 < 500) {
      warnings.push("T1 out of bounds (LOW) (500-600)");
      fieldSpecificWarnings.T1.push("T1 out of bounds (LOW) (500-600)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (t1 > 600) {
      warnings.push("T1 out of bounds (HIGH) (500-600)");
      fieldSpecificWarnings.T1.push("T1 out of bounds (HIGH) (500-600)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // T2p bounds (460-560 °C)
    if (t2p < 460) {
      warnings.push("T2p out of bounds (LOW) (460-560)");
      fieldSpecificWarnings.T2p.push("T2p out of bounds (LOW) (460-560)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (t2p > 560) {
      warnings.push("T2p out of bounds (HIGH) (460-560)");
      fieldSpecificWarnings.T2p.push("T2p out of bounds (HIGH) (460-560)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // TCRH bounds (300-425 °C)
    if (tcrh < 300) {
      warnings.push("TCRH out of bounds (LOW) (300-425)");
      fieldSpecificWarnings.TCRH.push("TCRH out of bounds (LOW) (300-425)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (tcrh > 425) {
      warnings.push("TCRH out of bounds (HIGH) (300-425)");
      fieldSpecificWarnings.TCRH.push("TCRH out of bounds (HIGH) (300-425)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // Tmix bounds (300-450 °C)
    if (tmix < 300) {
      warnings.push("T_M out of bounds (LOW) (300-450)");
      fieldSpecificWarnings.Tmix.push("T_M out of bounds (LOW) (300-450)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (tmix > 450) {
      warnings.push("T_M out of bounds (HIGH) (300-450)");
      fieldSpecificWarnings.Tmix.push("T_M out of bounds (HIGH) (300-450)");
      // Allow calculation but with warning
    }

    // Tmix vs TCRH checks
    if (tcrh - tmix > 2) {
      warnings.push("T_m error (less than T_CRH)");
      fieldSpecificWarnings.Tmix.push("T_m error (less than T_CRH)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (tcrh - tmix > 4) {
      warnings.push("Possible inaccuracy in T_CRH and/or T_m");
      fieldSpecificWarnings.Tmix.push("Possible inaccuracy in T_CRH and/or T_m");
      leakRateOutput = "0";
      shouldCalculate = false;
    }

    // WCRH bounds (500-2500 T/HR)
    if (wcrh < 500) {
      warnings.push("W_CRH out of bounds (LOW) (500-2500)");
      fieldSpecificWarnings.WCRH.push("W_CRH out of bounds (LOW) (500-2500)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (wcrh > 2500) {
      warnings.push("W_CRH out of bounds (HIGH) (500-2500)");
      fieldSpecificWarnings.WCRH.push("W_CRH out of bounds (HIGH) (500-2500)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // D2 bounds (300-600 mm)
    if (d2 < 300) {
      warnings.push("D2 out of bounds (LOW) (300-600)");
      fieldSpecificWarnings.D2.push("D2 out of bounds (LOW) (300-600)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (d2 > 600) {
      warnings.push("D2 out of bounds (HIGH) (300-600)");
      fieldSpecificWarnings.D2.push("D2 out of bounds (HIGH) (300-600)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    return { 
      warnings, 
      fieldWarnings: fieldSpecificWarnings, 
      leakRateOutput, 
      shouldCalculate,
      missingFields: [] 
    };
  };

  const calculateLeakFlow = () => {
    // Check for missing fields first
    const missing = checkMissingFields();
    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingFieldsModal(true);
      return;
    }

    // Validate inputs
    const validation = validateInputs();
    
    if (validation.warnings.length > 0) {
      setWarnings(validation.warnings);
      setHasWarning(true);
      setResult(validation.leakRateOutput || "0.00");
      
      // Update field warnings
      setFieldWarnings(validation.fieldWarnings);
      
      setCalculatedResults(prev => ({
        ...prev,
        hasWarning: true,
        warningMessages: validation.warnings
      }));
      
      scrollToTop();
      return;
    }

    // If no warnings, proceed with calculation
    performCalculation();
  };

// Update the performCalculation function - specifically the production loss formatting

// Update the production loss formatting in performCalculation function

const performCalculation = () => {
  // Convert units for calculation
  const converted = convertUnits();
  const { p1, p2, t1, t2p, t2, tmix, wcrh, d2, hrValue } = converted;
  
  const twValue = Number(tw) || 0;
  const wwValue = Number(ww) || 0;
  const mcrFlowRate = Number(plantMCR) || 0; // Plant MCR in mt/h

  // Calculate T2is (Isentropic temperature)
  const T2is = t1 - ((p1 - p2) / 20) * (25.1 - 0.03 * t1);
  
  // Calculate K1, K2, K3
  const K1 = 15.32 * (p2 / (T2is + 273.2));
  const K2 = (3 * Math.pow(10, -8)) * (Math.pow(wcrh, 2) / p2) * (t2 + 273.2);
  const K3 = Math.pow(d2 / 500, 2);
  
  // Calculate Wraw
  const Wraw = 0.145 * (tmix - t2) * K1 * K2 * K3;
  
  // Calculate Wcorr (this is in T/HR)
  const Wcorr = Wraw * ((T2is - t2) / (t2p - t2));
  
  // Apply spray water correction if needed
  const correctionFactor = wwValue !== 0 && twValue !== 0 ? wwValue / twValue : 1;
  const finalCorrectedLeakRate = Wcorr * correctionFactor;

  // Calculate CpstH and CpstL
  const CpstH = 3.521 + 0.00467 * p1 - 0.00274 * t1;
  const CpstL = 2.784 + 0.01164 * p2 - 0.002 * t2;
  
  // Convert Wcorr from T/HR to KG/S for MW calculation
  const wcorrInKgPerSec = finalCorrectedLeakRate / 3.6;
  
  // MW LOSS calculation
  const mwLoss = 0.9 * wcorrInKgPerSec * ((CpstH * t1) - (CpstL * t2))/1000;
  
  // Heat Rate Penalty calculation
  let hrPenalty = 0;
  if (mcrFlowRate > 0 && mwLoss > 0) {
    hrPenalty = hrValue * (mwLoss / mcrFlowRate);
  }
  
  // Calculate Production Loss per year (8000 hours per year)
  const productionLossPerYear = mwLoss * 8000;
  
  // Calculate Revenue Loss per year
  const sellPriceNum = parseFloat(sellPricePerMWh || "0");
  const revenueLossPerYear = sellPriceNum * productionLossPerYear;
  
  // Calculate Production Cost Wasted per year
  const productionCostNum = parseFloat(productionCost || "50");
  const productionCostWastedPerYear = productionCostNum * productionLossPerYear;

  // Convert leak rate to selected unit for display
  let displayLeakRate = finalCorrectedLeakRate;
  if (wcrUnit === "KG/S") displayLeakRate = finalCorrectedLeakRate / 3.6;
  else if (wcrUnit === "KPPH/HR") displayLeakRate = finalCorrectedLeakRate / (1/2.24);
  else if (wcrUnit === "LB/S") displayLeakRate = finalCorrectedLeakRate / (3600/2240);
  else displayLeakRate = finalCorrectedLeakRate; // T/HR

  // Format results
  const formattedLeakRate = displayLeakRate.toFixed(2);
  const formattedMwLoss = mwLoss.toFixed(2);
  const formattedHrPenalty = hrPenalty.toFixed(1);
  
  // Production loss per year - exactly 1 decimal place WITHOUT trailing zero
  // This will show "21,336.8" instead of "21,336.80"
  const productionLossRounded = Math.round(productionLossPerYear * 10) / 10;
  const formattedProductionLoss = productionLossRounded.toString();
  
  // Revenue loss per year - rounded to whole number (no decimal)
  const formattedRevenueLoss = Math.round(revenueLossPerYear).toString();
  
  // Production Cost Wasted per year - rounded to whole number (no decimal)
  const formattedProductionCostWasted = Math.round(productionCostWastedPerYear).toString();

  console.log("Calculation Debug:", {
    finalCorrectedLeakRate,
    wcorrInKgPerSec,
    CpstH,
    CpstL,
    mwLoss: mwLoss,
    hrValue: hrValue,
    mcrFlowRate: mcrFlowRate,
    hrPenalty: hrPenalty,
    productionLossPerYear,
    formattedProductionLoss,
    revenueLossPerYear,
    formattedRevenueLoss,
    productionCostWastedPerYear,
    formattedProductionCostWasted,
  });

  setCalculatedResults({
    leakRate: formattedLeakRate,
    mwLoss: formattedMwLoss,
    hrPenalty: formattedHrPenalty,
    productionLoss: formattedProductionLoss,
    revenueLoss: formattedRevenueLoss,
    productionCostWasted: formattedProductionCostWasted,
    hasWarning: false,
    warningMessages: []
  });

  setResult(formattedLeakRate);
  setWarnings([]);
  setHasWarning(false);
  setShowOutput(true);
  setModalVisible(true);
  scrollToTop();
};
 const resetAll = () => {
  if (initialCalculatorValues) {
    // Reset to saved values instead of empty
    setP1(initialCalculatorValues.P1 || "");
    setP2(initialCalculatorValues.P2 || "");
    setT1(initialCalculatorValues.T1 || "");
    setT2p(initialCalculatorValues.T2p || "");
    setTCRH(initialCalculatorValues.TCRH || "");
    setTmix(initialCalculatorValues.Tmix || "");
    setWCRH(initialCalculatorValues.WCRH || "");
    setD2(initialCalculatorValues.D2 || "");
    setTw(initialCalculatorValues.tw || "");
    setWw(initialCalculatorValues.ww || "");
    setP1Unit(initialCalculatorValues.p1Unit || "bara");
    setT1Unit(initialCalculatorValues.t1Unit || "C");
    setWcrUnit(initialCalculatorValues.wcrUnit || "T/HR");
    setD2Unit(initialCalculatorValues.d2Unit || "MM");
  } else {
    // Regular reset to empty
    setP1("");
    setP2("");
    setT1("");
    setT2p("");
    setTCRH("");
    setTmix("");
    setWCRH("");
    setD2("");
    setTw("");
    setWw("");
  }
  
  setResult("0.00");
  setWarnings([]);
  setHasWarning(false);
  setFieldWarnings({
    P1: [], P2: [], T1: [], T2p: [], TCRH: [], Tmix: [], WCRH: [], D2: []
  });
  setInputErrors({});
  setShowOutput(false);
  setModalVisible(false);
  setShowMissingFieldsModal(false);
  scrollToTop();
};

  const handleLogout = () => {
    router.replace("/LoginScreen");
  };

  const calculateAndSave = async () => {
    calculateLeakFlow();
    
    try {
      const finalPayload = {
        power_station_name: stationName,
        pipe_dia_d2: D2,
        pipe_dia_unit: d2Unit,
        t2p: T2p,
        p1: P1,
        p1_unit: p1Unit,
        t1: T1,
        t1_unit: t1Unit,
        p2: P2,
        tcrh: TCRH,
        w_crh: WCRH,
        w_crh_unit: wcrUnit,
        tw: tw,
        ww: ww,
        t_mix: Tmix,
        plant_type: plantType,
        critical_type: criticalType,
        plant_mcr: plantMCR, 
        heat_rate_value: heatRateValue,
        heat_rate_unit: heatRateUnit,
        production_cost: productionCost,
        production_cost_currency: currency,
        custom_currency: currency === "custom" ? customCurrency : currency,
        sell_price_per_mwh: sellPricePerMWh
      };

      console.log("Saving payload:", finalPayload); // For debugging
      
      const response = await api.post("/power-stations/", finalPayload);
      console.log("Save response:", response.data);
    } catch (error: any) {
      console.log("BACKEND ERROR =>", error.response?.data);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeMissingFieldsModal = () => {
    setShowMissingFieldsModal(false);
  };

  const setHeatRateValue = (value: string) => {
    // This function will be implemented to update heat rate
    console.log("Setting heat rate to:", value);
  };

  // Render warning below a field
  const renderFieldWarning = (fieldName: string) => {
    if (fieldWarnings[fieldName] && fieldWarnings[fieldName].length > 0) {
      return (
        <View style={styles.fieldWarningContainer}>
          {fieldWarnings[fieldName].map((warning, index) => (
            <Text key={index} style={styles.fieldWarningText}>⚠ {warning}</Text>
          ))}
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBackToEdit}>
          <Ionicons name="arrow-back" size={24} color="#FF4D57" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>KOSO</Text>
        <View style={styles.stationUnitContainer}>
          <Text style={styles.station}>{stationName || "Power Station"}</Text>
          <View style={styles.underline} />
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      >
        <View style={styles.container}>
          <View style={styles.diagramImageContainer}>
            <Image source={LeakDiagramImage} style={styles.diagramImage} resizeMode="contain" />
          </View>

          <Text style={styles.sectionTitle}>APPLICATION - HP BYPASS</Text>

          {/* P1 and T1 Row */}
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }} onLayout={rememberY("P1")}>
              <Text style={styles.inputLabel}>P1 (HP Inlet Pressure)</Text>
              <TextInput
                style={[styles.input, fieldWarnings.P1.length > 0 && styles.inputError]}
                keyboardType="numeric"
                value={P1}
                onChangeText={setP1}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
              {renderFieldWarning('P1')}
            </View>
            <View style={{ width: 90, marginLeft: 6 ,marginTop: 14}}>
              <Text style={styles.inputLabel}>Unit</Text>
              <DropDownPicker
                open={openP1}
                value={p1Unit}
                items={p1Items}
                setOpen={setOpenP1}
                setValue={setP1Unit}
                setItems={setP1Items}
                style={styles.unitDropdownBox}
                dropDownContainerStyle={styles.unitDropdownList}
                textStyle={styles.unitDropdownText}
                listMode="SCROLLVIEW"
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }} onLayout={rememberY("T1")}>
              <Text style={styles.inputLabel}>T1 (HP Steam)</Text>
              <TextInput
                style={[styles.input, fieldWarnings.T1.length > 0 && styles.inputError]}
                keyboardType="numeric"
                value={T1}
                onChangeText={setT1}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
              {renderFieldWarning('T1')}
            </View>
            <View style={{ width: 90, marginLeft: 6,marginTop: 14}}>
              <Text style={styles.inputLabel}>Unit</Text>
              <DropDownPicker
                open={openT1}
                value={t1Unit}
                items={t1Items}
                setOpen={setOpenT1}
                setValue={setT1Unit}
                setItems={setT1Items}
                style={styles.unitDropdownBox}
                dropDownContainerStyle={styles.unitDropdownList}
                textStyle={styles.unitDropdownText}
                listMode="SCROLLVIEW"
                zIndex={2900}
                zIndexInverse={900}
              />
            </View>
          </View>

          {/* T2p, D2, and Unit Row - T2p on left, D2 with unit on right */}
          <View style={styles.row}>
            <View onLayout={rememberY("T2p")} style={[styles.inputWrapper, { marginTop: 13 }]}>
              <Text style={styles.inputLabel}>T2p</Text>
              <TextInput
                style={[styles.input, fieldWarnings.T2p.length > 0 && styles.inputError]}
                keyboardType="numeric"
                value={T2p}
                onChangeText={setT2p}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
              {renderFieldWarning('T2p')}
            </View>
            <View onLayout={rememberY("D2")} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>HP Bypass Outlet Pipe Diameter (D2)</Text>
              <TextInput
                style={[styles.input, fieldWarnings.D2.length > 0 && styles.inputError]}
                keyboardType="numeric"
                value={D2}
                onChangeText={setD2}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
              {renderFieldWarning('D2')}
            </View>
            <View style={{ width: 90, marginLeft: 8, marginTop: 14, zIndex: 2000 }}>
              <Text style={styles.inputLabel}>Unit</Text>
              <DropDownPicker
                open={openD2Unit}
                value={d2Unit}
                items={d2UnitItems}
                setOpen={setOpenD2Unit}
                setValue={setD2Unit}
                setItems={setD2UnitItems}
                style={styles.unitDropdownBox}
                dropDownContainerStyle={styles.unitDropdownList}
                textStyle={styles.unitDropdownText}
                listMode="SCROLLVIEW"
                zIndex={2000}
                zIndexInverse={800}
              />
            </View>
          </View>

          {/* P2 and TCRH */}
          <View style={styles.row}>
            <View onLayout={rememberY("P2")} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>P2 (CRH Outlet Pressure)</Text>
              <TextInput
                style={[styles.input, fieldWarnings.P2.length > 0 && styles.inputError]}
                keyboardType="numeric"
                value={P2}
                onChangeText={setP2}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
              {renderFieldWarning('P2')}
            </View>
            <View onLayout={rememberY("TCRH")} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>TCRH</Text>
              <TextInput
                style={[styles.input, fieldWarnings.TCRH.length > 0 && styles.inputError]}
                keyboardType="numeric"
                value={TCRH}
                onChangeText={setTCRH}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
              {renderFieldWarning('TCRH')}
            </View>
          </View>

          {/* WCRH and Unit */}
          <View style={styles.row}>
            <View onLayout={rememberY("WCRH")} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>W-CRH</Text>
              <TextInput
                style={[styles.input, fieldWarnings.WCRH.length > 0 && styles.inputError]}
                keyboardType="numeric"
                value={WCRH}
                onChangeText={setWCRH}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
              {renderFieldWarning('WCRH')}
            </View>
            <View onLayout={rememberY("Unit")} style={{ flex: 1, marginRight: 8, zIndex: 1000 }}>
              <Text style={styles.inputLabels}>Unit</Text>
              <DropDownPicker
                open={open}
                value={wcrUnit}
                items={items}
                setOpen={setOpen}
                setValue={setWcrUnit}
                setItems={setItems}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                textStyle={styles.dropdownText}
                placeholderStyle={styles.dropdownText}
                listMode="SCROLLVIEW"
                zIndex={1000}
                zIndexInverse={700}
              />
            </View>
          </View>

          {/* Tw and Ww */}
          <View style={styles.row}>
            <View onLayout={rememberY("Tw")} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Tw (Spray Water Temp)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={tw}
                onChangeText={setTw}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
            </View>
            <View onLayout={rememberY("Ww")} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Ww (Spray Water Flow)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={ww}
                onChangeText={setWw}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
            </View>
          </View>

          {/* Tmix */}
          <View style={styles.row}>
            <View onLayout={rememberY("Tmix")} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>T-MIX</Text>
              <TextInput
                style={[styles.input, fieldWarnings.Tmix.length > 0 && styles.inputError]}
                keyboardType="numeric"
                value={Tmix}
                onChangeText={setTmix}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
              {renderFieldWarning('Tmix')}
            </View>
          </View>

          {/* Warning Messages - Only for non-field specific warnings */}
          {warnings.length > 0 && (
            <Reanimated.View entering={FadeIn.duration(500)} style={styles.warningContainer}>
              {warnings.map((warning, index) => (
                <Text key={index} style={styles.warningText}>⚠ {warning}</Text>
              ))}
            </Reanimated.View>
          )}

          {/* Output Box */}
          {showOutput && (
            <Reanimated.View entering={FadeIn.duration(500)} style={styles.outputBox}>
              <View style={styles.outputInnerBox}>
                <Text style={styles.outputLabel}>LEAK RATE :</Text>
                <Text style={[styles.outputValueText, result === "NA" && { color: "red" }]}>
                  {result === "NA" ? "NA (Check Inputs)" : `${result} ${wcrUnit}`}
                </Text>
              </View>
            </Reanimated.View>
          )}

          {/* Calculate Button */}
          {!showOutput && (
            <TouchableOpacity style={styles.calculateBtn} onPress={calculateAndSave}>
              <Text style={styles.calculateText}>Calculate</Text>
            </TouchableOpacity>
          )}

          {/* Reset Button */}
          <TouchableOpacity onPress={resetAll}>
            <Text style={styles.resetText}>Reset Value</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Missing Fields Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showMissingFieldsModal}
        onRequestClose={closeMissingFieldsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#FFF3CD' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#856404' }]}>Missing Required Fields</Text>
              <TouchableOpacity onPress={closeMissingFieldsModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={{ color: '#856404', fontSize: 14, marginBottom: 10 }}>
                Please fill in the following required fields:
              </Text>
              {missingFields.map((field, index) => (
                <View key={index} style={styles.missingFieldItem}>
                  <Text style={styles.missingFieldText}>• {field}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.modalCloseBtn, { backgroundColor: '#856404' }]} 
              onPress={closeMissingFieldsModal}
            >
              <Text style={styles.modalCloseText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Results Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Calculation Results</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {calculatedResults.hasWarning && calculatedResults.warningMessages.length > 0 && (
                <View style={styles.modalWarningContainer}>
                  {calculatedResults.warningMessages.map((warning, index) => (
                    <Text key={index} style={styles.modalWarningText}>⚠ {warning}</Text>
                  ))}
                </View>
              )}

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>LEAK RATE:</Text>
                <Text style={[styles.resultValue, calculatedResults.hasWarning && { color: "#856404" }]}>
                  {result === "NA" ? "NA (Check Inputs)" : `${calculatedResults.leakRate} ${wcrUnit}`}
                </Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Eq. MW-loss:</Text>
                <Text style={styles.resultValue}>{calculatedResults.mwLoss} MW</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Heat Rate Penalty:</Text>
                <Text style={styles.resultValue}>
                  {calculatedResults.hrPenalty} {heatRateUnit}
                </Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Production loss per year:</Text>
                <Text style={styles.resultValue}>{formatNumberWithCommas(calculatedResults.productionLoss)} MW-h</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Revenue loss per year:</Text>
                <Text style={styles.resultValue}>
                  {getCurrencySymbol(currency)} {formatNumberWithCommas(calculatedResults.revenueLoss)}
                </Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Production Cost Wasted per year:</Text>
                <Text style={styles.resultValue}>
                  {getCurrencySymbol(currency)} {formatNumberWithCommas(calculatedResults.productionCostWasted)}
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  container: { backgroundColor: "#FFFFFF", padding: 15, flexGrow: 1 },
  header: { 
    backgroundColor: "#000000", 
    paddingVertical: 10, 
    paddingHorizontal: 18, 
    width: "100%",
    position: 'relative',
  },
  backButton: {
    position: "absolute",
    bottom:10,
    top: 10,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  backButtonText: {
    color: "#FF4D57",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '500',
  },
  logo: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#FF4D57", 
    marginTop: 10,
    textAlign: 'center',
  },
  stationUnitContainer: { alignItems: "center" },
  station: { fontSize: 15, color: "#D3D3D3", fontWeight: "bold" },
  underline: { height: 1, width: "65%", backgroundColor: "#D3D3D3", marginVertical: 2 },
  diagramImageContainer: { alignSelf: "center", width: "100%", height: 250, marginVertical: 5 },
  diagramImage: { width: '105%', height: '100%' },
  warningContainer: { marginTop: 10, marginBottom: 10, padding: 10, backgroundColor: "#FFF3CD", borderRadius: 5, borderWidth: 1, borderColor: "#FFE58F" },
  warningText: { color: "#856404", fontSize: 12, marginVertical: 2 },
  fieldWarningContainer: { marginTop: 2, marginBottom: 4, paddingHorizontal: 8 },
  fieldWarningText: { color: "#D60000", fontSize: 10, fontStyle: "italic" },
  outputBox: { marginTop: 15, marginBottom: 10, alignItems: "center", backgroundColor: "rgba(255, 77, 87, 0.1)", borderColor: "#FF4D57", borderWidth: 1, padding: 10, borderRadius: 5, width: "95%", alignSelf: "center" },
  outputInnerBox: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  outputLabel: { fontSize: 16, fontWeight: "bold", color: "#000000", marginRight: 5 },
  outputValueText: { color: "#066e2cff", fontSize: 18, fontWeight: "bold" },
  logoutButton: { position: "absolute", top: 10, right: 15, zIndex: 10 },
  logoutText: { color: "#FF4D57", fontWeight: "bold", fontSize: 15 },
  sectionTitle: { backgroundColor: "#ECE9E9", padding: 10, fontSize: 15, color: "#FF4D57", marginVertical: 10, textAlign: "center", fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, overflow: "visible" },
  inputWrapper: { flex: 1, marginHorizontal: 2 },
  inputLabel: { color: "#080808", marginBottom: 2, fontSize: 11, marginHorizontal: 8 },
  inputLabels: { color: "#080808", marginBottom: 5, fontSize: 11, marginLeft: 15 },
  input: { backgroundColor: "#FFFFFF", borderRadius: 10, borderWidth: 1, borderColor: "#E5E5E5", paddingHorizontal: 12, height: 42, fontSize: 14, color: "#000", marginHorizontal: 8 },
  inputError: { borderColor: "#D60000", borderWidth: 1.5 },
  dropdown: { backgroundColor: "transparent", borderRadius: 0, borderWidth: 0, borderBottomWidth: 1, borderColor: "#FF4D57", height: 35, width: '90%', minHeight: 35, marginHorizontal: 8 },
  dropdownList: { borderRadius: 0, borderColor: "#FF4D57", marginHorizontal: 8 },
  dropdownText: { color: "#FF4D57", fontSize: 11, lineHeight: 18 },
  calculateBtn: { backgroundColor: "#FF4D57", padding: 12, borderRadius: 30, marginTop: 15, width: "55%", alignSelf: "center", alignItems: "center" },
  calculateText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  unitDropdownBox: { borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 8, height: 42, minHeight: 42, backgroundColor: "#fff", justifyContent: "center" },
  unitDropdownList: { borderRadius: 10, borderColor: "#E5E5E5" },
  unitDropdownText: { fontSize: 14, color: "#000" },
  resetText: { color: "#111111", fontSize: 11, textAlign: "center", marginTop: 8 },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4d50',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  modalBody: {
    marginBottom: 15,
  },
  resultItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  modalCloseBtn: {
    backgroundColor: '#FF4D57',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalWarningContainer: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFE58F',
  },
  modalWarningText: {
    color: '#856404',
    fontSize: 12,
    marginVertical: 2,
  },
  missingFieldItem: {
    padding: 8,
    backgroundColor: '#FFE8E8',
    borderRadius: 5,
    marginVertical: 3,
  },
  missingFieldText: {
    color: '#856404',
    fontSize: 13,
  },
});