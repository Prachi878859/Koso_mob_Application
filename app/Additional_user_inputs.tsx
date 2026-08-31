
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   Alert,
//   ActivityIndicator,
//   Dimensions,
// } from 'react-native';
// import { router, useLocalSearchParams } from 'expo-router';
// import DropDownPicker from 'react-native-dropdown-picker';
// import { Keyboard } from "react-native";

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';
// import api from './axiosInstance';

// /* ---------------- TYPES ---------------- */

// interface PlantData {
//   power_station_name: string;
//   pipe_dia_d2: string | null;
//   pipe_dia_unit: string | null;
//   plant_type: string | null;
//   critical_type: string | null;
//   plant_mcr: string | null;
//   heat_rate_value: string | null;
//   heat_rate_unit: string | null;
//   production_cost: string | null;
//   production_cost_currency: string | null;
//   custom_currency: string | null;
//   sell_price_per_mwh: string | null;
// }

// interface PowerStationData {
//   stationName?: string;
//   pipeDiaD2?: string;
//   pipeDiaUnit?: string;
//   plantType?: string;
//   criticalType?: string;
//   plantMCR?: string;
//   heatRateValue?: string;
//   heatRateUnit?: string;
//   currency?: string;
//   sellPricePerMWh?: string;
//   productionCost?: string;
//   productionCostCurrency?: string;
//   customCurrency?: string;
//   p1Unit?: string;
//   t1Unit?: string;
//   wcrhUnit?: string;

//   p1Value?: string;
//   p2Value?: string;
//   t1Value?: string;
//   t2pValue?: string;
//   tcrhValue?: string;
//   tmixValue?: string;
//   wcrhValue?: string;
//   d2Value?: string;
//   twValue?: string;
//   wwValue?: string;
// }

// type DropdownItem = {
//   label: string;
//   value: string;
// };

// interface CustomDropdownProps {
//   open: boolean;
//   value: string | null;
//   items: DropdownItem[];
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   setValue: React.Dispatch<React.SetStateAction<string | null>>;
//   placeholder: string;
//   zIndex: number;
//   onSelect?: (value: string | null) => void;
//   useModal?: boolean;
//   disabled?: boolean;
// }

// /* ---------------- CUSTOM DROPDOWN ---------------- */

// const CustomDropdown: React.FC<CustomDropdownProps> = ({
//   open,
//   value,
//   items,
//   setOpen,
//   setValue,
//   placeholder,
//   zIndex,
//   onSelect,
//   disabled = false,
// }) => {
//   return (
//     <View style={{ zIndex, overflow: 'visible' }}>
//       <DropDownPicker
//         open={open}
//         value={value}
//         items={items}
//         setOpen={setOpen}
//         setValue={setValue}
//         onChangeValue={onSelect}
//         placeholder={placeholder}
//         disabled={disabled}

//         listMode="SCROLLVIEW"

//         flatListProps={{
//           nestedScrollEnabled: true,
//         }}

//         dropDownDirection="BOTTOM"

//         zIndex={zIndex}
//         zIndexInverse={1000 - zIndex}

//         containerStyle={{
//           height: 40,
//         }}

//         style={[
//           styles.dropdown,
//           {
//             minHeight: 40,
//             height: 40,
//             width: '100%',
//           },
//         ]}

//         textStyle={{
//           fontSize: 13,
//         }}

//         dropDownContainerStyle={{
//           borderWidth: 1,
//           borderColor: '#E0E0E0',
//           borderRadius: 8,
//           backgroundColor: '#FFF',
//           position: 'absolute',
//           top: 42,
//           width: '100%',
//         }}

//         closeAfterSelecting
//       />
//     </View>
//   );
// };

// /* ---------------- MAIN SCREEN ---------------- */

// export default function AdditionalUserInputsScreen() {
//   const params = useLocalSearchParams();

//   // Check if we're coming back from calculator with data
//   const returningFromCalculator = params.fromCalculator === 'true';
//   const returnedData = params.powerStationData
//     ? JSON.parse(params.powerStationData as string) as PowerStationData
//     : {};

//   // Form states
//   const [errors, setErrors] = useState<any>({});
//   const [warnings, setWarnings] = useState<any>({});
//   const [powerStationName, setPowerStationName] = useState(
//     returnedData.stationName || ''
//   );
//   const [plantType, setPlantType] = useState<string | null>(
//     returnedData.plantType || null
//   );
//   const [criticalType, setCriticalType] = useState<string | null>(
//     returnedData.criticalType || null
//   );
//   const [plantMCR, setPlantMCR] = useState(
//     returnedData.plantMCR || ''
//   );
//   const [heatRateValue, setHeatRateValue] = useState(
//     returnedData.heatRateValue || ''
//   );
//   const [heatRateUnit, setHeatRateUnit] = useState<string | null>(
//     returnedData.heatRateUnit || 'kJ/kW-h'
//   );
//   const [productionCost, setProductionCost] = useState(
//     returnedData.productionCost || ''
//   );
//   const [productionCostCurrency, setProductionCostCurrency] = useState<string | null>(
//     returnedData.productionCostCurrency || returnedData.currency || 'USD'
//   );
//   const [customCurrency, setCustomCurrency] = useState(
//     returnedData.customCurrency || ''
//   );
//   const [sellPricePerMWh, setSellPricePerMWh] = useState(
//     returnedData.sellPricePerMWh || ''
//   );

//   // NEW: D2 (Pipe Diameter) states
//   const [pipeDiameter, setPipeDiameter] = useState(
//     returnedData.pipeDiaD2 || ''
//   );
//   const [pipeDiameterUnit, setPipeDiameterUnit] = useState<string | null>(
//     returnedData.pipeDiaUnit || 'MM'
//   );

//   // Dropdown states
//   const [plantTypeOpen, setPlantTypeOpen] = useState(false);
//   const [criticalTypeOpen, setCriticalTypeOpen] = useState(false);
//   const [heatRateUnitOpen, setHeatRateUnitOpen] = useState(false);
//   const [currencyOpen, setCurrencyOpen] = useState(false);
//   const [pipeDiaUnitOpen, setPipeDiaUnitOpen] = useState(false);
//   const [p1Unit, setP1Unit] = useState(returnedData.p1Unit || 'barA');
//   const [t1Unit, setT1Unit] = useState(returnedData.t1Unit || 'deg C');
//   const [wcrhUnit, setWcrhUnit] = useState(returnedData.wcrhUnit || 'T/HR');

//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   const [showHistoryBtn, setShowHistoryBtn] = useState(true);
//   const [isKeyboardVisible, setKeyboardVisible] = useState(false);
//   const [currencyItems, setCurrencyItems] = useState<DropdownItem[]>([
//     { label: 'USD', value: 'USD' },
//     { label: 'Euro', value: 'Euro' },
//     { label: 'INR', value: 'INR' },
//     { label: 'Custom', value: 'custom' },
//   ]);

//   // Refs for handling scroll
//   const scrollViewRef = useRef<ScrollView>(null);

//   /* ---------------- DROPDOWN DATA ---------------- */

//   const plantTypeItems: DropdownItem[] = [
//     { label: 'Coal-/Oil-Fired', value: 'coal_oil_fired' },
//     { label: 'CCPP', value: 'ccpp' },
//   ];

//   const criticalTypeItems: DropdownItem[] = [
//     { label: 'Sub Critical', value: 'subcritical' },
//     { label: 'Super Critical', value: 'supercritical' },
//   ];

//   const heatRateUnitItems: DropdownItem[] = [
//     { label: 'kJ/kW-h', value: 'kJ/kW-h' },
//     { label: 'Btu/kW-h', value: 'Btu/kW-h' },
//     { label: 'Default', value: 'default' },
//   ];

// const p1UnitItems = [
//   { label: 'barA', value: 'barA' },
//   { label: 'psiA', value: 'psiA' },
// ];

// const t1UnitItems = [
//   { label: 'deg C', value: 'deg C' },
//   { label: 'deg F', value: 'deg F' },
// ];

//   const wcrhUnitItems = [
//     { label: 'T/HR', value: 'T/HR' },
//     { label: 'KG/S', value: 'KG/S' },
//     { label: 'KPPH/HR', value: 'KPPH/HR' },
//     { label: 'LB/S', value: 'LB/S' },
//   ];

//   const pipeDiameterUnitItems: DropdownItem[] = [
//     { label: 'MM', value: 'MM' },
//     { label: 'IN', value: 'IN' },
//   ];

//   // Calculator values state to preserve when returning from calculator
//   const [calculatorValues, setCalculatorValues] = useState({
//     p1Value: '',
//     p2Value: '',
//     t1Value: '',
//     t2pValue: '',
//     tcrhValue: '',
//     tmixValue: '',
//     wcrhValue: '',
//     d2Value: '',
//     twValue: '',
//     wwValue: ''
//   });

//   /* ---------------- DROPDOWN HANDLERS ---------------- */

//   const closeAllDropdowns = () => {
//     setPlantTypeOpen(false);
//     setCriticalTypeOpen(false);
//     setHeatRateUnitOpen(false);
//     setCurrencyOpen(false);
//     setPipeDiaUnitOpen(false);
//   };

//   const handleOpenDropdown = (dropdownName: string) => {
//     closeAllDropdowns();
//     switch (dropdownName) {
//       case 'plantType':
//         setPlantTypeOpen(true);
//         break;
//       case 'criticalType':
//         setCriticalTypeOpen(true);
//         break;
//       case 'heatRateUnit':
//         setHeatRateUnitOpen(true);
//         break;
//       case 'currency':
//         setCurrencyOpen(true);
//         break;
//       case 'pipeDiaUnit':
//         setPipeDiaUnitOpen(true);
//         break;
//     }
//   };



//   useEffect(() => {
//     const showSub = Keyboard.addListener("keyboardDidShow", () => {
//       setKeyboardVisible(true);
//     });

//     const hideSub = Keyboard.addListener("keyboardDidHide", () => {
//       setKeyboardVisible(false);
//     });

//     return () => {
//       showSub.remove();
//       hideSub.remove();
//     };
//   }, []);

//   useEffect(() => {
//     if (returningFromCalculator && returnedData) {
//       console.log("Returned data from calculator:", returnedData);

//       setCalculatorValues({
//         p1Value: returnedData.p1Value || '',
//         p2Value: returnedData.p2Value || '',
//         t1Value: returnedData.t1Value || '',
//         t2pValue: returnedData.t2pValue || '',
//         tcrhValue: returnedData.tcrhValue || '',
//         tmixValue: returnedData.tmixValue || '',
//         wcrhValue: returnedData.wcrhValue || '',
//         d2Value: returnedData.d2Value || '',
//         twValue: returnedData.twValue || '',
//         wwValue: returnedData.wwValue || ''
//       });

//       // Restore pipe diameter values
//       setPipeDiameter(returnedData.pipeDiaD2 || '');
//       setPipeDiameterUnit(returnedData.pipeDiaUnit || 'MM');

//       setP1Unit(returnedData.p1Unit || 'barA');
//       setT1Unit(returnedData.t1Unit || 'deg C');
//       setWcrhUnit(returnedData.wcrhUnit || 'T/HR');

//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 3000);
//     }
//   }, [returningFromCalculator]);

//   /* ---------------- FORM HANDLERS ---------------- */

//   const handlePlantTypeChange = (value: string | null) => {
//     setPlantType(value);
//     if (value !== 'coal_oil_fired') {
//       setCriticalType(null);
//     }
//   };

//   const handleCurrencyChange = (value: string | null) => {
//     setProductionCostCurrency(value);
//     if (value !== 'custom') {
//       setCustomCurrency('');
//     }
//   };

//   const handleHeatRateUnitChange = (value: string | null) => {
//     setHeatRateUnit(value);
//     setWarnings((prev: any) => ({ ...prev, heatRateValue: null }));
//     setErrors((prev: any) => ({ ...prev, heatRateValue: null }));
//   };

//   // NEW: Validate pipe diameter
//   const validatePipeDiameter = (value: string, unit: string | null): { isValid: boolean; warning: string | null } => {
//     if (!value.trim()) {
//       return { isValid: true, warning: null };
//     }

//     const numValue = Number(value);
//     if (isNaN(numValue)) {
//       return { isValid: false, warning: null };
//     }

//     if (unit === 'MM') {
//       if (numValue < 300) {
//         return { isValid: false, warning: 'D2 out of bounds (LOW) (300-600)' };
//       } else if (numValue > 600) {
//         return { isValid: false, warning: 'D2 out of bounds (HIGH) (300-600)' };
//       }
//     } else if (unit === 'IN') {
//       if (numValue < 11.8) {
//         return { isValid: false, warning: 'D2 out of bounds (LOW) (11.8-23.6)' };
//       } else if (numValue > 23.6) {
//         return { isValid: false, warning: 'D2 out of bounds (HIGH) (11.8-23.6)' };
//       }
//     }

//     return { isValid: true, warning: null };
//   };

//   const handlePipeDiameterChange = (text: string) => {
//     setPipeDiameter(text);
//     setErrors((prev: any) => ({ ...prev, pipeDiameter: null }));
//     setWarnings((prev: any) => ({ ...prev, pipeDiameter: null }));

//     const { isValid, warning } = validatePipeDiameter(text, pipeDiameterUnit);
//     if (!isValid && warning) {
//       setWarnings((prev: any) => ({ ...prev, pipeDiameter: warning }));
//     }
//   };

//   const handlePipeDiameterUnitChange = (value: string | null) => {
//     setPipeDiameterUnit(value);
//     setErrors((prev: any) => ({ ...prev, pipeDiameter: null }));
//     setWarnings((prev: any) => ({ ...prev, pipeDiameter: null }));

//     if (pipeDiameter.trim()) {
//       const { isValid, warning } = validatePipeDiameter(pipeDiameter, value);
//       if (!isValid && warning) {
//         setWarnings((prev: any) => ({ ...prev, pipeDiameter: warning }));
//       }
//     }
//   };

//   const validatePlantMCR = (value: string): { isValid: boolean; warning: string | null } => {
//     if (!value.trim()) {
//       return { isValid: false, warning: null };
//     }

//     const numValue = Number(value);
//     if (isNaN(numValue)) {
//       return { isValid: false, warning: null };
//     }

//     if (numValue < 100) {
//       return { isValid: false, warning: 'Plant MCR out of bounds (LOW) (100-1200)' };
//     } else if (numValue > 1200) {
//       return { isValid: false, warning: 'Plant MCR out of bounds (HIGH) (100-1200)' };
//     }

//     return { isValid: true, warning: null };
//   };

//   const validateHeatRate = (value: string, unit: string | null): { isValid: boolean; warning: string | null } => {
//     if (!value.trim()) {
//       return { isValid: false, warning: null };
//     }

//     const numValue = Number(value);
//     if (isNaN(numValue)) {
//       return { isValid: false, warning: null };
//     }

//     if (unit === 'kJ/kW-h') {
//       if (numValue < 6000) {
//         return { isValid: false, warning: 'Heat Rate out of bounds (LOW) (6000-12000)' };
//       } else if (numValue > 12000) {
//         return { isValid: false, warning: 'Heat Rate out of bounds (HIGH) (6000-12000)' };
//       }
//     } else if (unit === 'Btu/kW-h') {
//       if (numValue < 5687) {
//         return { isValid: false, warning: 'Heat Rate out of bounds (LOW) (5687-11374)' };
//       } else if (numValue > 11374) {
//         return { isValid: false, warning: 'Heat Rate out of bounds (HIGH) (5687-11374)' };
//       }
//     }

//     return { isValid: true, warning: null };
//   };

//   const getDefaultHeatRate = (): string => {
//     if (plantType === 'ccpp') {
//       return '7500';
//     } else if (criticalType === 'supercritical') {
//       return '8400';
//     }
//     return '9500';
//   };

//   const handlePlantMCRChange = (text: string) => {
//     setPlantMCR(text);
//     setErrors((prev: any) => ({ ...prev, plantMCR: null }));
//     setWarnings((prev: any) => ({ ...prev, plantMCR: null }));

//     const { isValid, warning } = validatePlantMCR(text);
//     if (!isValid && warning) {
//       setWarnings((prev: any) => ({ ...prev, plantMCR: warning }));
//     }
//   };

//   const handleHeatRateChange = (text: string) => {
//     setHeatRateValue(text);
//     setErrors((prev: any) => ({ ...prev, heatRateValue: null }));
//     setWarnings((prev: any) => ({ ...prev, heatRateValue: null }));

//     const { isValid, warning } = validateHeatRate(text, heatRateUnit);
//     if (!isValid && warning) {
//       setWarnings((prev: any) => ({ ...prev, heatRateValue: warning }));
//     }
//   };

//   const handleHeatRateUnitSelect = (value: string | null) => {
//     setHeatRateUnit(value);
//     setWarnings((prev: any) => ({ ...prev, heatRateValue: null }));
//     setErrors((prev: any) => ({ ...prev, heatRateValue: null }));

//     if (value === 'default') {
//       const defaultVal = getDefaultHeatRate();
//       setHeatRateValue(defaultVal);
//     } else {
//       if (heatRateValue.trim()) {
//         const { isValid, warning } = validateHeatRate(heatRateValue, value);
//         if (!isValid && warning) {
//           setWarnings((prev: any) => ({ ...prev, heatRateValue: warning }));
//         }
//       }
//     }
//   };

//   const clearAllFormFields = () => {
//     setPowerStationName('');
//     setPlantMCR('');
//     setHeatRateValue('');
//     setProductionCost('');
//     setCustomCurrency('');
//     setSellPricePerMWh('');
//     setPipeDiameter('');
//     setPlantType(null);
//     setCriticalType(null);
//     setHeatRateUnit('kJ/kW-h');
//     setProductionCostCurrency('USD');
//     setPipeDiameterUnit('MM');
//     setErrors({});
//     setWarnings({});
//     closeAllDropdowns();
//   };

//   const prepareApiData = (): PlantData => {
//     return {
//       power_station_name: powerStationName.trim(),
//       pipe_dia_d2: pipeDiameter || null,
//       pipe_dia_unit: pipeDiameterUnit || null,
//       plant_type: plantType || null,
//       critical_type: criticalType || null,
//       plant_mcr: plantMCR || null,
//       heat_rate_value: heatRateValue || null,
//       heat_rate_unit: heatRateUnit || null,
//       production_cost: productionCost || null,
//       production_cost_currency: productionCostCurrency || null,
//       custom_currency: customCurrency || null,
//       sell_price_per_mwh: sellPricePerMWh || null
//     };
//   };

//   const validateForm = () => {
//     let newErrors: any = {};
//     let newWarnings: any = {};

//     if (!powerStationName.trim()) {
//       newErrors.powerStationName = 'Power station name is required';
//     }

//     if (!plantType) {
//       newErrors.plantType = 'Plant type is required';
//     }

//     if (plantType === 'coal_oil_fired' && !criticalType) {
//       newErrors.criticalType = 'Critical type is required';
//     }

//     if (!plantMCR.trim()) {
//       newErrors.plantMCR = 'Plant MCR is required';
//     } else if (isNaN(Number(plantMCR))) {
//       newErrors.plantMCR = 'Enter valid MCR';
//     } else {
//       const { isValid, warning } = validatePlantMCR(plantMCR);
//       if (!isValid && warning) {
//         newWarnings.plantMCR = warning;
//       }
//     }

//     if (!heatRateValue.trim()) {
//       if (heatRateUnit !== 'default') {
//         newErrors.heatRateValue = 'Heat rate is required';
//       }
//     } else if (isNaN(Number(heatRateValue))) {
//       newErrors.heatRateValue = 'Enter valid heat rate';
//     } else {
//       if (heatRateUnit !== 'default') {
//         const { isValid, warning } = validateHeatRate(heatRateValue, heatRateUnit);
//         if (!isValid && warning) {
//           newWarnings.heatRateValue = warning;
//         }
//       }
//     }

//     if (!productionCost.trim()) {
//       setProductionCost('50');
//       setProductionCostCurrency('USD');
//     }
//     else if (isNaN(Number(productionCost))) {
//       newErrors.productionCost = 'Enter valid cost';
//     }

//     if (!productionCostCurrency) {
//       newErrors.productionCostCurrency = 'Currency required';
//     }

//     if (
//       productionCostCurrency === 'custom' &&
//       !customCurrency.trim()
//     ) {
//       newErrors.customCurrency = 'Enter custom currency';
//     }

//     if (!sellPricePerMWh.trim()) {
//       newErrors.sellPricePerMWh = 'Sell price required';
//     } else if (isNaN(Number(sellPricePerMWh))) {
//       newErrors.sellPricePerMWh = 'Enter valid sell price';
//     }

//     // NEW: Validate pipe diameter if provided
//     if (pipeDiameter.trim()) {
//       const { isValid, warning } = validatePipeDiameter(pipeDiameter, pipeDiameterUnit);
//       if (!isValid && warning) {
//         newWarnings.pipeDiameter = warning;
//       }
//     }

//     setErrors(newErrors);
//     setWarnings(newWarnings);

//     return Object.keys(newErrors).length === 0;
//   };

//   const goToCalculator = () => {
//     if (!validateForm()) {
//       if (Object.keys(errors).length === 0 && Object.keys(warnings).length > 0) {
//         Alert.alert(
//           'Warning',
//           'There are some values out of recommended range. Do you want to continue?',
//           [
//             { text: 'Cancel', style: 'cancel' },
//             {
//               text: 'Continue',
//               onPress: () => {
//                 router.push({
//                   pathname: "/CalculatorScreen",
//                   params: {
//                     powerStationData: JSON.stringify({
//                       stationName: powerStationName,
//                       pipeDiaD2: pipeDiameter,
//                       pipeDiaUnit: pipeDiameterUnit,
//                       plantType: plantType,
//                       criticalType: criticalType,
//                       plantMCR: plantMCR,
//                       heatRateValue: heatRateValue,
//                       heatRateUnit: heatRateUnit,
//                       currency: productionCostCurrency === "custom" ? customCurrency : productionCostCurrency,
//                       sellPricePerMWh: sellPricePerMWh,
//                       productionCost: productionCost,
//                       productionCostCurrency: productionCostCurrency,
//                       customCurrency: customCurrency,
//                       p1Value: calculatorValues.p1Value,
//                       p2Value: calculatorValues.p2Value,
//                       t1Value: calculatorValues.t1Value,
//                       t2pValue: calculatorValues.t2pValue,
//                       tcrhValue: calculatorValues.tcrhValue,
//                       tmixValue: calculatorValues.tmixValue,
//                       wcrhValue: calculatorValues.wcrhValue,
//                       d2Value: calculatorValues.d2Value,
//                       twValue: calculatorValues.twValue,
//                       wwValue: calculatorValues.wwValue,
//                       p1Unit: p1Unit,
//                       t1Unit: t1Unit,
//                       wcrhUnit: wcrhUnit,
//                     }),
//                   },
//                 });
//               }
//             }
//           ]
//         );
//         return;
//       }
//       return;
//     }

//     router.push({
//       pathname: "/CalculatorScreen",
//       params: {
//         powerStationData: JSON.stringify({
//           stationName: powerStationName,
//           pipeDiaD2: pipeDiameter,
//           pipeDiaUnit: pipeDiameterUnit,
//           plantType: plantType,
//           criticalType: criticalType,
//           plantMCR: plantMCR,
//           heatRateValue: heatRateValue,
//           heatRateUnit: heatRateUnit,
//           currency: productionCostCurrency === "custom" ? customCurrency : productionCostCurrency,
//           sellPricePerMWh: sellPricePerMWh,
//           productionCost: productionCost,
//           productionCostCurrency: productionCostCurrency,
//           customCurrency: customCurrency,
//           p1Value: calculatorValues.p1Value,
//           p2Value: calculatorValues.p2Value,
//           t1Value: calculatorValues.t1Value,
//           t2pValue: calculatorValues.t2pValue,
//           tcrhValue: calculatorValues.tcrhValue,
//           tmixValue: calculatorValues.tmixValue,
//           wcrhValue: calculatorValues.wcrhValue,
//           d2Value: calculatorValues.d2Value,
//           twValue: calculatorValues.twValue,
//           wwValue: calculatorValues.wwValue,
//           p1Unit: p1Unit,
//           t1Unit: t1Unit,
//           wcrhUnit: wcrhUnit,
//         }),
//       },
//     });
//   };



//   /* ---------------- JSX ---------------- */

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" />
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
//       >
//         <ScrollView
//           ref={scrollViewRef}
//           style={{ flex: 1 }}
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//           nestedScrollEnabled={true}
//           onScrollBeginDrag={closeAllDropdowns}
//           keyboardDismissMode="on-drag"
//           bounces={false}
//         >

//           {/* HEADER with Plant Configuration */}
//           <View style={styles.header}>

//             <TouchableOpacity
//               style={styles.headerNextTextContainer}
//               onPress={goToCalculator}
//               disabled={loading}
//               activeOpacity={0.7}
//             >
//               {loading ? (
//                 <ActivityIndicator size="small" color="#FFF" />
//               ) : (
//                 <Text style={styles.headerNextText}>Next</Text>
//               )}
//             </TouchableOpacity>

//             <Text style={styles.headerTitle}>Plant Configuration</Text>
//             <Text style={styles.headerSubtitle}>Additional Plant Information</Text>
//           </View>


//           {/* SUCCESS MESSAGE */}
//           {showSuccess && (
//             <View style={styles.successContainer}>
//               <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
//               <Text style={styles.successText}>{successMessage}</Text>
//             </View>
//           )}

//           {/* CONTENT */}
//           <View
//             style={styles.content}
//             onStartShouldSetResponder={() => true}
//             onResponderGrant={closeAllDropdowns}
//           >
//             {/* ---------------- BASIC INFORMATION ---------------- */}
//             <View style={[styles.section, { zIndex: 6000, marginBottom: -10 }]}>
//               <Text style={styles.sectionTitle}>BASIC INFORMATION</Text>

//               {/* Name of Power Station */}
//               <View style={styles.fieldContainer}>
//                 <Text style={styles.fieldLabel}>
//                   Name of Power Station <Text style={styles.requiredStar}>*</Text>
//                 </Text>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     errors.powerStationName && styles.errorInput
//                   ]}
//                   value={powerStationName}
//                   onChangeText={(text) => {
//                     setPowerStationName(text);
//                     setErrors((prev: any) => ({ ...prev, powerStationName: null }));
//                   }}
//                   placeholder="Enter Name of Power station"
//                   placeholderTextColor="#999"
//                   onFocus={closeAllDropdowns}
//                 />
//                 {errors.powerStationName && (
//                   <Text style={styles.errorText}>{errors.powerStationName}</Text>
//                 )}
//               </View>

//               {/* Plant Type and Pipe Diameter in same row */}
//               <View style={styles.rowContainer}>
//                 <View style={[styles.rowField, { flex: 0.5,zIndex: 3000 }]}>
//                   <Text style={styles.fieldLabel}>Plant Type <Text style={styles.requiredStar}>*</Text></Text>
//                   <CustomDropdown
//                     open={plantTypeOpen}
//                     value={plantType}
//                     items={plantTypeItems}
//                     setOpen={(open) =>
//                       open
//                         ? handleOpenDropdown('plantType')
//                         : setPlantTypeOpen(false)
//                     }
//                     setValue={setPlantType}
//                     placeholder="Select"
//                     zIndex={3000}
//                     onSelect={handlePlantTypeChange}
//                   />
//                   {errors.plantType && (
//                     <Text style={styles.errorText}>{errors.plantType}</Text>
//                   )}
//                 </View>

//                 <View style={[styles.rowField, { marginLeft: 12, zIndex: 2500 }]}>
//                   <Text style={styles.fieldLabel}>  Diameter (D2)</Text>
//                   <View style={styles.doubleFieldContainer}>
//                     <View style={styles.singleFieldContainer}>
//                       <TextInput
//                         style={[
//                           styles.input,
//                           warnings.pipeDiameter && styles.warningInput
//                         ]}
//                         value={pipeDiameter}
//                         onChangeText={handlePipeDiameterChange}
//                         placeholder="Enter Diameter"
//                         placeholderTextColor="#999"
//                         keyboardType="numeric"
//                       />
//                       {warnings.pipeDiameter && !errors.pipeDiameter && (
//                         <Text style={styles.warningText}>{warnings.pipeDiameter}</Text>
//                       )}
//                     </View>

//                     <View style={[styles.unitFieldContainer, { flex: 0.65 }]}>
//                       <Text style={styles.fieldLabel}>Unit </Text>
//                       <DropDownPicker
//                         open={pipeDiaUnitOpen}
//                         value={pipeDiameterUnit}
//                         items={pipeDiameterUnitItems}
//                         setOpen={setPipeDiaUnitOpen}
//                         setValue={(callback) => {
//                           const value = callback(pipeDiameterUnit);
//                           handlePipeDiameterUnitChange(value);
//                         }}
//                         listMode="SCROLLVIEW"
//                         containerStyle={{
//                           height: 40,
//                           width: '100%',
//                         }}
//                         style={[
//                           styles.dropdown,
//                           {
//                             minHeight: 40,
//                             height: 40,
//                           },
//                         ]}
//                         textStyle={{
//                           fontSize: 13,
//                         }}
//                         dropDownContainerStyle={{
//                           borderWidth: 1,
//                           borderColor: '#E0E0E0',
//                           borderRadius: 8,
//                           backgroundColor: '#FFF',
//                           position: 'absolute',
//                           top: 42,
//                           width: '100%',
//                         }}
//                       />
//                     </View>
//                   </View>
//                 </View>
//               </View>

//               {/* Boiler Type - shown conditionally */}
//               {plantType === 'coal_oil_fired' && (
//                 <View style={[styles.fieldContainer, { zIndex: 2000, marginTop: 5 }]}>
//                   <Text style={styles.fieldLabel}>Boiler Type <Text style={styles.requiredStar}>*</Text></Text>
//                   <CustomDropdown
//                     open={criticalTypeOpen}
//                     value={criticalType}
//                     items={criticalTypeItems}
//                     setOpen={(open) =>
//                       open
//                         ? handleOpenDropdown('criticalType')
//                         : setCriticalTypeOpen(false)
//                     }
//                     setValue={setCriticalType}
//                     placeholder="Select critical type"
//                     zIndex={2000}
//                   />
//                   {errors.criticalType && (
//                     <Text style={styles.errorText}>{errors.criticalType}</Text>
//                   )}
//                 </View>
//               )}
//             </View>

//             {/* ---------------- PLANT SPECIFICATIONS ---------------- */}
//             <View style={[styles.section, { zIndex: 70, marginTop: 10 }]}>
//               <Text style={styles.sectionTitle}>PLANT SPECIFICATIONS</Text>

//               {/* Plant MCR */}
//               <View style={styles.fieldContainer}>
//                 <Text style={styles.fieldLabel}>Plant MCR Flow Rate (mt/h) <Text style={styles.requiredStar}>*</Text></Text>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     errors.plantMCR && styles.errorInput,
//                     warnings.plantMCR && styles.warningInput
//                   ]}
//                   value={plantMCR}
//                   onChangeText={handlePlantMCRChange}
//                   placeholder="Enter Plant MCR"
//                   placeholderTextColor="#999"
//                   keyboardType="numeric"
//                 />
//                 {errors.plantMCR && (
//                   <Text style={styles.errorText}>{errors.plantMCR}</Text>
//                 )}
//                 {warnings.plantMCR && !errors.plantMCR && (
//                   <Text style={styles.warningText}>{warnings.plantMCR}</Text>
//                 )}
//               </View>

//               {/* Heat Rate */}
//               <View style={styles.fieldContainer}>
//                 <Text style={styles.fieldLabel}>Heat Rate <Text style={styles.requiredStar}>*</Text></Text>
//                 <View style={styles.doubleFieldContainer}>
//                   <View style={styles.singleFieldContainer}>
//                     <TextInput
//                       style={[
//                         styles.input,
//                         errors.heatRateValue && styles.errorInput,
//                         warnings.heatRateValue && styles.warningInput
//                       ]}
//                       value={heatRateValue}
//                       onChangeText={handleHeatRateChange}
//                       placeholder="Enter Value"
//                       placeholderTextColor="#999"
//                       keyboardType="numeric"
//                       editable={heatRateUnit !== 'default'}
//                     />
//                     {errors.heatRateValue && (
//                       <Text style={styles.errorText}>{errors.heatRateValue}</Text>
//                     )}
//                     {warnings.heatRateValue && !errors.heatRateValue && (
//                       <Text style={styles.warningText}>{warnings.heatRateValue}</Text>
//                     )}
//                   </View>

//                   <View style={styles.singleFieldContainer}>
//                     <CustomDropdown
//                       open={heatRateUnitOpen}
//                       value={heatRateUnit}
//                       items={heatRateUnitItems}
//                       setOpen={(open) =>
//                         open
//                           ? handleOpenDropdown('heatRateUnit')
//                           : setHeatRateUnitOpen(false)
//                       }
//                       setValue={handleHeatRateUnitSelect}
//                       placeholder="kJ/kW-h"
//                       zIndex={1500}
//                     />
//                   </View>
//                 </View>
//               </View>
//             </View>

//             {/* ---------------- FINANCIAL INFORMATION ---------------- */}
//             <View style={[styles.section, { zIndex: 60, marginTop: -10 }]}>
//               <Text style={styles.sectionTitle}>FINANCIAL INFORMATION</Text>

//               {/* Production Cost and Currency */}
//               <View style={styles.fieldContainer}>
//                 <Text style={styles.fieldLabel}>Production Cost (per MW-h) <Text style={styles.requiredStar}>*</Text></Text>

//                 <View style={styles.doubleFieldContainer}>
//                   <View style={styles.singleFieldContainer}>
//                     <Text style={styles.subLabel}>Cost</Text>
//                     <TextInput
//                       style={[
//                         styles.input,
//                         errors.productionCost && styles.errorInput
//                       ]}
//                       value={productionCost}
//                       onChangeText={(text) => {
//                         setProductionCost(text);
//                         setErrors((prev: any) => ({ ...prev, productionCost: null }));
//                       }}
//                       placeholder="Enter Cost"
//                       placeholderTextColor="#999"
//                       keyboardType="numeric"
//                     />
//                     {errors.productionCost && (
//                       <Text style={styles.errorText}>{errors.productionCost}</Text>
//                     )}
//                   </View>

//                   <View style={styles.singleFieldContainer}>
//                     <Text style={styles.subLabel}>Currency</Text>
//                     <DropDownPicker
//                       open={currencyOpen}
//                       value={productionCostCurrency}
//                       items={[
//                         { label: "USD", value: "USD" },
//                         { label: "Euro", value: "Euro" },
//                         { label: "INR", value: "INR" },
//                         { label: "Custom", value: "custom" },
//                       ]}
//                       setOpen={setCurrencyOpen}
//                       setValue={(callback) => {
//                         const value = callback(productionCostCurrency);
//                         setProductionCostCurrency(value);
//                       }}
//                       setItems={setCurrencyItems}

//                       listMode="SCROLLVIEW"

//                       containerStyle={{
//                         height: 38,
//                       }}

//                       style={[
//                         styles.dropdown,
//                         {
//                           minHeight: 38,
//                           height: 38,
//                         },
//                       ]}

//                       textStyle={{
//                         fontSize: 12,
//                       }}

//                       listItemLabelStyle={{
//                         fontSize: 12,
//                       }}

//                       listItemContainerStyle={{
//                         height: 32,
//                       }}

//                       dropDownContainerStyle={{
//                         borderWidth: 1,
//                         borderColor: '#E0E0E0',
//                         borderRadius: 8,
//                         backgroundColor: '#FFF',
//                         elevation: 1000,
//                         zIndex: 1000,
//                         position: 'absolute',
//                         top: 42,
//                         width: '100%',
//                       }}
//                     />
//                     {errors.productionCostCurrency && (
//                       <Text style={styles.errorText}>
//                         {errors.productionCostCurrency}
//                       </Text>
//                     )}
//                   </View>
//                 </View>
//               </View>

//               {productionCostCurrency === 'custom' && (
//                 <View style={[styles.fieldContainer, { marginTop: -7 }]}>
//                   <Text style={styles.fieldLabel}>Custom Currency <Text style={styles.requiredStar}>*</Text></Text>
//                   <TextInput
//                     style={[
//                       styles.input,
//                       errors.customCurrency && styles.errorInput
//                     ]}
//                     value={customCurrency}
//                     onChangeText={(text) => {
//                       setCustomCurrency(text);
//                       setErrors((prev: any) => ({ ...prev, customCurrency: null }));
//                     }}
//                     placeholder="Enter custom currency"
//                     placeholderTextColor="#999"
//                   />
//                   {errors.customCurrency && (
//                     <Text style={styles.errorText}>{errors.customCurrency}</Text>
//                   )}
//                 </View>
//               )}

//               {/* Sell Price */}
//               <View style={[styles.fieldContainer, { marginTop: -5 }]}>
//                 <Text style={styles.fieldLabel}>
//                   Sell Price ({productionCostCurrency === "custom"
//                     ? customCurrency || "Custom"
//                     : productionCostCurrency} / MW-h) <Text style={styles.requiredStar}>*</Text>
//                 </Text>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     errors.sellPricePerMWh && styles.errorInput
//                   ]}
//                   value={sellPricePerMWh}
//                   onChangeText={(text) => {
//                     setSellPricePerMWh(text);
//                     setErrors((prev: any) => ({ ...prev, sellPricePerMWh: null }));
//                   }}
//                   placeholder="Enter Sell Price"
//                   placeholderTextColor="#999"
//                   keyboardType="numeric"
//                 />
//                 {errors.sellPricePerMWh && (
//                   <Text style={styles.errorText}>{errors.sellPricePerMWh}</Text>
//                 )}
//               </View>
//             </View>


//           </View>
//         </ScrollView>

//         {/* FLOATING HISTORY BUTTON */}
//         {!isKeyboardVisible && (
//           <TouchableOpacity
//             style={styles.floatingButton}
//             activeOpacity={0.8}
//             onPress={() => router.push('/ViewHistoryScreen')}
//           >
//             <Ionicons name="time-outline" size={20} color="#fff" />
//             <Text style={styles.floatingButtonText}>View History</Text>
//           </TouchableOpacity>
//         )}
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const { width, height } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   headerNextTextContainer: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//     zIndex: 1000,
//   },


//   headerNextText: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   errorInput: {
//     borderColor: 'red',
//   },
//   warningInput: {
//     borderColor: 'red',
//   },
//   floatingButton: {
//     position: 'absolute',
//     bottom: 25,
//     right: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ef4b56',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 22,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     zIndex: 1000,
//     maxWidth: 160,
//   },
//   floatingButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 11,
//     marginTop: 2,
//   },
//   warningText: {
//     color: 'red',
//     fontSize: 11,
//     marginTop: 2,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 120,
//   },
//   header: {
//     backgroundColor: '#ef4b56',
//     paddingTop: 20,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     color: '#FFF',
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#FFF',
//     opacity: 0.9,
//   },
//   subLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//   },
//   successContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E8F5E9',
//     padding: 8,
//     marginHorizontal: 16,
//     borderRadius: 6,
//     marginTop: 8,
//     marginBottom: 8,
//   },
//   successText: {
//     marginLeft: 10,
//     color: '#2E7D32',
//     fontSize: 12,
//     fontWeight: '500'
//   },
//   content: {
//     backgroundColor: '#FFF',
//     padding: 16,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   section: {
//     marginBottom: 12,
//     position: 'relative',

//   },
//   plantTypeSection: {
//     zIndex: 3000,
//     position: 'relative',
//     overflow: 'visible',
//   },
//   sectionTitle: {
//     fontSize: 14,
//     color: '#ef4b56',
//     marginBottom: 10,
//     fontWeight: 'bold',
//     letterSpacing: 0.5,
//   },
//   fieldContainer: {
//     marginBottom: 7,
//     position: 'relative',

//   },
//   singleFieldContainer: {
//     flex: 1,
//     position: 'relative',

//   },
//   doubleFieldContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 0,
//     gap: 12,
//     position: 'relative',
//     zIndex: 4000,
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 7,
//     alignItems: 'flex-start',
//   },
//   rowField: {
//     flex: 1,
//   },
//   unitFieldContainer: {
//     width: 80,
//     marginTop: -22,
//   },
//   fieldLabel: {
//     fontSize: 12,
//     color: '#333',
//     marginBottom: 6,
//     fontWeight: '500',
//   },
//   requiredStar: {
//     color: '#ef4b56',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     fontSize: 14,
//     backgroundColor: '#FFF',
//     height: 40,
//     color: '#333',
//   },
//   dropdown: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     height: 30,
//     backgroundColor: '#FFF',
//     paddingHorizontal: 14,
//     justifyContent: 'center',
//   },

//   fixedNextButtonContainer: {
//     position: 'absolute',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     alignItems: 'center',
//     bottom: -40,
//     left: 20,
//     right: 20,
//     zIndex: 999,
//   },

//   saveButton: {
//     backgroundColor: '#ef4b56',
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 25,
//     width: '60%',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     alignItems: 'center',
//   },
//   saveButtonDisabled: {
//     backgroundColor: '#f7a5ab',
//     opacity: 0.7,
//   },
//   saveButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//     letterSpacing: 1,
//   },


// });



import React, { useState, useRef, useEffect } from 'react';
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
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import { Keyboard } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from './axiosInstance';

/* ---------------- TYPES ---------------- */

interface PlantData {
  power_station_name: string;
  pipe_dia_d2: string | null;
  pipe_dia_unit: string | null;
  plant_type: string | null;
  critical_type: string | null;
  plant_mcr: string | null;
  heat_rate_value: string | null;
  heat_rate_unit: string | null;
  production_cost: string | null;
  production_cost_currency: string | null;
  custom_currency: string | null;
  sell_price_per_mwh: string | null;
}

interface PowerStationData {
  stationName?: string;
  pipeDiaD2?: string;
  pipeDiaUnit?: string;
  plantType?: string;
  criticalType?: string;
  plantMCR?: string;
  heatRateValue?: string;
  heatRateUnit?: string;
  currency?: string;
  sellPricePerMWh?: string;
  productionCost?: string;
  productionCostCurrency?: string;
  customCurrency?: string;
  p1Unit?: string;
  t1Unit?: string;
  wcrhUnit?: string;

  p1Value?: string;
  p2Value?: string;
  t1Value?: string;
  t2pValue?: string;
  tcrhValue?: string;
  tmixValue?: string;
  wcrhValue?: string;
  d2Value?: string;
  twValue?: string;
  wwValue?: string;
  p1flValue?: string;
  t1flValue?: string;
  p1flUnit?: string;
  t1flUnit?: string;
  tcrhflValue?: string;
  tcrhflUnit?: String;
  plantcapacityfactor?: string;
  p2flValue?: string;
}

type DropdownItem = {
  label: string;
  value: string;
};

interface CustomDropdownProps {
  open: boolean;
  value: string | null;
  items: DropdownItem[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  placeholder: string;
  zIndex: number;
  onSelect?: (value: string | null) => void;
  useModal?: boolean;
  disabled?: boolean;
}

/* ---------------- CUSTOM DROPDOWN ---------------- */

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  placeholder,
  zIndex,
  onSelect,
  disabled = false,
}) => {
  return (
    <View style={{ zIndex, overflow: 'visible' }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        onChangeValue={onSelect}
        placeholder={placeholder}
        disabled={disabled}

        listMode="SCROLLVIEW"

        flatListProps={{
          nestedScrollEnabled: true,
        }}

        dropDownDirection="BOTTOM"

        zIndex={zIndex}
        zIndexInverse={1000 - zIndex}

        containerStyle={{
          height: 40,
        }}

        style={[
          styles.dropdown,
          {
            minHeight: 40,
            height: 40,
            width: '100%',
          },
        ]}

        textStyle={{
          fontSize: 13,
        }}

        dropDownContainerStyle={{
          borderWidth: 1,
          borderColor: '#E0E0E0',
          borderRadius: 8,
          backgroundColor: '#FFF',
          position: 'absolute',
          top: 42,
          width: '100%',
        }}

        closeAfterSelecting
      />
    </View>
  );
};

/* ---------------- MAIN SCREEN ---------------- */

export default function AdditionalUserInputsScreen() {
  const params = useLocalSearchParams();

  // Check if we're coming back from calculator with data
  const returningFromCalculator = params.fromCalculator === 'true';
  const returnedData = params.powerStationData
    ? JSON.parse(params.powerStationData as string) as PowerStationData
    : {};

  // Form states
  const [errors, setErrors] = useState<any>({});
  const [warnings, setWarnings] = useState<any>({});
  const [powerStationName, setPowerStationName] = useState(
    returnedData.stationName || ''
  );
  const [plantType, setPlantType] = useState<string | null>(
    returnedData.plantType || null
  );
  const [criticalType, setCriticalType] = useState<string | null>(
    returnedData.criticalType || null
  );
  const [plantMCR, setPlantMCR] = useState(
    returnedData.plantMCR || ''
  );
  const [heatRateValue, setHeatRateValue] = useState(
    returnedData.heatRateValue || ''
  );
  const [heatRateUnit, setHeatRateUnit] = useState<string | null>(
    returnedData.heatRateUnit || 'kJ/kW-h'
  );
  const [productionCost, setProductionCost] = useState(
    returnedData.productionCost || ''
  );
  const [productionCostCurrency, setProductionCostCurrency] = useState<string | null>(
    returnedData.productionCostCurrency || returnedData.currency || 'USD'
  );
  const [customCurrency, setCustomCurrency] = useState(
    returnedData.customCurrency || ''
  );
  const [sellPricePerMWh, setSellPricePerMWh] = useState(
    returnedData.sellPricePerMWh || ''
  );

  // D2 (Pipe Diameter) states
  const [pipeDiameter, setPipeDiameter] = useState(
    returnedData.pipeDiaD2 || ''
  );
  const [pipeDiameterUnit, setPipeDiameterUnit] = useState<string | null>(
    returnedData.pipeDiaUnit || 'MM'
  );

  // Renamed: P1FL (was P1)
  const [p1flValue, setP1flValue] = useState(
    returnedData.p1flValue || ''
  );
  const [p1flUnit, setP1flUnit] = useState<string | null>(
    returnedData.p1flUnit || 'barA'
  );

  // New: P2FL state
  const [p2flValue, setP2flValue] = useState(
    returnedData.p2flValue || ''
  );

  const [t1flValue, setT1flValue] = useState(
    returnedData.t1flValue || ''
  );
  const [t1flUnit, setT1flUnit] = useState<string | null>(
    returnedData.t1flUnit || 'deg C'
  );

  // Renamed: TCRHFL (was TCRH@MCR)
  const [tcrhflValue, setTcrhflValue] = useState(
    returnedData.tcrhflValue || ''
  );
  const [tcrhflUnit, setTcrhflUnit] = useState<string | null>(
    'deg C'
  );


  const [plantCapacityFactor, setPlantCapacityFactor] = useState(
    returnedData.plantcapacityfactor || '90'
  );

  // Dropdown states
  const [plantTypeOpen, setPlantTypeOpen] = useState(false);
  const [criticalTypeOpen, setCriticalTypeOpen] = useState(false);
  const [heatRateUnitOpen, setHeatRateUnitOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [pipeDiaUnitOpen, setPipeDiaUnitOpen] = useState(false);
  const [p1Unit, setP1Unit] = useState(returnedData.p1Unit || 'barA');
  const [t1Unit, setT1Unit] = useState(returnedData.t1Unit || 'deg C');
  const [p1flUnitOpen, setP1flUnitOpen] = useState(false);
  const [t1flUnitOpen, setT1flUnitOpen] = useState(false);
  const [tcrhflUnitOpen, setTcrhflUnitOpen] = useState(false);
  const [wcrhUnit, setWcrhUnit] = useState(returnedData.wcrhUnit || 'T/HR');
const [dataRestored, setDataRestored] = useState(false);
  // UI states
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [containerHeight, setContainerHeight] = useState(0);
  const [showHistoryBtn, setShowHistoryBtn] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [currencyItems, setCurrencyItems] = useState<DropdownItem[]>([
    { label: 'USD', value: 'USD' },
    { label: 'Euro', value: 'Euro' },
    { label: 'INR', value: 'INR' },
    { label: 'Custom', value: 'custom' },
  ]);

  // Refs for handling scroll
  const scrollViewRef = useRef<ScrollView>(null);

  /* ---------------- DROPDOWN DATA ---------------- */

  const plantTypeItems: DropdownItem[] = [
    { label: 'Coal-/Oil-Fired', value: 'coal_oil_fired' },
    { label: 'CCPP', value: 'ccpp' },
  ];

  const criticalTypeItems: DropdownItem[] = [
    { label: 'Sub Critical', value: 'subcritical' },
    { label: 'Super Critical', value: 'supercritical' },
  ];

  const heatRateUnitItems: DropdownItem[] = [
    { label: 'kJ/kW-h', value: 'kJ/kW-h' },
    { label: 'Btu/kW-h', value: 'Btu/kW-h' },
    { label: 'Default', value: 'default' },
  ];

  const p1UnitItems = [
    { label: 'barA', value: 'barA' },
    { label: 'psiA', value: 'psiA' },
  ];

  const t1UnitItems = [
    { label: 'deg C', value: 'deg C' },
    { label: 'deg F', value: 'deg F' },
  ];

  const p1flUnitItems = [
    { label: 'barA', value: 'barA' },
    { label: 'psiA', value: 'psiA' },
  ];

  const t1flUnitItems = [
    { label: '°C', value: 'deg C' },
    { label: '°F', value: 'deg F' },
  ];

  const tcrhflUnitItems = [
    { label: '°C', value: 'deg C' },
    { label: '°F', value: 'deg F' },
  ];

  const wcrhUnitItems = [
    { label: 'T/HR', value: 'T/HR' },
    { label: 'KG/S', value: 'KG/S' },
    { label: 'KPPH/HR', value: 'KPPH/HR' },
    { label: 'LB/S', value: 'LB/S' },
  ];

  const pipeDiameterUnitItems: DropdownItem[] = [
    { label: 'MM', value: 'MM' },
    { label: 'IN', value: 'IN' },
  ];

  // Calculator values state to preserve when returning from calculator
  const [calculatorValues, setCalculatorValues] = useState({
    p1Value: '',
    p2Value: '',
    t1Value: '',
    t2pValue: '',
    tcrhValue: '',
    tmixValue: '',
    wcrhValue: '',
    d2Value: '',
    twValue: '',
    wwValue: ''
  });

  /* ---------------- DROPDOWN HANDLERS ---------------- */

  const closeAllDropdowns = () => {
    setPlantTypeOpen(false);
    setCriticalTypeOpen(false);
    setHeatRateUnitOpen(false);
    setCurrencyOpen(false);
    setPipeDiaUnitOpen(false);
    setP1flUnitOpen(false);
    setT1flUnitOpen(false);
    setTcrhflUnitOpen(false);
  };

  const handleOpenDropdown = (dropdownName: string) => {
    closeAllDropdowns();
    switch (dropdownName) {
      case 'plantType':
        setPlantTypeOpen(true);
        break;
      case 'criticalType':
        setCriticalTypeOpen(true);
        break;
      case 'heatRateUnit':
        setHeatRateUnitOpen(true);
        break;
      case 'currency':
        setCurrencyOpen(true);
        break;
      case 'pipeDiaUnit':
        setPipeDiaUnitOpen(true);
        break;
      case 'p1flUnit':
        setP1flUnitOpen(true);
        break;
      case 't1flUnit':
        setT1flUnitOpen(true);
        break;
      case 'tcrhflUnit':
        setTcrhflUnitOpen(true);
        break;
    }
  };



  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

useEffect(() => {
  if (returningFromCalculator && returnedData && Object.keys(returnedData).length > 0 && !dataRestored) {
    console.log("Returned data from calculator:", returnedData);

    setDataRestored(true); // Mark as restored

    setCalculatorValues({
      p1Value: returnedData.p1Value || '',
      p2Value: returnedData.p2Value || '',
      t1Value: returnedData.t1Value || '',
      t2pValue: returnedData.t2pValue || '',
      tcrhValue: returnedData.tcrhValue || '',
      tmixValue: returnedData.tmixValue || '',
      wcrhValue: returnedData.wcrhValue || '',
      d2Value: returnedData.d2Value || '',
      twValue: returnedData.twValue || '',
      wwValue: returnedData.wwValue || '',
    });

    // Restore pipe diameter values
    setPipeDiameter(returnedData.pipeDiaD2 || '');
    setPipeDiameterUnit(returnedData.pipeDiaUnit || 'MM');

    // Restore P1FL values
    setP1flValue(returnedData.p1flValue || '');
    setP1flUnit(returnedData.p1flUnit || 'barA');

    // Restore P2FL values
    setP2flValue(returnedData.p2flValue || '');

    // Restore T1FL values
    setT1flValue(returnedData.t1flValue || '');
    setT1flUnit(returnedData.t1flUnit || 'deg C');

    // Restore TCRHFL values
    setTcrhflValue(returnedData.tcrhflValue || '');
    setTcrhflUnit(returnedData.tcrhflUnit || 'deg C');

    // Restore plant capacity factor
    setPlantCapacityFactor(returnedData.plantcapacityfactor || '90');

    // Restore W-CRH unit
    setWcrhUnit(returnedData.wcrhUnit || 'T/HR');

    // Also restore financial data if needed
    if (returnedData.currency) {
      setProductionCostCurrency(returnedData.currency);
    }
    if (returnedData.sellPricePerMWh) {
      setSellPricePerMWh(returnedData.sellPricePerMWh);
    }
    if (returnedData.productionCost) {
      setProductionCost(returnedData.productionCost);
    }
    if (returnedData.customCurrency) {
      setCustomCurrency(returnedData.customCurrency);
    }

    // Restore heat rate
    if (returnedData.heatRateValue) {
      setHeatRateValue(returnedData.heatRateValue);
    }
    if (returnedData.heatRateUnit) {
      setHeatRateUnit(returnedData.heatRateUnit);
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }
}, [returningFromCalculator, returnedData, dataRestored]);

  /* ---------------- FORM HANDLERS ---------------- */

  // Validate P1FL
  const validateP1FL = (value: string, unit: string | null): { isValid: boolean; warning: string | null } => {
    if (!value.trim()) {
      return { isValid: true, warning: null };
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { isValid: false, warning: null };
    }

    if (unit === 'barA') {
      if (numValue < 80) {
        return { 
          isValid: false, 
          warning: 'HP Bypass inlet pressure out of bounds (LOW) (80-280)' 
        };
      } else if (numValue > 280) {
        return { 
          isValid: false, 
          warning: 'HP Bypass inlet pressure out of bounds (HIGH) (80-280)' 
        };
      }
    } else if (unit === 'psiA') {
      if (numValue < 1160) {
        return { 
          isValid: false, 
          warning: 'HP Bypass inlet pressure out of bounds (LOW) (1160-4060)' 
        };
      } else if (numValue > 4060) {
        return { 
          isValid: false, 
          warning: 'HP Bypass inlet pressure out of bounds (HIGH) (1160-4060)' 
        };
      }
    }

    return { isValid: true, warning: null };
  };

  const handleP1FLChange = (text: string) => {
    setP1flValue(text);
    setErrors((prev: any) => ({ ...prev, p1flValue: null }));
    setWarnings((prev: any) => ({ ...prev, p1flValue: null }));

    const { isValid, warning } = validateP1FL(text, p1flUnit);
    if (!isValid && warning) {
      setWarnings((prev: any) => ({ ...prev, p1flValue: warning }));
    }
  };

  const handleP1FLUnitChange = (value: string | null) => {
    setP1flUnit(value);
    setErrors((prev: any) => ({ ...prev, p1flValue: null }));
    setWarnings((prev: any) => ({ ...prev, p1flValue: null }));

    if (p1flValue.trim()) {
      const { isValid, warning } = validateP1FL(p1flValue, value);
      if (!isValid && warning) {
        setWarnings((prev: any) => ({ ...prev, p1flValue: warning }));
      }
    }
  };

  // Validate P2FL (uses p1flUnit)
  const validateP2FL = (value: string, unit: string | null): { isValid: boolean; warning: string | null } => {
    if (!value.trim()) {
      return { isValid: true, warning: null };
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { isValid: false, warning: null };
    }

    if (unit === 'barA') {
      if (numValue < 20) {
        return { 
          isValid: false, 
          warning: 'HP Bypass outlet pressure out of bounds (LOW) (20-60)' 
        };
      } else if (numValue > 60) {
        return { 
          isValid: false, 
          warning: 'HP Bypass outlet pressure out of bounds (HIGH) (20-60)' 
        };
      }
    } else if (unit === 'psiA') {
      if (numValue < 290) {
        return { 
          isValid: false, 
          warning: 'HP Bypass outlet pressure out of bounds (LOW) (290-870)' 
        };
      } else if (numValue > 870) {
        return { 
          isValid: false, 
          warning: 'HP Bypass outlet pressure out of bounds (HIGH) (290-870)' 
        };
      }
    }

    return { isValid: true, warning: null };
  };

  const handleP2FLChange = (text: string) => {
    setP2flValue(text);
    setErrors((prev: any) => ({ ...prev, p2flValue: null }));
    setWarnings((prev: any) => ({ ...prev, p2flValue: null }));

    const { isValid, warning } = validateP2FL(text, p1flUnit);
    if (!isValid && warning) {
      setWarnings((prev: any) => ({ ...prev, p2flValue: warning }));
    }
  };

  // Validate T1FL
  const validateT1FL = (value: string, unit: string | null): { isValid: boolean; warning: string | null } => {
    if (!value.trim()) {
      return { isValid: true, warning: null };
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { isValid: false, warning: null };
    }

    if (unit === 'deg C') {
      if (numValue < 500) {
        return { 
          isValid: false, 
          warning: 'HP Bypass inlet temperature out of bounds (LOW) (500-630)' 
        };
      } else if (numValue > 630) {
        return { 
          isValid: false, 
          warning: 'HP Bypass inlet temperature out of bounds (HIGH) (500-630)' 
        };
      }
    } else if (unit === 'deg F') {
      if (numValue < 932) {
        return { 
          isValid: false, 
          warning: 'HP Bypass inlet temperature out of bounds (LOW) (932-1166)' 
        };
      } else if (numValue > 1166) {
        return { 
          isValid: false, 
          warning: 'HP Bypass inlet temperature out of bounds (HIGH) (932-1166)' 
        };
      }
    }

    return { isValid: true, warning: null };
  };

  const handleT1FLChange = (text: string) => {
    setT1flValue(text);
    setErrors((prev: any) => ({ ...prev, t1flValue: null }));
    setWarnings((prev: any) => ({ ...prev, t1flValue: null }));

    const { isValid, warning } = validateT1FL(text, t1flUnit);
    if (!isValid && warning) {
      setWarnings((prev: any) => ({ ...prev, t1flValue: warning }));
    }
  };

  const handleT1FLUnitChange = (value: string | null) => {
    setT1flUnit(value);
    setErrors((prev: any) => ({ ...prev, t1flValue: null }));
    setWarnings((prev: any) => ({ ...prev, t1flValue: null }));

    if (t1flValue.trim()) {
      const { isValid, warning } = validateT1FL(t1flValue, value);
      if (!isValid && warning) {
        setWarnings((prev: any) => ({ ...prev, t1flValue: warning }));
      }
    }
  };

  // Validate TCRHFL
  const validateTCRHFL = (value: string, unit: string | null): { isValid: boolean; warning: string | null } => {
    if (!value.trim()) {
      return { isValid: true, warning: null };
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { isValid: false, warning: null };
    }

    if (unit === 'deg C') {
      if (numValue < 300) {
        return { 
          isValid: false, 
          warning: 'CRH temperature out of bounds (LOW) (300-425)' 
        };
      } else if (numValue > 425) {
        return { 
          isValid: false, 
          warning: 'CRH temperature out of bounds (HIGH) (300-425)' 
        };
      }
    } else if (unit === 'deg F') {
      if (numValue < 572) {
        return { 
          isValid: false, 
          warning: 'CRH temperature out of bounds (LOW) (572-797)' 
        };
      } else if (numValue > 797) {
        return { 
          isValid: false, 
          warning: 'CRH temperature out of bounds (HIGH) (572-797)' 
        };
      }
    }

    return { isValid: true, warning: null };
  };

  const handleTCRHFLChange = (text: string) => {
    setTcrhflValue(text);
    setErrors((prev: any) => ({ ...prev, tcrhflValue: null }));
    setWarnings((prev: any) => ({ ...prev, tcrhflValue: null }));

    const { isValid, warning } = validateTCRHFL(text, tcrhflUnit);
    if (!isValid && warning) {
      setWarnings((prev: any) => ({ ...prev, tcrhflValue: warning }));
    }
  };

  const handleTCRHFLUnitChange = (value: string | null) => {
    setTcrhflUnit(value);
    setErrors((prev: any) => ({ ...prev, tcrhflValue: null }));
    setWarnings((prev: any) => ({ ...prev, tcrhflValue: null }));

    if (tcrhflValue.trim()) {
      const { isValid, warning } = validateTCRHFL(tcrhflValue, value);
      if (!isValid && warning) {
        setWarnings((prev: any) => ({ ...prev, tcrhflValue: warning }));
      }
    }
  };

  // Validate Plant Capacity Factor
  const validatePlantCapacityFactor = (value: string): { isValid: boolean; warning: string | null } => {
    if (!value.trim()) {
      return { isValid: true, warning: null };
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { isValid: false, warning: null };
    }

    if (numValue < 10) {
      return { 
        isValid: false, 
        warning: 'TOO LOW – USE DEFAULT VALUE OF 10%' 
      };
    } else if (numValue > 100) {
      return { 
        isValid: false, 
        warning: 'CANNOT EXCEED 100%' 
      };
    }

    return { isValid: true, warning: null };
  };

  const handlePlantCapacityFactorChange = (text: string) => {
    setPlantCapacityFactor(text);
    setErrors((prev: any) => ({ ...prev, plantCapacityFactor: null }));
    setWarnings((prev: any) => ({ ...prev, plantCapacityFactor: null }));

    const { isValid, warning } = validatePlantCapacityFactor(text);
    if (!isValid && warning) {
      setWarnings((prev: any) => ({ ...prev, plantCapacityFactor: warning }));
    }
  };

  const handlePlantTypeChange = (value: string | null) => {
    setPlantType(value);
    if (value !== 'coal_oil_fired') {
      setCriticalType(null);
    }
  };

  const handleCurrencyChange = (value: string | null) => {
    setProductionCostCurrency(value);
    if (value !== 'custom') {
      setCustomCurrency('');
    }
  };

  const handleHeatRateUnitChange = (value: string | null) => {
    setHeatRateUnit(value);
    setWarnings((prev: any) => ({ ...prev, heatRateValue: null }));
    setErrors((prev: any) => ({ ...prev, heatRateValue: null }));
  };

  // Validate pipe diameter
  const validatePipeDiameter = (value: string, unit: string | null): { isValid: boolean; warning: string | null } => {
    if (!value.trim()) {
      return { isValid: true, warning: null };
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { isValid: false, warning: null };
    }

    if (unit === 'MM') {
      if (numValue < 300) {
        return { isValid: false, warning: 'D2 out of bounds (LOW) (300-600)' };
      } else if (numValue > 600) {
        return { isValid: false, warning: 'D2 out of bounds (HIGH) (300-600)' };
      }
    } else if (unit === 'IN') {
      if (numValue < 11.8) {
        return { isValid: false, warning: 'D2 out of bounds (LOW) (11.8-23.6)' };
      } else if (numValue > 23.6) {
        return { isValid: false, warning: 'D2 out of bounds (HIGH) (11.8-23.6)' };
      }
    }

    return { isValid: true, warning: null };
  };

  const handlePipeDiameterChange = (text: string) => {
    setPipeDiameter(text);
    setErrors((prev: any) => ({ ...prev, pipeDiameter: null }));
    setWarnings((prev: any) => ({ ...prev, pipeDiameter: null }));

    const { isValid, warning } = validatePipeDiameter(text, pipeDiameterUnit);
    if (!isValid && warning) {
      setWarnings((prev: any) => ({ ...prev, pipeDiameter: warning }));
    }
  };

  const handlePipeDiameterUnitChange = (value: string | null) => {
    setPipeDiameterUnit(value);
    setErrors((prev: any) => ({ ...prev, pipeDiameter: null }));
    setWarnings((prev: any) => ({ ...prev, pipeDiameter: null }));

    if (pipeDiameter.trim()) {
      const { isValid, warning } = validatePipeDiameter(pipeDiameter, value);
      if (!isValid && warning) {
        setWarnings((prev: any) => ({ ...prev, pipeDiameter: warning }));
      }
    }
  };

  const validatePlantMCR = (value: string): { isValid: boolean; warning: string | null } => {
    if (!value.trim()) {
      return { isValid: false, warning: null };
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { isValid: false, warning: null };
    }

    if (numValue < 100) {
      return { isValid: false, warning: 'Plant MCR out of bounds (LOW) (100-1200)' };
    } else if (numValue > 1200) {
      return { isValid: false, warning: 'Plant MCR out of bounds (HIGH) (100-1200)' };
    }

    return { isValid: true, warning: null };
  };

  const validateHeatRate = (value: string, unit: string | null): { isValid: boolean; warning: string | null } => {
    if (!value.trim()) {
      return { isValid: false, warning: null };
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { isValid: false, warning: null };
    }

    if (unit === 'kJ/kW-h') {
      if (numValue < 6000) {
        return { isValid: false, warning: 'Heat Rate out of bounds (LOW) (6000-12000)' };
      } else if (numValue > 12000) {
        return { isValid: false, warning: 'Heat Rate out of bounds (HIGH) (6000-12000)' };
      }
    } else if (unit === 'Btu/kW-h') {
      if (numValue < 5687) {
        return { isValid: false, warning: 'Heat Rate out of bounds (LOW) (5687-11374)' };
      } else if (numValue > 11374) {
        return { isValid: false, warning: 'Heat Rate out of bounds (HIGH) (5687-11374)' };
      }
    }

    return { isValid: true, warning: null };
  };

  const getDefaultHeatRate = (): string => {
    if (plantType === 'ccpp') {
      return '7500';
    } else if (criticalType === 'supercritical') {
      return '8400';
    }
    return '9500';
  };

  const handlePlantMCRChange = (text: string) => {
    setPlantMCR(text);
    setErrors((prev: any) => ({ ...prev, plantMCR: null }));
    setWarnings((prev: any) => ({ ...prev, plantMCR: null }));

    const { isValid, warning } = validatePlantMCR(text);
    if (!isValid && warning) {
      setWarnings((prev: any) => ({ ...prev, plantMCR: warning }));
    }
  };

  const handleHeatRateChange = (text: string) => {
    setHeatRateValue(text);
    setErrors((prev: any) => ({ ...prev, heatRateValue: null }));
    setWarnings((prev: any) => ({ ...prev, heatRateValue: null }));

    const { isValid, warning } = validateHeatRate(text, heatRateUnit);
    if (!isValid && warning) {
      setWarnings((prev: any) => ({ ...prev, heatRateValue: warning }));
    }
  };

  const handleHeatRateUnitSelect = (value: string | null) => {
    setHeatRateUnit(value);
    setWarnings((prev: any) => ({ ...prev, heatRateValue: null }));
    setErrors((prev: any) => ({ ...prev, heatRateValue: null }));

    if (value === 'default') {
      const defaultVal = getDefaultHeatRate();
      setHeatRateValue(defaultVal);
    } else {
      if (heatRateValue.trim()) {
        const { isValid, warning } = validateHeatRate(heatRateValue, value);
        if (!isValid && warning) {
          setWarnings((prev: any) => ({ ...prev, heatRateValue: warning }));
        }
      }
    }
  };

  const clearAllFormFields = () => {
    setPowerStationName('');
    setPlantMCR('');
    setHeatRateValue('');
    setProductionCost('');
    setCustomCurrency('');
    setSellPricePerMWh('');
    setPipeDiameter('');
    setP1flValue('');
    setP2flValue('');
    setT1flValue('');
    setTcrhflValue('');
    setPlantCapacityFactor('90');
    setPlantType(null);
    setCriticalType(null);
    setHeatRateUnit('kJ/kW-h');
    setProductionCostCurrency('USD');
    setPipeDiameterUnit('MM');
    setP1flUnit('barA');
    setT1flUnit('deg C');
    setTcrhflUnit('deg C');
    setErrors({});
    setWarnings({});
    closeAllDropdowns();
  };

  const prepareApiData = (): PlantData => {
    return {
      power_station_name: powerStationName.trim(),
      pipe_dia_d2: pipeDiameter || null,
      pipe_dia_unit: pipeDiameterUnit || null,
      plant_type: plantType || null,
      critical_type: criticalType || null,
      plant_mcr: plantMCR || null,
      heat_rate_value: heatRateValue || null,
      heat_rate_unit: heatRateUnit || null,
      production_cost: productionCost || null,
      production_cost_currency: productionCostCurrency || null,
      custom_currency: customCurrency || null,
      sell_price_per_mwh: sellPricePerMWh || null,
      p1flValue: p1flValue || null,
      p1flUnit: p1flUnit || null,
      p2flValue: p2flValue || null,
      t1flValue: t1flValue || null,
      t1fl: t1flValue || null,
      tcrhflValue: tcrhflValue || null,
      tcrhflUnit: tcrhflUnit || null,
      plantCapacityFactor: plantCapacityFactor || null,
    };
  };

  const validateForm = () => {
    let newErrors: any = {};
    let newWarnings: any = {};

    if (!powerStationName.trim()) {
      newErrors.powerStationName = 'Power station name is required';
    }

    if (!plantType) {
      newErrors.plantType = 'Plant type is required';
    }

    if (plantType === 'coal_oil_fired' && !criticalType) {
      newErrors.criticalType = 'Critical type is required';
    }

    if (!plantMCR.trim()) {
      newErrors.plantMCR = 'Plant MCR is required';
    } else if (isNaN(Number(plantMCR))) {
      newErrors.plantMCR = 'Enter valid MCR';
    } else {
      const { isValid, warning } = validatePlantMCR(plantMCR);
      if (!isValid && warning) {
        newWarnings.plantMCR = warning;
      }
    }

    // Validate P1FL
    if (p1flValue.trim()) {
      const { isValid, warning } = validateP1FL(p1flValue, p1flUnit);
      if (!isValid && warning) {
        newWarnings.p1flValue = warning;
      }
    }

    // Validate P2FL (uses p1flUnit)
    if (p2flValue.trim()) {
      const { isValid, warning } = validateP2FL(p2flValue, p1flUnit);
      if (!isValid && warning) {
        newWarnings.p2flValue = warning;
      }
    }

    // Validate T1FL
    if (t1flValue.trim()) {
      const { isValid, warning } = validateT1FL(t1flValue, t1flUnit);
      if (!isValid && warning) {
        newWarnings.t1flValue = warning;
      }
    }

    // Validate TCRHFL
    if (tcrhflValue.trim()) {
      const { isValid, warning } = validateTCRHFL(tcrhflValue, tcrhflUnit);
      if (!isValid && warning) {
        newWarnings.tcrhflValue = warning;
      }
    }

    // Validate Plant Capacity Factor
    if (plantCapacityFactor.trim()) {
      const { isValid, warning } = validatePlantCapacityFactor(plantCapacityFactor);
      if (!isValid && warning) {
        newWarnings.plantCapacityFactor = warning;
      }
    }

    if (!heatRateValue.trim()) {
      if (heatRateUnit !== 'default') {
        newErrors.heatRateValue = 'Heat rate is required';
      }
    } else if (isNaN(Number(heatRateValue))) {
      newErrors.heatRateValue = 'Enter valid heat rate';
    } else {
      if (heatRateUnit !== 'default') {
        const { isValid, warning } = validateHeatRate(heatRateValue, heatRateUnit);
        if (!isValid && warning) {
          newWarnings.heatRateValue = warning;
        }
      }
    }

    if (!productionCost.trim()) {
      setProductionCost('50');
      setProductionCostCurrency('USD');
    }
    else if (isNaN(Number(productionCost))) {
      newErrors.productionCost = 'Enter valid cost';
    }

    if (!productionCostCurrency) {
      newErrors.productionCostCurrency = 'Currency required';
    }

    if (
      productionCostCurrency === 'custom' &&
      !customCurrency.trim()
    ) {
      newErrors.customCurrency = 'Enter custom currency';
    }

    if (!sellPricePerMWh.trim()) {
      newErrors.sellPricePerMWh = 'Sell price required';
    } else if (isNaN(Number(sellPricePerMWh))) {
      newErrors.sellPricePerMWh = 'Enter valid sell price';
    }

    // Validate pipe diameter if provided
    if (pipeDiameter.trim()) {
      const { isValid, warning } = validatePipeDiameter(pipeDiameter, pipeDiameterUnit);
      if (!isValid && warning) {
        newWarnings.pipeDiameter = warning;
      }
    }

    setErrors(newErrors);
    setWarnings(newWarnings);

    return Object.keys(newErrors).length === 0;
  };

  const goToCalculator = () => {
    if (!validateForm()) {
      if (Object.keys(errors).length === 0 && Object.keys(warnings).length > 0) {
        Alert.alert(
          'Warning',
          'There are some values out of recommended range. Do you want to continue?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Continue',
              onPress: () => {
                router.push({
                  pathname: "/CalculatorScreen",
                  params: {
                    powerStationData: JSON.stringify({
                      stationName: powerStationName,
                      pipeDiaD2: pipeDiameter,
                      pipeDiaUnit: pipeDiameterUnit,
                      plantType: plantType,
                      criticalType: criticalType,
                      plantMCR: plantMCR,
                      heatRateValue: heatRateValue,
                      heatRateUnit: heatRateUnit,
                      currency: productionCostCurrency === "custom" ? customCurrency : productionCostCurrency,
                      sellPricePerMWh: sellPricePerMWh,
                      productionCost: productionCost,
                      productionCostCurrency: productionCostCurrency,
                      customCurrency: customCurrency,
                      p1Value: calculatorValues.p1Value,
                      p2Value: calculatorValues.p2Value,
                      p1flValue: p1flValue,
                      p2flValue: p2flValue,
                      t1flValue: t1flValue,
                      t2pValue: calculatorValues.t2pValue,
                      tcrhValue: calculatorValues.tcrhValue,
                      tcrhflValue: tcrhflValue,
                      tcrhflUnit: tcrhflUnit,
                      tmixValue: calculatorValues.tmixValue,
                      wcrhValue: calculatorValues.wcrhValue,
                      d2Value: calculatorValues.d2Value,
                      twValue: calculatorValues.twValue,
                      wwValue: calculatorValues.wwValue,
                      p1flUnit: p1flUnit,
                      p1Unit: p1Unit,
                      t1Unit: t1Unit,
                      t1flUnit: t1flUnit,
                      wcrhUnit: wcrhUnit,
                      plantCapacityFactor: plantCapacityFactor,
                    }),
                  },
                });
              }
            }
          ]
        );
        return;
      }
      return;
    }

    router.push({
      pathname: "/CalculatorScreen",
      params: {
        powerStationData: JSON.stringify({
          stationName: powerStationName,
          pipeDiaD2: pipeDiameter,
          pipeDiaUnit: pipeDiameterUnit,
          plantType: plantType,
          criticalType: criticalType,
          plantMCR: plantMCR,
          heatRateValue: heatRateValue,
          heatRateUnit: heatRateUnit,
          currency: productionCostCurrency === "custom" ? customCurrency : productionCostCurrency,
          sellPricePerMWh: sellPricePerMWh,
          productionCost: productionCost,
          productionCostCurrency: productionCostCurrency,
          customCurrency: customCurrency,
          p1Value: calculatorValues.p1Value,
          p2Value: calculatorValues.p2Value,
          p1flValue: p1flValue,
          p2flValue: p2flValue,
          t1flValue: t1flValue,
          t2pValue: calculatorValues.t2pValue,
          tcrhValue: calculatorValues.tcrhValue,
          tcrhflValue: tcrhflValue,
          tcrhflUnit: tcrhflUnit,
          tmixValue: calculatorValues.tmixValue,
          wcrhValue: calculatorValues.wcrhValue,
          d2Value: calculatorValues.d2Value,
          twValue: calculatorValues.twValue,
          wwValue: calculatorValues.wwValue,
          p1flUnit: p1flUnit,
          p1Unit: p1Unit,
          t1Unit: t1Unit,
          t1flUnit: t1flUnit,
          wcrhUnit: wcrhUnit,
          plantCapacityFactor: plantCapacityFactor,
        }),
      },
    });
  };



  /* ---------------- JSX ---------------- */

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          onScrollBeginDrag={closeAllDropdowns}
          keyboardDismissMode="on-drag"
          bounces={false}
        >

          {/* HEADER with Plant Configuration */}
          <View style={styles.header}>

            <TouchableOpacity
              style={styles.headerNextTextContainer}
              onPress={goToCalculator}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.headerNextText}>Next</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Plant Configuration</Text>
            <Text style={styles.headerSubtitle}>Additional Plant Information</Text>
          </View>


          {/* SUCCESS MESSAGE */}
          {showSuccess && (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          {/* CONTENT */}
          <View
            style={styles.content}
            onStartShouldSetResponder={() => true}
            onResponderGrant={closeAllDropdowns}
          >
            {/* ---------------- BASIC INFORMATION ---------------- */}
            <View style={[styles.section, { zIndex: 6000, marginBottom: -10 }]}>
              <Text style={styles.sectionTitle}>BASIC INFORMATION</Text>

              {/* Name of Power Station */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  Name of Power Station <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.powerStationName && styles.errorInput
                  ]}
                  value={powerStationName}
                  onChangeText={(text) => {
                    setPowerStationName(text);
                    setErrors((prev: any) => ({ ...prev, powerStationName: null }));
                  }}
                  placeholder="Enter Name of Power station"
                  placeholderTextColor="#999"
                  onFocus={closeAllDropdowns}
                />
                {errors.powerStationName && (
                  <Text style={styles.errorText}>{errors.powerStationName}</Text>
                )}
              </View>
            </View>

            {/* ---------------- PLANT SPECIFICATIONS ---------------- */}
            <View style={[styles.section, { zIndex: 70, marginTop: 10 }]}>
              <Text style={styles.sectionTitle}>PLANT SPECIFICATIONS</Text>

              {/* Plant MCR, Heat Rate, and Heat Rate Unit in same row */}
              <View style={styles.rowContainer}>
                <View style={[styles.rowField, { flex: 0.3, zIndex: 400 }]}>
                  <Text style={styles.fieldLabel}>Plant MCR <Text style={styles.requiredStar}>*</Text></Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.plantMCR && styles.errorInput,
                      warnings.plantMCR && styles.warningInput
                    ]}
                    value={plantMCR}
                    onChangeText={handlePlantMCRChange}
                    placeholder="Enter MCR"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                  {errors.plantMCR && (
                    <Text style={styles.errorText}>{errors.plantMCR}</Text>
                  )}
                  {warnings.plantMCR && !errors.plantMCR && (
                    <Text style={styles.warningText}>{warnings.plantMCR}</Text>
                  )}
                </View>

                <View
                  style={[
                    styles.rowField,
                    {
                      flex: 0.65,
                      zIndex: 3000,
                      elevation: 3000,
                    },
                  ]}
                >
                  <Text style={styles.fieldLabel}>Heat Rate <Text style={styles.requiredStar}>*</Text></Text>
                  <View style={styles.doubleFieldContainer}>
                    <View style={styles.singleFieldContainer}>
                      <TextInput
                        style={[
                          styles.input,
                          errors.heatRateValue && styles.errorInput,
                          warnings.heatRateValue && styles.warningInput
                        ]}
                        value={heatRateValue}
                        onChangeText={handleHeatRateChange}
                        placeholder="Enter Value"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        editable={heatRateUnit !== 'default'}
                      />
                      {errors.heatRateValue && (
                        <Text style={styles.errorText}>{errors.heatRateValue}</Text>
                      )}
                      {warnings.heatRateValue && !errors.heatRateValue && (
                        <Text style={styles.warningText}>{warnings.heatRateValue}</Text>
                      )}
                    </View>

                    <View style={[styles.unitFieldContainer, { flex: 0.6 }]}>
                      <Text style={styles.fieldLabel}>Unit</Text>
                      <DropDownPicker
                        open={heatRateUnitOpen}
                        value={heatRateUnit}
                        items={heatRateUnitItems}
                        setOpen={setHeatRateUnitOpen}
                        setValue={(callback) => {
                          const value = callback(heatRateUnit);
                          handleHeatRateUnitSelect(value);
                        }}
                        listMode="SCROLLVIEW"
                        dropDownDirection="BOTTOM"

                        zIndex={3000}
                        zIndexInverse={100}

                        containerStyle={{
                          height: 35,
                          width: '100%',
                        }}
                        style={{
                          minHeight: 38,
                          height: 38,
                          borderColor: '#E0E0E0',
                          borderRadius: 8,
                        }}


                        dropDownContainerStyle={{
                          position: 'absolute',
                          top: 40,
                          width: '100%',
                          borderWidth: 1,
                          borderColor: '#E0E0E0',
                          borderRadius: 8,
                          backgroundColor: '#FFF',
                          elevation: 3000,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* P1FL and T1FL in same row */}
              <View style={[styles.rowContainer, { marginTop: 5 }]}>
                {/* P1FL (HP Inlet) */}
                <View style={[styles.rowField, {
                  flex: 0.5, zIndex: 2900,
                  elevation: 2900,
                }]}>
                  <Text style={styles.fieldLabel}>P1FL (HP Inlet)</Text>
                  <View style={styles.doubleFieldContainer}>
                    <View style={styles.singleFieldContainer}>
                      <TextInput
                        style={[
                          styles.input,
                          warnings.p1flValue && styles.warningInput
                        ]}
                        value={p1flValue}
                        onChangeText={handleP1FLChange}
                        placeholder="Enter P1FL"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                      />
                      {warnings.p1flValue && (
                        <Text style={styles.warningText}>{warnings.p1flValue}</Text>
                      )}
                    </View>

                    <View style={[styles.unitFieldContainer, { flex: 0.8 }]}>
                      <Text style={styles.fieldLabel}>  Unit</Text>
                      <DropDownPicker
                        open={p1flUnitOpen}
                        value={p1flUnit}
                        items={p1flUnitItems}
                        setOpen={setP1flUnitOpen}
                        setValue={(callback) => {
                          const value = callback(p1flUnit);
                          handleP1FLUnitChange(value);
                        }}
                        listMode="SCROLLVIEW"
                        dropDownDirection="BOTTOM"

                        zIndex={2900}
                        zIndexInverse={100}

                        containerStyle={{
                          height: 30,
                          width: '100%',
                        }}

                        style={{
                          minHeight: 38,
                          height: 38,
                          borderColor: '#E0E0E0',
                          borderRadius: 8,
                        }}

                        dropDownContainerStyle={{
                          position: 'absolute',
                          top: 42,
                          width: '100%',
                          borderWidth: 1,
                          borderColor: '#E0E0E0',
                          borderRadius: 8,
                          backgroundColor: '#FFF',
                          elevation: 2900,
                        }}
                      />
                    </View>
                  </View>
                </View>

                {/* T1FL */}
                <View style={[styles.rowField, {
                  marginLeft: 12, flex: 0.5, zIndex: 2800,
                  elevation: 2800,
                }]}>
                  <Text style={styles.fieldLabel}>T1FL</Text>
                  <View style={styles.doubleFieldContainer}>
                    <View style={styles.singleFieldContainer}>
                      <TextInput
                        style={[
                          styles.input,
                          warnings.t1flValue && styles.warningInput
                        ]}
                        value={t1flValue}
                        onChangeText={handleT1FLChange}
                        placeholder="Enter T1FL"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                      />
                      {warnings.t1flValue && (
                        <Text style={styles.warningText}>{warnings.t1flValue}</Text>
                      )}
                    </View>

                    <View style={[styles.unitFieldContainer, { flex: 0.65 }]}>
                      <Text style={styles.fieldLabel}>Unit</Text>
                      <DropDownPicker
                        open={t1flUnitOpen}
                        value={t1flUnit}
                        items={t1flUnitItems}
                        setOpen={setT1flUnitOpen}
                        setValue={(callback) => {
                          const value = callback(t1flUnit);
                          handleT1FLUnitChange(value);
                        }}
                        listMode="SCROLLVIEW"
                        dropDownDirection="BOTTOM"

                        zIndex={2800}
                        zIndexInverse={100}

                        containerStyle={{
                          height: 40,
                          width: '100%',
                        }}
                        style={{
                          minHeight: 38,
                          height: 38,
                          borderColor: '#E0E0E0',
                          borderRadius: 8,
                        }}
                        dropDownContainerStyle={{
                          position: 'absolute',
                          top: 42,
                          width: '100%',
                          borderWidth: 1,
                          borderColor: '#E0E0E0',
                          borderRadius: 8,
                          backgroundColor: '#FFF',
                          elevation: 2800,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* TCRHFL and Diameter (D2) in same row */}
              <View style={[styles.rowContainer, { marginTop: 5 }]}>
                {/* TCRHFL */}
                <View
                  style={[
                    styles.rowField,
                    {
                      flex: 0.5,
                      zIndex: 2600,
                      elevation: 2600,
                    },
                  ]}
                >
                  <Text style={styles.fieldLabel}>TCRHFL</Text>
                  <View style={styles.doubleFieldContainer}>
                    <View style={styles.singleFieldContainer}>
                      <TextInput
                        style={[
                          styles.input,
                          warnings.tcrhflValue && styles.warningInput
                        ]}
                        value={tcrhflValue}
                        onChangeText={handleTCRHFLChange}
                        placeholder="Enter TCRHFL"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                      />
                      {warnings.tcrhflValue && (
                        <Text style={styles.warningText}>{warnings.tcrhflValue}</Text>
                      )}
                    </View>

                    <View style={[styles.unitFieldContainer, { flex: 0.55 }]}>
                      <Text style={styles.fieldLabel}>Unit</Text>
                      <DropDownPicker
                        open={tcrhflUnitOpen}
                        value={tcrhflUnit}
                        items={tcrhflUnitItems}
                        setOpen={(open) => {
                          if (open) {
                            closeAllDropdowns();
                            setTcrhflUnitOpen(true);
                          } else {
                            setTcrhflUnitOpen(false);
                          }
                        }}
                        setValue={(callback) => {
                          const value = callback(tcrhflUnit);
                          handleTCRHFLUnitChange(value);
                        }}

                        listMode="SCROLLVIEW"
                        dropDownDirection="BOTTOM"

                        zIndex={2600}
                        zIndexInverse={100}

                        containerStyle={{
                          height: 40,
                          width: '100%',
                        }}

                        style={[
                          styles.dropdown,
                          {
                            minHeight: 40,
                            height: 40,
                          },
                        ]}

                        dropDownContainerStyle={{
                          borderWidth: 1,
                          borderColor: '#E0E0E0',
                          borderRadius: 8,
                          backgroundColor: '#FFF',
                          position: 'absolute',
                          top: 42,
                          width: '100%',
                          elevation: 2600,
                        }}
                      />
                    </View>
                  </View>
                </View>

                {/* Diameter (D2) */}
                <View style={[styles.rowField, { marginLeft: 12, flex: 0.5, zIndex: 2500 }]}>
                  <Text style={styles.fieldLabel}>Diameter (D2)</Text>
                  <View style={styles.doubleFieldContainer}>
                    <View style={styles.singleFieldContainer}>
                      <TextInput
                        style={[
                          styles.input,
                          warnings.pipeDiameter && styles.warningInput
                        ]}
                        value={pipeDiameter}
                        onChangeText={handlePipeDiameterChange}
                        placeholder="Enter Diameter"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                      />
                      {warnings.pipeDiameter && !errors.pipeDiameter && (
                        <Text style={styles.warningText}>{warnings.pipeDiameter}</Text>
                      )}
                    </View>

                    <View style={[styles.unitFieldContainer, { flex: 0.7 }]}>
                      <Text style={styles.fieldLabel}>Unit</Text>
                      <DropDownPicker
                        open={pipeDiaUnitOpen}
                        value={pipeDiameterUnit}
                        items={pipeDiameterUnitItems}
                        setOpen={setPipeDiaUnitOpen}
                        setValue={(callback) => {
                          const value = callback(pipeDiameterUnit);
                          handlePipeDiameterUnitChange(value);
                        }}
                        listMode="SCROLLVIEW"
                        containerStyle={{
                          height: 40,
                          width: '100%',
                        }}
                        style={[
                          styles.dropdown,
                          {
                            minHeight: 40,
                            height: 40,
                          },
                        ]}
                        textStyle={{
                          fontSize: 13,
                        }}
                        dropDownContainerStyle={{
                          borderWidth: 1,
                          borderColor: '#E0E0E0',
                          borderRadius: 8,
                          backgroundColor: '#FFF',
                          position: 'absolute',
                          top: 42,
                          width: '100%',
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* P2FL, Plant Type, and Plant Capacity Factor in same row */}
              <View style={[styles.rowContainer, { marginTop: 5 }]}>
                {/* P2FL - First in the row */}
                <View style={[styles.rowField, { flex: 0.28, zIndex: 2850 }]}>
                  <Text style={styles.fieldLabel}>P2FL</Text>
                  <TextInput
                    style={[
                      styles.input,
                      warnings.p2flValue && styles.warningInput
                    ]}
                    value={p2flValue}
                    onChangeText={handleP2FLChange}
                    placeholder="Enter P2FL"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                  {warnings.p2flValue && (
                    <Text style={styles.warningText}>{warnings.p2flValue}</Text>
                  )}
                </View>

                {/* Plant Type - Second in the row */}
                <View
                  style={[
                    styles.rowField,
                    {
                      marginLeft: 8,
                      flex: 0.3,
                      zIndex: plantTypeOpen ? 4000 : 1200,
                    },
                  ]}
                >
                  <Text style={styles.fieldLabel}>Plant Type <Text style={styles.requiredStar}>*</Text></Text>
                  <CustomDropdown
                    open={plantTypeOpen}
                    value={plantType}
                    items={plantTypeItems}
                    setOpen={(open) =>
                      open
                        ? handleOpenDropdown('plantType')
                        : setPlantTypeOpen(false)
                    }
                    setValue={setPlantType}
                    placeholder="Select"
                    zIndex={3000}
                    onSelect={handlePlantTypeChange}
                  />
                  {errors.plantType && (
                    <Text style={styles.errorText}>{errors.plantType}</Text>
                  )}
                </View>

                {/* Plant Capacity Factor - Third in the row */}
                <View style={[styles.rowField, { marginLeft: 8, flex: 0.42 }]}>
                  <Text style={styles.fieldLabel}>Plant Capacity Factor (%)</Text>
                  <TextInput
                    style={[
                      styles.input,
                      warnings.plantCapacityFactor && styles.warningInput
                    ]}
                    value={plantCapacityFactor}
                    onChangeText={handlePlantCapacityFactorChange}
                    placeholder="90"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                  {warnings.plantCapacityFactor && (
                    <Text style={styles.warningText}>{warnings.plantCapacityFactor}</Text>
                  )}
                </View>
              </View>

              {/* Boiler Type - Full width row, shown conditionally */}
              {plantType === 'coal_oil_fired' && (
                <View style={[styles.fieldContainer, { marginTop: 5, zIndex: 2000 }]}>
                  <Text style={styles.fieldLabel}>Boiler Type <Text style={styles.requiredStar}>*</Text></Text>
                  <CustomDropdown
                    open={criticalTypeOpen}
                    value={criticalType}
                    items={criticalTypeItems}
                    setOpen={(open) =>
                      open
                        ? handleOpenDropdown('criticalType')
                        : setCriticalTypeOpen(false)
                    }
                    setValue={setCriticalType}
                    placeholder="Select"
                    zIndex={2000}
                  />
                  {errors.criticalType && (
                    <Text style={styles.errorText}>{errors.criticalType}</Text>
                  )}
                </View>
              )}
            </View>

            {/* ---------------- FINANCIAL INFORMATION ---------------- */}
            <View style={[styles.section, { zIndex: 60, marginTop: -10 }]}>
              <Text style={styles.sectionTitle}>FINANCIAL INFORMATION</Text>

              {/* Production Cost and Currency */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Production Cost (per MW-h) <Text style={styles.requiredStar}>*</Text></Text>

                <View style={styles.doubleFieldContainer}>
                  <View style={styles.singleFieldContainer}>
                    <Text style={styles.subLabel}>Cost</Text>
                    <TextInput
                      style={[
                        styles.input,
                        errors.productionCost && styles.errorInput
                      ]}
                      value={productionCost}
                      onChangeText={(text) => {
                        setProductionCost(text);
                        setErrors((prev: any) => ({ ...prev, productionCost: null }));
                      }}
                      placeholder="Enter Cost"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                    {errors.productionCost && (
                      <Text style={styles.errorText}>{errors.productionCost}</Text>
                    )}
                  </View>

                  <View style={styles.singleFieldContainer}>
                    <Text style={styles.subLabel}>Currency</Text>
                    <DropDownPicker
                      open={currencyOpen}
                      value={productionCostCurrency}
                      items={[
                        { label: "USD", value: "USD" },
                        { label: "Euro", value: "Euro" },
                        { label: "INR", value: "INR" },
                        { label: "Custom", value: "custom" },
                      ]}
                      setOpen={setCurrencyOpen}
                      setValue={(callback) => {
                        const value = callback(productionCostCurrency);
                        setProductionCostCurrency(value);
                      }}
                      setItems={setCurrencyItems}

                      listMode="SCROLLVIEW"

                      containerStyle={{
                        height: 38,
                      }}

                      style={[
                        styles.dropdown,
                        {
                          minHeight: 38,
                          height: 38,
                        },
                      ]}

                      textStyle={{
                        fontSize: 12,
                      }}

                      listItemLabelStyle={{
                        fontSize: 12,
                      }}

                      listItemContainerStyle={{
                        height: 32,
                      }}

                      dropDownContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        borderRadius: 8,
                        backgroundColor: '#FFF',
                        elevation: 1000,
                        zIndex: 1000,
                        position: 'absolute',
                        top: 42,
                        width: '100%',
                      }}
                    />
                    {errors.productionCostCurrency && (
                      <Text style={styles.errorText}>
                        {errors.productionCostCurrency}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {productionCostCurrency === 'custom' && (
                <View style={[styles.fieldContainer, { marginTop: -7 }]}>
                  <Text style={styles.fieldLabel}>Custom Currency <Text style={styles.requiredStar}>*</Text></Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.customCurrency && styles.errorInput
                    ]}
                    value={customCurrency}
                    onChangeText={(text) => {
                      setCustomCurrency(text);
                      setErrors((prev: any) => ({ ...prev, customCurrency: null }));
                    }}
                    placeholder="Enter custom currency"
                    placeholderTextColor="#999"
                  />
                  {errors.customCurrency && (
                    <Text style={styles.errorText}>{errors.customCurrency}</Text>
                  )}
                </View>
              )}

              {/* Sell Price */}
              <View style={[styles.fieldContainer, { marginTop: -5 }]}>
                <Text style={styles.fieldLabel}>
                  Sell Price ({productionCostCurrency === "custom"
                    ? customCurrency || "Custom"
                    : productionCostCurrency} / MW-h) <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.sellPricePerMWh && styles.errorInput
                  ]}
                  value={sellPricePerMWh}
                  onChangeText={(text) => {
                    setSellPricePerMWh(text);
                    setErrors((prev: any) => ({ ...prev, sellPricePerMWh: null }));
                  }}
                  placeholder="Enter Sell Price"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                {errors.sellPricePerMWh && (
                  <Text style={styles.errorText}>{errors.sellPricePerMWh}</Text>
                )}
              </View>
            </View>


          </View>
        </ScrollView>

        {/* FLOATING HISTORY BUTTON */}
        {!isKeyboardVisible && (
          <TouchableOpacity
            style={styles.floatingButton}
            activeOpacity={0.8}
            onPress={() => router.push('/ViewHistoryScreen')}
          >
            <Ionicons name="time-outline" size={20} color="#fff" />
            <Text style={styles.floatingButtonText}>View History</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerNextTextContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
  },


  headerNextText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorInput: {
    borderColor: 'red',
  },
  warningInput: {
    borderColor: 'red',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 25,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4b56',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 22,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1000,
    maxWidth: 160,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 11,
    marginTop: 2,
  },
  warningText: {
    color: 'red',
    fontSize: 11,
    marginTop: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  header: {
    backgroundColor: '#ef4b56',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  subLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 8,
  },
  successText: {
    marginLeft: 10,
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '500'
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  section: {
    marginBottom: 12,
    position: 'relative',

  },
  plantTypeSection: {
    zIndex: 3000,
    position: 'relative',
    overflow: 'visible',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#ef4b56',
    marginBottom: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  fieldContainer: {
    marginBottom: 7,
    position: 'relative',

  },
  singleFieldContainer: {
    flex: 0.6,
    position: 'relative',

  },
  doubleFieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    gap: 12,
    position: 'relative',
    zIndex: 4000,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
    alignItems: 'flex-start',
  },
  rowField: {
    flex: 1,
    position: 'relative',
    overflow: 'visible',
  },
  unitFieldContainer: {
    width: 80,
    marginTop: -22,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  requiredStar: {
    color: '#ef4b56',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#FFF',
    height: 40,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 30,
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },

  fixedNextButtonContainer: {
    position: 'absolute',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    bottom: -40,
    left: 20,
    right: 20,
    zIndex: 999,
  },

  saveButton: {
    backgroundColor: '#ef4b56',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '60%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#f7a5ab',
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },


});