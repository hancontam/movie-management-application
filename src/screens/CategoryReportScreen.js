// src/screens/CategoryReportScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getMovieCountByCategory } from "../database/db";
import { colors, commonStyles } from "../styles/commonStyles";

const CategoryReportScreen = ({ navigation }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0);

  // Category icons mapping
  const categoryIcons = {
    Action: "flash",
    Comedy: "happy",
    Drama: "theater",
    Horror: "skull",
    Romance: "heart",
    "Sci-Fi": "rocket",
    Thriller: "eye",
    Animation: "color-palette",
    Documentary: "videocam",
  };

  // Category colors
  const categoryColors = {
    Action: "#FF5722",
    Comedy: "#FFEB3B",
    Drama: "#9C27B0",
    Horror: "#000000",
    Romance: "#E91E63",
    "Sci-Fi": "#2196F3",
    Thriller: "#795548",
    Animation: "#FF9800",
    Documentary: "#4CAF50",
  };

  // Load category statistics
  const loadCategoryStats = () => {
    const data = getMovieCountByCategory();
    setCategoryData(data);

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.total_movies, 0);
    setTotalMovies(total);
  };

  useFocusEffect(
    useCallback(() => {
      loadCategoryStats();
    }, []),
  );

  // Calculate percentage
  const getPercentage = (count) => {
    if (totalMovies === 0) return 0;
    return ((count / totalMovies) * 100).toFixed(1);
  };

  return (
    <View style={commonStyles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="bar-chart" size={40} color={colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Category Statistics</Text>
        <Text style={styles.headerSubtitle}>Total Movies: {totalMovies}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {categoryData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="film-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>No movies yet</Text>
            <Text style={styles.emptySubtext}>
              Add some movies to see statistics
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {categoryData.map((item, index) => {
              const percentage = getPercentage(item.total_movies);
              const icon = categoryIcons[item.category] || "film";
              const color = categoryColors[item.category] || "#999";

              return (
                <View key={index} style={styles.categoryCard}>
                  {/* Category Header */}
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryTitleRow}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: color + "20" },
                        ]}
                      >
                        <Ionicons name={icon} size={24} color={color} />
                      </View>
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryName}>{item.category}</Text>
                        <Text style={styles.categoryCount}>
                          {item.total_movies}{" "}
                          {item.total_movies === 1 ? "movie" : "movies"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.percentageContainer}>
                      <Text style={[styles.percentageText, { color }]}>
                        {percentage}%
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${percentage}%`,
                          backgroundColor: color,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Navigate to Favorite Years Report */}
        {categoryData.length > 0 && (
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigation.navigate("FavoriteYearsReport")}
          >
            <Ionicons name="calendar" size={20} color="#FFF" />
            <Text style={styles.navigationButtonText}>
              View Favorite Years Report
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: "#FFF",
    padding: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  categoryCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 14,
    color: "#666",
  },
  percentageContainer: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
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
    textAlign: "center",
  },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  navigationButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CategoryReportScreen;
