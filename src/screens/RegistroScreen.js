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
  createRegistro,
  deleteRegistro,
  listRegistrosByUsuario,
  updateRegistro,
} from "../database/registros";

const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

const RegistroScreen = () => {
  const [usuarioId, setUsuarioId] = useState(null);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [proveedor, setProveedor] = useState("");
  const [kilos, setKilos] = useState("");
  const [calibre, setCalibre] = useState("");
  const [fechaSiembra, setFechaSiembra] = useState("");
  const [fechaListo, setFechaListo] = useState("");
  const [proceso, setProceso] = useState("");
  const [lineaSector, setLineaSector] = useState("");
  const [observacion, setObservacion] = useState("");

  const loadData = async (userId) => {
    const data = await listRegistrosByUsuario(userId);
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
    setProveedor("");
    setKilos("");
    setCalibre("");
    setFechaSiembra("");
    setFechaListo("");
    setProceso("");
    setLineaSector("");
    setObservacion("");
    setEditingId(null);
  };

  const validateForm = () => {
    if (!proveedor.trim() || !kilos.trim() || !calibre.trim()) {
      Alert.alert("Faltan datos", "Completa proveedor, kilos y calibre.");
      return false;
    }
    if (!fechaSiembra.trim() || !dateRegex.test(fechaSiembra.trim())) {
      Alert.alert("Fecha invalida", "Usa formato dd-mm-aaaa en fecha de siembra.");
      return false;
    }
    if (!fechaListo.trim() || !dateRegex.test(fechaListo.trim())) {
      Alert.alert("Fecha invalida", "Usa formato dd-mm-aaaa en fecha listo.");
      return false;
    }
    if (!proceso.trim() || !lineaSector.trim()) {
      Alert.alert("Faltan datos", "Completa proceso y linea/sector.");
      return false;
    }
    if (Number.isNaN(Number(kilos)) || Number(kilos) <= 0) {
      Alert.alert("Kilos invalidos", "Ingresa un valor numerico mayor a 0.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!usuarioId) return;
    if (!validateForm()) return;

    const payload = {
      proveedor: proveedor.trim(),
      kilos: Number(kilos),
      calibre: calibre.trim(),
      fecha_siembra: fechaSiembra.trim(),
      fecha_listo: fechaListo.trim(),
      proceso: proceso.trim(),
      linea_sector: lineaSector.trim(),
      observacion: observacion.trim(),
      usuario_id: usuarioId,
    };

    try {
      if (editingId) {
        await updateRegistro({ id: editingId, ...payload });
      } else {
        await createRegistro(payload);
      }
      await loadData(usuarioId);
      resetForm();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el registro.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setProveedor(item.proveedor);
    setKilos(String(item.kilos));
    setCalibre(item.calibre);
    setFechaSiembra(item.fecha_siembra);
    setFechaListo(item.fecha_listo);
    setProceso(item.proceso);
    setLineaSector(item.linea_sector);
    setObservacion(item.observacion || "");
  };

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "Deseas eliminar este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteRegistro(id);
          await loadData(usuarioId);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registro productivo</Text>

      <TextInput
        style={styles.input}
        placeholder="Proveedor"
        placeholderTextColor="#7aa9c7"
        value={proveedor}
        onChangeText={setProveedor}
      />
      <TextInput
        style={styles.input}
        placeholder="Kilos"
        placeholderTextColor="#7aa9c7"
        keyboardType="numeric"
        value={kilos}
        onChangeText={setKilos}
      />
      <TextInput
        style={styles.input}
        placeholder="Calibre"
        placeholderTextColor="#7aa9c7"
        value={calibre}
        onChangeText={setCalibre}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha siembra (dd-mm-aaaa)"
        placeholderTextColor="#7aa9c7"
        value={fechaSiembra}
        onChangeText={setFechaSiembra}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha listo (dd-mm-aaaa)"
        placeholderTextColor="#7aa9c7"
        value={fechaListo}
        onChangeText={setFechaListo}
      />
      <TextInput
        style={styles.input}
        placeholder="Proceso (engorda / cosecha)"
        placeholderTextColor="#7aa9c7"
        value={proceso}
        onChangeText={setProceso}
      />
      <TextInput
        style={styles.input}
        placeholder="Linea / Sector"
        placeholderTextColor="#7aa9c7"
        value={lineaSector}
        onChangeText={setLineaSector}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Observacion"
        placeholderTextColor="#7aa9c7"
        value={observacion}
        onChangeText={setObservacion}
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

      <Text style={styles.sectionTitle}>Registros recientes</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.proveedor}</Text>
            <Text style={styles.cardText}>Kilos: {item.kilos}</Text>
            <Text style={styles.cardText}>Calibre: {item.calibre}</Text>
            <Text style={styles.cardText}>Siembra: {item.fecha_siembra}</Text>
            <Text style={styles.cardText}>Listo: {item.fecha_listo}</Text>
            <Text style={styles.cardText}>Proceso: {item.proceso}</Text>
            <Text style={styles.cardText}>Linea/Sector: {item.linea_sector}</Text>
            {item.observacion ? (
              <Text style={styles.cardText}>Obs: {item.observacion}</Text>
            ) : null}
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

export default RegistroScreen;
