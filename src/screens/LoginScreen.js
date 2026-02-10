import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUsuario } from "../database/usuarios";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const storedUserId = await AsyncStorage.getItem("sessionUserId");
      if (storedUserId) {
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      }
    };

    const unsubscribe = navigation.addListener("focus", checkSession);
    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Falta informacion", "Completa email y password.");
      return;
    }

    try {
      const user = await loginUsuario(email.trim(), password.trim());
      if (!user) {
        Alert.alert("Acceso denegado", "Credenciales incorrectas.");
        return;
      }
      await AsyncStorage.setItem("sessionUserId", String(user.id));
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (error) {
      Alert.alert("Error", "No se pudo iniciar sesion.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BitaCoraMar</Text>
      <Text style={styles.subtitle}>Control productivo offline</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#7aa9c7"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7aa9c7"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.linkText}>Crear cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("Recover")}
      >
        <Text style={styles.linkText}>Recuperar acceso</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f4ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: "#2677b8",
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#3d6f95",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#b7d7ef",
  },
  button: {
    width: "100%",
    backgroundColor: "#4aa3df",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  link: {
    marginTop: 14,
  },
  linkText: {
    color: "#2677b8",
    fontSize: 16,
  },
});

export default LoginScreen;
