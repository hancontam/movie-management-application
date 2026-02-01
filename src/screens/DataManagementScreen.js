// src/screens/DataManagementScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import {
  exportMoviesData,
  importMoviesData,
  getAllMovies,
} from "../database/db";
import { colors, commonStyles } from "../styles/commonStyles";

const DataManagementScreen = ({ navigation }) => {
  const [movieCount, setMovieCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Load movie count
  const loadMovieCount = () => {
    const movies = getAllMovies();
    setMovieCount(movies.length);
  };

  useFocusEffect(
    useCallback(() => {
      loadMovieCount();
    }, []),
  );

  // Export data to JSON file
  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Get all movies data
      const moviesData = exportMoviesData();

      if (moviesData.length === 0) {
        Alert.alert("No Data", "There are no movies to export");
        setIsExporting(false);
        return;
      }

      // Create JSON string
      const jsonString = JSON.stringify(moviesData, null, 2);

      // Create file name with timestamp
      const timestamp = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .split(".")[0];
      const fileName = `movies_backup_${timestamp}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Write file
      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        // Share the file
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Export Movies Data",
          UTI: "public.json",
        });

        Alert.alert(
          "Export Successful",
          `Exported ${moviesData.length} movies to ${fileName}`,
        );
      } else {
        Alert.alert(
          "Export Successful",
          `File saved to: ${fileUri}\n\nSharing is not available on this device.`,
        );
      }

      setIsExporting(false);
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Export Failed", error.message || "Failed to export data");
      setIsExporting(false);
    }
  };

  // Import data from JSON file
  const handleImport = async (overwrite = false) => {
    try {
      setIsImporting(true);

      // Pick a document
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

      // Read file content
      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);

      // Parse JSON
      let moviesData;
      try {
        moviesData = JSON.parse(fileContent);
      } catch (parseError) {
        Alert.alert(
          "Invalid File",
          "The selected file is not a valid JSON file",
        );
        setIsImporting(false);
        return;
      }

      // Validate data structure
      if (!Array.isArray(moviesData)) {
        Alert.alert(
          "Invalid Format",
          "The JSON file does not contain a valid movies array",
        );
        setIsImporting(false);
        return;
      }

      // Import data
      const importResult = importMoviesData(moviesData, overwrite);

      // Show results
      const totalProcessed =
        importResult.success + importResult.failed + importResult.skipped;
      let message = `Processed: ${totalProcessed} movies\n`;
      message += `✅ Success: ${importResult.success}\n`;

      if (importResult.skipped > 0) {
        message += `⏭️ Skipped: ${importResult.skipped} (already exist)\n`;
      }

      if (importResult.failed > 0) {
        message += `❌ Failed: ${importResult.failed}\n`;
      }

      Alert.alert("Import Complete", message);

      // Reload count
      loadMovieCount();
      setIsImporting(false);
    } catch (error) {
      console.error("Import error:", error);
      Alert.alert("Import Failed", error.message || "Failed to import data");
      setIsImporting(false);
    }
  };

  // Show import options dialog
  const showImportOptions = () => {
    Alert.alert("Import Options", "How should duplicate movies be handled?", [
      {
        text: "Skip Duplicates",
        onPress: () => handleImport(false),
      },
      {
        text: "Overwrite Duplicates",
        onPress: () => handleImport(true),
        style: "destructive",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  // Confirm export
  const confirmExport = () => {
    Alert.alert("Export Data", `Export ${movieCount} movies to JSON file?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Export",
        onPress: handleExport,
      },
    ]);
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="server" size={40} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Data Management</Text>
          <Text style={styles.headerSubtitle}>
            Backup and restore your movie collection
          </Text>
        </View>

        <View style={styles.contentContainer}>
          {/* Stats Card */}
          <View style={styles.statsCard}>
            <Ionicons name="film" size={32} color={colors.primary} />
            <View style={styles.statsContent}>
              <Text style={styles.statsNumber}>{movieCount}</Text>
              <Text style={styles.statsLabel}>
                {movieCount === 1 ? "Movie" : "Movies"} in Database
              </Text>
            </View>
          </View>

          {/* Export Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cloud-upload" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Export Data</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Create a backup of all your movies as a JSON file. You can share
              it or save it for later import.
            </Text>
            <TouchableOpacity
              style={[styles.actionButton, styles.exportButton]}
              onPress={confirmExport}
              disabled={isExporting || movieCount === 0}
            >
              {isExporting ? (
                <>
                  <Ionicons name="hourglass" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Exporting...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="download" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Export to JSON</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Import Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cloud-download" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Import Data</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Restore movies from a previously exported JSON file. You can
              choose to skip or overwrite duplicate entries.
            </Text>

            {/* Import Options Info */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#2196F3" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Duplicate Handling:</Text>
                <Text style={styles.infoText}>
                  • Skip: Keep existing movies{"\n"}• Overwrite: Replace with
                  imported data
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, styles.importButton]}
              onPress={showImportOptions}
              disabled={isImporting}
            >
              {isImporting ? (
                <>
                  <Ionicons name="hourglass" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Importing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="folder-open" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Import from JSON</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={styles.warningCard}>
            <Ionicons name="warning" size={24} color="#FF9800" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Important Notes:</Text>
              <Text style={styles.warningText}>
                • Always keep backups of your data{"\n"}• Exported files contain
                all movie information including posters{"\n"}• Import will
                validate the JSON format before processing{"\n"}• Large imports
                may take a moment to complete
              </Text>
            </View>
          </View>
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
  statsCard: {
    backgroundColor: colors.primary + "10",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  statsContent: {
    flex: 1,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
  },
  statsLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
    gap: 10,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1976D2",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  exportButton: {
    backgroundColor: colors.primary,
  },
  importButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  warningCard: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F57C00",
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
});

export default DataManagementScreen;
