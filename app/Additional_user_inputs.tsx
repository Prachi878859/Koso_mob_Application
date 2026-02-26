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
import { router } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import { Keyboard } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from './axiosInstance'; // Adjust the path as needed

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
        dropDownDirection="BOTTOM"
        nestedScrollEnabled={true}
        zIndex={zIndex}
        zIndexInverse={1000 - zIndex}
        style={[styles.dropdown, { height: 50, width: '100%' }]}
        dropDownContainerStyle={{
          borderWidth: 1,
          borderColor: '#E0E0E0',
          borderRadius: 8,
          backgroundColor: '#FFF',
          elevation: zIndex,
          zIndex: zIndex,
        }}
        closeAfterSelecting
      />
    </View>
  );
};

/* ---------------- MAIN SCREEN ---------------- */

export default function AdditionalUserInputsScreen() {
  // Form states
  const [errors, setErrors] = useState<any>({});
  const [warnings, setWarnings] = useState<any>({});
  const [powerStationName, setPowerStationName] = useState('');
  const [pipeDiaD2, setPipeDiaD2] = useState('');
  const [pipeDiaUnit, setPipeDiaUnit] = useState<string | null>('MM');
  const [plantType, setPlantType] = useState<string | null>(null);
  const [criticalType, setCriticalType] = useState<string | null>(null);
  const [plantMCR, setPlantMCR] = useState('');
  const [heatRateValue, setHeatRateValue] = useState('');
  const [heatRateUnit, setHeatRateUnit] = useState<string | null>('kJ/kW-h');
  const [productionCost, setProductionCost] = useState('');
  const [productionCostCurrency, setProductionCostCurrency] = useState<string | null>('USD');
  const [customCurrency, setCustomCurrency] = useState('');
  const [sellPricePerMWh, setSellPricePerMWh] = useState('');

  // Dropdown states
  const [pipeDiaUnitOpen, setPipeDiaUnitOpen] = useState(false);
  const [plantTypeOpen, setPlantTypeOpen] = useState(false);
  const [criticalTypeOpen, setCriticalTypeOpen] = useState(false);
  const [heatRateUnitOpen, setHeatRateUnitOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [p1Unit, setP1Unit] = useState('barA');
  const [t1Unit, setT1Unit] = useState('deg C');
  const [wcrhUnit, setWcrhUnit] = useState('T/HR');

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

  const pipeDiaUnitItems: DropdownItem[] = [
    { label: 'MM', value: 'MM' },
    { label: 'IN', value: 'IN' },
  ];

  const plantTypeItems: DropdownItem[] = [
    { label: 'Coal-/Oil-Fired', value: 'coal_oil_fired' },
    { label: 'CCPP', value: 'ccpp' },
  ];

  const criticalTypeItems: DropdownItem[] = [
    { label: 'Subcritical', value: 'subcritical' },
    { label: 'Supercritical', value: 'supercritical' },
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

  const wcrhUnitItems = [
    { label: 'T/HR', value: 'T/HR' },
    { label: 'KG/S', value: 'KG/S' },
    { label: 'KPPH/HR', value: 'KPPH/HR' },
    { label: 'LB/S', value: 'LB/S' },
  ];

  /* ---------------- DROPDOWN HANDLERS ---------------- */

  const closeAllDropdowns = () => {
    setPipeDiaUnitOpen(false);
    setPlantTypeOpen(false);
    setCriticalTypeOpen(false);
    setHeatRateUnitOpen(false);
    setCurrencyOpen(false);
  };

  const handleOpenDropdown = (dropdownName: string) => {
    closeAllDropdowns();
    switch (dropdownName) {
      case 'pipeDiaUnit':
        setPipeDiaUnitOpen(true);
        break;
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
    }
  };

  // Handle scroll when dropdown opens
  useEffect(() => {
    if (currencyOpen) {
      // Scroll to show the currency dropdown properly
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currencyOpen]);

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

  /* ---------------- FORM HANDLERS ---------------- */

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

  /* ---------------- VALIDATION FUNCTIONS ---------------- */

  // Validate Pipe Diameter D2 with bounds checking (300-600)
  const validatePipeDiameter = (value: string): { isValid: boolean; warning: string | null } => {
    if (!value.trim()) {
      return { isValid: false, warning: null };
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { isValid: false, warning: null };
    }

    if (numValue < 300) {
      return { isValid: false, warning: 'Pipe Diameter out of bounds (LOW) (300-600)' };
    } else if (numValue > 600) {
      return { isValid: false, warning: 'Pipe Diameter out of bounds (HIGH) (300-600)' };
    }
    
    return { isValid: true, warning: null };
  };

  // Validate Plant MCR with bounds checking
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

  // Validate Heat Rate with bounds checking (no auto-correction)
  const validateHeatRate = (value: string): { isValid: boolean; warning: string | null } => {
    if (!value.trim()) {
      return { isValid: false, warning: null };
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { isValid: false, warning: null };
    }

    if (numValue < 6000) {
      return { isValid: false, warning: 'Heat Rate out of bounds (LOW) (6000-12000)' };
    } else if (numValue > 12000) {
      return { isValid: false, warning: 'Heat Rate out of bounds (HIGH) (6000-12000)' };
    }
    
    return { isValid: true, warning: null };
  };

  // Handle Pipe Diameter change with validation
  const handlePipeDiameterChange = (text: string) => {
    setPipeDiaD2(text);
    
    // Clear previous error
    setErrors((prev: any) => ({ ...prev, pipeDiaD2: null }));
    
    // Validate and set warning
    const { isValid, warning } = validatePipeDiameter(text);
    if (!isValid && warning) {
      setWarnings((prev: any) => ({ ...prev, pipeDiaD2: warning }));
    } else {
      setWarnings((prev: any) => ({ ...prev, pipeDiaD2: null }));
    }
  };

  // Handle Plant MCR change with validation
  const handlePlantMCRChange = (text: string) => {
    setPlantMCR(text);
    
    // Clear previous error
    setErrors((prev: any) => ({ ...prev, plantMCR: null }));
    
    // Validate and set warning
    const { isValid, warning } = validatePlantMCR(text);
    if (!isValid && warning) {
      setWarnings((prev: any) => ({ ...prev, plantMCR: warning }));
    } else {
      setWarnings((prev: any) => ({ ...prev, plantMCR: null }));
    }
  };

  // Handle Heat Rate change with validation (no auto-correction)
  const handleHeatRateChange = (text: string) => {
    setHeatRateValue(text);
    
    // Clear previous error
    setErrors((prev: any) => ({ ...prev, heatRateValue: null }));
    
    // Validate and set warning
    const { isValid, warning } = validateHeatRate(text);
    if (!isValid && warning) {
      setWarnings((prev: any) => ({ ...prev, heatRateValue: warning }));
    } else {
      setWarnings((prev: any) => ({ ...prev, heatRateValue: null }));
    }
  };

  /* ---------------- FORM CLEAR FUNCTION ---------------- */

  const clearAllFormFields = () => {
    // Clear all text inputs
    setPowerStationName('');
    setPipeDiaD2('');
    setPlantMCR('');
    setHeatRateValue('');
    setProductionCost('');
    setCustomCurrency('');
    setSellPricePerMWh('');

    // Reset all dropdowns to default values
    setPipeDiaUnit('MM');
    setPlantType(null);
    setCriticalType(null);
    setHeatRateUnit('kJ/kW-h');
    setProductionCostCurrency('USD');

    // Clear errors and warnings
    setErrors({});
    setWarnings({});

    // Close all dropdowns
    closeAllDropdowns();
  };

  /* ---------------- API FUNCTIONS ---------------- */

  // Prepare data for API
  const prepareApiData = (): PlantData => {
    return {
      power_station_name: powerStationName.trim(),
      pipe_dia_d2: pipeDiaD2 || null,
      pipe_dia_unit: pipeDiaUnit || null,
      plant_type: plantType || null,
      critical_type: criticalType || null,
      plant_mcr: plantMCR || null,
      heat_rate_value: heatRateValue || null,
      heat_rate_unit: heatRateUnit || null,
      production_cost: productionCost || null,
      production_cost_currency: productionCostCurrency || null,
      custom_currency: customCurrency || null,
      sell_price_per_mwh: sellPricePerMWh || null
    };
  };

  const validateForm = () => {
    let newErrors: any = {};
    let newWarnings: any = {};

    // Power Station Name
    if (!powerStationName.trim()) {
      newErrors.powerStationName = 'Power station name is required';
    }

    // Pipe Diameter Validation with bounds checking
    if (!pipeDiaD2.trim()) {
      newErrors.pipeDiaD2 = 'Pipe diameter is required';
    } else if (isNaN(Number(pipeDiaD2))) {
      newErrors.pipeDiaD2 = 'Enter valid number';
    } else {
      const { isValid, warning } = validatePipeDiameter(pipeDiaD2);
      if (!isValid && warning) {
        newWarnings.pipeDiaD2 = warning;
        // Don't set error for out of bounds, just warning
      }
    }

    // Plant Type
    if (!plantType) {
      newErrors.plantType = 'Plant type is required';
    }

    // Critical Type
    if (plantType === 'coal_oil_fired' && !criticalType) {
      newErrors.criticalType = 'Critical type is required';
    }

    // Plant MCR Validation with bounds checking
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

    // Heat Rate Validation with bounds checking
    if (!heatRateValue.trim()) {
      // 👉 Set default values based on plant type
      let defaultValue = '9500'; // Default for subcritical
      if (plantType === 'ccpp') {
        defaultValue = '7500';
      } else if (criticalType === 'supercritical') {
        defaultValue = '8400';
      }
      setHeatRateValue(defaultValue);
    } else if (isNaN(Number(heatRateValue))) {
      newErrors.heatRateValue = 'Enter valid heat rate';
    } else {
      const { isValid, warning } = validateHeatRate(heatRateValue);
      if (!isValid && warning) {
        newWarnings.heatRateValue = warning;
      }
    }

    /* ---------------- PRODUCTION COST DEFAULT LOGIC ---------------- */

    if (!productionCost.trim()) {
      setProductionCost('50');
      setProductionCostCurrency('USD');
    } 
    else if (isNaN(Number(productionCost))) {
      newErrors.productionCost = 'Enter valid cost';
    }

    // Currency
    if (!productionCostCurrency) {
      newErrors.productionCostCurrency = 'Currency required';
    }

    // Custom Currency
    if (
      productionCostCurrency === 'custom' &&
      !customCurrency.trim()
    ) {
      newErrors.customCurrency = 'Enter custom currency';
    }

    // Sell Price
    if (!sellPricePerMWh.trim()) {
      newErrors.sellPricePerMWh = 'Sell price required';
    } else if (isNaN(Number(sellPricePerMWh))) {
      newErrors.sellPricePerMWh = 'Enter valid sell price';
    }

    setErrors(newErrors);
    setWarnings(newWarnings);

    return Object.keys(newErrors).length === 0;
  };

  const goToCalculator = () => {
    if (!validateForm()) {
      // If there are warnings but no errors, still allow navigation
      if (Object.keys(errors).length === 0 && Object.keys(warnings).length > 0) {
        // Show warning alert but allow navigation
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
                      pipeDiaD2: pipeDiaD2,
                      pipeDiaUnit: pipeDiaUnit,
                      plantType: plantType,
                      criticalType: criticalType,
                      plantMCR: plantMCR,
                      heatRateValue: heatRateValue,
                      currency:
                        productionCostCurrency === "custom"
                          ? customCurrency
                          : productionCostCurrency,
                      sellPricePerMWh: sellPricePerMWh,
                      p1Unit,
                      t1Unit,
                      wcrhUnit,
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
          pipeDiaD2: pipeDiaD2,
          pipeDiaUnit: pipeDiaUnit,
          plantType: plantType,
          criticalType: criticalType,
          plantMCR: plantMCR,
          heatRateValue: heatRateValue,
          currency:
            productionCostCurrency === "custom"
              ? customCurrency
              : productionCostCurrency,
          sellPricePerMWh: sellPricePerMWh,
          p1Unit,
          t1Unit,
          wcrhUnit,
        }),
      },
    });
  };

  const handleContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  /* ---------------- JSX ---------------- */

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          onScrollBeginDrag={closeAllDropdowns}
          keyboardDismissMode="on-drag"
          onScroll={() => setShowHistoryBtn(true)}
          scrollEventThrottle={16}
        >
          {/* HEADER */}
          <View style={styles.header} pointerEvents="box-none">
            <View style={styles.titleContainer} pointerEvents="none">
              <Text style={styles.title}>Plant Configuration</Text>
              <Text style={styles.subtitle}>Additional Plant Information</Text>
            </View>
          </View>

          {/* SUCCESS MESSAGE */}
          {showSuccess && (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          {/* CONTENT */}
          <View
            style={styles.content}
            onStartShouldSetResponder={() => true}
            onResponderGrant={closeAllDropdowns}
            onLayout={handleContentLayout}
          >
            {/* ---------------- BASIC INFORMATION ---------------- */}
            <View style={[styles.section, { zIndex: 6000 }]}>
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
              </View>

              {/* Pipe Diameter and Unit in same row */}
              <View style={styles.doubleFieldContainer}>
                {/* Pipe Diameter Field */}
                <View style={styles.singleFieldContainer}>
                  <Text style={styles.fieldLabel}>Pipe Diameter (D2) <Text style={styles.requiredStar}>*</Text></Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.pipeDiaD2 && styles.errorInput,
                      warnings.pipeDiaD2 && styles.warningInput
                    ]}
                    value={pipeDiaD2}
                    onChangeText={handlePipeDiameterChange}
                    placeholder="Enter Dia"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                  {errors.pipeDiaD2 && (
                    <Text style={styles.errorText}>{errors.pipeDiaD2}</Text>
                  )}
                  {warnings.pipeDiaD2 && !errors.pipeDiaD2 && (
                    <Text style={styles.warningText}>{warnings.pipeDiaD2}</Text>
                  )}
                </View>

                {/* Pipe Diameter Unit Dropdown - OPEN UPWARDS */}
                <View style={[styles.singleFieldContainer, { zIndex: 5000 }]}>
                  <Text style={styles.fieldLabel}>Unit</Text>
                  <CustomDropdown
                    open={pipeDiaUnitOpen}
                    value={pipeDiaUnit}
                    items={pipeDiaUnitItems}
                    setOpen={(open) =>
                      open
                        ? handleOpenDropdown('pipeDiaUnit')
                        : setPipeDiaUnitOpen(false)
                    }
                    setValue={setPipeDiaUnit}
                    placeholder="MM"
                    zIndex={4000}
                  />
                </View>
              </View>
            </View>

            {/* ---------------- PLANT TYPE ---------------- */}
            <View style={[styles.section, styles.plantTypeSection, { marginBottom: -10 }]}>
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel]}>Plant Type <Text style={styles.requiredStar}>*</Text></Text>
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
                  placeholder="Select Plant type"
                  zIndex={3000}
                  onSelect={handlePlantTypeChange}
                />
                {errors.plantType && (
                  <Text style={styles.errorText}>{errors.plantType}</Text>
                )}
              </View>

              {plantType === 'coal_oil_fired' && (
                <View style={[styles.fieldContainer, { zIndex: 2500 }]}>
                  <Text style={styles.fieldLabel}>Critical Type <Text style={styles.requiredStar}>*</Text></Text>
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
                    placeholder="Select critical type"
                    zIndex={2500}
                  />
                  {errors.criticalType && (
                    <Text style={styles.errorText}>{errors.criticalType}</Text>
                  )}
                </View>
              )}
            </View>

            {/* ---------------- PLANT SPECIFICATIONS ---------------- */}
            <View style={[styles.section, { zIndex: 70 }]}>
              <Text style={styles.sectionTitle}>PLANT SPECIFICATIONS</Text>

              {/* Plant MCR */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Plant MCR (MW) <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.plantMCR && styles.errorInput,
                    warnings.plantMCR && styles.warningInput
                  ]}
                  value={plantMCR}
                  onChangeText={handlePlantMCRChange}
                  placeholder="Enter Plant MCR"
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

              {/* Heat Rate */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Heat Rate <Text style={styles.requiredStar}>*</Text></Text>
                <View style={styles.doubleFieldContainer}>
                  {/* Heat Rate Value */}
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
                    />
                    {errors.heatRateValue && (
                      <Text style={styles.errorText}>{errors.heatRateValue}</Text>
                    )}
                    {warnings.heatRateValue && !errors.heatRateValue && (
                      <Text style={styles.warningText}>{warnings.heatRateValue}</Text>
                    )}
                  </View>

                  {/* Heat Rate Unit */}
                  <View style={styles.singleFieldContainer}>
                    <CustomDropdown
                      open={heatRateUnitOpen}
                      value={heatRateUnit}
                      items={heatRateUnitItems}
                      setOpen={(open) =>
                        open
                          ? handleOpenDropdown('heatRateUnit')
                          : setHeatRateUnitOpen(false)
                      }
                      setValue={setHeatRateUnit}
                      placeholder="kJ/kW-h"
                      zIndex={2000}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* ---------------- FINANCIAL INFORMATION ---------------- */}
            <View style={[styles.section, { zIndex: 60 }]}>
              <Text style={[styles.sectionTitle, { marginTop: -40 }]}>FINANCIAL INFORMATION</Text>

              {/* Production Cost and Currency - Fixed layout to prevent overlap */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Production Cost (per MW-h) <Text style={styles.requiredStar}>*</Text></Text>

                <View style={styles.doubleFieldContainer}>
                  {/* Production Cost */}
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

                  {/* Currency */}
                  <View style={styles.singleFieldContainer}>
                    <Text style={styles.subLabel}>Currency</Text>
                    <DropDownPicker
                      open={currencyOpen}
                      value={productionCostCurrency}
                      items={[
                        { label: "USD", value: "USD" },
                        { label: "Euro", value: "Euro" },
                        { label: "INR", value: "INR" },
                      ]}
                      setOpen={setCurrencyOpen}
                      setValue={setProductionCostCurrency}
                      setItems={setCurrencyItems}
                      style={[styles.dropdown, { height: 50 }]}
                      dropDownContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        borderRadius: 8,
                        backgroundColor: '#FFF',
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
                <View style={styles.fieldContainer}>
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

              {/* Sell Price - Clear separation from currency dropdown */}
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { marginTop: -15 }]}>
                  Sell Price ({productionCostCurrency === "custom"
                    ? customCurrency
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

            {/* ---------------- SAVE BUTTON ---------------- */}
            <View style={styles.saveButtonContainer}>
              <TouchableOpacity
                style={[styles.saveButton, (!powerStationName.trim() || loading) && styles.saveButtonDisabled]}
                onPress={goToCalculator}
                disabled={loading}
                activeOpacity={0.7}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Next</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {!isKeyboardVisible && (
          <TouchableOpacity
            style={styles.floatingButton}
            activeOpacity={0.8}
            onPress={() => router.push('/ViewHistoryScreen')}
          >
            <Ionicons name="time-outline" size={22} color="#fff" />
            <Text style={styles.floatingButtonText}>View History</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ef4b56'
  },
  errorInput: {
    borderColor: 'red',
  },
  warningInput: {
    borderColor: 'red', // Changed from orange to red
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4b56',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  warningText: {
    color: 'red', // Changed from orange to red
    fontSize: 12,
    marginTop: 4,
  },
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 60
  },
  header: {
    backgroundColor: '#ef4b56',
    padding: 20
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButtonText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500'
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20
  },
  title: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: '600',
    marginBottom: 8
  },
  subLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
  },
  successText: {
    marginLeft: 10,
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500'
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    overflow: 'visible',
    position: 'relative',
    minHeight: 'auto',
  },
  section: {
    marginBottom: 30,
    position: 'relative',
    overflow: 'visible',
  },
  plantTypeSection: {
    zIndex: 3000,
    position: 'relative',
    overflow: 'visible',
    marginTop: -10,
  },
  plantTypeDropdownWrapper: {
    position: 'relative',
    zIndex: 2000,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#ef4b56',
    marginBottom: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  fieldContainer: {
    marginBottom: 20,
    position: 'relative',
    overflow: 'visible',
  },
  singleFieldContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'visible',
  },
  doubleFieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
    position: 'relative',
    zIndex: 4000,
  },
  costCurrencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 15,
  },
  costInputWrapper: {
    flex: 1,
  },
  costInput: {
    marginBottom: 0,
  },
  currencyDropdownWrapper: {
    flex: 1,
    zIndex: 5000,
  },
  currencyLabel: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
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
    height: 50,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 50,
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#999'
  },
  dropdownArrow: {
    width: 20,
    height: 20,
  },
  dropdownTick: {
    width: 16,
    height: 16,
    tintColor: '#ef4b56',
  },
  dropdownListItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownListItemLabel: {
    fontSize: 14,
    color: '#333',
  },
  dropdownSelectedItem: {
    backgroundColor: '#FFF5F5',
  },
  dropdownSelectedLabel: {
    color: '#ef4b56',
    fontWeight: '500',
  },
  dropdownBadge: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  dropdownBadgeText: {
    fontSize: 14,
    color: '#333',
  },
  saveButtonContainer: {
    marginTop: -10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#ef4b56',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '70%',
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
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
});