// src/screens/MovieDetailScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import {
  getMovieById,
  updateMovie,
  updateMovieStatus,
  deleteMovie,
} from "../database/db";
import { colors, commonStyles } from "../styles/commonStyles";

const MovieDetailScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Edit mode states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Action");
  const [releaseYear, setReleaseYear] = useState("");
  const [status, setStatus] = useState("To Watch");
  const [posterUri, setPosterUri] = useState(null);

  const categories = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Animation",
    "Documentary",
  ];

  const statuses = ["To Watch", "Watched", "Favorite"];

  const currentYear = new Date().getFullYear();
  const maxYear = currentYear + 5;
  const minYear = 1888;

  // Load movie details
  const loadMovie = () => {
    const data = getMovieById(movieId);
    if (data) {
      setMovie(data);
      setTitle(data.title);
      setCategory(data.category);
      setReleaseYear(data.release_year.toString());
      setStatus(data.status);
      setPosterUri(data.poster_uri);
    } else {
      Alert.alert("Error", "Movie not found", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMovie();
    }, [movieId]),
  );

  // Cycle through statuses: To Watch → Watched → Favorite → To Watch
  const handleChangeStatus = () => {
    const currentIndex = statuses.indexOf(movie.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const newStatus = statuses[nextIndex];

    const success = updateMovieStatus(movieId, newStatus);
    if (success) {
      setMovie({ ...movie, status: newStatus });
      setStatus(newStatus);
      Alert.alert("Success", `Status changed to: ${newStatus}`);
    } else {
      Alert.alert("Error", "Failed to update status");
    }
  };

  // Toggle edit mode
  const handleEdit = () => {
    if (!isEditMode) {
      // Enter edit mode
      setIsEditMode(true);
    } else {
      // Cancel edit mode
      setIsEditMode(false);
      // Reset to original values
      setTitle(movie.title);
      setCategory(movie.category);
      setReleaseYear(movie.release_year.toString());
      setStatus(movie.status);
      setPosterUri(movie.poster_uri);
    }
  };

  // Save changes
  const handleSaveChanges = () => {
    // Validate title
    if (!title.trim()) {
      Alert.alert("Validation Error", "Title cannot be empty");
      return;
    }

    // Validate year
    const year = parseInt(releaseYear);
    if (isNaN(year) || year < minYear || year > maxYear) {
      Alert.alert(
        "Validation Error",
        `Release year must be between ${minYear} and ${maxYear}`,
      );
      return;
    }

    // Update movie
    const success = updateMovie(
      movieId,
      title.trim(),
      category,
      year,
      status,
      posterUri,
    );

    if (success) {
      Alert.alert("Success", "Movie updated successfully!");
      setIsEditMode(false);
      loadMovie(); // Reload data
    } else {
      Alert.alert("Error", "Failed to update movie");
    }
  };

  // Delete movie
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${movie.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const success = deleteMovie(movieId);
            if (success) {
              Alert.alert("Success", "Movie deleted successfully", [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ]);
            } else {
              Alert.alert("Error", "Failed to delete movie");
            }
          },
        },
      ],
    );
  };

  // Pick image from library
  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Need permission to access photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPosterUri(result.assets[0].uri);
    }
  };

  // Take photo
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Need permission to access camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPosterUri(result.assets[0].uri);
    }
  };

  // Show image options
  const showImageOptions = () => {
    Alert.alert("Change Poster", "Choose an option", [
      {
        text: "Take Photo",
        onPress: takePhoto,
      },
      {
        text: "Choose from Library",
        onPress: pickImageFromLibrary,
      },
      {
        text: "Remove Poster",
        style: "destructive",
        onPress: () => setPosterUri(null),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  if (!movie) {
    return (
      <View style={[commonStyles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container}>
      {/* Poster */}
      <View style={styles.posterContainer}>
        {posterUri || movie.poster_uri ? (
          <TouchableOpacity
            onPress={isEditMode ? showImageOptions : null}
            disabled={!isEditMode}
          >
            <Image
              source={{ uri: posterUri || movie.poster_uri }}
              style={styles.poster}
            />
            {isEditMode && (
              <View style={styles.editPosterOverlay}>
                <Ionicons name="camera" size={40} color="#FFF" />
                <Text style={styles.editPosterText}>Change Poster</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.noPosterContainer}
            onPress={isEditMode ? showImageOptions : null}
            disabled={!isEditMode}
          >
            <Ionicons name="image-outline" size={80} color="#999" />
            <Text style={styles.noPosterText}>
              {isEditMode ? "Tap to add poster" : "No poster"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Movie Details */}
      <View style={styles.detailsContainer}>
        {/* Title */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Title</Text>
          {isEditMode ? (
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter movie title"
              placeholderTextColor="#999"
            />
          ) : (
            <Text style={styles.value}>{movie.title}</Text>
          )}
        </View>

        {/* Category */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Category</Text>
          {isEditMode ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.picker}
              >
                {categories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>
          ) : (
            <Text style={styles.value}>{movie.category}</Text>
          )}
        </View>

        {/* Release Year */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Release Year</Text>
          {isEditMode ? (
            <TextInput
              style={styles.input}
              value={releaseYear}
              onChangeText={setReleaseYear}
              placeholder={`${minYear}-${maxYear}`}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor="#999"
            />
          ) : (
            <Text style={styles.value}>{movie.release_year}</Text>
          )}
        </View>

        {/* Status */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Status</Text>
          {isEditMode ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status}
                onValueChange={setStatus}
                style={styles.picker}
              >
                {statuses.map((stat) => (
                  <Picker.Item key={stat} label={stat} value={stat} />
                ))}
              </Picker>
            </View>
          ) : (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{movie.status}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!isEditMode ? (
            <>
              {/* Edit Button */}
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={handleEdit}
              >
                <Ionicons name="create-outline" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              {/* Change Status Button */}
              <TouchableOpacity
                style={[styles.button, styles.statusButton]}
                onPress={handleChangeStatus}
              >
                <Ionicons name="repeat-outline" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Change Status</Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Save Changes Button */}
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveChanges}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleEdit}
              >
                <Ionicons name="close-circle" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#999",
  },
  posterContainer: {
    width: "100%",
    height: 400,
    backgroundColor: "#F0F0F0",
  },
  poster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  editPosterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  editPosterText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
  },
  noPosterContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  noPosterText: {
    marginTop: 10,
    fontSize: 14,
    color: "#999",
  },
  detailsContainer: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  statusButton: {
    backgroundColor: "#FF9800",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#757575",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MovieDetailScreen;
