


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
//   NativeSyntheticEvent,
//   TextInputChangeEventData,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// import Reanimated, { FadeIn } from "react-native-reanimated";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import api from "./axiosInstance";


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
//   T2p?: string;
//   TCRH?: string;
//   Tmix?: string;
//   WCRH?: string;
//   D2?: string;
//   Tw?: string;
//   Ww?: string;
// }

// const validateInputs = (
//   p1: number,
//   p2: number,
//   t1: number,
//   t2p: number,
//   t2: number,
//   tmix: number,
//   wcrh: number,
//   d2: number,
//   wcrUnit: string,
//   tw: number,
//   ww: number
// ): { warningsByField: WarningByField; leakRateOutput: string | null; anyWarning: boolean } => {
//   const warningsByField: WarningByField = {
//     P1: undefined,
//     P2: undefined,
//     T1: undefined,
//     T2p: undefined,
//     TCRH: undefined,
//     Tmix: undefined,
//     WCRH: undefined,
//     D2: undefined,
//     Tw: undefined,
//     Ww: undefined,
//   };

//   let leakRateOutput: string | null = null;

//   // Add check for unrealistic temperatures (below absolute zero or too high)
//   if (t1 < -273 || t1 > 1000) warningsByField.T1 = "T1 temperature out of realistic range";
//   if (t2p < -273 || t2p > 1000) warningsByField.T2p = "T2p temperature out of realistic range";
//   if (t2 < -273 || t2 > 1000) warningsByField.TCRH = "TCRH temperature out of realistic range";
//   if (tmix < -273 || tmix > 1000) warningsByField.Tmix = "Tmix temperature out of realistic range";

//   // P1 bounds (barA)
//   if (p1 < 80) warningsByField.P1 = "P1 out of bounds (LOW) - (80-280)";
//   if (p1 > 280) warningsByField.P1 = "P1 out of bounds (HIGH) - (80-280)";

//   // P2 bounds (barA)
//   if (p2 < 20) warningsByField.P2 = "P-CRH out of bounds (LOW) - (20-60)";
//   if (p2 > 60) warningsByField.P2 = "P-CRH out of bounds (HIGH) - (20-60)";

//   // P1/P2 ratio
//   if (p2 !== 0) {
//     if (p1 / p2 < 2) warningsByField.P2 = "(P1/P2-CRH) ratio out of bounds (LOW) - (2-6)";
//     if (p1 / p2 > 6) warningsByField.P2 = "(P1/P2-CRH) ratio out of bounds (HIGH) - (2-6)";
//   } else {
//     warningsByField.P2 = "P2 cannot be zero for ratio check";
//   }

//   // T1 bounds (°C)
//   if (t1 < 500) warningsByField.T1 = "T1 out of bounds (LOW) - (500-600)";
//   if (t1 > 600) warningsByField.T1 = "T1 out of bounds (HIGH) - (500-600)";
  
//   // T2 bounds (°C)
//   if (t2 < 300) warningsByField.TCRH = "TCRH out of bounds (LOW) - (300-425)";
//   if (t2 > 425) warningsByField.TCRH = "TCRH out of bounds (HIGH) - (300-425)";

//   // T2p bounds (°C)
//   if (t2p < 300) warningsByField.T2p = "T2p out of bounds (LOW) - (300-425)";
//   if (t2p > 425) warningsByField.T2p = "T2p out of bounds (HIGH) - (300-425)";

//   // Tmix bounds (°C)
//   if (tmix < 300) warningsByField.Tmix = "T_M out of bounds (LOW) - (300-450)";
//   if (tmix > 450) warningsByField.Tmix = "T_M out of bounds (HIGH) - (300-450)";

//   // T2p vs TCRH comparison (for correction factor denominator)
//   if (Math.abs(t2p - t2) < 4) {
//     warningsByField.TCRH = "T2p and TCRH are too close - correction factor may be inaccurate";
//     warningsByField.T2p = "T2p and TCRH are too close - correction factor may be inaccurate";
//   }

//   // Tmix vs TCRH checks
//   if (t2 - tmix > 4) {
//     warningsByField.Tmix = "T_M temperature error (less than T-CRH)";
//   }
//   if (Math.abs(t2 - tmix) < 4) {
//     warningsByField.TCRH = "Possible inaccuracy in TCRH and/or T_M";
//     warningsByField.Tmix = "Possible inaccuracy in TCRH and/or T_M";
//   }

//   // W bounds (T/HR)
//   if (wcrh < 100) warningsByField.WCRH = "W out of bounds (LOW) - (100-4000)";
//   if (wcrh > 4000) warningsByField.WCRH = "W out of bounds (HIGH) - (100-4000)";

//   // D2 bounds (mm)
//   if (d2 < 100) warningsByField.D2 = "D2 out of bounds (LOW) - (100-1000)";
//   if (d2 > 1000) warningsByField.D2 = "D2 out of bounds (HIGH) - (100-1000)";

//   const anyWarning = Object.values(warningsByField).some(Boolean);
//   return { warningsByField, leakRateOutput, anyWarning };
// };

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
//     plantMCR,
//     plantType,
//     criticalType,
//     currency: paramCurrency,
    
//   } = parsedPowerStationData;

//   const [P1, setP1] = useState("");
//   const [P2, setP2] = useState("");
//   const [T1, setT1] = useState("");
//   const [T2p, setT2p] = useState("");
//   const [TCRH, setTCRH] = useState("");

//   const [Tmix, setTmix] = useState("");
//   const [WCRH, setWCRH] = useState("");
//   const [D2, setD2] = useState("");

//   const [showOutput, setShowOutput] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [wcrUnit, setWcrUnit] = useState<
//     "T/HR" | "KG/S" | "KPPH/HR" | "LB/S"
//   >("T/HR");
//   // Default unit
//   const [items, setItems] = useState([
//     { label: "T/HR", value: "T/HR" },
//     { label: "KG/S", value: "KG/S" },

//     { label: "KPPH/HR", value: "KPPH/HR" },
//     { label: "LB/S", value: "LB/S" },
//   ]);

//   const [result, setResult] = useState("0.00");
//   const [message, setMessage] = useState("");
//   const [hasWarning, setHasWarning] = useState(false);

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
//   const [tw, setTw] = useState('');
//   const [ww, setWw] = useState('');
//   const [currency, setCurrency] = useState("INR");
//   const [heatRateUnit, setHeatRateUnit] = useState("kJ/kW-h");
//   const [productionCost, setProductionCost] = useState("");
//   const [sellPricePerMWh, setSellPricePerMWh] = useState("");
//   const [pipeDiaUnit, setPipeDiaUnit] = useState("MM"); 
//   const [calculatedResults, setCalculatedResults] = useState({
//   leakRate: "0.00",
//   mwLoss: "0.00",
//   hrPenalty: "0.00",
//   productionLoss: "0.00",
//   revenueLoss: "0.00",
//   productionCostWasted: "0.00",
//   hasWarning: false,
//   warningMessage: ""
// });
//   const [inputErrors, setInputErrors] = useState<InputErrors>({});

//   useEffect(() => {
//     if (pipeDiaD2) {
//       setD2(pipeDiaD2);
//     }

//     if (paramP1Unit === "barA") setP1Unit("bara");
//     if (paramP1Unit === "psiA") setP1Unit("psia");

//     if (paramT1Unit === "deg C") setT1Unit("C");
//     if (paramT1Unit === "deg F") setT1Unit("F");

//     if (wcrhUnit) {
//       setWcrUnit(wcrhUnit);
//     }

//     if (paramCurrency) {
//       setCurrency(paramCurrency);
//     }
//     if (pipeDiaUnit) { // 👈 Add this
//     setPipeDiaUnit(pipeDiaUnit);
//   }
//   }, []);

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

// const convertUnits = () => {
//   // Make copies of current values for conversion
//   let p1 = Number.parseFloat(P1) || 0;
//   let p2 = Number.parseFloat(P2) || 0;
//   let t1 = Number.parseFloat(T1) || 0;
//   let t2p = Number.parseFloat(T2p) || 0;
//   let t2 = Number.parseFloat(TCRH) || 0;
//   let tmix = Number.parseFloat(Tmix) || 0;
//   let wcrh = Number.parseFloat(WCRH) || 0;
//   let d2 = Number.parseFloat(D2) || 0;

//   console.log("=== BEFORE CONVERSION ===");
//   console.log("Original T1:", t1, t1Unit);
//   console.log("Original T2p:", t2p, t1Unit);
//   console.log("Original TCRH:", t2, t1Unit);
//   console.log("Original Tmix:", tmix, t1Unit);

//   // P1/P2 conversion (psiA to barA)
//   if (p1Unit === "psia") {
//     const ConvP = 1/14.5; // ~0.0689655
//     p1 = p1 * ConvP;
//     p2 = p2 * ConvP;
//     console.log("Converted P1 to barA:", p1);
//     console.log("Converted P2 to barA:", p2);
//   }

//   // Temperature conversion (°F to °C)
//   if (t1Unit === "F") {
//     t1 = (t1 - 32) / 1.8;
//     t2p = (t2p - 32) / 1.8;
//     t2 = (t2 - 32) / 1.8;
//     tmix = (tmix - 32) / 1.8;
    
//     console.log("=== AFTER TEMP CONVERSION ===");
//     console.log("Converted T1 (°C):", t1);
//     console.log("Converted T2p (°C):", t2p);
//     console.log("Converted TCRH (°C):", t2);
//     console.log("Converted Tmix (°C):", tmix);
//   }

//   // W-CRH conversion to T/HR
//   if (wcrUnit === "KG/S") {
//     const ConvW = 3.6;
//     wcrh = wcrh * ConvW;
//   } else if (wcrUnit === "KPPH/HR") {
//     const ConvW = 1/2.24; // ~0.446429
//     wcrh = wcrh * ConvW;
//   } else if (wcrUnit === "LB/S") {
//     const ConvW = 3600/2240; // ~1.60714
//     wcrh = wcrh * ConvW;
//   }

//   // D2 conversion (IN to MM)
//   if (pipeDiaUnit === "IN") {
//     d2 = d2 * 25.4;
//   }

//   // Heat Rate conversion (Btu/kW-h to kJ/kW-h)
//   let hrValue = Number.parseFloat(heatRateValue || "0");
//   if (heatRateUnit === "Btu/kW-h") {
//     const ConvHR = 1.055;
//     hrValue = hrValue * ConvHR;
//   } else if (heatRateUnit === "default") {
//     // Set default values based on plant type
//     if (plantType === "ccpp") {
//       hrValue = 7500;
//     } else if (criticalType === "supercritical") {
//       hrValue = 8400;
//     } else {
//       hrValue = 9500; // subcritical or default
//     }
//   }

//   return {
//     p1, p2, t1, t2p, t2, tmix, wcrh, d2, hrValue
//   };
// };


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

//       case 'T2p':
//         if (numValue < 300)
//           error = "T2p out of bounds (LOW) - (300-425)";
//         if (numValue > 425)
//           error = "T2p out of bounds (HIGH) - (300-425)";
//         break;



//       case 'TCRH':

//         if (numValue < 300) error = "TCRH out of bounds (LOW) - (300-425)";
//         if (numValue > 425) error = "TCRH out of bounds (HIGH) - (300-425)";
//         break;
//       case 'Tmix':
//         if (numValue < 300) error = "T_M out of bounds (LOW) - (300-450)";
//         if (numValue > 450) error = "T_M out of bounds (HIGH) - (300-450)";
//         break;
//       case 'WCRH':
//         if (numValue < 100) error = "W out of bounds (LOW) - (100-4000)";
//         if (numValue > 4000) error = "W out of bounds (HIGH) - (100-4000)";
//         break;

//     }

//     setInputErrors(prev => ({ ...prev, [fieldName]: error }));
//   };

//   // Format result based on unit
//   const formatResult = (
//     resultValue: string,
//     unit: "T/HR" | "KG/S" | "KPPH/HR" | "LB/S"
//   ): string => {
//     if (resultValue === "NA" || resultValue === "0.00") return resultValue;

//     const numericValue = parseFloat(resultValue);

//     if (unit !== "T/HR") {
//       return Math.floor(numericValue).toString();
//     }
//     else {
//       // For T/HR, show with two decimal digits
//       return numericValue.toFixed(2);
//     }
//   };

// const calculateLeakFlow = () => {
//   let finalProductionCost = productionCost;
//   let finalCurrency = currency;

//   // DEFAULT LOGIC (as per document)
//   if (!finalProductionCost || finalProductionCost.trim() === "") {
//     finalProductionCost = "50";
//     finalCurrency = "USD";
//   }

//   // Validate empty fields first
//   const empties: InputErrors = {
//     P1: !P1.trim() ? "Required" : undefined,
//     P2: !P2.trim() ? "Required" : undefined,
//     T1: !T1.trim() ? "Required" : undefined,
//     T2p: !T2p.trim() ? "Required" : undefined,
//     TCRH: !TCRH.trim() ? "Required" : undefined,
//     Tmix: !Tmix.trim() ? "Required" : undefined,
//     WCRH: !WCRH.trim() ? "Required" : undefined,
//     Tw: !tw.trim() ? "Required" : undefined,
//     Ww: !ww.trim() ? "Required" : undefined,
//   };

//   const hasEmpty = Object.values(empties).some(Boolean);
//   if (hasEmpty) {
//     setInputErrors(empties);
//     setHasWarning(true);
//     setShowOutput(false);
//     setCalculatedResults(prev => ({
//       ...prev,
//       hasWarning: true,
//       warningMessage: "Please fill all required fields"
//     }));
//     const firstKey = Object.keys(empties).find((k) => empties[k]);
//     if (firstKey && fieldPositions[firstKey] !== undefined) {
//       requestAnimationFrame(() =>
//         scrollRef.current?.scrollTo({ y: Math.max(fieldPositions[firstKey] - 24, 0), animated: true }),
//       );
//     }
//     return;
//   }

//   // Store original unit values for later conversion back
//   const originalWcrUnit = wcrUnit;
//   const originalHeatRateUnit = heatRateUnit;
//   const originalP1Unit = p1Unit;
//   const originalT1Unit = t1Unit;
//   const originalPipeDiaUnit = pipeDiaUnit;

//   // Apply unit conversions to standard units for calculation
//   const converted = convertUnits();
  
//   let p1 = converted.p1;
//   let p2 = converted.p2;
//   let t1 = converted.t1;
//   let t2p = converted.t2p;
//   let t2 = converted.t2;
//   let tmix = converted.tmix;
//   let wcrh = converted.wcrh;
//   let d2 = converted.d2;
//   let heatRateNum = converted.hrValue;

//   console.log("=== CONVERTED VALUES ===");
//   console.log("P1 (barA):", p1);
//   console.log("P2 (barA):", p2);
//   console.log("T1 (°C):", t1);
//   console.log("T2p (°C):", t2p);
//   console.log("TCRH (°C):", t2);
//   console.log("Tmix (°C):", tmix);
//   console.log("WCRH (T/HR):", wcrh);
//   console.log("D2 (mm):", d2);

//   // Check if temperatures are in realistic range after conversion
//   if (t1 < 0 || t1 > 1000 || t2p < 0 || t2p > 1000 || t2 < 0 || t2 > 1000 || tmix < 0 || tmix > 1000) {
//     console.error("Temperature out of realistic range after conversion");
//     setInputErrors(prev => ({
//       ...prev,
//       T1: t1 < 0 || t1 > 1000 ? "Temperature unrealistic. Check units." : prev.T1,
//       T2p: t2p < 0 || t2p > 1000 ? "Temperature unrealistic. Check units." : prev.T2p,
//       TCRH: t2 < 0 || t2 > 1000 ? "Temperature unrealistic. Check units." : prev.TCRH,
//       Tmix: tmix < 0 || tmix > 1000 ? "Temperature unrealistic. Check units." : prev.Tmix,
//     }));
//     setHasWarning(true);
//     setShowOutput(true);
//     setCalculatedResults(prev => ({
//       ...prev,
//       hasWarning: true,
//       warningMessage: "Temperature values unrealistic. Please check your inputs and units."
//     }));
//     return;
//   }

//   const twValue = Number(tw) || 0;
//   const wwValue = Number(ww) || 0;

//   // Check for cross-field validations
//   const { warningsByField, leakRateOutput, anyWarning } = validateInputs(
//     p1, p2, t1, t2p, t2, tmix, wcrh, d2, wcrUnit, twValue, wwValue
//   );

//   if (anyWarning) {
//     setInputErrors({ ...inputErrors, ...warningsByField });
//     setHasWarning(true);
//     setShowOutput(true);
//     setCalculatedResults(prev => ({
//       ...prev,
//       hasWarning: true,
//       warningMessage: Object.values(warningsByField).find(Boolean) || "Input validation warning"
//     }));
//     const firstWarnKey = Object.keys(warningsByField).find((k) => warningsByField[k as keyof WarningByField]);
//     if (firstWarnKey && fieldPositions[firstWarnKey] !== undefined) {
//       requestAnimationFrame(() =>
//         scrollRef.current?.scrollTo({ y: Math.max(fieldPositions[firstWarnKey] - 24, 0), animated: true }),
//       );
//     }
//     return;
//   }

//   // STEP 2a: Calculate T2is (Isentropic Temperature)
//   const T2is = t1 - ((p1 - p2) / 20) * (25.1 - 0.03 * t1);
  
//   // STEP 2a: Calculate K1 (Updated formula)
//   const K1 = 15.32 * (p2 / (T2is + 273.2));
  
//   // STEP 2a: Calculate K2 (Updated formula)
//   const K2 = (3 * Math.pow(10, -8)) * (Math.pow(wcrh, 2) / p2) * (t2 + 273.2);
  
//   // STEP 2a: Calculate K3 (Unchanged)
//   const K3 = Math.pow(d2 / 500, 2);
  
//   // STEP 2a: Calculate Uncorrected Leak Rate, Wraw
//   const CONST_K = originalWcrUnit === "T/HR" ? 0.145 : 145;
//   const Wraw = CONST_K * (tmix - t2) * K1 * K2 * K3;
  
//   // STEP 2b: Calculate Corrected Leak Rate, Wcorr
//   let Wcorr = Wraw;
//   if (Math.abs(t2p - t2) > 0.001) {
//     Wcorr = Wraw * ((T2is - t2) / (t2p - t2));
//   }
  
//   // Apply spray water correction factor
//   const correctionFactor = wwValue !== 0 && twValue !== 0 ? wwValue / twValue : 1;
//   let finalCorrectedLeakRate = Wcorr * correctionFactor;

//   // STEP 3: Calculate MW loss
//   // CpstH (High pressure range specific heat)
//   const CpstH = 3.521 + 0.00467 * p1 - 0.00274 * t1;
  
//   // CpstL (Low pressure range specific heat)
//   const CpstL = 2.784 + 0.01164 * p2 - 0.002 * t2;
  
//   // Eq. MW-loss formula: MWLOSS = 0.9 * (Wcorr/3.6) * [(CpstH*T1) – (CpstL*TCRH)]
//   const mwLoss = 0.9 * (finalCorrectedLeakRate / 3.6) * ((CpstH * t1) - (CpstL * t2));
  
//   // Heat Rate Penalty: D-HR = HR * (Eq. MW-loss / MCR)
//   const mcrNum = parseFloat(plantMCR || "0");
//   let hrPenalty = mcrNum > 0 ? heatRateNum * (mwLoss / mcrNum) : 0;
  
//   // Production loss (MW-h) per year: PLOSS = Eq. MW-loss * 8000
//   const productionLossPerYear = mwLoss * 8000;
  
//   // Revenue loss per year: RLOSS = SPMWh * PLOSS
//   const sellPriceNum = parseFloat(sellPricePerMWh || "0");
//   const revenueLossPerYear = sellPriceNum * productionLossPerYear;
  
//   // Production Cost Wasted per year: PCOST = PCOSTU * (HR * 1000) * PLOSS
//   const productionCostNum = parseFloat(finalProductionCost);
//   const productionCostWastedPerYear = productionCostNum * (heatRateNum * 1000) * productionLossPerYear;

//   console.log("=== INTERMEDIATE CALCULATIONS ===");
//   console.log("T2is =", T2is);
//   console.log("K1 =", K1);
//   console.log("K2 =", K2);
//   console.log("K3 =", K3);
//   console.log("Wraw =", Wraw);
//   console.log("Wcorr =", Wcorr);
//   console.log("Correction Factor =", correctionFactor);

//   /* ========== STEP 4: CONVERT BACK TO USER UNITS ========== */
  
//   // Store values before conversion for display
//   let displayLeakRate = finalCorrectedLeakRate;
//   let displayHrPenalty = hrPenalty;
  
//   // 4a: Convert Wcorr back to original W-CRH unit
//   if (originalWcrUnit === "KG/S") {
//     const ConvW = 3.6;
//     displayLeakRate = finalCorrectedLeakRate / ConvW;
//   } else if (originalWcrUnit === "KPPH/HR") {
//     const ConvW = 1/2.24; // ~0.446429
//     displayLeakRate = finalCorrectedLeakRate / ConvW;
//   } else if (originalWcrUnit === "LB/S") {
//     const ConvW = 3600/2240; // ~1.60714
//     displayLeakRate = finalCorrectedLeakRate / ConvW;
//   }
//   // If T/HR, no conversion needed (already in T/HR)

//   // 4b: Convert Heat Rate Penalty back to original Heat Rate unit
//   if (originalHeatRateUnit === "Btu/kW-h") {
//     const ConvHR = 1.055;
//     displayHrPenalty = hrPenalty / ConvHR;
//   }
//   // If kJ/kW-h or default, no conversion needed (already in kJ/kW-h)

//   // Format the leak rate result for display
//   let formattedLeakRate: string;
//   if (originalWcrUnit !== "T/HR") {
//     formattedLeakRate = Math.floor(Math.abs(displayLeakRate)).toString();
//   } else {
//     formattedLeakRate = Math.abs(displayLeakRate).toFixed(2);
//   }

//   // Format other values (use absolute values to avoid negative display)
//   const formattedMwLoss = Math.abs(mwLoss).toFixed(2);
//   const formattedHrPenalty = Math.abs(displayHrPenalty).toFixed(2);
//   const formattedProductionLoss = Math.abs(productionLossPerYear).toFixed(2);
//   const formattedRevenueLoss = Math.abs(revenueLossPerYear).toFixed(2);
//   const formattedProductionCostWasted = Math.abs(productionCostWastedPerYear).toFixed(2);

//   console.log("=== FINAL RESULTS ===");
//   console.log("Leak Rate:", displayLeakRate, originalWcrUnit);
//   console.log("MW Loss:", mwLoss, "MW");
//   console.log("Heat Rate Penalty:", displayHrPenalty, originalHeatRateUnit || "kJ/kW-h");
//   console.log("Production Loss per Year:", productionLossPerYear, "MW-h");
//   console.log("Revenue Loss per Year:", revenueLossPerYear, finalCurrency);
//   console.log("Production Cost Wasted per Year:", productionCostWastedPerYear, finalCurrency);

//   // Set all results
//   setCalculatedResults({
//     leakRate: formattedLeakRate,
//     mwLoss: formattedMwLoss,
//     hrPenalty: formattedHrPenalty,
//     productionLoss: formattedProductionLoss,
//     revenueLoss: formattedRevenueLoss,
//     productionCostWasted: formattedProductionCostWasted,
//     hasWarning: false,
//     warningMessage: ""
//   });

//   setResult(formattedLeakRate);
//   setMessage("");
//   setHasWarning(false);
//   setShowOutput(true);
//   setInputErrors({});
//   scrollToTop();

//   return formattedLeakRate;
// };


//   const calculateAndSave = async () => {

//     // 1️⃣ First calculate
//     calculateLeakFlow(); 
    
//     try {

//       const finalPayload = {
//         power_station_name: stationName,

//         pipe_dia_d2: pipeDiaD2,
//         pipe_dia_unit: pipeDiaUnit,

//         t2p: T2p,

//         p1: P1,
//         p1_unit: p1Unit,

//         t1: T1,
//         t1_unit: t1Unit,

//         p2: P2,
//         tcrh: TCRH,

//         w_crh: WCRH,
//         w_crh_unit: wcrhUnit,

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
//         custom_currency: currency,

//         sell_price_per_mwh: sellPricePerMWh
//       };
//       console.log("T1 =", T1);
//       console.log("Payload =>", finalPayload);
//       const response = await api.post(
//         "/power-stations/",
//         finalPayload
//       );

//       if (response.data.success) {
//         // router.replace("/ResultScreen");
//       }

//     } catch (error: any) {
//       console.log("BACKEND ERROR =>", error.response?.data);
//     }
//   };

//   const resetAll = () => {
//     setP1("");
//     setP2("");
//     setT1("");
//     setT2p("");

//     setTCRH("");

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

//   const handleLogout = () => {
//     router.replace("/LoginScreen");
//   };

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.logoutButton}
//           onPress={handleLogout}
//         >
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>

//         <Text style={styles.logo}>KOSO</Text>
//         <View style={styles.stationUnitContainer}>
//           {/* Updated text to match image: "BASHP OORJA UNIT" */}
//           <Text style={styles.station}>
//             {stationName || "Power Station"}
//           </Text>

//           <View style={styles.underline} />
//           {/* <Text style={styles.unit}>UNIT 4</Text> */}
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
//           {/* Replaced StaticGasCylinder with the Image component */}
//           <View style={styles.diagramImageContainer}>
//             <Image
//               source={LeakDiagramImage}
//               style={styles.diagramImage}
//               resizeMode="contain"
//             />
//           </View>

//           <Text style={styles.sectionTitle}>APPLICATION - HP BYPASS</Text>

//           <View style={{ flexDirection: "row", alignItems: "flex-end" }}>

//             {/* P1 INPUT */}
//             <View style={{ flex: 1 }}>
//               <Text style={styles.inputLabel}>P1 (HP Inlet Pressure)</Text>
//               <TextInput
//                 style={[styles.input, inputErrors.P1 && styles.inputError]}
//                 keyboardType="numeric"
//                 value={P1}
//                 onChangeText={(t) => {
//                   setP1(t);
//                   validateFieldInRealTime("P1", t);
//                   setShowOutput(false);
//                 }}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//             </View>

//             {/* P1 UNIT */}
//             <View style={{ width: 90, marginLeft: 6 }}>
//               <Text style={styles.inputLabel}>Unit</Text>
//               <DropDownPicker
//                 open={openP1}
//                 value={p1Unit}
//                 items={p1Items}
//                 setOpen={setOpenP1}
//                 setValue={(cb) => setP1Unit(cb(p1Unit))}
//                 setItems={setP1Items}
//                 style={styles.unitDropdownBox}
//                 dropDownContainerStyle={styles.unitDropdownList}
//                 textStyle={styles.unitDropdownText}
//               />
//             </View>

//             {/* T1 INPUT */}
//             <View style={{ flex: 1, marginLeft: 8 }}>
//               <Text style={styles.inputLabel}>T1 (HP Steam)</Text>
//               <TextInput
//                 style={[styles.input, inputErrors.T1 && styles.inputError]}
//                 keyboardType="numeric"
//                 value={T1}
//                 onChangeText={(t) => {
//                   setT1(t);
//                   validateFieldInRealTime("T1", t);
//                   setShowOutput(false);
//                 }}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//             </View>

//             {/* T1 UNIT */}
//             <View style={{ width: 90, marginLeft: 6 }}>
//               <Text style={styles.inputLabel}>Unit</Text>
//               <DropDownPicker
//                 open={openT1}
//                 value={t1Unit}
//                 items={t1Items}
//                 setOpen={setOpenT1}
//                 setValue={(cb) => setT1Unit(cb(t1Unit))}
//                 setItems={setT1Items}
//                 style={styles.unitDropdownBox}
//                 dropDownContainerStyle={styles.unitDropdownList}
//                 textStyle={styles.unitDropdownText}
//               />
//             </View>

//           </View>

//           <View style={styles.row}>
//             <View onLayout={rememberY("T2p")} style={styles.inputWrapper}>
//               <InputField
//                 label={`T2p (°${t1Unit})`}

//                 value={T2p}
//                 onChangeText={(t: string) => {
//                   setT2p(t);
//                   validateFieldInRealTime("T2p", t);
//                   setShowOutput(false);
//                 }}
//                 errorText={inputErrors.T2p}
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

//             <View onLayout={rememberY("TCRH")
//             } style={styles.inputWrapper}>
//               <InputField
//                 label={`TCRH (°${t1Unit})`}

//                 value={TCRH}
//                 onChangeText={(t: string) => {
//                   setTCRH(t);
//                   validateFieldInRealTime("TCRH", t);

//                   setShowOutput(false);
//                 }}
//                 errorText={inputErrors.TCRH
//                 }
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
//               <DropDownPicker<"T/HR" | "KG/S" | "KPPH/HR" | "LB/S">

//                 open={open}
//                 value={wcrUnit}
//                 items={items}
//                 setOpen={setOpen}
//                 setValue={(callback: (val: "T/HR" | "KG/S" | "KPPH/HR" | "LB/S")
//                   => "T/HR" | "KG/S" | "KPPH/HR" | "LB/S") => {

//                   const value = callback(wcrUnit);

//                   setWcrUnit(value as "T/HR" | "KG/S" | "KPPH/HR" | "LB/S");

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
//             <View onLayout={rememberY("Tw")} style={styles.inputWrapper}>
//               <InputField
//                 label="Tw (Spray Water Temp)"
//                 value={tw}
//                 onChangeText={(t: string) => {
//                   setTw(t);
//                   setShowOutput(false);
//                 }}
//                 errorText={inputErrors.Tw}
//               />
//             </View>

//             <View onLayout={rememberY("Ww")} style={styles.inputWrapper}>
//               <InputField
//                 label="Ww (Spray Water Flow)"
//                 value={ww}
//                 onChangeText={(t: string) => {
//                   setWw(t);
//                   setShowOutput(false);
//                 }}
//                 errorText={inputErrors.Ww}
//               />
//             </View>
//           </View>
//           <View style={styles.row}>


//             <View onLayout={rememberY("Tmix")} style={styles.inputWrapper}>
//               <InputField
//                 label={`T-MIX (°${t1Unit})`}

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
//                     `${formatResult(result, wcrUnit)} ${wcrUnit}`
//                   )}
//                 </Text>
//               </View>

//               {hasWarning && message ? <Text style={styles.outputWarningText}>Warning : {message}</Text> : null}
//             </Reanimated.View>
//           )}

//           {/* Show Calculate Button only when output is not showing */}
//           {!showOutput && (
//             <TouchableOpacity style={styles.calculateBtn} onPress={calculateAndSave} accessibilityRole="button">
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
//   sectionContainer: {
//     marginTop: 15,
//     marginBottom: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 5,
//     backgroundColor: '#F9F9F9',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   sectionSubTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#FF4D57',
//     marginBottom: 10,
//     marginLeft: 8,
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
//     width: "100%",
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
//   logoutButton: {
//     position: "absolute",
//     top: 10,
//     right: 5,
//     padding: 20,
//     zIndex: 10,
//   },

//   logoutText: {
//     color: "#FF4D57",
//     fontWeight: "bold",
//     fontSize: 15,
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
//     overflow: "visible",
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
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#E5E5E5",
//     paddingHorizontal: 12,
//     height: 42,
//     fontSize: 14,
//     color: "#000",
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
//   unitDropdownBox: {
//     borderWidth: 1,
//     borderColor: "#E5E5E5",
//     borderRadius: 8,
//     height: 42,
//     minHeight: 42,   // ⭐ VERY IMPORTANT
//     backgroundColor: "#fff",
//     paddingVertical: 0,   // ⭐ dropdown खाली जाणं थांबवतो
//     justifyContent: "center", // ⭐ text center ठेवतो
//   },
//   unitDropdownList: {
//     borderRadius: 10,
//     borderColor: "#E5E5E5",
//   },

//   unitDropdownText: {
//     fontSize: 14,
//     color: "#000",
//   },

//   resetText: {
//     color: "#111111",
//     fontSize: 11,
//     textAlign: "center",
//     marginTop: 8,
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
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Reanimated, { FadeIn } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "./axiosInstance";

// ⚠️ REPLACE THIS WITH YOUR ACTUAL IMAGE IMPORT
const LeakDiagramImage = require('../assets/images/image.png');

const { width } = Dimensions.get('window');

interface FieldPositions {
  [key: string]: number;
}

interface InputErrors {
  [key: string]: string | undefined;
}

interface ValidationResult {
  warnings: string[];
  leakRateOutput: string | null;
  shouldCalculate: boolean;
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
    plantMCR,
    plantType,
    criticalType,
    currency: paramCurrency,
  } = parsedPowerStationData;

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);

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

  // Unit states
  const [showOutput, setShowOutput] = useState(false);
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

  // Additional data states
  const [currency, setCurrency] = useState("INR");
  const [heatRateUnit, setHeatRateUnit] = useState("kJ/kW-h");
  const [productionCost, setProductionCost] = useState("");
  const [sellPricePerMWh, setSellPricePerMWh] = useState("");
  const [pipeDiaUnit, setPipeDiaUnit] = useState("MM");

  // Warning and result states
  const [warnings, setWarnings] = useState<string[]>([]);
  const [result, setResult] = useState("0.00");
  const [hasWarning, setHasWarning] = useState(false);
  const [inputErrors, setInputErrors] = useState<InputErrors>({});
const [customCurrency, setCustomCurrency] = useState("");
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

  useEffect(() => {
    if (pipeDiaD2) setD2(pipeDiaD2);
    if (paramP1Unit === "barA") setP1Unit("bara");
    if (paramP1Unit === "psiA") setP1Unit("psia");
    if (paramT1Unit === "deg C") setT1Unit("C");
    if (paramT1Unit === "deg F") setT1Unit("F");
    if (wcrhUnit) setWcrUnit(wcrhUnit as any);
      if (paramCurrency) setCurrency(paramCurrency);
  if (parsedPowerStationData.sellPricePerMWh) 
    setSellPricePerMWh(parsedPowerStationData.sellPricePerMWh);
  if (parsedPowerStationData.productionCost) 
    setProductionCost(parsedPowerStationData.productionCost);
  if (parsedPowerStationData.heatRateValue) 
    setHeatRateValue(parsedPowerStationData.heatRateValue);
  if (parsedPowerStationData.pipeDiaUnit) 
    setPipeDiaUnit(parsedPowerStationData.pipeDiaUnit);
}, []);

  const rememberY = (key: string) => (e: LayoutChangeEvent) => {
    fieldPositions[key] = e.nativeEvent.layout.y;
  };

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  };

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

    // D2 conversion (IN to MM)
    if (pipeDiaUnit === "IN") {
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

  // Validation function based on the image
  const validateInputs = (): ValidationResult => {
    const warnings: string[] = [];
    let leakRateOutput: string | null = null;
    let shouldCalculate = true;

    const p1 = Number.parseFloat(P1) || 0;
    const p2 = Number.parseFloat(P2) || 0;
    const t1 = Number.parseFloat(T1) || 0;
    const t2p = Number.parseFloat(T2p) || 0;
    const tcrh = Number.parseFloat(TCRH) || 0;
    const tmix = Number.parseFloat(Tmix) || 0;
    const wcrh = Number.parseFloat(WCRH) || 0;
    const d2 = Number.parseFloat(D2) || 0;
    const plantMCRNum = Number.parseFloat(plantMCR) || 0;
    const hrNum = Number.parseFloat(heatRateValue) || 0;

    // Check for empty fields
    if (!P1) { warnings.push("P1 is required"); shouldCalculate = false; }
    if (!P2) { warnings.push("P2 is required"); shouldCalculate = false; }
    if (!T1) { warnings.push("T1 is required"); shouldCalculate = false; }
    if (!T2p) { warnings.push("T2p is required"); shouldCalculate = false; }
    if (!TCRH) { warnings.push("TCRH is required"); shouldCalculate = false; }
    if (!Tmix) { warnings.push("Tmix is required"); shouldCalculate = false; }
    if (!WCRH) { warnings.push("WCRH is required"); shouldCalculate = false; }

    if (!shouldCalculate) return { warnings, leakRateOutput, shouldCalculate };

    // P1 bounds (80-280 barA)
    if (p1 < 80) {
      warnings.push("P1 out of bounds (LOW) (80-280)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (p1 > 280) {
      warnings.push("P1 out of bounds (HIGH) (80-280)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // P2 bounds (20-60 barA)
    if (p2 < 20) {
      warnings.push("P-CRH out of bounds (LOW) (20-60)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (p2 > 60) {
      warnings.push("P-CRH out of bounds (HIGH) (20-60)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // P1/P2 ratio (2-6)
    if (p2 !== 0) {
      const ratio = p1 / p2;
      if (ratio < 2) {
        warnings.push("(P1/P-CRH) ratio out of bounds (LOW) (2-6)");
        leakRateOutput = "NA";
        shouldCalculate = false;
      }
      if (ratio > 6) {
        warnings.push("(P1/P-CRH) ratio out of bounds (HIGH) (2-6)");
        leakRateOutput = "NA";
        shouldCalculate = false;
      }
    }

    // T1 bounds (500-600 °C)
    if (t1 < 500) {
      warnings.push("T1 out of bounds (LOW) (500-600)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (t1 > 600) {
      warnings.push("T1 out of bounds (HIGH) (500-600)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // T2p bounds (460-560 °C)
    if (t2p < 460) {
      warnings.push("T2p out of bounds (LOW) (460-560)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (t2p > 560) {
      warnings.push("T2p out of bounds (HIGH) (460-560)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // TCRH bounds (300-425 °C)
    if (tcrh < 300) {
      warnings.push("TCRH out of bounds (LOW) (300-425)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (tcrh > 425) {
      warnings.push("TCRH out of bounds (HIGH) (300-425)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // Tmix bounds (300-450 °C)
    if (tmix < 300) {
      warnings.push("T_M out of bounds (LOW) (300-450)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (tmix > 450) {
      warnings.push("T_M out of bounds (HIGH) (300-450)");
      // Allow calculation but with warning
    }

    // Tmix vs TCRH checks
    if (tcrh - tmix > 2) {
      warnings.push("T_M error (less than TCRH)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (tcrh - tmix > 4) {
      warnings.push("Possible inaccuracy in TCRH and/or T_M");
      leakRateOutput = "0";
      shouldCalculate = false;
    }

    // WCRH bounds (500-2500 T/HR)
    if (wcrh < 500) {
      warnings.push("WCRH out of bounds (LOW) (500-2500)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (wcrh > 2500) {
      warnings.push("WCRH out of bounds (HIGH) (500-2500)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // D2 bounds (300-600 mm)
    if (d2 < 300) {
      warnings.push("D2 out of bounds (LOW) (300-600)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }
    if (d2 > 600) {
      warnings.push("D2 out of bounds (HIGH) (300-600)");
      leakRateOutput = "NA";
      shouldCalculate = false;
    }

    // Plant MCR bounds (100-1200 MW)
    if (plantMCRNum < 100) {
      warnings.push("Plant MCR out of bounds (LOW) (100-1200) - No action");
    }
    if (plantMCRNum > 1200) {
      warnings.push("Plant MCR out of bounds (HIGH) (100-1200) - No action");
    }

    // Heat Rate bounds (6000-12000)
    if (hrNum < 6000) {
      warnings.push("Heat Rate out of bounds (LOW) – set to default");
      setHeatRateValue(getDefaultHeatRate());
    }
    if (hrNum > 12000) {
      warnings.push("Heat Rate out of bounds (HIGH) – set to default");
      setHeatRateValue(getDefaultHeatRate());
    }

    return { warnings, leakRateOutput, shouldCalculate };
  };

  const getDefaultHeatRate = (): string => {
    if (plantType === "ccpp") return "7500";
    else if (criticalType === "supercritical") return "8400";
    else return "9500";
  };

  const setHeatRateValue = (value: string) => {
    // This function will be implemented to update heat rate
    console.log("Setting heat rate to:", value);
  };

  const calculateLeakFlow = () => {
    // Validate inputs first
    const validation = validateInputs();
    
    if (validation.warnings.length > 0) {
      setWarnings(validation.warnings);
      setHasWarning(true);
      setResult(validation.leakRateOutput || "0.00");
      setShowOutput(true);
      setModalVisible(true); // Show modal even for warnings
      
      setCalculatedResults(prev => ({
        ...prev,
        hasWarning: true,
        warningMessages: validation.warnings
      }));
      
      scrollToTop();
      return;
    }

    // Convert units for calculation
    const converted = convertUnits();
    const { p1, p2, t1, t2p, t2, tmix, wcrh, d2, hrValue } = converted;
    
    const twValue = Number(tw) || 0;
    const wwValue = Number(ww) || 0;

    // Calculations
    const T2is = t1 - ((p1 - p2) / 20) * (25.1 - 0.03 * t1);
    const K1 = 15.32 * (p2 / (T2is + 273.2));
    const K2 = (3 * Math.pow(10, -8)) * (Math.pow(wcrh, 2) / p2) * (t2 + 273.2);
    const K3 = Math.pow(d2 / 500, 2);
    
    const CONST_K = wcrUnit === "T/HR" ? 0.145 : 145;
    const Wraw = CONST_K * (tmix - t2) * K1 * K2 * K3;
    
    let Wcorr = Wraw;
    if (Math.abs(t2p - t2) > 0.001) {
      Wcorr = Wraw * ((T2is - t2) / (t2p - t2));
    }
    
    const correctionFactor = wwValue !== 0 && twValue !== 0 ? wwValue / twValue : 1;
    const finalCorrectedLeakRate = Wcorr * correctionFactor;

    // Calculate losses
    const CpstH = 3.521 + 0.00467 * p1 - 0.00274 * t1;
    const CpstL = 2.784 + 0.01164 * p2 - 0.002 * t2;
    
    const mwLoss = 0.9 * (finalCorrectedLeakRate / 3.6) * ((CpstH * t1) - (CpstL * t2));
    
    const mcrNum = parseFloat(plantMCR || "0");
    let hrPenalty = mcrNum > 0 ? hrValue * (mwLoss / mcrNum) : 0;
    
    const productionLossPerYear = mwLoss * 8000;
    const sellPriceNum = parseFloat(sellPricePerMWh || "0");
    const revenueLossPerYear = sellPriceNum * productionLossPerYear;
    
    const productionCostNum = parseFloat(productionCost || "50");
    const productionCostWastedPerYear = productionCostNum * (hrValue * 1000) * productionLossPerYear;

    // Convert back to user units
    let displayLeakRate = finalCorrectedLeakRate;
    if (wcrUnit === "KG/S") displayLeakRate = finalCorrectedLeakRate / 3.6;
    else if (wcrUnit === "KPPH/HR") displayLeakRate = finalCorrectedLeakRate / (1/2.24);
    else if (wcrUnit === "LB/S") displayLeakRate = finalCorrectedLeakRate / (3600/2240);

    // Format results
    const formattedLeakRate = wcrUnit !== "T/HR" 
      ? Math.floor(Math.abs(displayLeakRate)).toString()
      : Math.abs(displayLeakRate).toFixed(2);

    setCalculatedResults({
      leakRate: formattedLeakRate,
      mwLoss: Math.abs(mwLoss).toFixed(2),
      hrPenalty: Math.abs(hrPenalty).toFixed(2),
      productionLoss: Math.abs(productionLossPerYear).toFixed(2),
      revenueLoss: Math.abs(revenueLossPerYear).toFixed(2),
      productionCostWasted: Math.abs(productionCostWastedPerYear).toFixed(2),
      hasWarning: false,
      warningMessages: []
    });

    setResult(formattedLeakRate);
    setWarnings([]);
    setHasWarning(false);
    setShowOutput(true);
    setModalVisible(true); // Show modal with results
    scrollToTop();
  };

  const resetAll = () => {
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
    setResult("0.00");
    setWarnings([]);
    setHasWarning(false);
    setInputErrors({});
    setShowOutput(false);
    setModalVisible(false);
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
      pipe_dia_d2: pipeDiaD2,
      pipe_dia_unit: pipeDiaUnit,
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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
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
      >
        <View style={styles.container}>
          <View style={styles.diagramImageContainer}>
            <Image source={LeakDiagramImage} style={styles.diagramImage} resizeMode="contain" />
          </View>

          <Text style={styles.sectionTitle}>APPLICATION - HP BYPASS</Text>

          {/* P1 and T1 Row */}
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <View style={{ flex: 1 }} onLayout={rememberY("P1")}>
              <Text style={styles.inputLabel}>P1 (HP Inlet Pressure)</Text>
              <TextInput
                style={[styles.input, warnings.some(w => w.includes("P1")) && styles.inputError]}
                keyboardType="numeric"
                value={P1}
                onChangeText={setP1}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
            </View>
            <View style={{ width: 90, marginLeft: 6 }}>
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
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }} onLayout={rememberY("T1")}>
              <Text style={styles.inputLabel}>T1 (HP Steam)</Text>
              <TextInput
                style={[styles.input, warnings.some(w => w.includes("T1")) && styles.inputError]}
                keyboardType="numeric"
                value={T1}
                onChangeText={setT1}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
            </View>
            <View style={{ width: 90, marginLeft: 6 }}>
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
              />
            </View>
          </View>

          {/* T2p */}
          <View style={styles.row}>
            <View onLayout={rememberY("T2p")} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>T2p</Text>
              <TextInput
                style={[styles.input, warnings.some(w => w.includes("T2p")) && styles.inputError]}
                keyboardType="numeric"
                value={T2p}
                onChangeText={setT2p}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
            </View>
          </View>

          {/* P2 and TCRH */}
          <View style={styles.row}>
            <View onLayout={rememberY("P2")} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>P2 (CRH Outlet Pressure)</Text>
              <TextInput
                style={[styles.input, warnings.some(w => w.includes("P-CRH")) && styles.inputError]}
                keyboardType="numeric"
                value={P2}
                onChangeText={setP2}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
            </View>
            <View onLayout={rememberY("TCRH")} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>TCRH</Text>
              <TextInput
                style={[styles.input, warnings.some(w => w.includes("TCRH")) && styles.inputError]}
                keyboardType="numeric"
                value={TCRH}
                onChangeText={setTCRH}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
            </View>
          </View>

          {/* WCRH and Unit */}
          <View style={styles.row}>
            <View onLayout={rememberY("WCRH")} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>W-CRH</Text>
              <TextInput
                style={[styles.input, warnings.some(w => w.includes("WCRH")) && styles.inputError]}
                keyboardType="numeric"
                value={WCRH}
                onChangeText={setWCRH}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
            </View>
            <View onLayout={rememberY("Unit")} style={{ flex: 1, marginRight: 8, zIndex: 3000 }}>
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
                zIndex={3000}
                zIndexInverse={1000}
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
                style={[styles.input, warnings.some(w => w.includes("T_M")) && styles.inputError]}
                keyboardType="numeric"
                value={Tmix}
                onChangeText={setTmix}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />
            </View>
          </View>

          {/* Warning Messages */}
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
                <Text style={styles.resultValue}>{calculatedResults.productionLoss} MW-h</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Revenue loss per year:</Text>
                <Text style={styles.resultValue}>
                  {currency} {Number(calculatedResults.revenueLoss).toLocaleString(undefined, {maximumFractionDigits: 2})}
                </Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Production Cost Wasted per year:</Text>
                <Text style={styles.resultValue}>
                  {currency} {Number(calculatedResults.productionCostWasted).toLocaleString(undefined, {maximumFractionDigits: 2})}
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
  header: { backgroundColor: "#000000", paddingVertical: 10, paddingHorizontal: 18, width: "100%" },
  logo: { fontSize: 26, fontWeight: "bold", color: "#FF4D57", marginTop: 10 },
  stationUnitContainer: { alignItems: "center" },
  station: { fontSize: 15, color: "#D3D3D3", fontWeight: "bold" },
  underline: { height: 1, width: "65%", backgroundColor: "#D3D3D3", marginVertical: 2 },
  diagramImageContainer: { alignSelf: "center", width: "100%", height: 250, marginVertical: 5 },
  diagramImage: { width: '105%', height: '100%' },
  warningContainer: { marginTop: 10, marginBottom: 10, padding: 10, backgroundColor: "#FFF3CD", borderRadius: 5, borderWidth: 1, borderColor: "#FFE58F" },
  warningText: { color: "#856404", fontSize: 12, marginVertical: 2 },
  outputBox: { marginTop: 15, marginBottom: 10, alignItems: "center", backgroundColor: "rgba(255, 77, 87, 0.1)", borderColor: "#FF4D57", borderWidth: 1, padding: 10, borderRadius: 5, width: "95%", alignSelf: "center" },
  outputInnerBox: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  outputLabel: { fontSize: 16, fontWeight: "bold", color: "#000000", marginRight: 5 },
  outputValueText: { color: "#066e2cff", fontSize: 18, fontWeight: "bold" },
  logoutButton: { position: "absolute", top: 10, right: 5, padding: 20, zIndex: 10 },
  logoutText: { color: "#FF4D57", fontWeight: "bold", fontSize: 15 },
  sectionTitle: { backgroundColor: "#ECE9E9", padding: 10, fontSize: 15, color: "#FF4D57", marginVertical: 10, textAlign: "center", fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, overflow: "visible" },
  inputWrapper: { flex: 1, marginHorizontal: 2 },
  inputLabel: { color: "#080808", marginBottom: 2, fontSize: 11, marginHorizontal: 8 },
  inputLabels: { color: "#080808", marginBottom: 5, fontSize: 11, marginLeft: 15 },
  input: { backgroundColor: "#FFFFFF", borderRadius: 10, borderWidth: 1, borderColor: "#E5E5E5", paddingHorizontal: 12, height: 42, fontSize: 14, color: "#000", marginHorizontal: 8 },
  inputError: { borderColor: "#D60000", borderWidth: 1.5 },
  dropdown: { backgroundColor: "transparent", borderRadius: 0, borderWidth: 0, borderBottomWidth: 1, borderColor: "#FF4D57", height: 35, width: '90%', minHeight: 35, marginHorizontal: 8 },
  dropdownList: { borderRadius: 0, zIndex: 3000, borderColor: "#FF4D57", marginHorizontal: 8 },
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
    color: '#FF4D57',
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
});




