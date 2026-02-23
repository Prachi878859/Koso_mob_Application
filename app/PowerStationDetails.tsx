import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import api from "./axiosInstance";
import { Stack } from "expo-router";

interface PowerStation {
  id: number;
  power_station_name: string;
  pipe_dia_d2:string;
  pipe_dia_unit:string;
  t2p:string;
  p1:string;
  p1_unit:string;
  t1:string;
  t1_unit:string;
  p2:string;
  tcrh:string;
  w_crh:string;
  w_crh_unit:string;
  tw:string;
  ww:string;
  t_mix:string;
  plant_type: string;
  critical_type: string;
  plant_mcr: string;
  heat_rate_value: string;
  heat_rate_unit:string;
  production_cost: string;
  production_cost_currency:string;
  custom_currency:string;
  sell_price_per_mwh: string;

}


export default function PowerStationDetails() {
  const { id } = useLocalSearchParams();

  const [station, setStation] = useState<PowerStation | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/power-stations/${id}`);
       console.log("Full Response:", res.data);  // 👈 ADD THIS

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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ef4b56" />
      </View>
    );
  }
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


 return (
   <>
    <Stack.Screen options={{ headerShown: false }} />
  <View style={styles.container}>
    {/* Power Station Name */}
    <Text style={styles.powerName}>
      {station?.power_station_name}
    </Text>

    {/* Details Card */}
    <View style={styles.card}>
  <Text style={styles.cardTitle}>Details</Text>

  {renderRow("Plant Type", station?.plant_type, 0)}
  {renderRow("Critical Type", station?.critical_type, 1)}
  {renderRow("MCR", station?.plant_mcr, 2)}
  {renderRow("P1", `${station?.p1} ${station?.p1_unit}`, 3)}
  {renderRow("P2", station?.p2, 4)}
  {renderRow("Pipe Diameter (D2)", `${station?.pipe_dia_d2} ${station?.pipe_dia_unit}`, 5)}
  {renderRow("Heat Rate", `${station?.heat_rate_value} ${station?.heat_rate_unit}`, 6)}
  {renderRow("Production Cost", `${station?.production_cost} ${station?.production_cost_currency} ${station?.custom_currency}`, 7)}
  {renderRow("T1", `${station?.t1} ${station?.t1_unit}`, 8)}
  {renderRow("T2P", station?.t2p, 9)}
  {renderRow("Tmix", station?.t_mix, 10)}
  {renderRow("Tcrh", station?.tcrh, 11)}
  {renderRow("Tw", station?.tw, 12)}
  {renderRow("Wcrh", `${station?.w_crh} ${station?.w_crh_unit}`, 13)}
  {renderRow("Ww", station?.ww, 14)}
  {renderRow("Sell Price", station?.sell_price_per_mwh, 15)}
</View>

  </View>
  </>
);

}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ef4b56",
    marginBottom: 15,
  },
    loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    color: "#000",   // 👈 IMPORTANT
    marginBottom: 8,
  },
 powerName: {
  fontSize: 20,
  fontWeight: "600",
  color: "#ef4b56",
  textAlign: "center",
  paddingVertical: 12,
  backgroundColor: "#fef2f3",   // light red background
  borderRadius: 8,
  marginBottom: 15,
},


  card: {
    backgroundColor: "#e6e6e6",
    borderRadius: 15,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 12,
    backgroundColor: "#d9d9d9",
  },
 row: {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: 12,
  paddingHorizontal: 15,
},

  rowLabel: {
    fontWeight: "600",
    color: "#000",
  },

  rowValue: {
    color: "#333",
  },
});
