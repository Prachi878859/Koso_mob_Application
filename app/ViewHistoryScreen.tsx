import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "./axiosInstance";


interface PowerStation {
  id: number;
  power_station_name: string;
  plant_type: string;
  plant_mcr: string;
  created_at: string;
}

export default function ViewHistoryScreen() {
  const [stations, setStations] = useState<PowerStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredStations, setFilteredStations] = useState<PowerStation[]>([]);


  /* ---------- FETCH ---------- */

  const fetchStations = async () => {
    try {
      const res = await api.get("/power-stations");

      if (res.data.success) {
        setStations(res.data.data);
        setFilteredStations(res.data.data);
      }
    } catch (error) {
      console.log("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);


  const handleSearchButton = () => {
    if (searchText.trim() === "") {
      setFilteredStations(stations);
      return;
    }

    const filtered = stations.filter((item) =>
      item.power_station_name
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );

    setFilteredStations(filtered);
  };




  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";

    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    };

    const formattedDate = `${day}${suffix} ${date.toLocaleDateString(
      "en-US",
      options
    )}`;

    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate} | ${time}`;
  };

  /* ---------- CARD ---------- */

  const renderItem = ({ item }: { item: PowerStation }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/PowerStationDetails",
          params: { id: item.id.toString() },
        })
      }
    >
      {/* Title */}
      <Text style={styles.stationName}>
        {item.power_station_name}
      </Text>

      {/* Timestamp */}
      <Text style={styles.dateText}>
        {formatDate(item.created_at)}
      </Text>

      <View style={styles.divider} />

      {/* Bottom Row */}
      <View style={styles.bottomRow}>
        <Text style={styles.plantType}>
          Plant Type : {item.plant_type}
        </Text>

        <Text style={styles.mcrText}>
          Plant MCR : {item.plant_mcr}
        </Text>
      </View>
    </TouchableOpacity>
  );




  /* ---------- LOADER ---------- */

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ef4b56" />
      </View>
    );
  }

  /* ---------- UI ---------- */

  return (
    
    <>
<Stack.Screen options={{ headerShown: false }} />


      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>History</Text>
        </View>



        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.searchLabel}>Search records</Text>

          <View style={styles.searchRow}>
            <TextInput
              placeholder="Search your old record"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInputBox}
            />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchButton}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>

          </View>
        </View>



        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No Power Station Found
            </Text>
          }

        />
      </SafeAreaView>
    </>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },

  stationName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },
  dateText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  plantType: {
    fontSize: 14,
    color: "#333",
  },

  mcrText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ef4b56",
  },

  subText: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topHeader: {
    height: 70,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    left: 15,
  },


  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ef4b56",
  },

  searchSection: {
    backgroundColor: "#e5e5e5",
    padding: 15,
    marginBottom: 15, 
  },

  searchLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  searchInputBox: {
    flex: 1,
    height: 45,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },

  searchButton: {
    marginLeft: 10,
    backgroundColor: "#ef4b56",
    height: 45,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  searchButtonText: {
    color: "#fff",
    fontWeight: "600",
  },


});
