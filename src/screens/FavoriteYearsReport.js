/**
 * Author: Nguyễn Ngọc Hân CE180049 - SE1816
 */
// src/screens/FavoriteYearsReport.js
import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getAbnormallyHighFavoriteYears } from "../database/db";
import { colors, commonStyles } from "../styles/commonStyles";

const FavoriteYearsReport = ({ navigation }) => {
  const [yearData, setYearData] = useState([]);
  const [averageFavorites, setAverageFavorites] = useState(0);

  // Load abnormally high favorite years
  const loadFavoriteYearsData = () => {
    const data = getAbnormallyHighFavoriteYears();
    setYearData(data);

    // Calculate average (approximate from the data)
    if (data.length > 0) {
      // The threshold is avg * 1.3, so we can estimate avg
      // But for display purposes, we'll calculate from the minimum value
      const minCount = Math.min(...data.map((item) => item.favorite_count));
      const estimatedAvg = minCount / 1.3;
      setAverageFavorites(estimatedAvg);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavoriteYearsData();
    }, []),
  );

  // Calculate percentage above average
  const getPercentageAboveAvg = (count) => {
    if (averageFavorites === 0) return 0;
    return (((count - averageFavorites) / averageFavorites) * 100).toFixed(1);
  };

  return (
    <View style={commonStyles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="trending-up" size={40} color={colors.favorite} />
        </View>
        <Text style={styles.headerTitle}>Abnormal Favorite Years</Text>
        <Text style={styles.headerSubtitle}>
          Years with exceptionally high favorites
        </Text>
        {averageFavorites > 0 && (
          <View style={styles.avgBadge}>
            <Text style={styles.avgText}>
              Threshold: {(averageFavorites * 1.3).toFixed(1)} favorites
            </Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollContainer}>
        {yearData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="analytics-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>No abnormal years found</Text>
            <Text style={styles.emptySubtext}>
              Years need to have favorite count {">"}130% of average to appear
              here
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons
                name="information-circle"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.infoText}>
                These years have significantly more favorites than average (
                {">"} 130% threshold)
              </Text>
            </View>

            {/* Year Cards */}
            {yearData.map((item, index) => {
              const percentageAbove = getPercentageAboveAvg(
                item.favorite_count,
              );
              const isTopYear = index === 0;

              return (
                <View
                  key={index}
                  style={[styles.yearCard, isTopYear && styles.topYearCard]}
                >
                  {/* Rank Badge */}
                  <View
                    style={[styles.rankBadge, isTopYear && styles.topRankBadge]}
                  >
                    <Text
                      style={[styles.rankText, isTopYear && styles.topRankText]}
                    >
                      #{index + 1}
                    </Text>
                  </View>

                  {/* Year Info */}
                  <View style={styles.yearContent}>
                    <View style={styles.yearHeader}>
                      <View style={styles.yearTitleRow}>
                        <Ionicons
                          name="calendar"
                          size={28}
                          color={isTopYear ? colors.favorite : colors.primary}
                        />
                        <Text
                          style={[
                            styles.yearText,
                            isTopYear && styles.topYearText,
                          ]}
                        >
                          {item.release_year}
                        </Text>
                        {isTopYear && (
                          <Ionicons
                            name="star"
                            size={24}
                            color={colors.favorite}
                          />
                        )}
                      </View>

                      {/* Favorite Count */}
                      <View style={styles.countContainer}>
                        <Ionicons name="heart" size={20} color="#E91E63" />
                        <Text style={styles.countText}>
                          {item.favorite_count}
                        </Text>
                      </View>
                    </View>

                    {/* Statistics */}
                    <View style={styles.statsContainer}>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Above Average</Text>
                        <Text
                          style={[
                            styles.statValue,
                            {
                              color: isTopYear
                                ? colors.favorite
                                : colors.primary,
                            },
                          ]}
                        >
                          +{percentageAbove}%
                        </Text>
                      </View>

                      <View style={styles.statDivider} />

                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Favorites</Text>
                        <Text
                          style={[
                            styles.statValue,
                            {
                              color: isTopYear
                                ? colors.favorite
                                : colors.primary,
                            },
                          ]}
                        >
                          {item.favorite_count} movies
                        </Text>
                      </View>
                    </View>

                    {/* Progress Indicator */}
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(parseFloat(percentageAbove), 100)}%`,
                              backgroundColor: isTopYear
                                ? colors.favorite
                                : colors.primary,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressLabel}>
                        Exceeds threshold by {percentageAbove}%
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <Ionicons name="stats-chart" size={32} color={colors.primary} />
              <Text style={styles.summaryTitle}>Summary</Text>
              <Text style={styles.summaryText}>
                Found {yearData.length}{" "}
                {yearData.length === 1 ? "year" : "years"} with abnormally high
                favorite counts
              </Text>
            </View>
          </View>
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
    backgroundColor: colors.favorite + "15",
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
    marginBottom: 12,
  },
  avgBadge: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  avgText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: colors.primary + "10",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  yearCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    flexDirection: "row",
    gap: 12,
  },
  topYearCard: {
    borderWidth: 2,
    borderColor: colors.favorite,
    elevation: 4,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  topRankBadge: {
    backgroundColor: colors.favorite + "30",
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  topRankText: {
    color: colors.favorite,
  },
  yearContent: {
    flex: 1,
  },
  yearHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  yearTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  yearText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  topYearText: {
    color: colors.favorite,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  countText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E91E63",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 12,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
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
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: colors.primary + "10",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  summaryText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default FavoriteYearsReport;
