/**
 * Author: Nguyễn Ngọc Hân CE180049 - SE1816
 */
// src/styles/commonStyles.js
import { StyleSheet } from "react-native";

// Color Palette - Netflix-inspired Dark Theme
export const colors = {
  primary: "#E50914", // Netflix Red
  accent: "#FFD700", // Gold
  background: "#141414", // Đen nhạt
  surface: "#1F1F1F", // Xám đen
  text: "#333333", // Text chính (dark mode)
  textLight: "#FFFFFF", // Text sáng
  textSecondary: "#B3B3B3", // Text phụ
  border: "#E0E0E0", // Border
  cardBg: "#FFFFFF", // Background card
  watched: "#4CAF50", // Xanh lá - Watched status
  toWatch: "#2196F3", // Xanh dương - To Watch status
  favorite: "#FFD700", // Vàng - Favorite status
  error: "#F44336", // Đỏ - Error
  success: "#4CAF50", // Xanh lá - Success
  warning: "#FF9800", // Cam - Warning
  info: "#2196F3", // Xanh dương - Info
};

// Common Styles - Reusable across all screens
export const commonStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Text Styles
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
  },

  bodyText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },

  caption: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Card Styles
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  darkCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // Button Styles
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },

  // Input Styles
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.cardBg,
    color: colors.text,
  },

  // Status Badge Styles
  watchedBadge: {
    backgroundColor: colors.watched,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  toWatchBadge: {
    backgroundColor: colors.toWatch,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  favoriteBadge: {
    backgroundColor: colors.favorite,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  badgeText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: "600",
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
  },

  emptySubtext: {
    fontSize: 14,
    color: "#BBB",
    textAlign: "center",
    marginTop: 8,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },

  // Center Content
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Row Styles
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Shadow Styles
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  shadowLarge: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});
