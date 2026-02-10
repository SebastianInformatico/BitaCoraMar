import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUsuarioById } from "../database/usuarios";

const HomeScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const storedUserId = await AsyncStorage.getItem("sessionUserId");
      if (!storedUserId) {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        return;
      }

      const user = await getUsuarioById(Number(storedUserId));
      setNombre(user ? user.nombre : "");
    };

    const unsubscribe = navigation.addListener("focus", loadUser);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("sessionUserId");
    Alert.alert("Sesion cerrada", "Hasta pronto.");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido{nombre ? ", " + nombre : ""}</Text>
      <Text style={styles.subtitle}>Unidad oficial: KILOS</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Registro")}
      >
        <Text style={styles.buttonText}>Registro productivo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Gastos")}
      >
        <Text style={styles.buttonText}>Gastos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Ventas")}
      >
        <Text style={styles.buttonText}>Ventas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Reportes")}
      >
        <Text style={styles.buttonText}>Reportes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f4ff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#2677b8",
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#3d6f95",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4aa3df",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  logout: {
    marginTop: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#3d6f95",
    fontSize: 16,
  },
});

export default HomeScreen;
