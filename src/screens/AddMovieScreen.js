// src/screens/AddMovieScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { addMovie } from "../database/db";
import { colors, commonStyles } from "../styles/commonStyles";

const AddMovieScreen = ({ navigation }) => {
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

  // Chọn ảnh từ thư viện
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

  // Chụp ảnh từ camera
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

  // Hiển thị tùy chọn chọn ảnh hoặc chụp ảnh
  const showImageOptions = () => {
    Alert.alert("Select Poster", "Choose an option", [
      {
        text: "Take Photo",
        onPress: takePhoto,
      },
      {
        text: "Choose from Library",
        onPress: pickImageFromLibrary,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  // Validate và lưu phim
  const handleSave = () => {
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

    // Save to database
    const success = addMovie(title.trim(), category, year, status, posterUri);

    if (success) {
      Alert.alert("Success", "Movie added successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert("Error", "Failed to add movie. Please try again.");
    }
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.formContainer}>
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter movie title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />
        </View>

        {/* Category Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
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
        </View>

        {/* Release Year Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Release Year ({minYear}-{maxYear}) *
          </Text>
          <TextInput
            style={styles.input}
            placeholder={`e.g., ${currentYear}`}
            value={releaseYear}
            onChangeText={setReleaseYear}
            keyboardType="numeric"
            maxLength={4}
            placeholderTextColor="#999"
          />
        </View>

        {/* Status Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
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
        </View>

        {/* Poster Image */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Poster</Text>
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={showImageOptions}
          >
            {posterUri ? (
              <Image source={{ uri: posterUri }} style={styles.posterPreview} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="image-outline" size={50} color="#999" />
                <Text style={styles.placeholderText}>Tap to add poster</Text>
              </View>
            )}
          </TouchableOpacity>
          {posterUri && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setPosterUri(null)}
            >
              <Text style={styles.removeButtonText}>Remove Poster</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
          <Text style={styles.saveButtonText}>Save Movie</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
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
  imagePickerButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
    minHeight: 200,
  },
  placeholderContainer: {
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 10,
    color: "#999",
    fontSize: 14,
  },
  posterPreview: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FF5252",
    borderRadius: 8,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default AddMovieScreen;
