// src/components/SearchBar.js
import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/commonStyles";

const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={20}
        color={colors.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
      />
      {value !== "" && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;
