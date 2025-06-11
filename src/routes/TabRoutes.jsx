import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/telas/DashboardScreen";
import TransacoesScreen from "../screens/telas/TransacoesScreen";
import CategoriasStackRoutes from "../routes/CategoriasStackRoutes";
import PerfilRoutes from "../routes/PerfilRoutes";
import AjudaScreen from "../screens/telas/AjudaScreen";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator();

export default function TabRoutes({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTintColor: "#E91E63",
        headerTitleStyle: { color: "#FF7F00", fontWeight: "bold" },
        tabBarActiveTintColor: "#FF7F00",
        tabBarInactiveTintColor: "gray",
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.replace("Login")}
          >
            <Ionicons name="exit-outline" size={25} color="#FF7F00" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tab.Screen
        name="Perfil"
        component={PerfilRoutes}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Transações"
        component={TransacoesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Categorias"
        component={CategoriasStackRoutes}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ajuda"
        component={AjudaScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
