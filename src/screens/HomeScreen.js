// src/screens/HomeScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getAllMovies } from "../database/db";
import MovieCard from "../components/MovieCard";
import { colors, commonStyles } from "../styles/commonStyles";

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadMovies = () => {
    const data = getAllMovies();
    setMovies(data);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMovies();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMovies();
    }, []),
  );

  return (
    <View style={commonStyles.container}>
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() =>
              navigation.navigate("MovieDetail", { movieId: item.id })
            }
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={() => (
          <View style={styles.banner}>
            <Ionicons name="film" size={60} color={colors.accent} />
            <Text style={styles.bannerTitle}>Movie Manager</Text>
            <Text style={styles.bannerSubtitle}>
              Your Personal Film Library
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={commonStyles.emptyText}>
            No movies yet. Press "+" to add!
          </Text>
        )}
        contentContainerStyle={movies.length === 0 && styles.emptyContainer}
      />

      {/* FAB Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddMovie")}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 10,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#E0E0E0",
    marginTop: 5,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

export default HomeScreen;
