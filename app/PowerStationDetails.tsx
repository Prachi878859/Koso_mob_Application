import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import api from "./axiosInstance";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface PowerStation {
  id: number;
  power_station_name: string;
  pipe_dia_d2: string;
  pipe_dia_unit: string;
  t2p: string;
  p1: string;
  p1_unit: string;
  t1: string;
  t1_unit: string;
  p2: string;
  tcrh: string;
  w_crh: string;
  w_crh_unit: string;
  tw: string;
  ww: string;
  t_mix: string;
  plant_type: string;
  critical_type: string;
  plant_mcr: string;
  heat_rate_value: string;
  heat_rate_unit: string;
  production_cost: string;
  production_cost_currency: string;
  custom_currency: string;
  sell_price_per_mwh: string;
}

export default function PowerStationDetails() {
  const { id } = useLocalSearchParams();

  const [station, setStation] = useState<PowerStation | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/power-stations/${id}`);
      console.log("Full Response:", res.data);

      if (res.data.success) {
        setStation(res.data.data);
      }
    } catch (err) {
      console.log("Details Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  // Helper function to format production cost display
  const formatProductionCost = () => {
    if (!station?.production_cost) return "-";
    
    const cost = station.production_cost;
    const currency = station.production_cost_currency;
    
    // If currency is 'custom', show custom_currency instead
    if (currency === 'custom' && station.custom_currency) {
      return `${cost} ${station.custom_currency}`;
    }
    
    // Otherwise show the regular currency
    return `${cost} ${currency || ''}`;
  };

  const renderRow = (label: string, value: any, index: number) => (
    <View
      style={[
        styles.row,
        { backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff" },
      ]}
    >
      <Text style={styles.rowLabel}>{label}:</Text>
      <Text style={styles.rowValue}>{value || "-"}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ef4b56" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Power Station Name Row with Back Button */}
          <View style={styles.powerNameRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#ef4b56" />
            </TouchableOpacity>
            <Text style={styles.powerName}>
              {station?.power_station_name}
            </Text>
          </View>

          {/* Details Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Details</Text>

            {renderRow("Plant Type", station?.plant_type, 0)}
            {renderRow("Critical Type", station?.critical_type || "-", 1)}
            {renderRow("MCR", station?.plant_mcr, 2)}
            {renderRow("P1", `${station?.p1} ${station?.p1_unit}`, 3)}
            {renderRow("P2", station?.p2, 4)}
            {renderRow("Pipe Diameter (D2)", `${station?.pipe_dia_d2} ${station?.pipe_dia_unit}`, 5)}
            {renderRow("Heat Rate", `${station?.heat_rate_value} ${station?.heat_rate_unit}`, 6)}
            {renderRow("Production Cost", formatProductionCost(), 7)}
            {renderRow("T1", `${station?.t1} ${station?.t1_unit}`, 8)}
            {renderRow("T2P", station?.t2p, 9)}
            {renderRow("Tmix", station?.t_mix, 10)}
            {renderRow("Tcrh", station?.tcrh, 11)}
            {renderRow("Tw", station?.tw, 12)}
            {renderRow("Wcrh", `${station?.w_crh} ${station?.w_crh_unit}`, 13)}
            {renderRow("Ww", station?.ww, 14)}
            {renderRow("Sell Price", station?.sell_price_per_mwh, 15)}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  scrollContent: {
    padding: width * 0.05,
    paddingBottom: width * 0.08,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  powerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f3",
    borderRadius: 12,
    marginBottom: width * 0.04,
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.04,
    borderWidth: 1,
    borderColor: "#ef4b5620",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: width * 0.02,
    paddingRight: width * 0.04,
  },
  backText: {
    fontSize: width * 0.04,
    color: "#ef4b56",
    fontWeight: "600",
    marginLeft: width * 0.02,
  },
  powerName: {
    flex: 1,
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "#ef4b56",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#e6e6e6",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: width * 0.045,
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: width * 0.035,
    backgroundColor: "#d9d9d9",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: width * 0.035,
    paddingHorizontal: width * 0.04,
  },
  rowLabel: {
    fontWeight: "600",
    color: "#000",
    fontSize: width * 0.038,
    flex: 0.4,
  },
  rowValue: {
    color: "#333",
    fontSize: width * 0.038,
    flex: 0.6,
    textAlign: "right",
  },
});