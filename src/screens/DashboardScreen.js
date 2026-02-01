// src/screens/DashboardScreen.js
import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { getMovieStats, getMovieCountByCategory } from "../database/db";
import { colors, commonStyles } from "../styles/commonStyles";

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    total: 0,
    watched: 0,
    toWatch: 0,
    favorite: 0,
  });
  const [categoryData, setCategoryData] = useState([]);

  const screenWidth = Dimensions.get("window").width;

  // Load dashboard data
  const loadDashboardData = () => {
    // Get movie stats for pie chart
    const movieStats = getMovieStats();
    setStats(movieStats);

    // Get category data for bar chart (top 5)
    const categories = getMovieCountByCategory();
    setCategoryData(categories.slice(0, 5)); // Top 5 categories
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, []),
  );

  // Prepare pie chart data
  const pieData = [
    {
      name: "Watched",
      count: stats.watched,
      color: "#4CAF50",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "To Watch",
      count: stats.toWatch,
      color: "#2196F3",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Favorite",
      count: stats.favorite,
      color: "#FFD700",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
  ];

  // Prepare bar chart data
  const barData = {
    labels: categoryData.map((item) => item.category.substring(0, 8)),
    datasets: [
      {
        data: categoryData.map((item) => item.total_movies),
      },
    ],
  };

  // Chart config
  const chartConfig = {
    backgroundColor: "#FFF",
    backgroundGradientFrom: "#FFF",
    backgroundGradientTo: "#FFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(229, 9, 20, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: "600",
    },
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="stats-chart" size={40} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Visual insights of your movie collection
          </Text>
        </View>

        <View style={styles.contentContainer}>
          {/* Stats Overview */}
          <View style={styles.statsOverview}>
            <View style={styles.statBox}>
              <Ionicons name="film" size={32} color={colors.primary} />
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Movies</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
              <Text style={styles.statNumber}>{stats.watched}</Text>
              <Text style={styles.statLabel}>Watched</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="time" size={32} color="#2196F3" />
              <Text style={styles.statNumber}>{stats.toWatch}</Text>
              <Text style={styles.statLabel}>To Watch</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="star" size={32} color="#FFD700" />
              <Text style={styles.statNumber}>{stats.favorite}</Text>
              <Text style={styles.statLabel}>Favorite</Text>
            </View>
          </View>

          {stats.total > 0 ? (
            <>
              {/* Pie Chart Section */}
              <View style={styles.chartSection}>
                <View style={styles.chartHeader}>
                  <Ionicons name="pie-chart" size={24} color={colors.primary} />
                  <Text style={styles.chartTitle}>Status Distribution</Text>
                </View>
                <Text style={styles.chartDescription}>
                  Overview of movies by watch status
                </Text>
                <View style={styles.chartContainer}>
                  <PieChart
                    data={pieData}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    accessor="count"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    center={[10, 0]}
                    absolute
                  />
                </View>

                {/* Pie Chart Legend Details */}
                <View style={styles.legendDetails}>
                  {pieData.map((item, index) => {
                    const percentage =
                      stats.total > 0
                        ? ((item.count / stats.total) * 100).toFixed(1)
                        : 0;
                    return (
                      <View key={index} style={styles.legendItem}>
                        <View
                          style={[
                            styles.legendColor,
                            { backgroundColor: item.color },
                          ]}
                        />
                        <View style={styles.legendInfo}>
                          <Text style={styles.legendName}>{item.name}</Text>
                          <Text style={styles.legendValue}>
                            {item.count} movies ({percentage}%)
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Bar Chart Section */}
              {categoryData.length > 0 && (
                <View style={styles.chartSection}>
                  <View style={styles.chartHeader}>
                    <Ionicons
                      name="bar-chart"
                      size={24}
                      color={colors.primary}
                    />
                    <Text style={styles.chartTitle}>Top 5 Categories</Text>
                  </View>
                  <Text style={styles.chartDescription}>
                    Most popular movie categories in your collection
                  </Text>
                  <View style={styles.chartContainer}>
                    <BarChart
                      data={barData}
                      width={screenWidth - 32}
                      height={220}
                      chartConfig={chartConfig}
                      verticalLabelRotation={0}
                      fromZero
                      showBarTops={true}
                      showValuesOnTopOfBars={true}
                      style={styles.barChart}
                    />
                  </View>

                  {/* Bar Chart Details */}
                  <View style={styles.categoryList}>
                    {categoryData.map((item, index) => (
                      <View key={index} style={styles.categoryItem}>
                        <View style={styles.categoryRank}>
                          <Text style={styles.rankNumber}>#{index + 1}</Text>
                        </View>
                        <View style={styles.categoryItemInfo}>
                          <Text style={styles.categoryItemName}>
                            {item.category}
                          </Text>
                          <View style={styles.categoryBar}>
                            <View
                              style={[
                                styles.categoryBarFill,
                                {
                                  width: `${(item.total_movies / categoryData[0].total_movies) * 100}%`,
                                },
                              ]}
                            />
                          </View>
                        </View>
                        <Text style={styles.categoryItemCount}>
                          {item.total_movies}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Insights Card */}
              <View style={styles.insightsCard}>
                <Ionicons name="bulb" size={24} color="#FF9800" />
                <View style={styles.insightsContent}>
                  <Text style={styles.insightsTitle}>Quick Insights</Text>
                  <Text style={styles.insightsText}>
                    • You have {stats.total} movies in your collection{"\n"}•{" "}
                    {stats.watched} movies watched (
                    {stats.total > 0
                      ? ((stats.watched / stats.total) * 100).toFixed(0)
                      : 0}
                    %){"\n"}• {stats.toWatch} movies waiting to be watched{"\n"}
                    • {stats.favorite} favorite movies{"\n"}
                    {categoryData.length > 0 &&
                      `• "${categoryData[0].category}" is your top category`}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="analytics-outline" size={80} color="#CCC" />
              <Text style={styles.emptyText}>No Data Available</Text>
              <Text style={styles.emptySubtext}>
                Add some movies to see dashboard statistics
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: "#FFF",
    padding: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  contentContainer: {
    padding: 16,
    gap: 20,
  },
  statsOverview: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  chartSection: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  chartDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  barChart: {
    borderRadius: 8,
  },
  legendDetails: {
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
  },
  legendColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  legendInfo: {
    flex: 1,
  },
  legendName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  legendValue: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  categoryList: {
    marginTop: 16,
    gap: 12,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  categoryRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  categoryItemInfo: {
    flex: 1,
  },
  categoryItemName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  categoryBar: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  categoryBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  categoryItemCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    minWidth: 30,
    textAlign: "right",
  },
  insightsCard: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  insightsContent: {
    flex: 1,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F57C00",
    marginBottom: 8,
  },
  insightsText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
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
});

export default DashboardScreen;
