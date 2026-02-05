/**
 * Author: Nguyễn Ngọc Hân CE180049 - SE1816
 */
// src/screens/SreachScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { searchMovies, filterMovies, getAllMovies } from "../database/db";
import MovieCard from "../components/MovieCard";
import { colors, commonStyles } from "../styles/commonStyles";

const SreachScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [results, setResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const statuses = ["All", "To Watch", "Watched", "Favorite"];

  // Generate year options (1888 to current year + 5)
  const currentYear = new Date().getFullYear();
  const years = ["All"];
  for (let year = currentYear + 5; year >= 1888; year--) {
    years.push(year.toString());
  }

  // Load all movies initially
  useEffect(() => {
    loadAllMovies();
  }, []);

  // Reload movies when screen is focused (sau khi add/edit movie)
  useFocusEffect(
    React.useCallback(() => {
      // Re-apply current filters/search when screen becomes visible
      if (
        searchQuery.trim() !== "" ||
        selectedYear !== "" ||
        selectedStatus !== ""
      ) {
        applyFilters(selectedYear, selectedStatus);
      } else {
        loadAllMovies();
      }
    }, [searchQuery, selectedYear, selectedStatus]),
  );

  const loadAllMovies = () => {
    const allMovies = getAllMovies();
    setResults(allMovies);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      // If search is empty, apply filters or show all
      applyFilters(selectedYear, selectedStatus);
    } else {
      // Search by title or category
      const searchResults = searchMovies(query);
      setResults(searchResults);
    }
  };

  // Apply filters
  const applyFilters = (year = selectedYear, status = selectedStatus) => {
    const yearValue = year === "All" || year === "" ? null : parseInt(year);
    const statusValue = status === "All" || status === "" ? null : status;

    if (!yearValue && !statusValue && searchQuery.trim() === "") {
      // No filters, show all movies
      loadAllMovies();
    } else if (searchQuery.trim() !== "") {
      // If there's a search query, search first then filter
      let filtered = searchMovies(searchQuery);

      if (yearValue) {
        filtered = filtered.filter((movie) => movie.release_year === yearValue);
      }
      if (statusValue) {
        filtered = filtered.filter((movie) => movie.status === statusValue);
      }

      setResults(filtered);
    } else {
      // Apply database filters
      const filtered = filterMovies(yearValue, statusValue);
      setResults(filtered);
    }
  };

  // Handle year filter change
  const handleYearChange = (year) => {
    setSelectedYear(year);
    applyFilters(year, selectedStatus);
  };

  // Handle status filter change
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    applyFilters(selectedYear, status);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedYear("");
    setSelectedStatus("");
    loadAllMovies();
  };

  return (
    <View style={commonStyles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title or category..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Toggle Button */}
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name={showFilters ? "funnel" : "funnel-outline"}
            size={24}
            color={showFilters ? colors.primary : "#666"}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      {showFilters && (
        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Year</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={handleYearChange}
                  style={styles.picker}
                >
                  {years.map((year) => (
                    <Picker.Item key={year} label={year} value={year} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedStatus}
                  onValueChange={handleStatusChange}
                  style={styles.picker}
                >
                  {statuses.map((status) => (
                    <Picker.Item key={status} label={status} value={status} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Clear Filters Button */}
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Ionicons name="refresh" size={16} color="#FFF" />
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results Info */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {results.length} {results.length === 1 ? "movie" : "movies"} found
        </Text>
      </View>

      {/* Results List */}
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() =>
              navigation.navigate("MovieDetail", { movieId: item.id })
            }
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>No movies found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
        contentContainerStyle={results.length === 0 && styles.emptyListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterToggle: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  filterContainer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  filterGroup: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
    overflow: "hidden",
  },
  picker: {
    height: 45,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9800",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  clearButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  resultsInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9F9F9",
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#BBB",
    marginTop: 8,
  },
  emptyListContent: {
    flexGrow: 1,
  },
});

export default SreachScreen;
