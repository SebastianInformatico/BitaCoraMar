import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initDb } from "./src/database/db";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import RecoverScreen from "./src/screens/RecoverScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RegistroScreen from "./src/screens/RegistroScreen";
import GastosScreen from "./src/screens/GastosScreen";
import VentasScreen from "./src/screens/VentasScreen";
import ReportesScreen from "./src/screens/ReportesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initDb();
        const storedUserId = await AsyncStorage.getItem("sessionUserId");
      } catch (error) {
      } finally {
        setReady(true);
      }
    };

    bootstrap();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4aa3df" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Crear cuenta" }}
        />
        <Stack.Screen
          name="Recover"
          component={RecoverScreen}
          options={{ title: "Recuperar acceso" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "BitaCoraMar" }}
        />
        <Stack.Screen
          name="Registro"
          component={RegistroScreen}
          options={{ title: "Registro productivo" }}
        />
        <Stack.Screen
          name="Gastos"
          component={GastosScreen}
          options={{ title: "Gastos" }}
        />
        <Stack.Screen
          name="Ventas"
          component={VentasScreen}
          options={{ title: "Ventas" }}
        />
        <Stack.Screen
          name="Reportes"
          component={ReportesScreen}
          options={{ title: "Reportes" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
