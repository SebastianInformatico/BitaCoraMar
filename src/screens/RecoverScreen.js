import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { recoverPassword } from "../database/usuarios";

const RecoverScreen = () => {
  const [email, setEmail] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");

  const handleRecover = async () => {
    if (!email.trim() || !pregunta.trim() || !respuesta.trim()) {
      Alert.alert("Faltan datos", "Completa email, pregunta y respuesta.");
      return;
    }

    try {
      const password = await recoverPassword(
        email.trim(),
        pregunta.trim(),
        respuesta.trim()
      );
      if (!password) {
        Alert.alert("No encontrado", "La informacion no coincide.");
        return;
      }
      Alert.alert("Password recuperado", `Tu password es: ${password}`);
    } catch (error) {
      Alert.alert("Error", "No se pudo recuperar el password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar acceso</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleRecover}>
        <Text style={styles.buttonText}>Recuperar</Text>
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

export default RecoverScreen;
