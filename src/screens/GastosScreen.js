import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createGasto,
  deleteGasto,
  listGastosByUsuario,
  updateGasto,
} from "../database/gastos";

const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

const GastosScreen = () => {
  const [usuarioId, setUsuarioId] = useState(null);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [nota, setNota] = useState("");

  const loadData = async (userId) => {
    const data = await listGastosByUsuario(userId);
    setItems(data);
  };

  useEffect(() => {
    const loadSession = async () => {
      const storedUserId = await AsyncStorage.getItem("sessionUserId");
      if (storedUserId) {
        const id = Number(storedUserId);
        setUsuarioId(id);
        loadData(id);
      }
    };

    loadSession();
  }, []);

  const resetForm = () => {
    setCategoria("");
    setMonto("");
    setFecha("");
    setNota("");
    setEditingId(null);
  };

  const validateForm = () => {
    if (!categoria.trim() || !monto.trim()) {
      Alert.alert("Faltan datos", "Completa categoria y monto.");
      return false;
    }
    if (!fecha.trim() || !dateRegex.test(fecha.trim())) {
      Alert.alert("Fecha invalida", "Usa formato dd-mm-aaaa.");
      return false;
    }
    if (Number.isNaN(Number(monto)) || Number(monto) <= 0) {
      Alert.alert("Monto invalido", "Ingresa un valor numerico mayor a 0.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!usuarioId) return;
    if (!validateForm()) return;

    const payload = {
      categoria: categoria.trim(),
      monto: Number(monto),
      fecha: fecha.trim(),
      nota: nota.trim(),
      usuario_id: usuarioId,
    };

    try {
      if (editingId) {
        await updateGasto({ id: editingId, ...payload });
      } else {
        await createGasto(payload);
      }
      await loadData(usuarioId);
      resetForm();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el gasto.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setCategoria(item.categoria);
    setMonto(String(item.monto));
    setFecha(item.fecha);
    setNota(item.nota || "");
  };

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "Deseas eliminar este gasto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteGasto(id);
          await loadData(usuarioId);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gastos</Text>

      <TextInput
        style={styles.input}
        placeholder="Categoria"
        placeholderTextColor="#7aa9c7"
        value={categoria}
        onChangeText={setCategoria}
      />
      <TextInput
        style={styles.input}
        placeholder="Monto"
        placeholderTextColor="#7aa9c7"
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha (dd-mm-aaaa)"
        placeholderTextColor="#7aa9c7"
        value={fecha}
        onChangeText={setFecha}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Nota"
        placeholderTextColor="#7aa9c7"
        value={nota}
        onChangeText={setNota}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {editingId ? "Actualizar" : "Guardar"}
        </Text>
      </TouchableOpacity>

      {editingId && (
        <TouchableOpacity style={styles.secondary} onPress={resetForm}>
          <Text style={styles.secondaryText}>Cancelar edicion</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Gastos recientes</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.categoria}</Text>
            <Text style={styles.cardText}>Monto: {item.monto}</Text>
            <Text style={styles.cardText}>Fecha: {item.fecha}</Text>
            {item.nota ? <Text style={styles.cardText}>Nota: {item.nota}</Text> : null}
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.cardButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cardButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.cardButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
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
  sectionTitle: {
    fontSize: 18,
    color: "#3d6f95",
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 12,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4aa3df",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  secondary: {
    alignItems: "center",
    paddingVertical: 12,
  },
  secondaryText: {
    color: "#3d6f95",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#b7d7ef",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2677b8",
    marginBottom: 6,
  },
  cardText: {
    color: "#3d6f95",
    marginBottom: 2,
  },
  cardActions: {
    flexDirection: "row",
    marginTop: 8,
  },
  cardButton: {
    backgroundColor: "#4aa3df",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#d9534f",
  },
  cardButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default GastosScreen;
