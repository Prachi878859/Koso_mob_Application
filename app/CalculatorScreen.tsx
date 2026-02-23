


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
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Reanimated, { FadeIn } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";



// ⚠️ REPLACE THIS WITH YOUR ACTUAL IMAGE IMPORT
const LeakDiagramImage = require('../assets/images/image.png');
// const LeakDiagramImage = { uri: "https://i.imgur.com/your_leak_diagram_image.png" };
// Using a placeholder URI or a local require is necessary for a real app.

interface FieldPositions {
  [key: string]: number;
}

interface InputErrors {
  [key: string]: string | undefined;
}

interface WarningByField {
  P1?: string;
  P2?: string;
  T1?: string;
  T2p?: string;
  TCRH?: string;
  Tmix?: string;
  WCRH?: string;
  D2?: string;
   Tw?: string;
  Ww?: string;
}

const validateInputs = (
  p1: number,
  p2: number,
  t1: number,
  t2p: number,
  t2: number,
  tmix: number,
  wcrh: number,
  d2: number,
  wcrUnit: string,
  tw: number,
  ww: number
)
: { warningsByField: WarningByField; leakRateOutput: string | null; anyWarning: boolean } => {
  const warningsByField: WarningByField = {
    P1: undefined,
    P2: undefined,
    T1: undefined,
    TCRH: undefined,

    Tmix: undefined,
    WCRH: undefined,
    D2: undefined,
    Tw: undefined,
Ww: undefined,
  };

  let leakRateOutput: string | null = null;

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
  if (Math.abs(t2 - t2p) < 4) {
    warningsByField.TCRH = "Possible inaccuracy in TCRH and/or T2p";
    warningsByField.T2p = "Possible inaccuracy in TCRH and/or T2p";
  }

  // T2
  if (t2 < 300) warningsByField.TCRH = "TCRH out of bounds (LOW) - (300-425)";
  if (t2 > 425) warningsByField.TCRH = "TCRH out of bounds (HIGH) - (300-425)";

  // Tmix
  if (tmix < 300) warningsByField.Tmix = "T_M out of bounds (LOW) - (300-450)";
  if (tmix > 450) warningsByField.Tmix = "T_M out of bounds (HIGH) - (300-450)";

  // Tmix checks
  if (t2 - tmix > 4) {
    warningsByField.Tmix = "T_M temperature error (less than T-CRH) ";
  }
  if (Math.abs(t2 - tmix) < 4) {
    warningsByField.TCRH = "Possible inaccuracy. in TCRH and/or T_M"
      ;
    warningsByField.Tmix = "Possible inaccuracy in TCRH and/or T_M"
      ;
    leakRateOutput = "0.00";
  }

  // W bounds (normalize to T/HR)
  if (wcrh < 100) warningsByField.WCRH = "W out of bounds (LOW) - (100-4000)";
  if (wcrh > 4000) warningsByField.WCRH = "W out of bounds (HIGH) - (100-4000)";



  const anyWarning = Object.values(warningsByField).some(Boolean);
  return { warningsByField, leakRateOutput, anyWarning };
};

export default function CalculatorScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();

const stationName = params.stationName as string | undefined;
const pipeDiaD2Param = params.pipeDiaD2 as string | undefined;
const p1UnitParam = params.p1Unit as string | undefined;
const t1UnitParam = params.t1Unit as string | undefined;
const wcrhUnitParam = params.wcrhUnit as string | undefined;
const heatRateValueParam = params.heatRateValue as string | undefined;
const plantMCRParam = params.plantMCR as string | undefined;
const plantTypeParam = params.plantType as string | undefined;
const criticalTypeParam = params.criticalType as string | undefined;
const currencyParam = params.currency as string | undefined;
const pipeDiaUnitParam = params.pipeDiaUnit as string | undefined;


  const [P1, setP1] = useState("");
  const [P2, setP2] = useState("");
  const [T1, setT1] = useState("");
  const [T2p, setT2p] = useState("");
  const [TCRH, setTCRH] = useState("");

  const [Tmix, setTmix] = useState("");
  const [WCRH, setWCRH] = useState("");
  const [D2, setD2] = useState("");

  const [showOutput, setShowOutput] = useState(false);
  const [open, setOpen] = useState(false);
  const [wcrUnit, setWcrUnit] = useState<
    "T/HR" | "KG/S" | "KPPH/HR" | "LB/S"
  >("T/HR");
  // Default unit
  const [items, setItems] = useState([
    { label: "T/HR", value: "T/HR" },
    { label: "KG/S", value: "KG/S" },

    { label: "KPPH/HR", value: "KPPH/HR" },
    { label: "LB/S", value: "LB/S" },
  ]);

  const [result, setResult] = useState("0.00");
  const [message, setMessage] = useState("");
  const [hasWarning, setHasWarning] = useState(false);

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
const [tw, setTw] = useState('');
const [ww, setWw] = useState('');
const [currency, setCurrency] = useState("INR");


  const [inputErrors, setInputErrors] = useState<InputErrors>({});

  useEffect(() => {
  if (pipeDiaD2Param) {
    setD2(pipeDiaD2Param);
  }

  if (p1UnitParam === "barA") {
    setP1Unit("bara");
  }

  if (p1UnitParam === "psiA") {
    setP1Unit("psia");
  }

  if (t1UnitParam === "deg C") {
    setT1Unit("C");
  }

  if (t1UnitParam === "deg F") {
    setT1Unit("F");
  }

  if (wcrhUnitParam) {
    setWcrUnit(wcrhUnitParam as "T/HR" | "KG/S" | "KPPH/HR" | "LB/S");
  }

  if (currencyParam) {
    setCurrency(currencyParam);
  }
}, []);


  // Constants for calculation
  
  const CONST_54 = 54;
  const CONST_8275 = 827.5;
  const CONST_2733 = 273.3;
  const CONST_1690 = 1690;
  const CONST_6332 = 633.2;
  const CONST_500 = 500;
  const CONST_K = wcrUnit === "T/HR" ? 0.145 : 145;


  const scrollRef = useRef<ScrollView>(null);

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  };

  const fieldPositions = useRef<FieldPositions>({}).current;

  const rememberY = (key: string) => (e: LayoutChangeEvent) => {
    fieldPositions[key] = e.nativeEvent.layout.y;
  };

  // Real-time validation function
  const validateFieldInRealTime = (fieldName: string, value: string) => {
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

    

    let error: string | undefined = undefined;

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

      case 'T2p':
        if (numValue < 300)
          error = "T2p out of bounds (LOW) - (300-425)";
        if (numValue > 425)
          error = "T2p out of bounds (HIGH) - (300-425)";
        break;



      case 'TCRH':

        if (numValue < 300) error = "TCRH out of bounds (LOW) - (300-425)";
        if (numValue > 425) error = "TCRH out of bounds (HIGH) - (300-425)";
        break;
      case 'Tmix':
        if (numValue < 300) error = "T_M out of bounds (LOW) - (300-450)";
        if (numValue > 450) error = "T_M out of bounds (HIGH) - (300-450)";
        break;
      case 'WCRH':
        if (numValue < 100) error = "W out of bounds (LOW) - (100-4000)";
        if (numValue > 4000) error = "W out of bounds (HIGH) - (100-4000)";
        break;
    
    }

    setInputErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Format result based on unit
  const formatResult = (
    resultValue: string,
    unit: "T/HR" | "KG/S" | "KPPH/HR" | "LB/S"
  ): string => {
    if (resultValue === "NA" || resultValue === "0.00") return resultValue;

    const numericValue = parseFloat(resultValue);

    if (unit !== "T/HR") {
      return Math.floor(numericValue).toString();
    }
    else {
      // For T/HR, show with two decimal digits
      return numericValue.toFixed(2);
    }
  };

  const calculateLeakFlow = () => {
    const empties: InputErrors = {
      
      P1: !P1.trim() ? "Required" : undefined,
      P2: !P2.trim() ? "Required" : undefined,
      T1: !T1.trim() ? "Required" : undefined,
      T2p: !T2p.trim() ? "Required" : undefined,
      TCRH: !TCRH.trim() ? "Required" : undefined,
      Tmix: !Tmix.trim() ? "Required" : undefined,
      WCRH: !WCRH.trim() ? "Required" : undefined,
      
      Tw: !tw.trim() ? "Required" : undefined,
  Ww: !ww.trim() ? "Required" : undefined,
      
    };

    const hasEmpty = Object.values(empties).some(Boolean);
    if (hasEmpty) {
      setInputErrors(empties);
      setHasWarning(true);
      setResult("NA");
      setShowOutput(false);
      const firstKey = Object.keys(empties).find((k) => empties[k]);
      if (firstKey && fieldPositions[firstKey] !== undefined) {
        requestAnimationFrame(() =>
          scrollRef.current?.scrollTo({ y: Math.max(fieldPositions[firstKey] - 24, 0), animated: true }),
        );
      }
      return;
    }

    let p1 = Number.parseFloat(P1);

    // Convert psia → bara
    if (p1Unit === "psia") {
      p1 = p1 * 0.0689476;
    }

    let p2 = Number.parseFloat(P2);

if (p1Unit === "psia") {
  p2 = p2 * 0.0689476;
}


    let t1 = Number.parseFloat(T1);

    // Convert °F → °C
    if (t1Unit === "F") {
      t1 = (t1 - 32) * (5 / 9);
    }

    let t2p = Number.parseFloat(T2p);
let t2 = Number.parseFloat(TCRH);
let tmix = Number.parseFloat(Tmix);

if (t1Unit === "F") {
  t2p = (t2p - 32) * (5 / 9);
  t2 = (t2 - 32) * (5 / 9);
  tmix = (tmix - 32) * (5 / 9);
}

    let wcrh = Number.parseFloat(WCRH);

    // Convert all units → T/HR
    if (wcrUnit === "KG/S") {
      wcrh = wcrh * 3.6;
    }

    if (wcrUnit === "KPPH/HR") {
      wcrh = wcrh * 0.453592;
      // 1 KPPH ≈ 0.453592 T/HR
    }

    if (wcrUnit === "LB/S") {
      wcrh = wcrh * 1.63293;
      // lb/s → T/HR
    }

    const d2 = Number.parseFloat(D2);
    const twValue = Number(tw);
const wwValue = Number(ww);


    // Check for cross-field validations
    const { warningsByField, leakRateOutput, anyWarning } = validateInputs(p1, p2, t1, t2p, t2, tmix, wcrh, d2, wcrUnit, twValue,
  wwValue);

    if (anyWarning) {
      // Merge real-time errors with cross-field warnings
      setInputErrors({ ...inputErrors, ...warningsByField });
      setHasWarning(true);
      setShowOutput(true);
      setResult(leakRateOutput !== null ? leakRateOutput : "NA");
      const firstWarnKey = Object.keys(warningsByField).find((k) => warningsByField[k as keyof WarningByField]);
      if (firstWarnKey && fieldPositions[firstWarnKey] !== undefined) {
        requestAnimationFrame(() =>
          scrollRef.current?.scrollTo({ y: Math.max(fieldPositions[firstWarnKey] - 24, 0), animated: true }),
        );
      }
      return;
    }

    // Calculation logic
    const T2is = t1 - ((p1 - p2) / 20) * (25.1 - 0.03 * t1);

    const K1 = (p2 / CONST_54) * (CONST_8275 / (T2is + CONST_2733)
    );
    const K2 = Math.pow(wcrh / CONST_1690, 2) * (CONST_54 / p2) * ((t2 + 273.2) / CONST_6332);
    const K3 = Math.pow(d2 / CONST_500, 2);

    const leakRate = CONST_K * (tmix - t2) * K1 * K2 * K3;

const correctionFactor =
  wwValue !== 0 && twValue !== 0 ? wwValue / twValue : 1;

const correctedLeakRate = leakRate * correctionFactor;

let finalResult: string;

if (wcrUnit !== "T/HR") {
  finalResult = Math.floor(correctedLeakRate).toString();
} else {
  finalResult = correctedLeakRate.toFixed(2);
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
    setT2p("");

    setTCRH("");

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

  const handleLogout = () => {
    router.replace("/LoginScreen");
  };


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>KOSO</Text>
        <View style={styles.stationUnitContainer}>
          {/* Updated text to match image: "BASHP OORJA UNIT" */}
          <Text style={styles.station}>
            {stationName || "Power Station"}
          </Text>

          <View style={styles.underline} />
          {/* <Text style={styles.unit}>UNIT 4</Text> */}
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
          {/* Replaced StaticGasCylinder with the Image component */}
          <View style={styles.diagramImageContainer}>
            <Image
              source={LeakDiagramImage}
              style={styles.diagramImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.sectionTitle}>APPLICATION - HP BYPASS</Text>

         <View style={{ flexDirection: "row", alignItems: "flex-end" }}>

  {/* P1 INPUT */}
  <View style={{ flex: 1 }}>
    <Text style={styles.inputLabel}>P1 (HP Inlet Pressure)</Text>
    <TextInput
      style={[styles.input, inputErrors.P1 && styles.inputError]}
      keyboardType="numeric"
      value={P1}
      onChangeText={(t) => {
        setP1(t);
        validateFieldInRealTime("P1", t);
        setShowOutput(false);
      }}
      placeholder="00"
      placeholderTextColor="#FF4D57"
    />
  </View>

  {/* P1 UNIT */}
  <View style={{ width: 90,marginLeft:6 }}>
    <Text style={styles.inputLabel}>Unit</Text>
    <DropDownPicker
      open={openP1}
      value={p1Unit}
      items={p1Items}
      setOpen={setOpenP1}
      setValue={(cb) => setP1Unit(cb(p1Unit))}
      setItems={setP1Items}
      style={styles.unitDropdownBox}
      dropDownContainerStyle={styles.unitDropdownList}
      textStyle={styles.unitDropdownText}
    />
  </View>

  {/* T1 INPUT */}
  <View style={{ flex: 1, marginLeft: 8 }}>
    <Text style={styles.inputLabel}>T1 (HP Steam)</Text>
    <TextInput
      style={[styles.input, inputErrors.T1 && styles.inputError]}
      keyboardType="numeric"
      value={T1}
      onChangeText={(t) => {
        setT1(t);
        validateFieldInRealTime("T1", t);
        setShowOutput(false);
      }}
      placeholder="00"
      placeholderTextColor="#FF4D57"
    />
  </View>

  {/* T1 UNIT */}
  <View style={{ width: 90,marginLeft:6 }}>
    <Text style={styles.inputLabel}>Unit</Text>
    <DropDownPicker
      open={openT1}
      value={t1Unit}
      items={t1Items}
      setOpen={setOpenT1}
      setValue={(cb) => setT1Unit(cb(t1Unit))}
      setItems={setT1Items}
      style={styles.unitDropdownBox}
      dropDownContainerStyle={styles.unitDropdownList}
      textStyle={styles.unitDropdownText}
    />
  </View>

</View>

          <View style={styles.row}>
            <View onLayout={rememberY("T2p")} style={styles.inputWrapper}>
              <InputField
                label={`T2p (°${t1Unit})`}

                value={T2p}
                onChangeText={(t: string) => {
                  setT2p(t);
                  validateFieldInRealTime("T2p", t);
                  setShowOutput(false);
                }}
                errorText={inputErrors.T2p}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View onLayout={rememberY("P2")} style={styles.inputWrapper}>
              <InputField
                label="P2 (CRH Outlet Pressure)"
                value={P2}
                onChangeText={(t: string) => {
                  setP2(t);
                  validateFieldInRealTime("P2", t);
                  setShowOutput(false);
                }}
                errorText={inputErrors.P2}
              />
            </View>

            <View onLayout={rememberY("TCRH")
            } style={styles.inputWrapper}>
              <InputField
                label={`TCRH (°${t1Unit})`}

                value={TCRH}
                onChangeText={(t: string) => {
                  setTCRH(t);
                  validateFieldInRealTime("TCRH", t);

                  setShowOutput(false);
                }}
                errorText={inputErrors.TCRH
                }
              />
            </View>
          </View>

          <View style={styles.row}>
            <View onLayout={rememberY("WCRH")} style={styles.inputWrapper}>
              <InputField
                label="W-CRH"
                value={WCRH}
                onChangeText={(t: string) => {
                  setWCRH(t);
                  validateFieldInRealTime("WCRH", t);
                  setShowOutput(false);
                }}
                errorText={inputErrors.WCRH}
              />
            </View>

  

            <View onLayout={rememberY("Unit")} style={{ flex: 1, marginRight: 8, zIndex: 3000 }}>
              <Text style={styles.inputLabels}>Unit</Text>
              <DropDownPicker<"T/HR" | "KG/S" | "KPPH/HR" | "LB/S">

                open={open}
                value={wcrUnit}
                items={items}
                setOpen={setOpen}
                setValue={(callback: (val: "T/HR" | "KG/S" | "KPPH/HR" | "LB/S") 
  => "T/HR" | "KG/S" | "KPPH/HR" | "LB/S") => {

  const value = callback(wcrUnit);

                  setWcrUnit(value as "T/HR" | "KG/S" | "KPPH/HR" | "LB/S");

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
  <View onLayout={rememberY("Tw")} style={styles.inputWrapper}>
    <InputField
      label="Tw (Spray Water Temp)"
      value={tw}
      onChangeText={(t: string) => {
        setTw(t);
        setShowOutput(false);
      }}
      errorText={inputErrors.Tw}
    />
  </View>

  <View onLayout={rememberY("Ww")} style={styles.inputWrapper}>
    <InputField
      label="Ww (Spray Water Flow)"
      value={ww}
      onChangeText={(t: string) => {
        setWw(t);
        setShowOutput(false);
      }}
      errorText={inputErrors.Ww}
    />
  </View>
</View>


          

          <View style={styles.row}>
          

            <View onLayout={rememberY("Tmix")} style={styles.inputWrapper}>
              <InputField
                label={`T-MIX (°${t1Unit})`}

                value={Tmix}
                onChangeText={(t: string) => {
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
                    `${formatResult(result, wcrUnit)} ${wcrUnit}`
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

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  errorText?: string;
}

function InputField({
  label,
  value,
  onChangeText,
  errorText,
}: InputFieldProps) {
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
  sectionContainer: {
  marginTop: 15,
  marginBottom: 10,
  paddingVertical: 10,
  paddingHorizontal: 5,
  backgroundColor: '#F9F9F9',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#E0E0E0',
},
sectionSubTitle: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#FF4D57',
  marginBottom: 10,
  marginLeft: 8,
},
  header: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 18,
    justifyContent: "space-between",
    width: "100%",
  },
  logo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF4D57",
    alignItems: "flex-start",
    marginTop: 10,
  },
  stationUnitContainer: {
    alignItems: "center",
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
    width: "100%",
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
  logoutButton: {
    position: "absolute",
    top: 10,
    right: 5,
    padding: 20,
    zIndex: 10,
  },

  logoutText: {
    color: "#FF4D57",
    fontWeight: "bold",
    fontSize: 15,
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
    overflow: "visible",
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
    marginLeft: 15,
  },
  // --- Input field style changes for bottom line ---
 input: {
  backgroundColor: "#FFFFFF",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#E5E5E5",
  paddingHorizontal: 12,
  height: 42,
  fontSize: 14,
  color: "#000",
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
 unitDropdownBox: {
  borderWidth: 1,
  borderColor: "#E5E5E5",
  borderRadius: 8,
  height: 42,
  minHeight: 42,   // ⭐ VERY IMPORTANT
  backgroundColor: "#fff",
  paddingVertical: 0,   // ⭐ dropdown खाली जाणं थांबवतो
  justifyContent: "center", // ⭐ text center ठेवतो
},



  unitDropdownList: {
    borderRadius: 10,
    borderColor: "#E5E5E5",
  },

  unitDropdownText: {
    fontSize: 14,
    color: "#000",
  },

  resetText: {
    color: "#111111",
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },
});





