/**
 * Author: Nguyễn Ngọc Hân CE180049 - SE1816
 */
// src/components/MovieCard.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/commonStyles";

const MovieCard = ({ movie, onPress }) => {
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Watched":
        return colors.watched;
      case "To Watch":
        return colors.toWatch;
      case "Favorite":
        return colors.favorite;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        {/* Poster */}
        <View style={styles.posterContainer}>
          {movie.poster_uri ? (
            <Image source={{ uri: movie.poster_uri }} style={styles.poster} />
          ) : (
            <View style={styles.placeholderPoster}>
              <Ionicons name="film-outline" size={40} color="#999" />
            </View>
          )}
        </View>

        {/* Movie Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title}
          </Text>

          <View style={styles.detailRow}>
            <Ionicons name="pricetag" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{movie.category}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{movie.release_year}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(movie.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(movie.status) },
              ]}
            >
              {movie.status}
            </Text>
          </View>
        </View>

        {/* Arrow Icon */}
        <View style={styles.arrowContainer}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textSecondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    flexDirection: "row",
    padding: 12,
  },
  posterContainer: {
    width: 80,
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
  },
  poster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderPoster: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  arrowContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8,
  },
});

export default MovieCard;
