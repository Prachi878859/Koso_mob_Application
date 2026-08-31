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
//   LogBox,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// import Reanimated, { FadeIn } from "react-native-reanimated";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { Ionicons } from '@expo/vector-icons';
// import api from "./axiosInstance";

// // Ignore the VirtualizedLists warning
// LogBox.ignoreLogs([
//   'VirtualizedLists should never be nested inside plain ScrollViews',
// ]);

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

// interface EnthalpyResults {
//   hstT1: number;
//   hstT2p: number;
//   hstTCRH: number;
//   hsw: number;
//   x: number;
//   hstT1FL: number;
//   hstTCRHFL: number;
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
//     p1flValue,
//     p1flUnit,
//     p2flValue,
//     tcrhflValue,
//     tcrhflUnit,
//     t1flValue,
//     t1flUnit,
//     plantCapacityFactor,
//   } = parsedPowerStationData;

//   // Store D2 value from first screen for calculations (no UI)
//   const [d2ValueFromFirstScreen] = useState(pipeDiaD2 || "");
//   const [d2UnitFromFirstScreen] = useState(paramPipeDiaUnit || "MM");

//   // Store P1FL value from first screen (display only)
//   const [p1flValueFromFirstScreen] = useState(p1flValue || "");
//   const [p1flUnitFromFirstScreen] = useState(p1flUnit || "psiA");
//   const [p2flValueFromFirstScreen] = useState(p2flValue || "");
//   // Store TCRHFL value from first screen (display only)
//   const [tcrhflValueFromFirstScreen] = useState(tcrhflValue || "");
//   const [tcrhflUnitFromFirstScreen] = useState(tcrhflUnit || "C");

//   // Store T1FL value from first screen (display only)
//   const [t1flValueFromFirstScreen] = useState(t1flValue || "");
//   const [t1flUnitFromFirstScreen] = useState(t1flUnit || "C");

//   // Store Plant MCR from first screen (display only)
//   const [plantMCRFromFirstScreen] = useState(parsedPowerStationData.plantMCR || "");

//   // Store Plant Capacity Factor from first screen
//   const [plantCapacityFactorFromFirstScreen] = useState(plantCapacityFactor || "90");

//   // Modal state
//   const [modalVisible, setModalVisible] = useState(false);
//   const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
//   const [missingFields, setMissingFields] = useState<string[]>([]);
//   const [initialCalculatorValues, setInitialCalculatorValues] = useState<any>(null);

//   // Enthalpy results state - not displayed, just stored
//   const [enthalpyResults, setEnthalpyResults] = useState<EnthalpyResults | null>(null);

//   // Input states
//   const [P1, setP1] = useState("");
//   const [P2, setP2] = useState("");
//   const [T1, setT1] = useState("");
//   const [T2p, setT2p] = useState("");
//   const [TCRH, setTCRH] = useState("");
//   const [Tmix, setTmix] = useState("");
//   const [WCRH, setWCRH] = useState("");
//   const [tw, setTw] = useState("");
//   const [ww, setWw] = useState("");
//   const [plantMWLoad, setPlantMWLoad] = useState("");
//   const [showOutput, setShowOutput] = useState(false);

//   // T2p Expected - calculated value (read-only)
//   const [t2pExpected, setT2pExpected] = useState("548.3");

//   // Error messages state
//   const [errorMessages, setErrorMessages] = useState<string[]>([]);

//   // Field-specific warnings state
//   const [fieldWarnings, setFieldWarnings] = useState<FieldWarnings>({
//     P1: [],
//     P2: [],
//     T1: [],
//     T2p: [],
//     TCRH: [],
//     Tmix: [],
//     WCRH: [],
//     Tw: [],
//     Ww: [],
//     PlantMWLoad: [],
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
//   const [customCurrency, setCustomCurrency] = useState("");
//   const [plantMCR, setPlantMCR] = useState("");

//   // Warning and result states
//   const [warnings, setWarnings] = useState<string[]>([]);
//   const [result, setResult] = useState("0.00");
//   const [hasWarning, setHasWarning] = useState(false);
//   const [inputErrors, setInputErrors] = useState<InputErrors>({});
//   const [calculatedResults, setCalculatedResults] = useState({
//     leakRate: "0.00",
//     leakRateFL: "0.00",
//     mwLoss: "0.00",
//     mwLossFL: "0.00",
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
//   const [calculatorInputs, setCalculatorInputs] = useState({
//     P1: "",
//     P2: "",
//     T1: "",
//     T2p: "",
//     TCRH: "",
//     Tmix: "",
//     WCRH: "",
//     tw: "",
//     ww: "",
//     plantMWLoad: "",
//     p1Unit: "bara" as "bara" | "psia",
//     t1Unit: "C" as "C" | "F",
//     wcrUnit: "T/HR" as "T/HR" | "KG/S" | "KPPH/HR" | "LB/S",
//   });

//   // Update the formatNumberWithCommas function
//   const formatNumberWithCommas = (value: string | number): string => {
//     let num: number;
//     if (typeof value === 'string') {
//       num = parseFloat(value);
//     } else {
//       num = value;
//     }

//     if (isNaN(num)) return "0";

//     const hasDecimal = num % 1 !== 0;

//     if (hasDecimal) {
//       const numStr = num.toString();
//       const parts = numStr.split('.');
//       const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//       const decimalPart = parts[1];
//       return `${integerPart}.${decimalPart}`;
//     } else {
//       return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
//     }
//   };

//   // Helper function to get currency symbol
//   const getCurrencySymbol = (currencyCode: string): string => {
//     const symbols: { [key: string]: string } = {
//       'USD': '$',
//       'EUR': '€',
//       'GBP': '£',
//       'JPY': '¥',
//       'INR': '₹',
//       'CNY': '¥',
//       'AUD': 'A$',
//       'CAD': 'C$',
//       'CHF': 'CHF',
//       'custom': '₿'
//     };

//     if (currencyCode === 'custom') {
//       return customCurrency || '$';
//     }

//     return symbols[currencyCode] || currencyCode;
//   };

// const calculateT2pExpected = () => {
//   const p1 = Number.parseFloat(P1) || 0;
//   const p2 = Number.parseFloat(P2) || 0;
//   const t1 = Number.parseFloat(T1) || 0;

//   let convertedP1 = p1;
//   let convertedP2 = p2;
//   let convertedT1 = t1;

//   // Pressure conversion
//   if (p1Unit === "psia") {
//     convertedP1 = p1 / 14.5;
//     convertedP2 = p2 / 14.5;
//   }

//   // Temperature conversion
//   if (t1Unit === "F") {
//     convertedT1 = (t1 - 32) / 1.8;
//   }

//   if (
//     convertedP1 > 0 &&
//     convertedP2 > 0 &&
//     convertedT1 > 0
//   ) {
//     // hstT1 formula
//     const hstT1 =
//       11.2572 * convertedT1
//       - 3.9503 * convertedP1
//       - 0.0086 * Math.pow(convertedT1, 2)
//       - 0.00195 * Math.pow(convertedP1, 2)
//       + 0.006275 * convertedP1 * convertedT1;

//     // T2is / T2p Expected formula
//     const t2pExpectedValue =
//       0.4352 * hstT1
//       + 0.5706 * convertedP2
//       - 1024;

//     console.log("T2p Expected Calculation:", {
//       P1: convertedP1,
//       P2: convertedP2,
//       T1: convertedT1,
//       hstT1,
//       T2pExpected: t2pExpectedValue,
//     });

//     return t2pExpectedValue.toFixed(1);
//   }

//   return "00";
// };


//   // Update T2p Expected whenever P1 or T1 changes
//   useEffect(() => {
//     const calculatedValue = calculateT2pExpected();
//     setT2pExpected(calculatedValue);
//  }, [P1, P2, T1, p1Unit, t1Unit]);
//   // Update calculator inputs whenever any input changes
//   useEffect(() => {
//     setCalculatorInputs({
//       P1, P2, T1, T2p, TCRH, Tmix, WCRH, tw, ww, plantMWLoad,
//       p1Unit, t1Unit, wcrUnit
//     });
//   }, [P1, P2, T1, T2p, TCRH, Tmix, WCRH, tw, ww, plantMWLoad, p1Unit, t1Unit, wcrUnit]);

//   // Initialize all values from passed parameters
//   useEffect(() => {
//     console.log("Received params in calculator:", parsedPowerStationData);
//     console.log("D2 value from first screen (for calculations):", pipeDiaD2, paramPipeDiaUnit);
//     console.log("P1FL value from first screen:", p1flValue, p1flUnit);
//     console.log("TCRHFL value from first screen:", tcrhflValue, tcrhflUnit);
//     console.log("T1FL value from first screen:", t1flValue, t1flUnit);
//     console.log("Plant MCR from first screen:", plantMCRFromFirstScreen);
//     console.log("Plant Capacity Factor from first screen:", plantCapacityFactor);

//     if (parsedPowerStationData.plantMCR) {
//       setPlantMCR(parsedPowerStationData.plantMCR);
//     }

//     if (paramP1Unit === "barA") setP1Unit("bara");
//     if (paramP1Unit === "psiA") setP1Unit("psia");
//     if (paramT1Unit === "deg C") setT1Unit("C");
//     if (paramT1Unit === "deg F") setT1Unit("F");
//     if (wcrhUnit) setWcrUnit(wcrhUnit as any);

//     if (paramCurrency) setCurrency(paramCurrency);
//     if (paramSellPricePerMWh) setSellPricePerMWh(paramSellPricePerMWh);
//     if (paramProductionCost) setProductionCost(paramProductionCost);
//     if (paramProductionCostCurrency) setCurrency(paramProductionCostCurrency);
//     if (paramCustomCurrency) setCustomCurrency(paramCustomCurrency);

//     if (parsedPowerStationData.heatRateValue) {
//       setHeatRateValue(parsedPowerStationData.heatRateValue);
//     }
//     if (parsedPowerStationData.heatRateUnit) {
//       setHeatRateUnit(parsedPowerStationData.heatRateUnit);
//     }

//     if (parsedPowerStationData.p1Value) setP1(parsedPowerStationData.p1Value);
//     if (parsedPowerStationData.p2Value) setP2(parsedPowerStationData.p2Value);
//     if (parsedPowerStationData.t1Value) setT1(parsedPowerStationData.t1Value);
//     if (parsedPowerStationData.t2pValue) setT2p(parsedPowerStationData.t2pValue);
//     if (parsedPowerStationData.tcrhValue) setTCRH(parsedPowerStationData.tcrhValue);
//     if (parsedPowerStationData.tmixValue) setTmix(parsedPowerStationData.tmixValue);
//     if (parsedPowerStationData.wcrhValue) setWCRH(parsedPowerStationData.wcrhValue);
//     if (parsedPowerStationData.twValue) setTw(parsedPowerStationData.twValue);
//     if (parsedPowerStationData.wwValue) setWw(parsedPowerStationData.wwValue);
//     if (parsedPowerStationData.plantMWLoad) setPlantMWLoad(parsedPowerStationData.plantMWLoad);

//     setTimeout(() => {
//       const calculatedValue = calculateT2pExpected();
//       setT2pExpected(calculatedValue);
//     }, 100);
//   }, []);

//   useEffect(() => {
//     if (params.calculatorData) {
//       try {
//         const savedCalculatorData = JSON.parse(params.calculatorData as string);
//         setInitialCalculatorValues(savedCalculatorData);

//         setP1(savedCalculatorData.P1 || "");
//         setP2(savedCalculatorData.P2 || "");
//         setT1(savedCalculatorData.T1 || "");
//         setT2p(savedCalculatorData.T2p || "");
//         setTCRH(savedCalculatorData.TCRH || "");
//         setTmix(savedCalculatorData.Tmix || "");
//         setWCRH(savedCalculatorData.WCRH || "");
//         setTw(savedCalculatorData.tw || "");
//         setWw(savedCalculatorData.ww || "");
//         setPlantMWLoad(savedCalculatorData.plantMWLoad || "");
//         setP1Unit(savedCalculatorData.p1Unit || "bara");
//         setT1Unit(savedCalculatorData.t1Unit || "C");
//         setWcrUnit(savedCalculatorData.wcrUnit || "T/HR");
//       } catch (error) {
//         console.error("Error parsing calculator data:", error);
//       }
//     }
//   }, [params.calculatorData]);

//   // Real-time validation function
//   const validateField = (fieldName: string, value: string, allValues?: any): string[] => {
//     const fieldSpecificWarnings: string[] = [];
//     const numValue = Number.parseFloat(value) || 0;

//     if (!value) {
//       return fieldSpecificWarnings;
//     }

//     const p1Value = Number.parseFloat(allValues?.P1 || P1) || 0;
//     const p2Value = Number.parseFloat(allValues?.P2 || P2) || 0;
//     const tcrhValue = Number.parseFloat(allValues?.TCRH || TCRH) || 0;
//     const tmixValue = Number.parseFloat(allValues?.Tmix || Tmix) || 0;

//     switch (fieldName) {
//       case 'P1':
//         if (p1Unit === "bara") {
//           if (numValue < 80) fieldSpecificWarnings.push("P1 out of bounds (LOW) (80-280)");
//           if (numValue > 280) fieldSpecificWarnings.push("P1 out of bounds (HIGH) (80-280)");
//         } else if (p1Unit === "psia") {
//           if (numValue < 1160) fieldSpecificWarnings.push("P1 out of bounds (LOW) (1160-4060)");
//           if (numValue > 4060) fieldSpecificWarnings.push("P1 out of bounds (HIGH) (1160-4060)");
//         }
//         break;
//       case 'P2':
//         if (p1Unit === "bara") {
//           if (numValue < 20) fieldSpecificWarnings.push("P-CRH out of bounds (LOW) (20-60)");
//           if (numValue > 60) fieldSpecificWarnings.push("P-CRH out of bounds (HIGH) (20-60)");
//         } else if (p1Unit === "psia") {
//           if (numValue < 290) fieldSpecificWarnings.push("P-CRH out of bounds (LOW) (290-870)");
//           if (numValue > 870) fieldSpecificWarnings.push("P-CRH out of bounds (HIGH) (290-870)");
//         }

//         if (p1Value > 0 && numValue > 0) {
//           const ratio = p1Value / numValue;
//           if (ratio < 2) {
//             fieldSpecificWarnings.push("HPT Pressure ratio out of bounds (LOW) (P1/P-CRH) ratio out of bounds (LOW) (2-6)");
//           }
//           if (ratio > 6) {
//             fieldSpecificWarnings.push("HPT Pressure ratio out of bounds (HIGH) (P1/P-CRH) ratio out of bounds (HIGH) (2-6)");
//           }
//         }
//         break;
//       case 'T1':
//         if (t1Unit === "C") {
//           if (numValue < 500) fieldSpecificWarnings.push("T1 out of bounds (LOW) (500-630)");
//           if (numValue > 630) fieldSpecificWarnings.push("T1 out of bounds (HIGH) (500-630)");
//         } else if (t1Unit === "F") {
//           if (numValue < 932) fieldSpecificWarnings.push("T1 out of bounds (LOW) (932-1166)");
//           if (numValue > 1166) fieldSpecificWarnings.push("T1 out of bounds (HIGH) (932-1166)");
//         }
//         break;
//       case 'T2p':
//         if (t1Unit === "C") {
//           if (numValue < 460) fieldSpecificWarnings.push("T2p out of bounds (LOW) (460-560)");
//           if (numValue > 560) fieldSpecificWarnings.push("T2p out of bounds (HIGH) (460-560)");
//         } else if (t1Unit === "F") {
//           if (numValue < 860) fieldSpecificWarnings.push("T2p out of bounds (LOW) (860-1040)");
//           if (numValue > 1040) fieldSpecificWarnings.push("T2p out of bounds (HIGH) (860-1040)");
//         }
//         break;
//       case 'TCRH':
//         if (t1Unit === "C") {
//           if (numValue < 300) fieldSpecificWarnings.push("TCRH out of bounds (LOW) (300-425)");
//           if (numValue > 425) fieldSpecificWarnings.push("TCRH out of bounds (HIGH) (300-425)");
//         } else if (t1Unit === "F") {
//           if (numValue < 572) fieldSpecificWarnings.push("TCRH out of bounds (LOW) (572-797)");
//           if (numValue > 797) fieldSpecificWarnings.push("TCRH out of bounds (HIGH) (572-797)");
//         }

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
//         if (t1Unit === "C") {
//           if (numValue < 300) fieldSpecificWarnings.push("T_m out of bounds (LOW) (300-450)");
//           if (numValue > 450) fieldSpecificWarnings.push("T_m out of bounds (HIGH) (300-450)");
//         } else if (t1Unit === "F") {
//           if (numValue < 572) fieldSpecificWarnings.push("T_m out of bounds (LOW) (572-842)");
//           if (numValue > 842) fieldSpecificWarnings.push("T_m out of bounds (HIGH) (572-842)");
//         }

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
//         if (wcrUnit === "T/HR") {
//           if (numValue < 500) fieldSpecificWarnings.push("W_CRH out of bounds (LOW) (500-2500)");
//           if (numValue > 2500) fieldSpecificWarnings.push("W_CRH out of bounds (HIGH) (500-2500)");
//         } else if (wcrUnit === "KG/S") {
//           if (numValue < 139) fieldSpecificWarnings.push("W_CRH out of bounds (LOW) (139-694)");
//           if (numValue > 694) fieldSpecificWarnings.push("W_CRH out of bounds (HIGH) (139-694)");
//         } else if (wcrUnit === "KPPH/HR") {
//           if (numValue < 1102) fieldSpecificWarnings.push("W_CRH out of bounds (LOW) (1102-5512)");
//           if (numValue > 5512) fieldSpecificWarnings.push("W_CRH out of bounds (HIGH) (1102-5512)");
//         } else if (wcrUnit === "LB/S") {
//           if (numValue < 306) fieldSpecificWarnings.push("W_CRH out of bounds (LOW) (306-1531)");
//           if (numValue > 1531) fieldSpecificWarnings.push("W_CRH out of bounds (HIGH) (306-1531)");
//         }
//         break;
//       case 'Tw':
//         if (t1Unit === "C") {
//           if (numValue < 15) fieldSpecificWarnings.push("Tw out of bounds (LOW) (15-250)");
//           if (numValue > 250) fieldSpecificWarnings.push("Tw out of bounds (HIGH) (15-250)");
//         } else if (t1Unit === "F") {
//           if (numValue < 59) fieldSpecificWarnings.push("Tw out of bounds (LOW) (59-482)");
//           if (numValue > 482) fieldSpecificWarnings.push("Tw out of bounds (HIGH) (59-482)");
//         }
//         break;
//       case 'Ww':
//         if (wcrUnit === "T/HR") {
//           if (numValue < 0) {
//             fieldSpecificWarnings.push("Bad input - CHECK");
//           } else if (numValue > 2) {
//             fieldSpecificWarnings.push("Excessive Spraywater Leakage - CHECK");
//           }
//         } else if (wcrUnit === "KPPH/HR") {
//           if (numValue < 0) {
//             fieldSpecificWarnings.push("Bad input - CHECK");
//           } else if (numValue > 4480) {
//             fieldSpecificWarnings.push("Excessive Spraywater Leakage - CHECK");
//           }
//         } else if (wcrUnit === "KG/S") {
//           if (numValue < 0) {
//             fieldSpecificWarnings.push("Bad input - CHECK");
//           } else if (numValue > 2) {
//             fieldSpecificWarnings.push("Excessive Spraywater Leakage - CHECK");
//           }
//         } else if (wcrUnit === "LB/S") {
//           if (numValue < 0) {
//             fieldSpecificWarnings.push("Bad input - CHECK");
//           } else if (numValue > 4480) {
//             fieldSpecificWarnings.push("Excessive Spraywater Leakage - CHECK");
//           }
//         }
//         break;
//       case 'PlantMWLoad':
//         const plantMCRValue = Number.parseFloat(plantMCRFromFirstScreen) || Number.parseFloat(plantMCR) || 0;
//         if (numValue > 0 && plantMCRValue > 0) {
//           const threshold = plantMCRValue * 1.05;
//           if (numValue > threshold) {
//             fieldSpecificWarnings.push("Plant MW exceeds MCR Rating");
//           }
//         }
//         break;
//     }

//     return fieldSpecificWarnings;
//   };

//   // Update field warnings when any input changes
//   useEffect(() => {
//     const newFieldWarnings = { ...fieldWarnings };
//     const allValues = { P1, P2, T1, T2p, TCRH, Tmix, WCRH, tw, ww, plantMWLoad };

//     newFieldWarnings.P1 = validateField('P1', P1, allValues);
//     newFieldWarnings.P2 = validateField('P2', P2, allValues);
//     newFieldWarnings.T1 = validateField('T1', T1, allValues);
//     newFieldWarnings.T2p = validateField('T2p', T2p, allValues);
//     newFieldWarnings.TCRH = validateField('TCRH', TCRH, allValues);
//     newFieldWarnings.Tmix = validateField('Tmix', Tmix, allValues);
//     newFieldWarnings.WCRH = validateField('WCRH', WCRH, allValues);
//     newFieldWarnings.Tw = validateField('Tw', tw, allValues);
//     newFieldWarnings.Ww = validateField('Ww', ww, allValues);
//     newFieldWarnings.PlantMWLoad = validateField('PlantMWLoad', plantMWLoad, allValues);

//     setFieldWarnings(newFieldWarnings);
//   }, [P1, P2, T1, T2p, TCRH, Tmix, WCRH, tw, ww, plantMWLoad, p1Unit, t1Unit, wcrUnit]);

//   const rememberY = (key: string) => (e: LayoutChangeEvent) => {
//     fieldPositions[key] = e.nativeEvent.layout.y;
//   };

//   const scrollToTop = () => {
//     requestAnimationFrame(() => {
//       scrollRef.current?.scrollTo({ y: 0, animated: true });
//     });
//   };

//   const goBackToEdit = () => {
//     const powerStationData = {
//       stationName: stationName,
//       pipeDiaD2: d2ValueFromFirstScreen,
//       pipeDiaUnit: d2UnitFromFirstScreen,
//       plantType: plantType,
//       criticalType: criticalType,
//       plantMCR: plantMCRFromFirstScreen || plantMCR,
//       heatRateValue: heatRateValue,
//       heatRateUnit: heatRateUnit,
//       currency: currency,
//       sellPricePerMWh: sellPricePerMWh,
//       productionCost: productionCost,
//       productionCostCurrency: currency,
//       customCurrency: customCurrency,
//       p1Value: P1,
//       p2Value: P2,
//       t1Value: T1,
//       t2pValue: T2p,
//       t2pExpected: t2pExpected,
//       tcrhValue: TCRH,
//       tmixValue: Tmix,
//       wcrhValue: WCRH,
//       d2Value: d2ValueFromFirstScreen,
//       twValue: tw,
//       wwValue: ww,
//       plantMWLoad: plantMWLoad,
//       p1flValue: p1flValueFromFirstScreen,
//       p1flUnit: p1flUnitFromFirstScreen,
//       p2flValue: p2flValueFromFirstScreen,
//       tcrhflValue: tcrhflValueFromFirstScreen,
//       tcrhflUnit: tcrhflUnitFromFirstScreen,
//       t1flValue: t1flValueFromFirstScreen,
//       t1flUnit: t1flUnitFromFirstScreen,
//       plantCapacityFactor: plantCapacityFactorFromFirstScreen,
//       p1Unit: p1Unit === "bara" ? "barA" : "psiA",
//       t1Unit: t1Unit === "C" ? "deg C" : "deg F",
//       wcrhUnit: wcrUnit,
//       pipeDiaUnit: d2UnitFromFirstScreen,
//     };

//     router.push({
//       pathname: "/Additional_user_inputs",
//       params: {
//         powerStationData: JSON.stringify(powerStationData),
//         fromCalculator: 'true'
//       }
//     });
//   };

//   // Helper function to get W-CRH conversion factor
//   const getWCRHConversionFactor = (unit: string): number => {
//     switch (unit) {
//       case "KG/S":
//         return 3.6;
//       case "KPPH/HR":
//         return 1 / 2.24;
//       case "LB/S":
//         return 3600 / 2240;
//       case "T/HR":
//       default:
//         return 1;
//     }
//   };

//   const getDefaultHeatRate = (plantType: string, criticalType: string): number => {
//     if (plantType === "ccpp") {
//       return 6500;
//     } else if (plantType === "coal_oil_fired") {
//       if (criticalType === "supercritical") {
//         return 8400;
//       } else {
//         return 9500;
//       }
//     }
//     return 9500;
//   };

//   // Function to calculate enthalpies
//   const calculateEnthalpies = (convertedValues: any): EnthalpyResults => {
//     const { p1, p2, t1, t2p, tcrh, tw, p1fl,p2fl, t1fl, tcrhfl } = convertedValues;

//     const hstT1 = 11.2572 * t1 - 3.9503 * p1 - 0.0086 * Math.pow(t1, 2) - 0.00195 * Math.pow(p1, 2) + 0.006275 * p1 * t1;
//     const hstT2p = 2322.3 - 1.87 * p2 + 2.4 * t2p;
//     const hstTCRH =  2302.7 - 2.29 * p2fl + 2.51 * tcrhfl;
//     const hsw = 10.37 + 4.048 * tw + 0.1235 * p2 + 0.0063 * Math.pow(tw, 2) - 0.000032 * Math.pow(p2, 2) - 0.000078 * p2 * tw;
//     const x = (hstT1 - hstT2p) / (hstT2p - hsw);
//     const hstT1FL = 11.2572 * t1fl - 3.9503 * p1fl - 0.0086 * Math.pow(t1fl, 2) - 0.00195 * Math.pow(p1fl, 2) + 0.006275 * p1fl * t1fl;
//     const hstTCRHFL = 2302.7 - 2.29 * p2 + 2.51 * tcrhfl;

//     return {
//       hstT1,
//       hstT2p,
//       hstTCRH,
//       hsw,
//       x,
//       hstT1FL,
//       hstTCRHFL
//     };
//   };

//   // Unit conversion function
//   const convertUnits = () => {
//     let p1 = Number.parseFloat(P1) || 0;
//     let p2 = Number.parseFloat(P2) || 0;
//     let t1 = Number.parseFloat(T1) || 0;
//     let t2p = Number.parseFloat(T2p) || 0;
//     let t2 = Number.parseFloat(TCRH) || 0;
//     let tmix = Number.parseFloat(Tmix) || 0;
//     let wcrh = Number.parseFloat(WCRH) || 0;
//     let d2 = Number.parseFloat(d2ValueFromFirstScreen) || 0;
//     let p1fl = Number.parseFloat(p1flValueFromFirstScreen) || 0;
//     let p2fl = Number.parseFloat(p2flValueFromFirstScreen) || 0;
//     let tcrhfl = Number.parseFloat(tcrhflValueFromFirstScreen) || 0;
//     let t1fl = Number.parseFloat(t1flValueFromFirstScreen) || 0;
//     let twValue = Number.parseFloat(tw) || 0;
//     let wwValue = Number.parseFloat(ww) || 0;

//     if (p1Unit === "psia") {
//       const ConvP = 1 / 14.5;
//       p1 = p1 * ConvP;
//       p2 = p2 * ConvP;
//       p1fl = p1fl * ConvP;
//   p2fl = p2fl * ConvP;
//     }

//     if (p1flUnitFromFirstScreen === "psiA") {
//       const ConvP = 1 / 14.5;
//       p1fl = p1fl * ConvP;
//     }

//     if (t1Unit === "F") {
//       t1 = (t1 - 32) / 1.8;
//       t2p = (t2p - 32) / 1.8;
//       t2 = (t2 - 32) / 1.8;
//       tmix = (tmix - 32) / 1.8;
//       twValue = (twValue - 32) / 1.8;

//       if (t1flUnitFromFirstScreen === "F" || t1flUnitFromFirstScreen === "deg F") {
//         t1fl = (t1fl - 32) / 1.8;
//       }

//       if (tcrhflUnitFromFirstScreen === "F" || tcrhflUnitFromFirstScreen === "deg F") {
//         tcrhfl = (tcrhfl - 32) / 1.8;
//       }
//     } else {
//       if (t1flUnitFromFirstScreen === "F" || t1flUnitFromFirstScreen === "deg F") {
//         t1fl = (t1fl - 32) / 1.8;
//       }
//       if (tcrhflUnitFromFirstScreen === "F" || tcrhflUnitFromFirstScreen === "deg F") {
//         tcrhfl = (tcrhfl - 32) / 1.8;
//       }
//     }

//     const convW = getWCRHConversionFactor(wcrUnit);
//     wcrh = wcrh * convW;
//     wwValue = wwValue * convW;

//     if (d2UnitFromFirstScreen === "IN") {
//       d2 = d2 * 25.4;
//     }

//     let hrValue = Number.parseFloat(heatRateValue || "0");
//     const isHRValueProvided = heatRateValue && heatRateValue.trim() !== "" && !isNaN(Number.parseFloat(heatRateValue));

//     if (!isHRValueProvided || hrValue === 0) {
//       hrValue = getDefaultHeatRate(plantType || "", criticalType || "");
//       console.log("Using default Heat Rate:", hrValue);
//     } else {
//       if (heatRateUnit === "Btu/kW-h") {
//         hrValue = hrValue * 1.055;
//         console.log("Converting Heat Rate from Btu/kW-h to kJ/kW-h:", hrValue);
//       } else if (heatRateUnit === "default") {
//         hrValue = getDefaultHeatRate(plantType || "", criticalType || "");
//         console.log("Using default Heat Rate (unit set to default):", hrValue);
//       }
//     }

//     return {
//       p1, p2, t1, t2p, t2, tmix, wcrh, d2, hrValue,
//       p1fl, tcrhfl, t1fl, tw: twValue, ww: wwValue,
//       convW
//     };
//   };

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
//     if (!d2ValueFromFirstScreen) missing.push("D2 (HP Bypass Outlet Pipe Diameter) - Please fill on previous screen");
//     if (!plantMWLoad) missing.push("Plant MW Load");

//     return missing;
//   };

//   // Validation function
//   const validateInputs = (): ValidationResult => {
//     const warnings: string[] = [];
//     const fieldSpecificWarnings: FieldWarnings = {
//       P1: [], P2: [], T1: [], T2p: [], TCRH: [], Tmix: [], WCRH: [], D2: [], Tw: [], Ww: [], PlantMWLoad: []
//     };
//     let leakRateOutput: string | null = null;
//     let shouldCalculate = true;
//     let missingFieldsList: string[] = [];

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
//     let d2 = Number.parseFloat(d2ValueFromFirstScreen) || 0;
//     const twValue = Number.parseFloat(tw) || 0;
//     const wwValue = Number.parseFloat(ww) || 0;

//     if (d2UnitFromFirstScreen === "IN") {
//       d2 = d2 * 25.4;
//     }

//     // P1 validation
//     if (p1Unit === "bara") {
//       if (p1 < 80) {
//         warnings.push("P1 out of bounds (LOW) (80-280)");
//         fieldSpecificWarnings.P1.push("P1 out of bounds (LOW) (80-280)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (p1 > 280) {
//         warnings.push("P1 out of bounds (HIGH) (80-280)");
//         fieldSpecificWarnings.P1.push("P1 out of bounds (HIGH) (80-280)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     } else if (p1Unit === "psia") {
//       if (p1 < 1160) {
//         warnings.push("P1 out of bounds (LOW) (1160-4060)");
//         fieldSpecificWarnings.P1.push("P1 out of bounds (LOW) (1160-4060)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (p1 > 4060) {
//         warnings.push("P1 out of bounds (HIGH) (1160-4060)");
//         fieldSpecificWarnings.P1.push("P1 out of bounds (HIGH) (1160-4060)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     }

//     // P2 validation with HPT Pressure ratio
//     if (p1Unit === "bara") {
//       if (p2 < 20) {
//         warnings.push("P-CRH out of bounds (LOW) (20-60)");
//         fieldSpecificWarnings.P2.push("P-CRH out of bounds (LOW) (20-60)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (p2 > 60) {
//         warnings.push("P-CRH out of bounds (HIGH) (20-60)");
//         fieldSpecificWarnings.P2.push("P-CRH out of bounds (HIGH) (20-60)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     } else if (p1Unit === "psia") {
//       if (p2 < 290) {
//         warnings.push("P-CRH out of bounds (LOW) (290-870)");
//         fieldSpecificWarnings.P2.push("P-CRH out of bounds (LOW) (290-870)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (p2 > 870) {
//         warnings.push("P-CRH out of bounds (HIGH) (290-870)");
//         fieldSpecificWarnings.P2.push("P-CRH out of bounds (HIGH) (290-870)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     }

//     if (p2 !== 0) {
//       const ratio = p1 / p2;
//       if (ratio < 2) {
//         warnings.push("HPT Pressure ratio out of bounds (LOW) (P1/P-CRH) ratio out of bounds (LOW) (2-6)");
//         fieldSpecificWarnings.P2.push("HPT Pressure ratio out of bounds (LOW) (P1/P-CRH) ratio out of bounds (LOW) (2-6)");
//       }
//       if (ratio > 6) {
//         warnings.push("HPT Pressure ratio out of bounds (HIGH) (P1/P-CRH) ratio out of bounds (HIGH) (2-6)");
//         fieldSpecificWarnings.P2.push("HPT Pressure ratio out of bounds (HIGH) (P1/P-CRH) ratio out of bounds (HIGH) (2-6)");
//       }
//     }

//     // T1 validation
//     if (t1Unit === "C") {
//       if (t1 < 500) {
//         warnings.push("T1 out of bounds (LOW) (500-630)");
//         fieldSpecificWarnings.T1.push("T1 out of bounds (LOW) (500-630)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (t1 > 630) {
//         warnings.push("T1 out of bounds (HIGH) (500-630)");
//         fieldSpecificWarnings.T1.push("T1 out of bounds (HIGH) (500-630)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     } else if (t1Unit === "F") {
//       if (t1 < 932) {
//         warnings.push("T1 out of bounds (LOW) (932-1166)");
//         fieldSpecificWarnings.T1.push("T1 out of bounds (LOW) (932-1166)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (t1 > 1166) {
//         warnings.push("T1 out of bounds (HIGH) (932-1166)");
//         fieldSpecificWarnings.T1.push("T1 out of bounds (HIGH) (932-1166)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     }

//     // T2p validation
//     if (t1Unit === "C") {
//       if (t2p < 460) {
//         warnings.push("T2p out of bounds (LOW) (460-560)");
//         fieldSpecificWarnings.T2p.push("T2p out of bounds (LOW) (460-560)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (t2p > 560) {
//         warnings.push("T2p out of bounds (HIGH) (460-560)");
//         fieldSpecificWarnings.T2p.push("T2p out of bounds (HIGH) (460-560)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     } else if (t1Unit === "F") {
//       if (t2p < 860) {
//         warnings.push("T2p out of bounds (LOW) (860-1040)");
//         fieldSpecificWarnings.T2p.push("T2p out of bounds (LOW) (860-1040)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (t2p > 1040) {
//         warnings.push("T2p out of bounds (HIGH) (860-1040)");
//         fieldSpecificWarnings.T2p.push("T2p out of bounds (HIGH) (860-1040)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     }

//     // TCRH validation
//     if (t1Unit === "C") {
//       if (tcrh < 300) {
//         warnings.push("TCRH out of bounds (LOW) (300-425)");
//         fieldSpecificWarnings.TCRH.push("TCRH out of bounds (LOW) (300-425)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (tcrh > 425) {
//         warnings.push("TCRH out of bounds (HIGH) (300-425)");
//         fieldSpecificWarnings.TCRH.push("TCRH out of bounds (HIGH) (300-425)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     } else if (t1Unit === "F") {
//       if (tcrh < 572) {
//         warnings.push("TCRH out of bounds (LOW) (572-797)");
//         fieldSpecificWarnings.TCRH.push("TCRH out of bounds (LOW) (572-797)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (tcrh > 797) {
//         warnings.push("TCRH out of bounds (HIGH) (572-797)");
//         fieldSpecificWarnings.TCRH.push("TCRH out of bounds (HIGH) (572-797)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     }

//     // Tmix validation
//     if (t1Unit === "C") {
//       if (tmix < 300) {
//         warnings.push("T_M out of bounds (LOW) (300-450)");
//         fieldSpecificWarnings.Tmix.push("T_M out of bounds (LOW) (300-450)");
//       }
//       if (tmix > 450) {
//         warnings.push("T_M out of bounds (HIGH) (300-450)");
//         fieldSpecificWarnings.Tmix.push("T_M out of bounds (HIGH) (300-450)");
//       }
//     } else if (t1Unit === "F") {
//       if (tmix < 572) {
//         warnings.push("T_M out of bounds (LOW) (572-842)");
//         fieldSpecificWarnings.Tmix.push("T_M out of bounds (LOW) (572-842)");
//       }
//       if (tmix > 842) {
//         warnings.push("T_M out of bounds (HIGH) (572-842)");
//         fieldSpecificWarnings.Tmix.push("T_M out of bounds (HIGH) (572-842)");
//       }
//     }

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

//     // WCRH validation
//     if (wcrUnit === "T/HR") {
//       if (wcrh < 500) {
//         warnings.push("W_CRH out of bounds (LOW) (500-2500)");
//         fieldSpecificWarnings.WCRH.push("W_CRH out of bounds (LOW) (500-2500)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (wcrh > 2500) {
//         warnings.push("W_CRH out of bounds (HIGH) (500-2500)");
//         fieldSpecificWarnings.WCRH.push("W_CRH out of bounds (HIGH) (500-2500)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     } else if (wcrUnit === "KG/S") {
//       if (wcrh < 139) {
//         warnings.push("W_CRH out of bounds (LOW) (139-694)");
//         fieldSpecificWarnings.WCRH.push("W_CRH out of bounds (LOW) (139-694)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (wcrh > 694) {
//         warnings.push("W_CRH out of bounds (HIGH) (139-694)");
//         fieldSpecificWarnings.WCRH.push("W_CRH out of bounds (HIGH) (139-694)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     } else if (wcrUnit === "KPPH/HR") {
//       if (wcrh < 1102) {
//         warnings.push("W_CRH out of bounds (LOW) (1102-5512)");
//         fieldSpecificWarnings.WCRH.push("W_CRH out of bounds (LOW) (1102-5512)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (wcrh > 5512) {
//         warnings.push("W_CRH out of bounds (HIGH) (1102-5512)");
//         fieldSpecificWarnings.WCRH.push("W_CRH out of bounds (HIGH) (1102-5512)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     } else if (wcrUnit === "LB/S") {
//       if (wcrh < 306) {
//         warnings.push("W_CRH out of bounds (LOW) (306-1531)");
//         fieldSpecificWarnings.WCRH.push("W_CRH out of bounds (LOW) (306-1531)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//       if (wcrh > 1531) {
//         warnings.push("W_CRH out of bounds (HIGH) (306-1531)");
//         fieldSpecificWarnings.WCRH.push("W_CRH out of bounds (HIGH) (306-1531)");
//         leakRateOutput = "NA";
//         shouldCalculate = false;
//       }
//     }

//     // Tw validation
//     if (twValue > 0) {
//       if (t1Unit === "C") {
//         if (twValue < 15) {
//           warnings.push("Tw out of bounds (LOW) (15-250)");
//           fieldSpecificWarnings.Tw.push("Tw out of bounds (LOW) (15-250)");
//         }
//         if (twValue > 250) {
//           warnings.push("Tw out of bounds (HIGH) (15-250)");
//           fieldSpecificWarnings.Tw.push("Tw out of bounds (HIGH) (15-250)");
//         }
//       } else if (t1Unit === "F") {
//         if (twValue < 59) {
//           warnings.push("Tw out of bounds (LOW) (59-482)");
//           fieldSpecificWarnings.Tw.push("Tw out of bounds (LOW) (59-482)");
//         }
//         if (twValue > 482) {
//           warnings.push("Tw out of bounds (HIGH) (59-482)");
//           fieldSpecificWarnings.Tw.push("Tw out of bounds (HIGH) (59-482)");
//         }
//       }
//     }

//     // Ww validation
//     if (wwValue > 0 || wwValue < 0) {
//       if (wcrUnit === "T/HR") {
//         if (wwValue < 0) {
//           warnings.push("Bad input - CHECK");
//           fieldSpecificWarnings.Ww.push("Bad input - CHECK");
//         } else if (wwValue > 2) {
//           warnings.push("Excessive Spraywater Leakage - CHECK");
//           fieldSpecificWarnings.Ww.push("Excessive Spraywater Leakage - CHECK");
//         }
//       } else if (wcrUnit === "KPPH/HR") {
//         if (wwValue < 0) {
//           warnings.push("Bad input - CHECK");
//           fieldSpecificWarnings.Ww.push("Bad input - CHECK");
//         } else if (wwValue > 4480) {
//           warnings.push("Excessive Spraywater Leakage - CHECK");
//           fieldSpecificWarnings.Ww.push("Excessive Spraywater Leakage - CHECK");
//         }
//       } else if (wcrUnit === "KG/S") {
//         if (wwValue < 0) {
//           warnings.push("Bad input - CHECK");
//           fieldSpecificWarnings.Ww.push("Bad input - CHECK");
//         } else if (wwValue > 2) {
//           warnings.push("Excessive Spraywater Leakage - CHECK");
//           fieldSpecificWarnings.Ww.push("Excessive Spraywater Leakage - CHECK");
//         }
//       } else if (wcrUnit === "LB/S") {
//         if (wwValue < 0) {
//           warnings.push("Bad input - CHECK");
//           fieldSpecificWarnings.Ww.push("Bad input - CHECK");
//         } else if (wwValue > 4480) {
//           warnings.push("Excessive Spraywater Leakage - CHECK");
//           fieldSpecificWarnings.Ww.push("Excessive Spraywater Leakage - CHECK");
//         }
//       }
//     }

//     // Heat Rate validation
//     const hrValue = Number.parseFloat(heatRateValue || "0");
//     if (hrValue > 0) {
//       if (heatRateUnit === "kJ/kW-h") {
//         if (hrValue < 6000) {
//           warnings.push("Heat Rate out of bounds (LOW) – set to default");
//         }
//         if (hrValue > 12000) {
//           warnings.push("Heat Rate out of bounds (HIGH) – set to default");
//         }
//       } else if (heatRateUnit === "Btu/kW-h") {
//         if (hrValue < 5687) {
//           warnings.push("Heat Rate out of bounds (LOW) – set to default");
//         }
//         if (hrValue > 11374) {
//           warnings.push("Heat Rate out of bounds (HIGH) – set to default");
//         }
//       }
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
//     const missing = checkMissingFields();
//     if (missing.length > 0) {
//       setMissingFields(missing);
//       setShowMissingFieldsModal(true);
//       return;
//     }

//     const validation = validateInputs();

//     if (validation.warnings.length > 0) {
//       setWarnings(validation.warnings);
//       setHasWarning(true);
//       setResult(validation.leakRateOutput || "0.00");
//       setFieldWarnings(validation.fieldWarnings);
//       setCalculatedResults(prev => ({
//         ...prev,
//         hasWarning: true,
//         warningMessages: validation.warnings
//       }));
//       scrollToTop();
//       return;
//     }

//     performCalculation();
//   };

//   const performCalculation = () => {
//   const converted = convertUnits();
//   const {
//     p1, p2, t1, t2p, t2, tmix, wcrh, d2, hrValue,
//     p1fl, tcrhfl, t1fl, tw: twConverted, ww: wwConverted,
//     convW
//   } = converted;

//   // Calculate enthalpies
//   const enthalpyResults = calculateEnthalpies({
//     p1, p2, t1, t2p,
//     tcrh: t2,
//     tw: twConverted,
//     p1fl, t1fl, tcrhfl
//   });

//   setEnthalpyResults(enthalpyResults);

//   console.log("Converted values:", {
//     p1, p2, t1, t2p, t2, tmix, wcrh, d2, hrValue,
//     p1fl, tcrhfl, t1fl, tw: twConverted, ww: wwConverted,
//     convW
//   });

//   console.log("Enthalpy Results:", enthalpyResults);

//   const mcrFlowRate = Number(plantMWLoad) || Number(plantMCRFromFirstScreen) || Number(plantMCR) || 0;

//   let finalCorrectedLeakRate = 0;
//   let T2is = 0;
//   let K1 = 0, K2 = 0, K3 = 0;
//   const errors: string[] = [];

//   // Use standard calculation since Ww <= 0.1
//   // FIX: Use correct formula for T2is
//   T2is = t1 - ((p1 - p2) / 20) * (25.1 - 0.03 * t1);
//   console.log("T2is calculated:", T2is);

//   // FIX: K1 formula - use T2is + 273.15 for absolute temperature
//   K1 = 15.32 * (p2 / (T2is + 273.15));
//   K2 = (3 * Math.pow(10, -8)) * (Math.pow(wcrh, 2) / p2) * (t2 + 273.15);
//   K3 = Math.pow(d2 / 500, 2);

//   console.log("K1:", K1, "K2:", K2, "K3:", K3);


//   // FIX: Wraw formula with more precision
//   const Wraw = 0.145 * (tmix - t2) * K1 * K2 * K3;
//   console.log("Standard Leak Rate (Wraw):", Wraw);

//   // FIX: K4 calculation with proper precision
//   let K4 = 1;
//   if ((T2is - t2p) >= 10) {
//     K4 = ((T2is - t2) / (t2p - t2)) / (1 + enthalpyResults.x);
//     console.log("K4 (with spray water correction):", K4);
//   } else {
//     K4 = 1;
//     console.log("K4 = 1 (no spray water correction)");
//   }

//   finalCorrectedLeakRate = Wraw * K4;
//   console.log("Corrected Leak Rate (Wcorr = Wraw * K4):", finalCorrectedLeakRate);

//   // Store error messages
//   setErrorMessages(errors);

//   // FULL LOAD LEAK RATE
//   let wcorrFL = finalCorrectedLeakRate;
//   if (p1fl > 0 && p1 > 0 && t1fl > 0 && t1 > 0) {
//     // FIX: Use correct temperature ratio calculation
//     const absoluteT1 = t1 + 273.15;
//     const absoluteT1FL = t1fl + 273.15;
//     const temperatureRatio = absoluteT1 / absoluteT1FL;
//     const sqrtTemperatureRatio = Math.sqrt(temperatureRatio);

//     wcorrFL = finalCorrectedLeakRate * ((p1fl / p1) * sqrtTemperatureRatio);
//     console.log("FULL LOAD LEAK RATE (WcorrFL):", wcorrFL);
//   } else {
//     console.log("P1FL or T1FL not available, skipping full load correction");
//   }

//   // MWLOSS CALCULATION (At Test Condition)
//   // FIX: Convert correctly from T/HR to KG/S
//   const wcorrInKgPerSec = finalCorrectedLeakRate / 3.6;
//   const enthalpyDifference = enthalpyResults.hstT1 - enthalpyResults.hstTCRH;
//   const mwLoss = 0.99 * wcorrInKgPerSec * enthalpyDifference / 1000;

//   console.log("MWLOSS (At Test Condition) Calculation:", {
//     wcorr: finalCorrectedLeakRate,
//     wcorrInKgPerSec,
//     hstT1: enthalpyResults.hstT1,
//     hstTCRH: enthalpyResults.hstTCRH,
//     enthalpyDifference,
//     mwLoss
//   });

//   // MWLOSSFL CALCULATION (At MCR Load)
//   const wcorrFLInKgPerSec = wcorrFL / 3.6;
//   const enthalpyDifferenceFL = enthalpyResults.hstT1FL - enthalpyResults.hstTCRHFL;
//   const mwLossFL = 0.99 * wcorrFLInKgPerSec * enthalpyDifferenceFL / 1000;

//   console.log("MWLOSSFL (At MCR Load) Calculation:", {
//     wcorrFL: wcorrFL,
//     wcorrFLInKgPerSec,
//     hstT1FL: enthalpyResults.hstT1FL,
//     hstTCRHFL: enthalpyResults.hstTCRHFL,
//     enthalpyDifferenceFL,
//     mwLossFL
//   });

//   // MCR Load calculations using mwLossFL
//   const mcrFlowRateForCalc = mcrFlowRate || 100;
//   const cfpValue = Number.parseFloat(plantCapacityFactorFromFirstScreen) || 90;
//   const sellPriceNum = parseFloat(sellPricePerMWh || "0");
//   const productionCostNum = parseFloat(productionCost || "50");

//   // FIX: Heat Rate Penalty calculation
//   const hrPenaltyMCR = hrValue * (mwLossFL / mcrFlowRateForCalc);
//   const productionLossMCR = mwLossFL * 8000 * (cfpValue / 100);
//   const revenueLossMCR = sellPriceNum * productionLossMCR;
//   const productionCostWastedMCR = productionCostNum * productionLossMCR;

//   // CONVERT BACK TO USER INPUT UNITS
//   const wcorrUserUnits = finalCorrectedLeakRate / convW;
//   const wcorrFLUserUnits = wcorrFL / convW;

//   let hrPenaltyUserUnits = hrPenaltyMCR;
//   if (heatRateUnit === "Btu/kW-h") {
//     hrPenaltyUserUnits = hrPenaltyMCR / 1.055;
//   }

//   // Use toFixed with proper rounding
//   const formattedWcorr = wcorrUserUnits.toFixed(2);
//   const formattedWcorrFL = wcorrFLUserUnits.toFixed(2);
//   const formattedMwLoss = mwLoss.toFixed(2);
//   const formattedMwLossFL = mwLossFL.toFixed(2);
//   const formattedHrPenaltyMCR = hrPenaltyUserUnits.toFixed(2);
//   const formattedProductionLossMCR = productionLossMCR.toFixed(2);
//   const formattedRevenueLossMCR = revenueLossMCR.toFixed(2);
//   const formattedProductionCostWastedMCR = productionCostWastedMCR.toFixed(2);

//   console.log("Final Outputs:", {
//     wcorr: formattedWcorr,
//     wcorrFL: formattedWcorrFL,
//     mwLoss: formattedMwLoss,
//     mwLossFL: formattedMwLossFL,
//     hrPenalty: formattedHrPenaltyMCR,
//     productionLoss: formattedProductionLossMCR,
//     revenueLoss: formattedRevenueLossMCR,
//     productionCostWasted: formattedProductionCostWastedMCR
//   });

//   setCalculatedResults({
//     leakRate: formattedWcorr,
//     leakRateFL: formattedWcorrFL,
//     mwLoss: formattedMwLoss,
//     mwLossFL: formattedMwLossFL,
//     hrPenalty: formattedHrPenaltyMCR,
//     productionLoss: formattedProductionLossMCR,
//     revenueLoss: formattedRevenueLossMCR,
//     productionCostWasted: formattedProductionCostWastedMCR,
//     hasWarning: errors.length > 0 || false,
//     warningMessages: errors.length > 0 ? errors : []
//   });

//   setResult(formattedWcorr);
//   setWarnings(errors.length > 0 ? errors : []);
//   setHasWarning(errors.length > 0);
//   setShowOutput(true);
//   setModalVisible(true);
//   scrollToTop();
// };

//   const resetAll = () => {
//     if (initialCalculatorValues) {
//       setP1(initialCalculatorValues.P1 || "");
//       setP2(initialCalculatorValues.P2 || "");
//       setT1(initialCalculatorValues.T1 || "");
//       setT2p(initialCalculatorValues.T2p || "");
//       setTCRH(initialCalculatorValues.TCRH || "");
//       setTmix(initialCalculatorValues.Tmix || "");
//       setWCRH(initialCalculatorValues.WCRH || "");
//       setTw(initialCalculatorValues.tw || "");
//       setWw(initialCalculatorValues.ww || "");
//       setPlantMWLoad(initialCalculatorValues.plantMWLoad || "");
//       setP1Unit(initialCalculatorValues.p1Unit || "bara");
//       setT1Unit(initialCalculatorValues.t1Unit || "C");
//       setWcrUnit(initialCalculatorValues.wcrUnit || "T/HR");
//     } else {
//       setP1("");
//       setP2("");
//       setT1("");
//       setT2p("");
//       setTCRH("");
//       setTmix("");
//       setWCRH("");
//       setTw("");
//       setWw("");
//       setPlantMWLoad("");
//     }

//     setResult("0.00");
//     setWarnings([]);
//     setErrorMessages([]);
//     setHasWarning(false);
//     setFieldWarnings({
//       P1: [], P2: [], T1: [], T2p: [], TCRH: [], Tmix: [], WCRH: [], D2: [], Tw: [], Ww: [], PlantMWLoad: []
//     });
//     setInputErrors({});
//     setShowOutput(false);
//     setModalVisible(false);
//     setShowMissingFieldsModal(false);
//     setEnthalpyResults(null);
//     scrollToTop();
//   };

//   const handleLogout = () => {
//     router.replace("/LoginScreen");
//   };

// const calculateAndSave = async () => {
//   calculateLeakFlow();

//   try {
//     // Format the results for saving
//     const formattedResults = {
//       productionLoss: parseFloat(Number(calculatedResults.productionLoss).toFixed(1)),
//       revenueLoss: Math.round(Number(calculatedResults.revenueLoss)),
//       productionCostWasted: Math.round(Number(calculatedResults.productionCostWasted))
//     };

//     // Ensure ww is properly parsed as float and preserve decimal values
//     const wwValue = parseFloat(ww) || 0;

//     // Also ensure other numeric values are properly parsed
//     const t2pValue = parseFloat(T2p) || 0;
//     const p1Value = parseFloat(P1) || 0;
//     const t1Value = parseFloat(T1) || 0;
//     const p2Value = parseFloat(P2) || 0;
//     const tcrhValue = parseFloat(TCRH) || 0;
//     const wcrhValue = parseFloat(WCRH) || 0;
//     const twValue = parseFloat(tw) || 0;
//     const tmixValue = parseFloat(Tmix) || 0;
//     const plantMWLoadValue = parseFloat(plantMWLoad) || 0;
//     const p1flValueFromFirstScreenNum = parseFloat(p1flValueFromFirstScreen) || 0;
//     const p2flValueFromFirstScreenNum = parseFloat(p2flValueFromFirstScreen) || 0;
//     const tcrhflValueFromFirstScreenNum = parseFloat(tcrhflValueFromFirstScreen) || 0;
//     const t1flValueFromFirstScreenNum = parseFloat(t1flValueFromFirstScreen) || 0;
//     const plantMCRValue = parseFloat(plantMCRFromFirstScreen) || parseFloat(plantMCR) || 0;
//     const heatRateValueNum = parseFloat(heatRateValue) || 0;
//     const productionCostNum = parseFloat(productionCost) || 0;
//     const sellPriceNum = parseFloat(sellPricePerMWh) || 0;
//     const plantCapacityFactorNum = parseFloat(plantCapacityFactorFromFirstScreen) || 90;

//     const finalPayload = {
//       power_station_name: stationName,
//       pipe_dia_d2: d2ValueFromFirstScreen,
//       pipe_dia_unit: d2UnitFromFirstScreen,
//       t2p: t2pValue,
//       t2p_expected: t2pExpected,
//       p1: p1Value,
//       p1_unit: p1Unit,
//       t1: t1Value,
//       t1_unit: t1Unit,
//       p2: p2Value,
//       tcrh: tcrhValue,
//       w_crh: wcrhValue,
//       w_crh_unit: wcrUnit,
//       tw: twValue,
//       ww: wwValue, // This should now preserve 0.01
//       t_mix: tmixValue,
//       plant_type: plantType,
//       critical_type: criticalType,
//       plant_mcr: plantMCRValue,
//       plant_mw_load: plantMWLoadValue,
//       plant_capacity_factor: plantCapacityFactorNum,
//       heat_rate_value: heatRateValueNum,
//       heat_rate_unit: heatRateUnit,
//       production_cost: productionCostNum,
//       production_cost_currency: currency,
//       custom_currency: currency === "custom" ? customCurrency : currency,
//       sell_price_per_mwh: sellPriceNum,
//       p1fl: p1flValueFromFirstScreenNum,
//       p2fl: p2flValueFromFirstScreenNum,
//       p1fl_unit: p1flUnitFromFirstScreen,
//       tcrhfl: tcrhflValueFromFirstScreenNum,
//       tcrhfl_unit: tcrhflUnitFromFirstScreen,
//       t1fl: t1flValueFromFirstScreenNum,
//       t1fl_unit: t1flUnitFromFirstScreen,
//       enthalpy_results: enthalpyResults,
//       error_messages: errorMessages,
//       formatted_results: formattedResults
//     };

//     console.log("Saving payload with ww value:", {
//       ww: wwValue,
//       ww_raw: ww,
//       all_values: finalPayload
//     });

//     const response = await api.post("/power-stations/", finalPayload);
//     console.log("Save response:", response.data);
//   } catch (error: any) {
//     console.log("BACKEND ERROR =>", error.response?.data);
//   }
// };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const closeMissingFieldsModal = () => {
//     setShowMissingFieldsModal(false);
//   };

//   const setHeatRateValue = (value: string) => {
//     console.log("Setting heat rate to:", value);
//   };

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
//         removeClippedSubviews={false}
//       >
//         <View style={styles.container}>
//           <View style={styles.diagramImageContainer}>
//             <Image source={LeakDiagramImage} style={styles.diagramImage} resizeMode="contain" />
//           </View>

//           <Text style={styles.sectionTitle}>APPLICATION - HP BYPASS</Text>

//           {/* Row 1: P1 and T1 */}
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
//             <View style={{ width: 90, marginLeft: 6, marginTop: 14 }}>
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
//                 listMode="SCROLLVIEW"
//                 zIndex={3000}
//                 zIndexInverse={1000}
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
//             <View style={{ width: 90, marginLeft: 6, marginTop: 14 }}>
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
//                 listMode="SCROLLVIEW"
//                 zIndex={2900}
//                 zIndexInverse={900}
//               />
//             </View>
//           </View>

//           {/* Row 2: P2, TCRH, Plant MW Load */}
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
//             <View onLayout={rememberY("TCRH")} style={[styles.inputWrapper, { flex: 1, marginTop: 11 }]}>
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
//             <View onLayout={rememberY("PlantMWLoad")} style={[styles.inputWrapper, { flex: 1, marginTop: 11 }]}>
//               <Text style={styles.inputLabel}>Plant MW Load</Text>
//               <TextInput
//                 style={[styles.input, fieldWarnings.PlantMWLoad.length > 0 && styles.inputError]}
//                 keyboardType="numeric"
//                 value={plantMWLoad}
//                 onChangeText={setPlantMWLoad}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//               {renderFieldWarning('PlantMWLoad')}
//             </View>
//           </View>

//           {/* Row 3: WCRH and Unit */}
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
//             <View onLayout={rememberY("Unit")} style={{ flex: 1, marginRight: 8, zIndex: 1000 }}>
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
//                 zIndex={1000}
//                 zIndexInverse={700}
//               />
//             </View>
//           </View>

//           {/* Row 4: T-MIX, T2p, and T2p Expected */}
//           <View style={styles.row}>
//             <View onLayout={rememberY("Tmix")} style={[styles.inputWrapper, { flex: 0.33 }]}>
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
//             <View onLayout={rememberY("T2p")} style={[styles.inputWrapper, { flex: 0.33, marginLeft: 4 }]}>
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
//             <View onLayout={rememberY("T2pExpected")} style={[styles.inputWrapper, { flex: 0.34, marginLeft: 4 }]}>
//               <Text style={styles.inputLabel}>T2p Expected</Text>
//               <View style={[styles.input, styles.readOnlyInput]}>
//                 <Text style={styles.readOnlyText}>{t2pExpected}</Text>
//               </View>
//             </View>
//           </View>

//           {/* Row 5: Tw and Ww */}
//           <View style={styles.row}>
//             <View onLayout={rememberY("Tw")} style={styles.inputWrapper}>
//               <Text style={styles.inputLabel}>Tw (Spray Water Temp)</Text>
//               <TextInput
//                 style={[styles.input, fieldWarnings.Tw.length > 0 && styles.inputError]}
//                 keyboardType="numeric"
//                 value={tw}
//                 onChangeText={setTw}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//               {renderFieldWarning('Tw')}
//             </View>
//             <View onLayout={rememberY("Ww")} style={styles.inputWrapper}>
//               <Text style={styles.inputLabel}>Ww (Spray Water Flow) </Text>
//               <TextInput
//                 style={[styles.input, fieldWarnings.Ww.length > 0 && styles.inputError]}
//                 keyboardType="numeric"
//                 value={ww}
//                 onChangeText={setWw}
//                 placeholder="00"
//                 placeholderTextColor="#FF4D57"
//               />
//               {renderFieldWarning('Ww')}
//             </View>
//           </View>

//           {/* Warning Messages */}
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
//                   <Text key={index} style={styles.missingFieldText}>• {field}</Text>
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

//     {/* Results Modal */}
// <Modal
//   animationType="slide"
//   transparent={true}
//   visible={modalVisible}
//   onRequestClose={closeModal}
// >
//   <View style={styles.modalOverlay}>
//     <View style={styles.modalContent}>
//       <View style={styles.modalHeader}>
//         <Text style={styles.modalTitle}>Calculation Results</Text>
//         <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
//           <Text style={styles.closeButtonText}>×</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
//         {calculatedResults.hasWarning && calculatedResults.warningMessages.length > 0 && (
//           <View style={styles.modalWarningContainer}>
//             {calculatedResults.warningMessages.map((warning, index) => (
//               <Text key={index} style={styles.modalWarningText}>⚠ {warning}</Text>
//             ))}
//           </View>
//         )}

//         {/* AT TEST CONDITIONS */}
//         <Text style={styles.sectionTitle}>At Test Conditions:</Text>

//         <View style={styles.resultItem}>
//           <Text style={styles.resultLabel}>LEAK RATE:</Text>
//           <Text style={[styles.resultValue, calculatedResults.hasWarning && { color: "#856404" }]}>
//             {result === "NA" ? "NA (Check Inputs)" : `${calculatedResults.leakRate} ${wcrUnit}`}
//           </Text>
//         </View>

//         <View style={styles.resultItem}>
//           <Text style={styles.resultLabel}>Eq. MW-loss:</Text>
//           <Text style={styles.resultValue}>{calculatedResults.mwLoss} MW</Text>
//         </View>

//         {/* AT MCR LOAD */}
//         <Text style={[styles.sectionTitle, { marginTop: 16 }]}>At MCR Load:</Text>

//         <View style={styles.resultItem}>
//           <Text style={styles.resultLabel}>LEAK RATE:</Text>
//           <Text style={[styles.resultValue, calculatedResults.hasWarning && { color: "#856404" }]}>
//             {result === "NA" ? "NA (Check Inputs)" : `${calculatedResults.leakRateFL} ${wcrUnit}`}
//           </Text>
//         </View>

//         <View style={styles.resultItem}>
//           <Text style={styles.resultLabel}>Eq. MW-loss:</Text>
//           <Text style={styles.resultValue}>{calculatedResults.mwLossFL} MW</Text>
//         </View>

//         <View style={styles.resultItem}>
//           <Text style={styles.resultLabel}>Heat Rate Penalty:</Text>
//           <Text style={styles.resultValue}>
//             {calculatedResults.hrPenalty} {heatRateUnit}
//           </Text>
//         </View>

//         <View style={styles.resultItem}>
//           <Text style={styles.resultLabel}>Production loss per year:</Text>
//           <Text style={styles.resultValue}>
//             {/* Production loss - 1 decimal place with commas */}
//             {formatNumberWithCommas(Number(calculatedResults.productionLoss).toFixed(1))} MW-h
//           </Text>
//         </View>

//         <View style={styles.resultItem}>
//           <Text style={styles.resultLabel}>Revenue loss per year:</Text>
//           <Text style={styles.resultValue}>
//             {/* Revenue loss - no decimal places with commas */}
//             {getCurrencySymbol(currency)} {formatNumberWithCommas(Math.round(Number(calculatedResults.revenueLoss)))}
//           </Text>
//         </View>

//         <View style={styles.resultItem}>
//           <Text style={styles.resultLabel}>Production Cost Wasted per year:</Text>
//           <Text style={styles.resultValue}>
//             {/* Production Cost - no decimal places with commas */}
//             {getCurrencySymbol(currency)} {formatNumberWithCommas(Math.round(Number(calculatedResults.productionCostWasted)))}
//           </Text>
//         </View>
//       </ScrollView>

//       <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
//         <Text style={styles.modalCloseText}>Close</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// </Modal>
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
//     bottom: 10,
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
//   logoutButton: { position: "absolute", top: 35, right: 15, zIndex: 10 },
//   logoutText: { color: "#FF4D57", fontWeight: "bold", fontSize: 15 },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#ef4b56',
//     marginBottom: 8,
//     marginTop: 4,
//     letterSpacing: 0.5,
//   },
//   row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, overflow: "visible" },
//   inputWrapper: { flex: 1, marginHorizontal: 2 },
//   inputLabel: { color: "#080808", marginBottom: 2, fontSize: 11, marginHorizontal: 8 },
//   inputLabels: { color: "#080808", marginBottom: 5, fontSize: 11, marginLeft: 15 },
//   input: { backgroundColor: "#FFFFFF", borderRadius: 10, borderWidth: 1, borderColor: "#E5E5E5", paddingHorizontal: 12, height: 42, fontSize: 14, color: "#000", marginHorizontal: 8 },
//   readOnlyInput: {
//     backgroundColor: "#F5F5F5",
//     justifyContent: 'center',
//   },
//   readOnlyText: {
//     fontSize: 14,
//     color: "#333",
//     paddingHorizontal: 12,
//   },
//   inputError: { borderColor: "#D60000", borderWidth: 1.5 },
//   dropdown: { backgroundColor: "transparent", borderRadius: 0, borderWidth: 0, borderBottomWidth: 1, borderColor: "#FF4D57", height: 35, width: '90%', minHeight: 35, marginHorizontal: 8 },
//   dropdownList: { borderRadius: 0, borderColor: "#FF4D57", marginHorizontal: 8 },
//   dropdownText: { color: "#FF4D57", fontSize: 11, lineHeight: 18 },
//   calculateBtn: { backgroundColor: "#FF4D57", padding: 12, borderRadius: 30, marginTop: 15, width: "55%", alignSelf: "center", alignItems: "center" },
//   calculateText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
//   unitDropdownBox: { borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 8, height: 42, minHeight: 42, backgroundColor: "#fff", justifyContent: "center" },
//   unitDropdownList: { borderRadius: 10, borderColor: "#E5E5E5" },
//   unitDropdownText: { fontSize: 14, color: "#000" },
//   resetText: { color: "#111111", fontSize: 11, textAlign: "center", marginTop: 8 },
//   readOnlyContainer: {
//     backgroundColor: "#F5F5F5",
//     padding: 10,
//     borderRadius: 8,
//     marginVertical: 8,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//   },
//   readOnlyLabel: {
//     fontSize: 12,
//     color: "#666",
//     fontWeight: "500",
//   },
//   readOnlyValue: {
//     fontSize: 14,
//     color: "#000",
//     fontWeight: "bold",
//   },
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
//     shadowOffset: { width: 0, height: 2 },
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
import { Ionicons } from "@expo/vector-icons";
import api from "./axiosInstance";

// Ignore the VirtualizedLists warning
LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
]);

// Your diagram image
const LeakDiagramImage = require("../assets/images/image.png");

const { width } = Dimensions.get("window");

interface FieldPositions {
  [key: string]: number;
}

interface InputErrors {
  [key: string]: string | undefined;
}

interface FieldWarnings {
  [key: string]: string[];
}

interface CalculationResults {
  hstT1: number;
  hstT2p: number;
  hstTCRH: number;
  hsw: number;
  x: number;
  hstT1FL: number;
  hstTCRHFL: number;
  T2is: number;
  K1: number;
  K2: number;
  K3: number;
  K4: number;
  Wraw: number;
  Wcorr: number;
  WcorrFL: number;
  leakRate: number;
  leakRateFL: number;
  MWLOSS: number;
  MWLOSSFL: number;
  DHR: number;
  PLOSS: number;
  RLOSS: number;
  PCOST: number;
  WcorrUserUnit: number;
  WcorrFLUserUnit: number;
  DHRUserUnit: number;
  calculationPath: string;
  step2Conditions: any;
  convertedInputs: any;
}

export default function CalculatorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // --------------------------------------------------
  // POWER STATION DATA
  // --------------------------------------------------

  const parsedPowerStationData = params.powerStationData
    ? JSON.parse(params.powerStationData as string)
    : {};

  const {
    stationName,
    pipeDiaD2,
    p1Unit: paramP1Unit,
    t1Unit: paramT1Unit,
    wcrhUnit,
    heatRateValue,
    heatRateUnit: paramHeatRateUnit,
    plantType,
    criticalType,
    currency: paramCurrency,
    pipeDiaUnit: paramPipeDiaUnit,
    sellPricePerMWh: paramSellPricePerMWh,
    productionCost: paramProductionCost,
    productionCostCurrency: paramProductionCostCurrency,
    customCurrency: paramCustomCurrency,

    p1flValue,
    p1flUnit,
    p2flValue,
    tcrhflValue,
    tcrhflUnit,
    t1flValue,
    t1flUnit,

    plantCapacityFactor,
    plantMCR,
  } = parsedPowerStationData;

  // --------------------------------------------------
  // VALUES RECEIVED FROM PREVIOUS SCREEN
  // --------------------------------------------------

  const [d2ValueFromFirstScreen] = useState(pipeDiaD2 || "");
  const [d2UnitFromFirstScreen] = useState(paramPipeDiaUnit || "MM");

  const [p1flValueFromFirstScreen] = useState(p1flValue || "");
  const [p1flUnitFromFirstScreen] = useState(p1flUnit || "psiA");

  const [p2flValueFromFirstScreen] = useState(p2flValue || "");

  const [tcrhflValueFromFirstScreen] = useState(tcrhflValue || "");
  const [tcrhflUnitFromFirstScreen] = useState(tcrhflUnit || "C");

  const [heatrateValueFromFirstScreen] = useState(heatRateValue || "");
  const heatRateUnitFromFirstScreen = paramHeatRateUnit || "kJ/kW-h";

  const [t1flValueFromFirstScreen] = useState(t1flValue || "");
  const [t1flUnitFromFirstScreen] = useState(t1flUnit || "C");

  const [plantMCRFromFirstScreen] = useState(plantMCR || "");

  const [plantCapacityFactorFromFirstScreen] = useState(
    plantCapacityFactor || "90"
  );

  // --------------------------------------------------
  // INPUT STATES
  // --------------------------------------------------

  const [P1, setP1] = useState("");
  const [P2, setP2] = useState("");
  const [T1, setT1] = useState("");
  const [T2p, setT2p] = useState("");
  const [TCRH, setTCRH] = useState("");
  const [Tmix, setTmix] = useState("");
  const [WCRH, setWCRH] = useState("");
  const [tw, setTw] = useState("");
  const [ww, setWw] = useState("");
  const [plantMWLoad, setPlantMWLoad] = useState("");
  const [t2pExpected, setT2pExpected] = useState("");

  // --------------------------------------------------
  // OTHER STATES
  // --------------------------------------------------

  const [initialCalculatorValues, setInitialCalculatorValues] =
    useState<any>(null);

  const [showMissingFieldsModal, setShowMissingFieldsModal] =
    useState(false);

  const [showResultsModal, setShowResultsModal] = useState(false);

  const [missingFields, setMissingFields] = useState<string[]>([]);

  const [warnings, setWarnings] = useState<string[]>([]);

  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);

  const [fieldWarnings, setFieldWarnings] = useState<FieldWarnings>({
    P1: [],
    P2: [],
    T1: [],
    T2p: [],
    TCRH: [],
    Tmix: [],
    WCRH: [],
    Tw: [],
    Ww: [],
    PlantMWLoad: [],
    T2pExpected: [],
  });

  const [inputErrors, setInputErrors] = useState<InputErrors>({});

  // --------------------------------------------------
  // UNIT STATES
  // --------------------------------------------------

  const [open, setOpen] = useState(false);

  const [wcrUnit, setWcrUnit] = useState<
    "T/HR" | "KG/S" | "KPPH/HR" | "LB/S"
  >("T/HR");

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

  const [currency, setCurrency] = useState("INR");
  const [productionCost, setProductionCost] = useState("");
  const [sellPricePerMWh, setSellPricePerMWh] = useState("");
  const [customCurrency, setCustomCurrency] = useState("");
  const [plantMCRState, setPlantMCRState] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  const fieldPositions = useRef<FieldPositions>({}).current;

  const rememberY = (key: string) => (e: LayoutChangeEvent) => {
    fieldPositions[key] = e.nativeEvent.layout.y;
  };

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    });
  };

  // --------------------------------------------------
  // CALCULATOR INPUT OBJECT
  // --------------------------------------------------

  const [calculatorInputs, setCalculatorInputs] = useState({
    P1: "",
    P2: "",
    T1: "",
    T2p: "",
    TCRH: "",
    Tmix: "",
    WCRH: "",
    tw: "",
    ww: "",
    plantMWLoad: "",
    t2pExpected: "",
    p1Unit: "bara" as "bara" | "psia",
    t1Unit: "C" as "C" | "F",
    wcrUnit: "T/HR" as
      | "T/HR"
      | "KG/S"
      | "KPPH/HR"
      | "LB/S",
  });

  // --------------------------------------------------
  // UPDATE INPUT OBJECT
  // --------------------------------------------------

  useEffect(() => {
    setCalculatorInputs({
      P1,
      P2,
      T1,
      T2p,
      TCRH,
      Tmix,
      WCRH,
      tw,
      ww,
      plantMWLoad,
      t2pExpected,
      p1Unit,
      t1Unit,
      wcrUnit,
    });
  }, [
    P1,
    P2,
    T1,
    T2p,
    TCRH,
    Tmix,
    WCRH,
    tw,
    ww,
    plantMWLoad,
    t2pExpected,
    p1Unit,
    t1Unit,
    wcrUnit,
  ]);

  // --------------------------------------------------
  // INITIAL DATA LOAD
  // --------------------------------------------------

  useEffect(() => {
    console.log(
      "Received params in calculator:",
      parsedPowerStationData
    );

    // Units
    if (paramP1Unit === "barA") {
      setP1Unit("bara");
    }

    if (paramP1Unit === "psiA") {
      setP1Unit("psia");
    }

    if (paramT1Unit === "deg C") {
      setT1Unit("C");
    }

    if (paramT1Unit === "deg F") {
      setT1Unit("F");
    }

    if (wcrhUnit) {
      setWcrUnit(wcrhUnit as any);
    }

    // Other values
    if (paramCurrency) {
      setCurrency(paramCurrency);
    }

    if (paramSellPricePerMWh) {
      setSellPricePerMWh(paramSellPricePerMWh);
    }

    if (paramProductionCost) {
      setProductionCost(paramProductionCost);
    }

    if (paramCustomCurrency) {
      setCustomCurrency(paramCustomCurrency);
    }

    if (plantMCR) {
      setPlantMCRState(plantMCR);
    }

    // Inputs
    if (parsedPowerStationData.p1Value) {
      setP1(parsedPowerStationData.p1Value);
    }

    if (parsedPowerStationData.p2Value) {
      setP2(parsedPowerStationData.p2Value);
    }

    if (parsedPowerStationData.t1Value) {
      setT1(parsedPowerStationData.t1Value);
    }

    if (parsedPowerStationData.t2pValue) {
      setT2p(parsedPowerStationData.t2pValue);
    }

    if (parsedPowerStationData.tcrhValue) {
      setTCRH(parsedPowerStationData.tcrhValue);
    }

    if (parsedPowerStationData.tmixValue) {
      setTmix(parsedPowerStationData.tmixValue);
    }

    if (parsedPowerStationData.wcrhValue) {
      setWCRH(parsedPowerStationData.wcrhValue);
    }

    if (parsedPowerStationData.twValue) {
      setTw(parsedPowerStationData.twValue);
    }

    if (parsedPowerStationData.wwValue) {
      setWw(parsedPowerStationData.wwValue);
    }

    if (parsedPowerStationData.plantMWLoad) {
      setPlantMWLoad(parsedPowerStationData.plantMWLoad);
    }

    if (parsedPowerStationData.t2pExpected) {
      setT2pExpected(parsedPowerStationData.t2pExpected);
    }
  }, []);

  // --------------------------------------------------
  // LOAD SAVED CALCULATOR DATA
  // --------------------------------------------------

  useEffect(() => {
    if (params.calculatorData) {
      try {
        const savedCalculatorData = JSON.parse(
          params.calculatorData as string
        );

        setInitialCalculatorValues(savedCalculatorData);

        setP1(savedCalculatorData.P1 || "");
        setP2(savedCalculatorData.P2 || "");
        setT1(savedCalculatorData.T1 || "");
        setT2p(savedCalculatorData.T2p || "");
        setTCRH(savedCalculatorData.TCRH || "");
        setTmix(savedCalculatorData.Tmix || "");
        setWCRH(savedCalculatorData.WCRH || "");
        setTw(savedCalculatorData.tw || "");
        setWw(savedCalculatorData.ww || "");
        setPlantMWLoad(savedCalculatorData.plantMWLoad || "");
        setT2pExpected(savedCalculatorData.t2pExpected || "");

        setP1Unit(savedCalculatorData.p1Unit || "bara");
        setT1Unit(savedCalculatorData.t1Unit || "C");
        setWcrUnit(savedCalculatorData.wcrUnit || "T/HR");
      } catch (error) {
        console.error(
          "Error parsing calculator data:",
          error
        );
      }
    }
  }, [params.calculatorData]);

  // --------------------------------------------------
  // FIELD VALIDATION
  // --------------------------------------------------

  const validateField = (
    fieldName: string,
    value: string,
    allValues?: any
  ): string[] => {
    const fieldSpecificWarnings: string[] = [];

    const numValue = Number.parseFloat(value) || 0;

    if (!value) {
      return fieldSpecificWarnings;
    }

    const p1Value =
      Number.parseFloat(allValues?.P1 || P1) || 0;

    const p2Value =
      Number.parseFloat(allValues?.P2 || P2) || 0;

    const tcrhValue =
      Number.parseFloat(allValues?.TCRH || TCRH) || 0;

    const tmixValue =
      Number.parseFloat(allValues?.Tmix || Tmix) || 0;

    switch (fieldName) {
      case "P1":
        if (p1Unit === "bara") {
          if (numValue < 80) {
            fieldSpecificWarnings.push(
              "P1 out of bounds (LOW) (80-280)"
            );
          }

          if (numValue > 280) {
            fieldSpecificWarnings.push(
              "P1 out of bounds (HIGH) (80-280)"
            );
          }
        } else {
          if (numValue < 1160) {
            fieldSpecificWarnings.push(
              "P1 out of bounds (LOW) (1160-4060)"
            );
          }

          if (numValue > 4060) {
            fieldSpecificWarnings.push(
              "P1 out of bounds (HIGH) (1160-4060)"
            );
          }
        }
        break;

      case "P2":
        if (p1Unit === "bara") {
          if (numValue < 20) {
            fieldSpecificWarnings.push(
              "P-CRH out of bounds (LOW) (20-60)"
            );
          }

          if (numValue > 60) {
            fieldSpecificWarnings.push(
              "P-CRH out of bounds (HIGH) (20-60)"
            );
          }
        } else {
          if (numValue < 290) {
            fieldSpecificWarnings.push(
              "P-CRH out of bounds (LOW) (290-870)"
            );
          }

          if (numValue > 870) {
            fieldSpecificWarnings.push(
              "P-CRH out of bounds (HIGH) (290-870)"
            );
          }
        }

        if (p1Value > 0 && numValue > 0) {
          const ratio = p1Value / numValue;

          if (ratio < 2) {
            fieldSpecificWarnings.push(
              "HPT Pressure ratio out of bounds (LOW) (2-6)"
            );
          }

          if (ratio > 6) {
            fieldSpecificWarnings.push(
              "HPT Pressure ratio out of bounds (HIGH) (2-6)"
            );
          }
        }

        break;

      case "T1":
        if (t1Unit === "C") {
          if (numValue < 500) {
            fieldSpecificWarnings.push(
              "T1 out of bounds (LOW) (500-630)"
            );
          }

          if (numValue > 630) {
            fieldSpecificWarnings.push(
              "T1 out of bounds (HIGH) (500-630)"
            );
          }
        } else {
          if (numValue < 932) {
            fieldSpecificWarnings.push(
              "T1 out of bounds (LOW) (932-1166)"
            );
          }

          if (numValue > 1166) {
            fieldSpecificWarnings.push(
              "T1 out of bounds (HIGH) (932-1166)"
            );
          }
        }

        break;

      case "T2p":
        if (t1Unit === "C") {
          if (numValue < 460) {
            fieldSpecificWarnings.push(
              "T2p out of bounds (LOW) (460-560)"
            );
          }

          if (numValue > 560) {
            fieldSpecificWarnings.push(
              "T2p out of bounds (HIGH) (460-560)"
            );
          }
        } else {
          if (numValue < 860) {
            fieldSpecificWarnings.push(
              "T2p out of bounds (LOW) (860-1040)"
            );
          }

          if (numValue > 1040) {
            fieldSpecificWarnings.push(
              "T2p out of bounds (HIGH) (860-1040)"
            );
          }
        }

        break;

      case "TCRH":
        if (t1Unit === "C") {
          if (numValue < 300) {
            fieldSpecificWarnings.push(
              "TCRH out of bounds (LOW) (300-425)"
            );
          }

          if (numValue > 425) {
            fieldSpecificWarnings.push(
              "TCRH out of bounds (HIGH) (300-425)"
            );
          }
        } else {
          if (numValue < 572) {
            fieldSpecificWarnings.push(
              "TCRH out of bounds (LOW) (572-797)"
            );
          }

          if (numValue > 797) {
            fieldSpecificWarnings.push(
              "TCRH out of bounds (HIGH) (572-797)"
            );
          }
        }

        if (tmixValue > 0) {
          if (numValue - tmixValue > 2) {
            fieldSpecificWarnings.push(
              "T_m error (less than T_CRH)"
            );
          }

          if (numValue - tmixValue > 4) {
            fieldSpecificWarnings.push(
              "Possible inaccuracy in T_CRH and/or T_m"
            );
          }
        }

        break;

      case "Tmix":
        if (t1Unit === "C") {
          if (numValue < 300) {
            fieldSpecificWarnings.push(
              "T_M out of bounds (LOW) (300-450)"
            );
          }

          if (numValue > 450) {
            fieldSpecificWarnings.push(
              "T_M out of bounds (HIGH) (300-450)"
            );
          }
        } else {
          if (numValue < 572) {
            fieldSpecificWarnings.push(
              "T_M out of bounds (LOW) (572-842)"
            );
          }

          if (numValue > 842) {
            fieldSpecificWarnings.push(
              "T_M out of bounds (HIGH) (572-842)"
            );
          }
        }

        if (tcrhValue > 0) {
          if (tcrhValue - numValue > 2) {
            fieldSpecificWarnings.push(
              "T_m error (less than T_CRH)"
            );
          }

          if (tcrhValue - numValue > 4) {
            fieldSpecificWarnings.push(
              "Possible inaccuracy in T_CRH and/or T_m"
            );
          }
        }

        break;

      case "WCRH":
        if (wcrUnit === "T/HR") {
          if (numValue < 500) {
            fieldSpecificWarnings.push(
              "W_CRH out of bounds (LOW) (500-2500)"
            );
          }

          if (numValue > 2500) {
            fieldSpecificWarnings.push(
              "W_CRH out of bounds (HIGH) (500-2500)"
            );
          }
        } else if (wcrUnit === "KG/S") {
          if (numValue < 139) {
            fieldSpecificWarnings.push(
              "W_CRH out of bounds (LOW) (139-694)"
            );
          }

          if (numValue > 694) {
            fieldSpecificWarnings.push(
              "W_CRH out of bounds (HIGH) (139-694)"
            );
          }
        } else if (wcrUnit === "KPPH/HR") {
          if (numValue < 1102) {
            fieldSpecificWarnings.push(
              "W_CRH out of bounds (LOW) (1102-5512)"
            );
          }

          if (numValue > 5512) {
            fieldSpecificWarnings.push(
              "W_CRH out of bounds (HIGH) (1102-5512)"
            );
          }
        } else {
          if (numValue < 306) {
            fieldSpecificWarnings.push(
              "W_CRH out of bounds (LOW) (306-1531)"
            );
          }

          if (numValue > 1531) {
            fieldSpecificWarnings.push(
              "W_CRH out of bounds (HIGH) (306-1531)"
            );
          }
        }

        break;

      case "Tw":
        if (t1Unit === "C") {
          if (numValue < 15) {
            fieldSpecificWarnings.push(
              "Tw out of bounds (LOW) (15-250)"
            );
          }

          if (numValue > 250) {
            fieldSpecificWarnings.push(
              "Tw out of bounds (HIGH) (15-250)"
            );
          }
        } else {
          if (numValue < 59) {
            fieldSpecificWarnings.push(
              "Tw out of bounds (LOW) (59-482)"
            );
          }

          if (numValue > 482) {
            fieldSpecificWarnings.push(
              "Tw out of bounds (HIGH) (59-482)"
            );
          }
        }

        break;

      case "Ww":
        if (wcrUnit === "T/HR") {
          if (numValue < 0) {
            fieldSpecificWarnings.push("Bad input - CHECK");
          }

          if (numValue > 2) {
            fieldSpecificWarnings.push(
              "Excessive Spraywater Leakage - CHECK"
            );
          }
        } else if (wcrUnit === "KPPH/HR") {
          if (numValue < 0) {
            fieldSpecificWarnings.push("Bad input - CHECK");
          }

          if (numValue > 4480) {
            fieldSpecificWarnings.push(
              "Excessive Spraywater Leakage - CHECK"
            );
          }
        } else if (wcrUnit === "KG/S") {
          if (numValue < 0) {
            fieldSpecificWarnings.push("Bad input - CHECK");
          }

          if (numValue > 2) {
            fieldSpecificWarnings.push(
              "Excessive Spraywater Leakage - CHECK"
            );
          }
        } else {
          if (numValue < 0) {
            fieldSpecificWarnings.push("Bad input - CHECK");
          }

          if (numValue > 4480) {
            fieldSpecificWarnings.push(
              "Excessive Spraywater Leakage - CHECK"
            );
          }
        }

        break;

      case "PlantMWLoad":
        const plantMCRValue =
          Number.parseFloat(
            plantMCRFromFirstScreen
          ) ||
          Number.parseFloat(plantMCRState) ||
          0;

        if (
          numValue > 0 &&
          plantMCRValue > 0 &&
          numValue > plantMCRValue * 1.05
        ) {
          fieldSpecificWarnings.push(
            "Plant MW exceeds MCR Rating"
          );
        }

        break;
    }

    return fieldSpecificWarnings;
  };

  // --------------------------------------------------
  // REAL TIME FIELD WARNINGS
  // --------------------------------------------------

  useEffect(() => {
    const allValues = {
      P1,
      P2,
      T1,
      T2p,
      TCRH,
      Tmix,
      WCRH,
      tw,
      ww,
      plantMWLoad,
      t2pExpected,
    };

    const newFieldWarnings: FieldWarnings = {
      P1: validateField("P1", P1, allValues),
      P2: validateField("P2", P2, allValues),
      T1: validateField("T1", T1, allValues),
      T2p: validateField("T2p", T2p, allValues),
      TCRH: validateField("TCRH", TCRH, allValues),
      Tmix: validateField("Tmix", Tmix, allValues),
      WCRH: validateField("WCRH", WCRH, allValues),
      Tw: validateField("Tw", tw, allValues),
      Ww: validateField("Ww", ww, allValues),
      PlantMWLoad: validateField(
        "PlantMWLoad",
        plantMWLoad,
        allValues
      ),
      T2pExpected: validateField("T2pExpected", t2pExpected, allValues),
    };

    setFieldWarnings(newFieldWarnings);

    const allWarnings = Object.values(newFieldWarnings).flat();

    setWarnings(allWarnings);
  }, [
    P1,
    P2,
    T1,
    T2p,
    TCRH,
    Tmix,
    WCRH,
    tw,
    ww,
    plantMWLoad,
    t2pExpected,
    p1Unit,
    t1Unit,
    wcrUnit,
  ]);

  // --------------------------------------------------
  // REAL TIME T2p EXPECTED CALCULATION
  // --------------------------------------------------

  useEffect(() => {
    // This effect runs whenever any of the required inputs change
    // and calculates T2is in real-time
    
    const p1Num = Number.parseFloat(P1);
    const p2Num = Number.parseFloat(P2);
    const t1Num = Number.parseFloat(T1);
    const t2pNum = Number.parseFloat(T2p);
    const tcrhNum = Number.parseFloat(TCRH);
    const tmixNum = Number.parseFloat(Tmix);
    const wcrhNum = Number.parseFloat(WCRH);
    const twNum = Number.parseFloat(tw);
    const wwNum = Number.parseFloat(ww);
    const d2Num = Number.parseFloat(d2ValueFromFirstScreen);

    // Check if all required fields have values
    if (
      !Number.isFinite(p1Num) ||
      !Number.isFinite(p2Num) ||
      !Number.isFinite(t1Num) ||
      !Number.isFinite(t2pNum) ||
      !Number.isFinite(tcrhNum) ||
      !Number.isFinite(tmixNum) ||
      !Number.isFinite(wcrhNum) ||
      !Number.isFinite(twNum) ||
      !Number.isFinite(wwNum) ||
      !Number.isFinite(d2Num)
    ) {
      setT2pExpected("");
      return;
    }

    try {
      // Convert units (same as in calculateLeakRate)
      let convertedP1 = p1Num;
      let convertedP2 = p2Num;
      let convertedT1 = t1Num;
      let convertedT2p = t2pNum;
      let convertedTCRH = tcrhNum;
      let convertedTM = tmixNum;
      let convertedTw = twNum;
      let convertedWCRH = wcrhNum;
      let convertedWw = wwNum;
      let convertedD2 = d2Num;

      // Pressure conversion
      if (p1Unit === "psia") {
        convertedP1 = convertedP1 / 14.5;
        convertedP2 = convertedP2 / 14.5;
      }

      // Temperature conversion
      if (t1Unit === "F") {
        convertedT1 = (convertedT1 - 32) / 1.8;
        convertedT2p = (convertedT2p - 32) / 1.8;
        convertedTCRH = (convertedTCRH - 32) / 1.8;
        convertedTM = (convertedTM - 32) / 1.8;
        convertedTw = (convertedTw - 32) / 1.8;
      }

      // W-CRH conversion
      let ConvW = 1;
      if (wcrUnit === "KPPH/HR") {
        ConvW = 1 / 2.24;
      } else if (wcrUnit === "LB/S") {
        ConvW = 3600 / 2240;
      }
      convertedWCRH = convertedWCRH * ConvW;
      convertedWw = convertedWw * ConvW;

      // D2 conversion
      if (d2UnitFromFirstScreen === "IN") {
        convertedD2 = convertedD2 * 25.4;
      }

      // Calculate hstT1
      const hstT1 =
        11.2572 * convertedT1
        - 3.9503 * convertedP1
        - 0.0086 * Math.pow(convertedT1, 2)
        - 0.00195 * Math.pow(convertedP1, 2)
        + 0.006275 * convertedP1 * convertedT1;

      // Calculate T2is (only if Ww > 0.1 or we're in the right path)
      // T2is formula is the same regardless of path
      const T2is = 0.4352 * hstT1 + 0.5706 * convertedP2 - 1024;

      // Convert back to user's unit if needed
      let displayT2is = T2is;
      if (t1Unit === "F") {
        displayT2is = (T2is * 1.8) + 32;
      }

      // Update T2pExpected state
      if (Number.isFinite(T2is)) {
        setT2pExpected(displayT2is.toFixed(1));
      } else {
        setT2pExpected("");
      }
    } catch (error) {
      setT2pExpected("");
    }
  }, [
    P1,
    P2,
    T1,
    T2p,
    TCRH,
    Tmix,
    WCRH,
    tw,
    ww,
    p1Unit,
    t1Unit,
    wcrUnit,
    d2UnitFromFirstScreen,
    d2ValueFromFirstScreen,

    
  ]);
  // useEffect madhe add kar (line ~200-250)
useEffect(() => {
  console.log("========== HEAT RATE DEBUG ==========");
  console.log("paramHeatRateUnit:", paramHeatRateUnit);
  console.log("heatRateUnitFromFirstScreen:", heatRateUnitFromFirstScreen);
  console.log("heatRateValue:", heatRateValue);
  console.log("======================================");
}, []);

  // --------------------------------------------------
  // CHECK MISSING FIELDS
  // --------------------------------------------------

  const checkMissingFields = (): string[] => {
    const missing: string[] = [];

    if (!P1) {
      missing.push("P1 (HP Inlet Pressure)");
    }

    if (!P2) {
      missing.push("P2 (CRH Outlet Pressure)");
    }

    if (!T1) {
      missing.push("T1 (HP Steam)");
    }

    if (!T2p) {
      missing.push("T2p");
    }

    if (!TCRH) {
      missing.push("TCRH");
    }

    if (!Tmix) {
      missing.push("T-MIX");
    }

    if (!WCRH) {
      missing.push("W-CRH");
    }

    if (!tw) {
      missing.push("Tw (Spray Water Temp)");
    }

    if (!ww) {
      missing.push("Ww (Spray Water Flow)");
    }

    if (!plantMWLoad) {
      missing.push("Plant MW Load");
    }

    return missing;
  };

  // --------------------------------------------------
  // UNIT CONVERSION
  // --------------------------------------------------

  const convertInputUnits = () => {
    // ==================================================
    // RAW VALUES
    // ==================================================

    let convertedP1 = Number.parseFloat(P1);
    let convertedP2 = Number.parseFloat(P2);

    let convertedP1FL = Number.parseFloat(
      p1flValueFromFirstScreen
    );

    let convertedP2FL = Number.parseFloat(
      p2flValueFromFirstScreen
    );

    let convertedT1 = Number.parseFloat(T1);
    let convertedT2p = Number.parseFloat(T2p);
    let convertedTCRH = Number.parseFloat(TCRH);
    let convertedTM = Number.parseFloat(Tmix);
    let convertedTw = Number.parseFloat(tw);

    let convertedT1FL = Number.parseFloat(
      t1flValueFromFirstScreen
    );

    let convertedTCRHFL = Number.parseFloat(
      tcrhflValueFromFirstScreen
    );

    let convertedWCRH = Number.parseFloat(WCRH);
    let convertedWw = Number.parseFloat(ww);

    let convertedD2 = Number.parseFloat(
      d2ValueFromFirstScreen
    );

    // HR is already received from the first screen.
    // DO NOT add default HR logic here.
    let convertedHR = Number.parseFloat(
      heatRateValue
    );

    // ==================================================
    // 1. PRESSURE CONVERSION
    // ==================================================

    let ConvP = 1;

    if (p1Unit === "psia") {
      ConvP = 1 / 14.5;

      convertedP1 *= ConvP;
      convertedP2 *= ConvP;

      if (Number.isFinite(convertedP1FL)) {
        convertedP1FL *= ConvP;
      }

      if (Number.isFinite(convertedP2FL)) {
        convertedP2FL *= ConvP;
      }
    }

    // ==================================================
    // 2. TEMPERATURE CONVERSION
    // ==================================================

    if (t1Unit === "F") {
      if (Number.isFinite(convertedT1)) {
        convertedT1 = (convertedT1 - 32) / 1.8;
      }

      if (Number.isFinite(convertedT2p)) {
        convertedT2p = (convertedT2p - 32) / 1.8;
      }

      if (Number.isFinite(convertedTCRH)) {
        convertedTCRH = (convertedTCRH - 32) / 1.8;
      }

      if (Number.isFinite(convertedTM)) {
        convertedTM = (convertedTM - 32) / 1.8;
      }

      if (Number.isFinite(convertedTw)) {
        convertedTw = (convertedTw - 32) / 1.8;
      }

      if (Number.isFinite(convertedT1FL)) {
        convertedT1FL = (convertedT1FL - 32) / 1.8;
      }

      if (Number.isFinite(convertedTCRHFL)) {
        convertedTCRHFL = (convertedTCRHFL - 32) / 1.8;
      }
    }

    // ==================================================
    // 3. W-CRH CONVERSION
    // ==================================================

    let ConvW = 1;

    if (wcrUnit === "KPPH/HR") {
      ConvW = 1 / 2.24;
    } else if (wcrUnit === "LB/S") {
      ConvW = 3600 / 2240;
    } else if (wcrUnit === "T/HR") {
      ConvW = 1;
    }

    if (Number.isFinite(convertedWCRH)) {
      convertedWCRH = convertedWCRH * ConvW;
    }

    if (Number.isFinite(convertedWw)) {
      convertedWw = convertedWw * ConvW;
    }

    // ==================================================
    // 4. D2 CONVERSION
    // ==================================================

    if (d2UnitFromFirstScreen === "IN") {
      if (Number.isFinite(convertedD2)) {
        convertedD2 = convertedD2 * 25.4;
      }
    }

    // ==================================================
    // 5. HEAT RATE CONVERSION
    // ==================================================

  const ConvHR = 1.055;

// Only convert if unit is Btu/kW-h
if (
  Number.isFinite(convertedHR) &&
  heatRateUnitFromFirstScreen === "Btu/kW-h"
) {
  convertedHR = convertedHR * ConvHR;
  console.log(`✅ Heat Rate converted: ${convertedHR / ConvHR} Btu → ${convertedHR} kJ`);
} else if (heatRateUnitFromFirstScreen === "kJ/kW-h") {
  console.log(`ℹ️ Heat Rate already in kJ/kW-h: ${convertedHR} (No conversion needed)`);
} else {
  console.log(`⚠️ Unknown heat rate unit: ${heatRateUnitFromFirstScreen}`);
}

    // ==================================================
    // RETURN CONVERTED VALUES
    // ==================================================

    return {

      // Pressure
      ConvP,
      P1: convertedP1,
      P2: convertedP2,
      P1FL: convertedP1FL,
      P2FL: convertedP2FL,

      // Temperature
      T1: convertedT1,
      T2p: convertedT2p,
      TCRH: convertedTCRH,
      TM: convertedTM,
      Tw: convertedTw,
      T1FL: convertedT1FL,
      TCRHFL: convertedTCRHFL,

      // W-CRH
      ConvW,
      WCRH: convertedWCRH,
      Ww: convertedWw,

      // D2
      D2: convertedD2,

      // Heat Rate
      ConvHR,
      HR: convertedHR,
    };
  };

  // --------------------------------------------------
  // LEAK RATE CALCULATION
  // --------------------------------------------------

  const calculateLeakRate = (): CalculationResults | null => {
    // ==================================================
    // STEP 0 - UNIT CONVERSION
    // ==================================================

    const converted = convertInputUnits();

    console.log("\n==============================================");
    console.log("        KOSO HP BYPASS CALCULATION");
    console.log("==============================================");

    console.log("\n------------ CONVERTED INPUTS ------------");
    console.log("P1 =", converted.P1);
    console.log("P2 =", converted.P2);
    console.log("T1 =", converted.T1);
    console.log("T2p =", converted.T2p);
    console.log("TCRH =", converted.TCRH);
    console.log("TM =", converted.TM);
    console.log("WCRH =", converted.WCRH);
    console.log("Tw =", converted.Tw);
    console.log("Ww =", converted.Ww);
    console.log("D2 =", converted.D2);

    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    if (
      !Number.isFinite(converted.P1) ||
      !Number.isFinite(converted.P2) ||
      !Number.isFinite(converted.T1) ||
      !Number.isFinite(converted.T2p) ||
      !Number.isFinite(converted.TCRH) ||
      !Number.isFinite(converted.TM) ||
      !Number.isFinite(converted.Tw) ||
      !Number.isFinite(converted.WCRH) ||
      !Number.isFinite(converted.Ww) ||
      !Number.isFinite(converted.D2)
    ) {
      console.log("❌ CALCULATION STOPPED - INVALID INPUT");
      return null;
    }

    // ==================================================
    // STEP 1 - ENTHALPY CALCULATIONS
    // ==================================================

    const hstT1 =
      11.2572 * converted.T1
      - 3.9503 * converted.P1
      - 0.0086 * Math.pow(converted.T1, 2)
      - 0.00195 * Math.pow(converted.P1, 2)
      + 0.006275 *
        converted.P1 *
        converted.T1;

    const hstT2p =
      2322.3
      - 1.87 * converted.P2
      + 2.4 * converted.T2p;

    const hstTCRH =
      2302.7
      - 2.29 * converted.P2
      + 2.51 * converted.TCRH;

    // ==================================================
    // hsw calculation using Ww
    // ==================================================

    const hsw =
      10.37
      + 4.048 * converted.Ww
      + 0.1235 * converted.P2
      + 0.0063 * Math.pow(converted.Ww, 2)
      - 0.000032 * Math.pow(converted.P2, 2)
      - 0.000078 *
        converted.P2 *
        converted.Ww;

    // ==================================================
    // x
    // ==================================================

    const enthalpyDenominator =
      hstT2p - hsw;

    let x = NaN;

    if (
      Number.isFinite(enthalpyDenominator) &&
      Math.abs(enthalpyDenominator) > 1e-12
    ) {
      x =
        (hstT1 - hstT2p) /
        enthalpyDenominator;
    }

    // ==================================================
    // FULL LOAD ENTHALPIES
    // ==================================================

    const hstT1FL =
      11.2572 * converted.T1FL
      - 3.9503 * converted.P1FL
      - 0.0086 * Math.pow(converted.T1FL, 2)
      - 0.00195 * Math.pow(converted.P1FL, 2)
      + 0.006275 *
        converted.P1FL *
        converted.T1FL;

    const hstTCRHFL =
      2302.7
      - 2.29 * converted.P2FL
      + 2.51 * converted.TCRHFL;

    // ==================================================
    // STEP 2 - CALCULATION
    // ==================================================

    let Wraw = NaN;
    let T2is = NaN;
    let K1 = NaN;
    let K2 = NaN;
    let K3 = NaN;
    let K4 = NaN;

    let Wcorr = NaN;
    let calculationPath = "";

    const temperatureDifference =
      converted.T2p - converted.TCRH;

    console.log("\n==============================================");
    console.log("                STEP 2 CONDITIONS");
    console.log("==============================================");

    console.log("Ww =", converted.Ww);
    console.log("Tw =", converted.Tw);

    console.log(
      "Ww > 0.1 =",
      converted.Ww > 0.1
    );

    console.log(
      "T2p - TCRH =",
      temperatureDifference
    );

    // ==================================================
    // STEP 2a - Ww > 0.1
    // ==================================================

    if (converted.Ww > 0.1) {
      // ==================================================
      // STEP 2c - temperatureDifference < 15
      // ==================================================

      if (temperatureDifference < 15) {
        calculationPath = "STEP 2c";

        if (
          Number.isFinite(x) &&
          Math.abs(x) > 1e-12
        ) {
          Wraw = converted.Ww / x;
          Wcorr = Wraw;

          console.log(
            "STEP 2c: Wcorr = Ww / x"
          );
          console.log("Ww =", converted.Ww);
          console.log("x =", x);
          console.log("Wcorr =", Wcorr);
        } else {
          Wcorr = NaN;
          console.log(
            "❌ STEP 2c FAILED - invalid x"
          );
        }
      }

      // ==================================================
      // STEP 2a + STEP 2b
      // ==================================================

      else {
        calculationPath = "STEP 2a + STEP 2b";

        // ------------------------------------------------
        // T2is
        // ------------------------------------------------

        T2is =
          0.4352 * hstT1
          + 0.5706 * converted.P2
          - 1024;

        // ------------------------------------------------
        // K1
        // ------------------------------------------------

        K1 =
          15.32 *
          (
            converted.P2 /
            (converted.T2p + 273.15)
          );

        // ------------------------------------------------
        // K2
        // ------------------------------------------------

        K2 =
          3e-8 *
          (
            Math.pow(
              converted.WCRH,
              2
            ) /
            converted.P2
          ) *
          (
            converted.TCRH +
            273.15
          );

        // ------------------------------------------------
        // K3
        // ------------------------------------------------

        K3 =
          Math.pow(
            converted.D2 / 500,
            2
          );

        // ------------------------------------------------
        // Wraw
        // ------------------------------------------------

        Wraw =
          0.145 *
          (
            converted.TM -
            converted.TCRH
          ) *
          K1 *
          K2 *
          K3;

        console.log(
          "\n------------ STEP 2a RESULTS ------------"
        );

        console.log("T2is =", T2is);
        console.log("K1 =", K1);
        console.log("K2 =", K2);
        console.log("K3 =", K3);
        console.log("Wraw =", Wraw);

        // ==================================================
        // STEP 2b - K4
        // ==================================================

        const t2isDifference =
          T2is - converted.T2p;

        if (t2isDifference < 10) {
          K4 = 1;
        } else {
          const k4Denominator =
            converted.T2p -
            converted.TCRH;

          if (
            Math.abs(k4Denominator) > 1e-12 &&
            Number.isFinite(x) &&
            Math.abs(1 + x) > 1e-12
          ) {
            K4 =
              (
                (
                  T2is -
                  converted.TCRH
                ) /
                k4Denominator
              ) /
              (1 + x);
          } else {
            K4 = NaN;
          }
        }

        Wcorr = Wraw * K4;
      }
    }

    // ==================================================
    // STEP 2 - NO SPRAYWATER (Ww <= 0.1)
    // ==================================================

    else {
      calculationPath = "Ww <= 0.1 - NO SPRAYWATER";

      T2is =
        0.4352 * hstT1
        + 0.5706 * converted.P2
        - 1024;

      K1 =
        15.32 *
        (
          converted.P2 /
          (T2is + 273.2)
        );

      K2 =
        3e-8 *
        (
          Math.pow(converted.WCRH, 2) /
          converted.P2
        ) *
        (
          converted.TCRH + 273.2
        );

      K3 =
        Math.pow(
          converted.D2 / 500,
          2
        );

      Wraw =
        0.145 *
        (
          converted.TM -
          converted.TCRH
        ) *
        K1 *
        K2 *
        K3;

      K4 = 1;

      Wcorr = Wraw;
    }

    // T2pExpected is already updated by the real-time calculation effect

    // ==================================================
    // STEP 2d - FULL LOAD LEAK RATE
    // ==================================================

    let WcorrFL = NaN;

    if (
      Number.isFinite(Wcorr) &&
      Number.isFinite(converted.P1FL) &&
      Number.isFinite(converted.P1) &&
      converted.P1 !== 0 &&
      Number.isFinite(converted.T1) &&
      Number.isFinite(converted.T1FL)
    ) {
      const temperatureRatio =
        (
          converted.T1 +
          273.3
        ) /
        (
          converted.T1FL +
          273.2
        );

      WcorrFL =
        Wcorr *
        (
          converted.P1FL /
          converted.P1
        ) *
        Math.sqrt(
          temperatureRatio
        );
    }

    // ==================================================
    // STEP 3 - MW LOSS
    // ==================================================

    let MWLOSS = NaN;
    let MWLOSSFL = NaN;

    if (
      Number.isFinite(Wcorr) &&
      Number.isFinite(hstT1) &&
      Number.isFinite(hstTCRH)
    ) {
      MWLOSS =
        0.99 *
        (Wcorr / 3.6) *
        (
          hstT1 -
          hstTCRH
        );
    }

    if (
      Number.isFinite(WcorrFL) &&
      Number.isFinite(hstT1FL) &&
      Number.isFinite(hstTCRHFL)
    ) {
      MWLOSSFL =
        0.99 *
        (WcorrFL / 3.6) *
        (
          hstT1FL -
          hstTCRHFL
        );
    }

    // ==================================================
    // HEAT RATE PENALTY
    // ==================================================

    let DHR = NaN;

    const mcrValue =
      Number.parseFloat(
        plantMCRFromFirstScreen
      ) ||
      Number.parseFloat(
        plantMCR
      ) ||
      0;

    if (
      Number.isFinite(MWLOSSFL) &&
      mcrValue > 0 &&
      Number.isFinite(converted.HR)
    ) {
      DHR =
        converted.HR *
        (MWLOSSFL / mcrValue);
    }

    // ==================================================
    // PRODUCTION LOSS
    // ==================================================

    let PLOSS = NaN;

    const CFP =
      Number.parseFloat(
        plantCapacityFactorFromFirstScreen
      ) || 0;

    if (
      Number.isFinite(MWLOSSFL)
    ) {
      PLOSS =
        MWLOSSFL *
        8760 *
        (CFP / 100);
    }

    // ==================================================
    // REVENUE LOSS
    // ==================================================

    let RLOSS = NaN;

    const SPMWh =
      Number.parseFloat(
        sellPricePerMWh
      ) || 0;

    if (
      Number.isFinite(PLOSS)
    ) {
      RLOSS =
        SPMWh *
        PLOSS;
    }

    // ==================================================
    // PRODUCTION COST
    // ==================================================

    let PCOST = NaN;

    const PCOSTU =
      Number.parseFloat(
        productionCost
      ) || 0;

    if (
      Number.isFinite(PLOSS) &&
      Number.isFinite(converted.HR)
    ) {
      PCOST =
        PCOSTU *
        PLOSS;
    }

    // ==================================================
    // STEP 4 - USER UNITS
    // ==================================================

    let WcorrUserUnit = Wcorr;
    let WcorrFLUserUnit = WcorrFL;
    let DHRUserUnit = DHR;

    if (
      Number.isFinite(Wcorr)
    ) {
      WcorrUserUnit =
        Wcorr /
        converted.ConvW;
    }

    if (
      Number.isFinite(WcorrFL)
    ) {
      WcorrFLUserUnit =
        WcorrFL /
        converted.ConvW;
    }

    if (
      Number.isFinite(DHR)
    ) {
      DHRUserUnit =
        DHR /
        converted.ConvHR;
    }

    // ==================================================
    // FINAL LOGS
    // ==================================================

    console.log(
      "\n=============================================="
    );

    console.log(
      "             FINAL CALCULATION"
    );

    console.log(
      "=============================================="
    );

    console.log("Calculation Path =", calculationPath);

    console.log("\n------------ ENTHALPY RESULTS ------------");
    console.log("hstT1 =", hstT1);
    console.log("hstT2p =", hstT2p);
    console.log("hstTCRH =", hstTCRH);
    console.log("hsw =", hsw);
    console.log("x =", x);
    console.log("hstT1FL =", hstT1FL);
    console.log("hstTCRHFL =", hstTCRHFL);

    console.log("\n------------ STEP 2 RESULTS ------------");
    console.log("T2is =", T2is);
    console.log("K1 =", K1);
    console.log("K2 =", K2);
    console.log("K3 =", K3);
    console.log("K4 =", K4);
    console.log("Wraw =", Wraw);
    console.log("Wcorr =", Wcorr);
    console.log("WcorrFL =", WcorrFL);

    console.log("\n------------ STEP 3 RESULTS ------------");
    console.log("MWLOSS =", MWLOSS);
    console.log("MWLOSSFL =", MWLOSSFL);
    console.log("DHR =", DHR);
    console.log("PLOSS =", PLOSS);
    console.log("RLOSS =", RLOSS);
    console.log("PCOST =", PCOST);

    // ==================================================
    // RETURN
    // ==================================================

    return {
      hstT1,
      hstT2p,
      hstTCRH,
      hsw,
      x,
      hstT1FL,
      hstTCRHFL,
      T2is,
      K1,
      K2,
      K3,
      K4,
      Wraw,
      Wcorr,
      WcorrFL,
      leakRate: Wcorr,
      leakRateFL: WcorrFL,
      MWLOSS,
      MWLOSSFL,
      DHR,
      PLOSS,
      RLOSS,
      PCOST,
      WcorrUserUnit,
      WcorrFLUserUnit,
      DHRUserUnit,
      calculationPath,
      step2Conditions: {
        Ww: converted.Ww,
        Tw: converted.Tw,
        WwGreaterThanPointOne:
          converted.Ww > 0.1,
        temperatureDifference,
        T2isMinusT2p:
          Number.isFinite(T2is)
            ? T2is - converted.T2p
            : NaN,
      },
      convertedInputs: converted,
    };
  };

  // --------------------------------------------------
  // SAVE INPUT DATA
  // --------------------------------------------------

  const saveInputData = async () => {
    const missing = checkMissingFields();

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingFieldsModal(true);
      return;
    }

    const leakResults = calculateLeakRate();

    if (!leakResults) {
      console.log(
        "❌ Leak Rate calculation failed."
      );
      return;
    }

    // Store results for popup
    setCalculationResults(leakResults);

    // Show results popup
    setShowResultsModal(true);

    console.log(
      "\n=============================================="
    );

    console.log(
      "             API SAVE START"
    );

    console.log(
      "=============================================="
    );

    // ==================================================
    // FORMAT FUNCTIONS FOR DISPLAY (same as in popup)
    // ==================================================

    const formatWith2Decimals = (value: number | undefined): string => {
      if (value === undefined || value === null || !Number.isFinite(value)) {
        return "N/A";
      }
      return value.toFixed(2);
    };

    const formatMWLoss = (value: number | undefined): string => {
      if (value === undefined || value === null || !Number.isFinite(value)) {
        return "N/A";
      }
      const dividedValue = value / 1000;
      return dividedValue.toFixed(2);
    };

   const formatHeatRatePenalty = (value: number | undefined): string => {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return "N/A";
  }
  // Show the value as-is with 2 decimal places
  return value.toFixed(2);
};
    const formatProductionLoss = (value: number | undefined): string => {
      if (value === undefined || value === null || !Number.isFinite(value)) {
        return "N/A";
      }
      const strValue = Math.round(value).toString();
      return strValue.substring(0, 4);
    };

    const formatRevenueLoss = (value: number | undefined): string => {
      if (value === undefined || value === null || !Number.isFinite(value)) {
        return "N/A";
      }
      const strValue = Math.round(value).toString();
      return strValue.substring(0, 5);
    };

    const formatProductionCost = (value: number | undefined): string => {
      if (value === undefined || value === null || !Number.isFinite(value)) {
        return "N/A";
      }
      const strValue = Math.round(value).toString();
      return strValue.substring(0, 5);
    };

    // ==================================================
    // SAFE NUMBER HELPER
    // ==================================================

    const safeNumber = (
      value: any
    ): number | null => {
      const num =
        Number(value);
      return Number.isFinite(num)
        ? num
        : null;
    };

    // ==================================================
    // INPUT VALUES
    // ==================================================

    const plantMCRValue =
      safeNumber(
        plantMCRFromFirstScreen ||
        plantMCR
      );

    const plantCapacityFactorValue =
      safeNumber(
        plantCapacityFactorFromFirstScreen
      );

    const heatRateValueNum =
      safeNumber(
        heatRateValue
      );

    const productionCostNum =
      safeNumber(
        productionCost
      );

    const sellPriceNum =
      safeNumber(
        sellPricePerMWh
      );

    // ==================================================
    // FINAL PAYLOAD - WITH FORMATTED VALUES
    // ==================================================

    const finalPayload = {

      // ------------------------------------------
      // BASIC INFORMATION
      // ------------------------------------------

      power_station_name:
        stationName || null,

      pipe_dia_d2:
        safeNumber(
          d2ValueFromFirstScreen
        ),

      pipe_dia_unit:
        d2UnitFromFirstScreen || null,

      // ------------------------------------------
      // PLANT INFORMATION
      // ------------------------------------------

      plant_type:
        plantType || null,

      critical_type:
        criticalType || null,

      plant_mcr:
        plantMCRValue,

      plant_mw_load:
        safeNumber(
          plantMWLoad
        ),

      plant_capacity_factor:
        plantCapacityFactorValue,

      // ------------------------------------------
      // HEAT RATE
      // ------------------------------------------

      heat_rate_value:
        heatRateValueNum,

      heat_rate_unit:
        heatRateUnitFromFirstScreen || null,

      // ------------------------------------------
      // CURRENCY / COST
      // ------------------------------------------

      production_cost:
        productionCostNum,

      production_cost_currency:
        paramProductionCostCurrency ||
        currency ||
        null,

      sell_price_per_mwh:
        sellPriceNum,

      custom_currency:
        currency === "custom"
          ? customCurrency
          : null,

      // ------------------------------------------
      // TEST CONDITION INPUTS
      // ------------------------------------------

      p1:
        safeNumber(P1),

      p1_unit:
        p1Unit || null,

      p2:
        safeNumber(P2),

      t1:
        safeNumber(T1),

      t1_unit:
        t1Unit || null,

      t2p:
        safeNumber(T2p),

      t2p_expected:
        safeNumber(t2pExpected),

      tcrh:
        safeNumber(TCRH),

      t_mix:
        safeNumber(Tmix),

      w_crh:
        safeNumber(WCRH),

      w_crh_unit:
        wcrUnit || null,

      tw:
        safeNumber(tw),

      ww:
        safeNumber(ww),

      // ------------------------------------------
      // FULL LOAD INPUTS
      // ------------------------------------------

      p1fl:
        safeNumber(
          p1flValueFromFirstScreen
        ),

      p1fl_unit:
        p1flUnitFromFirstScreen || null,

      p2fl:
        safeNumber(
          p2flValueFromFirstScreen
        ),

      t1fl:
        safeNumber(
          t1flValueFromFirstScreen
        ),

      t1fl_unit:
        t1flUnitFromFirstScreen || null,

      tcrhfl:
        safeNumber(
          tcrhflValueFromFirstScreen
        ),

      tcrhfl_unit:
        tcrhflUnitFromFirstScreen || null,

      // ------------------------------------------
      // CALCULATED VALUES (FORMATTED AS IN POPUP)
      // ------------------------------------------

      // LEAK RATE at test conditions (formatted with 2 decimals)
      leak_rate_test: leakResults.WcorrUserUnit !== undefined && Number.isFinite(leakResults.WcorrUserUnit)
        ? `${formatWith2Decimals(leakResults.WcorrUserUnit)} ${wcrUnit}`
        : null,

      // Eq. MW-loss at test conditions (formatted with decimal moved left)
      mw_loss_test: leakResults.MWLOSS !== undefined && Number.isFinite(leakResults.MWLOSS)
        ? `${formatMWLoss(leakResults.MWLOSS)} MW`
        : null,

      // LEAK RATE at MCR load (formatted with 2 decimals)
      leak_rate_mcr: leakResults.WcorrFLUserUnit !== undefined && Number.isFinite(leakResults.WcorrFLUserUnit)
        ? `${formatWith2Decimals(leakResults.WcorrFLUserUnit)} ${wcrUnit}`
        : null,

      // Eq. MW-loss at MCR load (formatted with decimal moved left)
      mw_loss_mcr: leakResults.MWLOSSFL !== undefined && Number.isFinite(leakResults.MWLOSSFL)
        ? `${formatMWLoss(leakResults.MWLOSSFL)} MW`
        : null,

      // Heat Rate Penalty (formatted with decimal moved left)
      heat_rate_penalty: leakResults.DHRUserUnit !== undefined && Number.isFinite(leakResults.DHRUserUnit)
        ? `${formatHeatRatePenalty(leakResults.DHRUserUnit)} ${heatRateUnitFromFirstScreen}`
        : null,

      // Production loss per year (first 4 digits)
      production_loss: leakResults.PLOSS !== undefined && Number.isFinite(leakResults.PLOSS)
        ? `${formatProductionLoss(leakResults.PLOSS)} MW-h`
        : null,

      // Revenue loss per year (first 5 digits with $ symbol)
      revenue_loss: leakResults.RLOSS !== undefined && Number.isFinite(leakResults.RLOSS)
        ? `$ ${formatRevenueLoss(leakResults.RLOSS)}`
        : null,

      // Production Cost Wasted per year (first 5 digits with $ symbol)
      production_cost_wasted: leakResults.PCOST !== undefined && Number.isFinite(leakResults.PCOST)
        ? `$ ${formatProductionCost(leakResults.PCOST)}`
        : null,

      // Calculation Path
      calculation_path:
        leakResults.calculationPath || null,
    };

    // ==================================================
    // CONSOLE PAYLOAD
    // ==================================================

    console.log(
      "\n------------ API PAYLOAD ------------"
    );

    console.log(
      JSON.stringify(
        finalPayload,
        null,
        2
      )
    );

    try {
      const response =
        await api.post(
          "/power-stations/",
          finalPayload
        );

      console.log(
        "\n------------ BACKEND RESPONSE ------------"
      );

      console.log(
        response.data
      );

      console.log(
        "✅ DATA SAVED SUCCESSFULLY"
      );
    } catch (error: any) {
      console.log(
        "\n------------ BACKEND ERROR ------------"
      );

      console.log(
        error?.response?.data ||
        error
      );
    }
  };

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  const resetAll = () => {
    if (initialCalculatorValues) {
      setP1(initialCalculatorValues.P1 || "");
      setP2(initialCalculatorValues.P2 || "");
      setT1(initialCalculatorValues.T1 || "");
      setT2p(initialCalculatorValues.T2p || "");
      setTCRH(initialCalculatorValues.TCRH || "");
      setTmix(initialCalculatorValues.Tmix || "");
      setWCRH(initialCalculatorValues.WCRH || "");
      setTw(initialCalculatorValues.tw || "");
      setWw(initialCalculatorValues.ww || "");
      setPlantMWLoad(
        initialCalculatorValues.plantMWLoad || ""
      );
      setT2pExpected(
        initialCalculatorValues.t2pExpected || ""
      );

      setP1Unit(
        initialCalculatorValues.p1Unit || "bara"
      );

      setT1Unit(
        initialCalculatorValues.t1Unit || "C"
      );

      setWcrUnit(
        initialCalculatorValues.wcrUnit || "T/HR"
      );
    } else {
      setP1("");
      setP2("");
      setT1("");
      setT2p("");
      setTCRH("");
      setTmix("");
      setWCRH("");
      setTw("");
      setWw("");
      setPlantMWLoad("");
      setT2pExpected("");
    }

    setWarnings([]);

    setFieldWarnings({
      P1: [],
      P2: [],
      T1: [],
      T2p: [],
      TCRH: [],
      Tmix: [],
      WCRH: [],
      Tw: [],
      Ww: [],
      PlantMWLoad: [],
      T2pExpected: [],
    });

    setInputErrors({});

    setMissingFields([]);

    setShowMissingFieldsModal(false);

    setShowResultsModal(false);

    scrollToTop();
  };

  // --------------------------------------------------
  // BACK TO EDIT
  // --------------------------------------------------

  const goBackToEdit = () => {
    const powerStationData = {
      stationName: stationName,

      pipeDiaD2: d2ValueFromFirstScreen,
      pipeDiaUnit: d2UnitFromFirstScreen,

      plantType: plantType,
      criticalType: criticalType,

      plantMCR:
        plantMCRFromFirstScreen ||
        plantMCRState,

      heatRateValue: heatRateValue,
      heatRateUnit: paramHeatRateUnit,

      currency: currency,

      sellPricePerMWh:
        sellPricePerMWh,

      productionCost:
        productionCost,

      productionCostCurrency:
        currency,

      customCurrency:
        customCurrency,

      p1Value: P1,
      p2Value: P2,
      t1Value: T1,
      t2pValue: T2p,
      t2pExpected: t2pExpected,

      tcrhValue: TCRH,
      tmixValue: Tmix,
      wcrhValue: WCRH,

      d2Value:
        d2ValueFromFirstScreen,

      twValue: tw,
      wwValue: ww,

      plantMWLoad:
        plantMWLoad,

      p1flValue:
        p1flValueFromFirstScreen,

      p1flUnit:
        p1flUnitFromFirstScreen,

      p2flValue:
        p2flValueFromFirstScreen,

      tcrhflValue:
        tcrhflValueFromFirstScreen,

      tcrhflUnit:
        tcrhflUnitFromFirstScreen,

      t1flValue:
        t1flValueFromFirstScreen,

      t1flUnit:
        t1flUnitFromFirstScreen,

      plantCapacityFactor:
        plantCapacityFactorFromFirstScreen,

      p1Unit:
        p1Unit === "bara"
          ? "barA"
          : "psiA",

      t1Unit:
        t1Unit === "C"
          ? "deg C"
          : "deg F",

      wcrhUnit:
        wcrUnit,

      pipeDiaUnit:
        d2UnitFromFirstScreen,
    };

    router.push({
      pathname: "/Additional_user_inputs",

      params: {
        powerStationData:
          JSON.stringify(powerStationData),

        fromCalculator: "true",
      },
    });
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {
    router.replace("/LoginScreen");
  };

  // --------------------------------------------------
  // CLOSE MODALS
  // --------------------------------------------------

  const closeMissingFieldsModal = () => {
    setShowMissingFieldsModal(false);
  };

  const closeResultsModal = () => {
    setShowResultsModal(false);
  };

  // --------------------------------------------------
  // FIELD WARNING UI
  // --------------------------------------------------

  const renderFieldWarning = (
    fieldName: string
  ) => {
    if (
      fieldWarnings[fieldName] &&
      fieldWarnings[fieldName].length > 0
    ) {
      return (
        <View
          style={styles.fieldWarningContainer}
        >
          {fieldWarnings[fieldName].map(
            (warning, index) => (
              <Text
                key={index}
                style={styles.fieldWarningText}
              >
                ⚠ {warning}
              </Text>
            )
          )}
        </View>
      );
    }

    return null;
  };

  // --------------------------------------------------
  // FORMAT NUMBER HELPERS (for display only)
  // --------------------------------------------------

  // Format with 2 decimal places (LEAK RATE)
  const formatWith2Decimals = (value: number | undefined): string => {
    if (value === undefined || value === null || !Number.isFinite(value)) {
      return "N/A";
    }
    return value.toFixed(2);
  };

  // Format MW-loss with decimal point moved left by 3 positions (divide by 1000)
  const formatMWLoss = (value: number | undefined): string => {
    if (value === undefined || value === null || !Number.isFinite(value)) {
      return "N/A";
    }
    // Move decimal point left by 3 positions (divide by 1000)
    const dividedValue = value / 1000;
    return dividedValue.toFixed(2);
  };

  // Format Heat Rate Penalty with decimal point moved left by 3 positions (divide by 1000)
  const formatHeatRatePenalty = (value: number | undefined): string => {
    if (value === undefined || value === null || !Number.isFinite(value)) {
      return "N/A";
    }
    // Move decimal point left by 3 positions (divide by 1000)
    const dividedValue = value / 1000;
    return dividedValue.toFixed(2);
  };

  // Format Production loss - show only first 4 digits from the left
  const formatProductionLoss = (value: number | undefined): string => {
    if (value === undefined || value === null || !Number.isFinite(value)) {
      return "N/A";
    }
    const strValue = Math.round(value).toString();
    // Get only first 4 digits
    return strValue.substring(0, 4);
  };

  // Format Revenue loss - show only first 5 digits from the left
  const formatRevenueLoss = (value: number | undefined): string => {
    if (value === undefined || value === null || !Number.isFinite(value)) {
      return "N/A";
    }
    const strValue = Math.round(value).toString();
    // Get only first 5 digits
    return strValue.substring(0, 5);
  };

  // Format Production Cost - show only first 5 digits from the left
  const formatProductionCost = (value: number | undefined): string => {
    if (value === undefined || value === null || !Number.isFinite(value)) {
      return "N/A";
    }
    const strValue = Math.round(value).toString();
    // Get only first 5 digits
    return strValue.substring(0, 5);
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBackToEdit}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#FF4D57"
          />

          <Text style={styles.backButtonText}>
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>

        <Text style={styles.logo}>
          KOSO
        </Text>

        <View
          style={styles.stationUnitContainer}
        >
          <Text style={styles.station}>
            {stationName ||
              "Power Station"}
          </Text>

          <View
            style={styles.underline}
          />
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      >
        <View style={styles.container}>

          {/* DIAGRAM */}
          <View
            style={
              styles.diagramImageContainer
            }
          >
            <Image
              source={LeakDiagramImage}
              style={styles.diagramImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.sectionTitle}>
            APPLICATION - HP BYPASS
          </Text>

          {/* ---------------------------------- */}
          {/* ROW 1 - P1 / T1 */}
          {/* ---------------------------------- */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            {/* P1 */}
            <View
              style={{ flex: 1 }}
              onLayout={rememberY("P1")}
            >
              <Text
                style={styles.inputLabel}
              >
                P1 (HP Inlet Pressure)
              </Text>

              <TextInput
                style={[
                  styles.input,
                  fieldWarnings.P1
                    .length > 0 &&
                    styles.inputError,
                ]}
                keyboardType="numeric"
                value={P1}
                onChangeText={setP1}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />

              {renderFieldWarning("P1")}
            </View>

            {/* P1 UNIT */}
            <View
              style={{
                width: 90,
                marginLeft: 6,
                marginTop: 14,
              }}
            >
              <Text
                style={styles.inputLabel}
              >
                Unit
              </Text>

              <DropDownPicker
                open={openP1}
                value={p1Unit}
                items={p1Items}
                setOpen={setOpenP1}
                setValue={setP1Unit}
                setItems={setP1Items}
                style={
                  styles.unitDropdownBox
                }
                dropDownContainerStyle={
                  styles.unitDropdownList
                }
                textStyle={
                  styles.unitDropdownText
                }
                listMode="SCROLLVIEW"
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>

            {/* T1 */}
            <View
              style={{
                flex: 1,
                marginLeft: 8,
              }}
              onLayout={rememberY("T1")}
            >
              <Text
                style={styles.inputLabel}
              >
                T1 (HP Steam)
              </Text>

              <TextInput
                style={[
                  styles.input,
                  fieldWarnings.T1
                    .length > 0 &&
                    styles.inputError,
                ]}
                keyboardType="numeric"
                value={T1}
                onChangeText={setT1}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />

              {renderFieldWarning("T1")}
            </View>

            {/* T1 UNIT */}
            <View
              style={{
                width: 90,
                marginLeft: 6,
                marginTop: 14,
              }}
            >
              <Text
                style={styles.inputLabel}
              >
                Unit
              </Text>

              <DropDownPicker
                open={openT1}
                value={t1Unit}
                items={t1Items}
                setOpen={setOpenT1}
                setValue={setT1Unit}
                setItems={setT1Items}
                style={
                  styles.unitDropdownBox
                }
                dropDownContainerStyle={
                  styles.unitDropdownList
                }
                textStyle={
                  styles.unitDropdownText
                }
                listMode="SCROLLVIEW"
                zIndex={2900}
                zIndexInverse={900}
              />
            </View>
          </View>

          {/* ---------------------------------- */}
          {/* ROW 2 - P2 / TCRH / PLANT MW */}
          {/* ---------------------------------- */}

          <View style={styles.row}>
            {/* P2 */}
            <View
              onLayout={rememberY("P2")}
              style={styles.inputWrapper}
            >
              <Text
                style={styles.inputLabel}
              >
                P2 (CRH Outlet Pressure)
              </Text>

              <TextInput
                style={[
                  styles.input,
                  fieldWarnings.P2
                    .length > 0 &&
                    styles.inputError,
                ]}
                keyboardType="numeric"
                value={P2}
                onChangeText={setP2}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />

              {renderFieldWarning("P2")}
            </View>

            {/* TCRH */}
            <View
              onLayout={rememberY("TCRH")}
              style={[
                styles.inputWrapper,
                {
                  flex: 1,
                  marginTop: 11,
                },
              ]}
            >
              <Text
                style={styles.inputLabel}
              >
                TCRH
              </Text>

              <TextInput
                style={[
                  styles.input,
                  fieldWarnings.TCRH
                    .length > 0 &&
                    styles.inputError,
                ]}
                keyboardType="numeric"
                value={TCRH}
                onChangeText={setTCRH}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />

              {renderFieldWarning("TCRH")}
            </View>

            {/* Plant MW Load */}
            <View
              onLayout={rememberY(
                "PlantMWLoad"
              )}
              style={[
                styles.inputWrapper,
                {
                  flex: 1,
                  marginTop: 11,
                },
              ]}
            >
              <Text
                style={styles.inputLabel}
              >
                Plant MW Load
              </Text>

              <TextInput
                style={[
                  styles.input,
                  fieldWarnings.PlantMWLoad
                    .length > 0 &&
                    styles.inputError,
                ]}
                keyboardType="numeric"
                value={plantMWLoad}
                onChangeText={
                  setPlantMWLoad
                }
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />

              {renderFieldWarning(
                "PlantMWLoad"
              )}
            </View>
          </View>

          {/* ---------------------------------- */}
          {/* ROW 3 - WCRH / UNIT */}
          {/* ---------------------------------- */}

          <View style={styles.row}>
            {/* WCRH */}
            <View
              onLayout={rememberY("WCRH")}
              style={styles.inputWrapper}
            >
              <Text
                style={styles.inputLabel}
              >
                W-CRH
              </Text>

              <TextInput
                style={[
                  styles.input,
                  fieldWarnings.WCRH
                    .length > 0 &&
                    styles.inputError,
                ]}
                keyboardType="numeric"
                value={WCRH}
                onChangeText={setWCRH}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />

              {renderFieldWarning(
                "WCRH"
              )}
            </View>

            {/* WCRH UNIT */}
            <View
              onLayout={rememberY("Unit")}
              style={{
                flex: 1,
                marginRight: 8,
                zIndex: 1000,
              }}
            >
              <Text
                style={styles.inputLabels}
              >
                Unit
              </Text>

              <DropDownPicker
                open={open}
                value={wcrUnit}
                items={items}
                setOpen={setOpen}
                setValue={setWcrUnit}
                setItems={setItems}
                style={styles.dropdown}
                dropDownContainerStyle={
                  styles.dropdownList
                }
                textStyle={
                  styles.dropdownText
                }
                placeholderStyle={
                  styles.dropdownText
                }
                listMode="SCROLLVIEW"
                zIndex={1000}
                zIndexInverse={700}
              />
            </View>
          </View>

          {/* ---------------------------------- */}
          {/* ROW 4 - T-MIX / T2p / T2p Expected */}
          {/* ---------------------------------- */}

          <View style={styles.row}>
            {/* T-MIX */}
            <View
              onLayout={rememberY("Tmix")}
              style={[
                styles.inputWrapper,
                {
                  flex: 0.3,
                },
              ]}
            >
              <Text
                style={styles.inputLabel}
              >
                T-MIX
              </Text>

              <TextInput
                style={[
                  styles.input,
                  fieldWarnings.Tmix
                    .length > 0 &&
                    styles.inputError,
                ]}
                keyboardType="numeric"
                value={Tmix}
                onChangeText={setTmix}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />

              {renderFieldWarning(
                "Tmix"
              )}
            </View>

            {/* T2p */}
            <View
              onLayout={rememberY("T2p")}
              style={[
                styles.inputWrapper,
                {
                  flex: 0.3,
                  marginLeft: 6,
                },
              ]}
            >
              <Text
                style={styles.inputLabel}
              >
                T2p
              </Text>

              <TextInput
                style={[
                  styles.input,
                  fieldWarnings.T2p
                    .length > 0 &&
                    styles.inputError,
                ]}
                keyboardType="numeric"
                value={T2p}
                onChangeText={setT2p}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />

              {renderFieldWarning(
                "T2p"
              )}
            </View>

            {/* T2p Expected (Read-only) */}
            <View
              onLayout={rememberY("T2pExpected")}
              style={[
                styles.inputWrapper,
                {
                  flex: 0.3,
                  marginLeft: 6,
                },
              ]}
            >
              <Text
                style={[styles.inputLabel, { color: "#666" }]}
              >
                T2p Expected
              </Text>

              <TextInput
                style={[
                  styles.input,
                  styles.readOnlyInput,
                ]}
                value={t2pExpected}
                editable={false}
                placeholder="--"
                placeholderTextColor="#999"
              />

              {renderFieldWarning("T2pExpected")}
            </View>
          </View>

          {/* ---------------------------------- */}
          {/* ROW 5 - Tw / Ww */}
          {/* ---------------------------------- */}

          <View style={styles.row}>
            {/* Tw */}
            <View
              onLayout={rememberY("Tw")}
              style={styles.inputWrapper}
            >
              <Text
                style={styles.inputLabel}
              >
                Tw (Spray Water Temp)
              </Text>

              <TextInput
                style={[
                  styles.input,
                  fieldWarnings.Tw
                    .length > 0 &&
                    styles.inputError,
                ]}
                keyboardType="numeric"
                value={tw}
                onChangeText={setTw}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />

              {renderFieldWarning("Tw")}
            </View>

            {/* Ww */}
            <View
              onLayout={rememberY("Ww")}
              style={styles.inputWrapper}
            >
              <Text
                style={styles.inputLabel}
              >
                Ww (Spray Water Flow)
              </Text>

              <TextInput
                style={[
                  styles.input,
                  fieldWarnings.Ww
                    .length > 0 &&
                    styles.inputError,
                ]}
                keyboardType="numeric"
                value={ww}
                onChangeText={setWw}
                placeholder="00"
                placeholderTextColor="#FF4D57"
              />

              {renderFieldWarning("Ww")}
            </View>
          </View>

          {/* ---------------------------------- */}
          {/* WARNINGS */}
          {/* ---------------------------------- */}

          {warnings.length > 0 && (
            <Reanimated.View
              entering={FadeIn.duration(500)}
              style={
                styles.warningContainer
              }
            >
              {warnings.map(
                (warning, index) => (
                  <Text
                    key={index}
                    style={
                      styles.warningText
                    }
                  >
                    ⚠ {warning}
                  </Text>
                )
              )}
            </Reanimated.View>
          )}

          {/* ---------------------------------- */}
          {/* SAVE BUTTON */}
          {/* ---------------------------------- */}

          <TouchableOpacity
            style={styles.calculateBtn}
            onPress={saveInputData}
          >
            <Text
              style={styles.calculateText}
            >
              Save
            </Text>
          </TouchableOpacity>

          {/* ---------------------------------- */}
          {/* RESET */}
          {/* ---------------------------------- */}

          <TouchableOpacity
            onPress={resetAll}
          >
            <Text style={styles.resetText}>
              Reset Value
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ---------------------------------- */}
      {/* MISSING FIELDS MODAL */}
      {/* ---------------------------------- */}

      <Modal
        animationType="fade"
        transparent
        visible={
          showMissingFieldsModal
        }
        onRequestClose={
          closeMissingFieldsModal
        }
      >
        <View
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor:
                  "#FFF3CD",
              },
            ]}
          >
            <View
              style={styles.modalHeader}
            >
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color: "#856404",
                  },
                ]}
              >
                Missing Required Fields
              </Text>

              <TouchableOpacity
                onPress={
                  closeMissingFieldsModal
                }
                style={
                  styles.closeButton
                }
              >
                <Text
                  style={
                    styles.closeButtonText
                  }
                >
                  ×
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={styles.modalBody}
            >
              <Text
                style={{
                  color: "#856404",
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                Please fill in the
                following required
                fields:
              </Text>

              {missingFields.map(
                (field, index) => (
                  <View
                    key={index}
                    style={
                      styles.missingFieldItem
                    }
                  >
                    <Text
                      style={
                        styles.missingFieldText
                      }
                    >
                      • {field}
                    </Text>
                  </View>
                )
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.modalCloseBtn,
                {
                  backgroundColor:
                    "#856404",
                },
              ]}
              onPress={
                closeMissingFieldsModal
              }
            >
              <Text
                style={
                  styles.modalCloseText
                }
              >
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ---------------------------------- */}
      {/* CALCULATION RESULTS MODAL */}
      {/* ---------------------------------- */}

      <Modal
        animationType="fade"
        transparent
        visible={showResultsModal}
        onRequestClose={closeResultsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.resultsModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: "#FF4D57" }]}>
                Calculation Results
              </Text>

              <TouchableOpacity
                onPress={closeResultsModal}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.resultsScrollView} showsVerticalScrollIndicator={false}>
              {calculationResults && (
                <View style={styles.resultsContainer}>
                  {/* At Test Conditions */}
                  <Text style={styles.resultsSectionTitle}>At Test Conditions:</Text>
                  
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>LEAK RATE</Text>
                    <Text style={styles.resultValue}>
                      {formatWith2Decimals(calculationResults.WcorrUserUnit)} {wcrUnit}
                    </Text>
                  </View>

                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Eq. MW-loss</Text>
                    <Text style={styles.resultValue}>
                      {formatMWLoss(calculationResults.MWLOSS)} MW
                    </Text>
                  </View>

                  {/* At MCR load */}
                  <Text style={[styles.resultsSectionTitle, { marginTop: 12 }]}>At MCR load:</Text>

                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>LEAK RATE</Text>
                    <Text style={styles.resultValue}>
                      {formatWith2Decimals(calculationResults.WcorrFLUserUnit)} {wcrUnit}
                    </Text>
                  </View>

                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Eq. MW-loss</Text>
                    <Text style={styles.resultValue}>
                      {formatMWLoss(calculationResults.MWLOSSFL)} MW
                    </Text>
                  </View>

                  {/* Additional Results */}
                  <Text style={[styles.resultsSectionTitle, { marginTop: 12 }]}>Performance Impact:</Text>

                  
<View style={styles.resultItem}>
  <Text style={styles.resultLabel}>Heat Rate Penalty</Text>
  <Text style={styles.resultValue}>
    {calculationResults.DHR !== undefined && Number.isFinite(calculationResults.DHR)
      ? (calculationResults.DHR / 1000).toFixed(2)  // Move decimal 3 places left
      : "N/A"} {heatRateUnitFromFirstScreen}
</Text>
</View>

                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Production loss per year</Text>
                    <Text style={styles.resultValue}>
                      {formatProductionLoss(calculationResults.PLOSS)} MW-h
                    </Text>
                  </View>

                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Revenue loss per year</Text>
                    <Text style={styles.resultValue}>
                      $ {formatRevenueLoss(calculationResults.RLOSS)}
                    </Text>
                  </View>

                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Production Cost Wasted per year</Text>
                    <Text style={styles.resultValue}>
                      $ {formatProductionCost(calculationResults.PCOST)}
                    </Text>
                  </View>

                  
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalCloseBtn, { backgroundColor: "#FF4D57" }]}
              onPress={closeResultsModal}
            >
              <Text style={styles.modalCloseText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ==================================================
// STYLES
// ==================================================

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
    width: "100%",
    position: "relative",
  },

  backButton: {
    position: "absolute",
    bottom: 10,
    top: 10,
    left: 15,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 20,
  },

  backButtonText: {
    color: "#FF4D57",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "500",
  },

  logo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF4D57",
    marginTop: 10,
    textAlign: "center",
  },

  stationUnitContainer: {
    alignItems: "center",
  },

  station: {
    fontSize: 15,
    color: "#D3D3D3",
    fontWeight: "bold",
  },

  underline: {
    height: 1,
    width: "65%",
    backgroundColor: "#D3D3D3",
    marginVertical: 2,
  },

  diagramImageContainer: {
    alignSelf: "center",
    width: "100%",
    height: 250,
    marginVertical: 5,
  },

  diagramImage: {
    width: "105%",
    height: "100%",
  },

  warningContainer: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#FFF3CD",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FFE58F",
  },

  warningText: {
    color: "#856404",
    fontSize: 12,
    marginVertical: 2,
  },

  fieldWarningContainer: {
    marginTop: 2,
    marginBottom: 4,
    paddingHorizontal: 8,
  },

  fieldWarningText: {
    color: "#D60000",
    fontSize: 10,
    fontStyle: "italic",
  },

  logoutButton: {
    position: "absolute",
    top: 35,
    right: 15,
    zIndex: 10,
  },

  logoutText: {
    color: "#FF4D57",
    fontWeight: "bold",
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ef4b56",
    marginBottom: 8,
    marginTop: 4,
    letterSpacing: 0.5,
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

  inputLabel: {
    color: "#080808",
    marginBottom: 2,
    fontSize: 11,
    marginHorizontal: 8,
  },

  inputLabels: {
    color: "#080808",
    marginBottom: 5,
    fontSize: 11,
    marginLeft: 15,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 12,
    height: 42,
    fontSize: 14,
    color: "#000",
    marginHorizontal: 8,
  },

  readOnlyInput: {
    backgroundColor: "#F5F5F5",
    color: "#666",
    borderColor: "#D0D0D0",
  },

  inputError: {
    borderColor: "#D60000",
    borderWidth: 1.5,
  },

  dropdown: {
    backgroundColor: "transparent",
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: "#FF4D57",
    height: 35,
    width: "90%",
    minHeight: 35,
    marginHorizontal: 8,
  },

  dropdownList: {
    borderRadius: 0,
    borderColor: "#FF4D57",
    marginHorizontal: 8,
  },

  dropdownText: {
    color: "#FF4D57",
    fontSize: 11,
    lineHeight: 18,
  },

  unitDropdownBox: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    height: 42,
    minHeight: 42,
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  unitDropdownList: {
    borderRadius: 10,
    borderColor: "#E5E5E5",
  },

  unitDropdownText: {
    fontSize: 14,
    color: "#000",
  },

  calculateBtn: {
    backgroundColor: "#FF4D57",
    padding: 12,
    borderRadius: 30,
    marginTop: 15,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: width * 0.9,
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  resultsModalContent: {
    maxHeight: "85%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff4d50",
  },

  closeButton: {
    padding: 5,
  },

  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },

  modalBody: {
    marginBottom: 15,
  },

  modalCloseBtn: {
    backgroundColor: "#FF4D57",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },

  modalCloseText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  missingFieldItem: {
    padding: 8,
    backgroundColor: "#FFE8E8",
    borderRadius: 5,
    marginVertical: 3,
  },

  missingFieldText: {
    color: "#856404",
    fontSize: 13,
  },

  // Results Modal Styles
  resultsScrollView: {
    maxHeight: "100%",
  },

  resultsContainer: {
    paddingVertical: 5,
  },

  resultsSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 4,
  },

  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  resultLabel: {
    fontSize: 13,
    color: "#555",
    flex: 1,
  },

  resultValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF4D57",
    textAlign: "right",
    flex: 1,
  },
});