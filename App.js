import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// Import screens
import HomeScreen from "./src/screens/HomeScreen";
import AddMovieScreen from "./src/screens/AddMovieScreen";
import MovieDetailScreen from "./src/screens/MovieDetailScreen";
import SreachScreen from "./src/screens/SreachScreen";
import CategoryReportScreen from "./src/screens/CategoryReportScreen";
import FavoriteYearsReport from "./src/screens/FavoriteYearsReport";
import DashboardScreen from "./src/screens/DashboardScreen";
import DataManagementScreen from "./src/screens/DataManagementScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab 1: Home Stack (HomeScreen → AddMovie → MovieDetail)
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#E50914" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: "Movies" }}
      />
      <Stack.Screen
        name="AddMovie"
        component={AddMovieScreen}
        options={{ title: "Add Movie" }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetailScreen}
        options={{ title: "Movie Detail" }}
      />
    </Stack.Navigator>
  );
}

// Tab 3: Reports Stack (CategoryReport → FavoriteYearsReport)
function ReportsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#E50914" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="CategoryReport"
        component={CategoryReportScreen}
        options={{ title: "Category Report" }}
      />
      <Stack.Screen
        name="FavoriteYearsReport"
        component={FavoriteYearsReport}
        options={{ title: "Favorite Years" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Search") {
              iconName = focused ? "search" : "search-outline";
            } else if (route.name === "Reports") {
              iconName = focused ? "bar-chart" : "bar-chart-outline";
            } else if (route.name === "Dashboard") {
              iconName = focused ? "stats-chart" : "stats-chart-outline";
            } else if (route.name === "Data") {
              iconName = focused ? "folder" : "folder-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#E50914",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0",
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ title: "Home" }}
        />
        <Tab.Screen
          name="Search"
          component={SreachScreen}
          options={{
            title: "Search",
            headerShown: true,
            headerStyle: { backgroundColor: "#E50914" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
        <Tab.Screen
          name="Reports"
          component={ReportsStack}
          options={{ title: "Reports" }}
        />
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: "Dashboard",
            headerShown: true,
            headerStyle: { backgroundColor: "#E50914" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
        <Tab.Screen
          name="Data"
          component={DataManagementScreen}
          options={{
            title: "Data",
            headerShown: true,
            headerStyle: { backgroundColor: "#E50914" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
