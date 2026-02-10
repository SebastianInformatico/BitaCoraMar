import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createUsuario } from "../database/usuarios";

const RegisterScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");

  const handleRegister = async () => {
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Faltan datos", "Completa nombre, email y password.");
      return;
    }
    if (!pregunta.trim() || !respuesta.trim()) {
      Alert.alert("Faltan datos", "Completa pregunta y respuesta.");
      return;
    }

    try {
      await createUsuario({
        nombre: nombre.trim(),
        email: email.trim(),
        password: password.trim(),
        pregunta: pregunta.trim(),
        respuesta: respuesta.trim(),
      });
      Alert.alert("Cuenta creada", "Ahora puedes iniciar sesion.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo crear el usuario.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#7aa9c7"
        value={nombre}
        onChangeText={setNombre}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Pregunta secreta"
        placeholderTextColor="#7aa9c7"
        value={pregunta}
        onChangeText={setPregunta}
      />
      <TextInput
        style={styles.input}
        placeholder="Respuesta secreta"
        placeholderTextColor="#7aa9c7"
        value={respuesta}
        onChangeText={setRespuesta}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
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
    fontSize: 22,
    color: "#2677b8",
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#b7d7ef",
    fontSize: 16,
  },
  button: {
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
});

export default RegisterScreen;
