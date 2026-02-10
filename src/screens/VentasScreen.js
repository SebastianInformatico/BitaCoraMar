import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createVenta,
  deleteVenta,
  listVentasByUsuario,
  updateVenta,
} from "../database/ventas";

const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

const VentasScreen = () => {
  const [usuarioId, setUsuarioId] = useState(null);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [comprador, setComprador] = useState("");
  const [kilos, setKilos] = useState("");
  const [precioKilo, setPrecioKilo] = useState("");
  const [fecha, setFecha] = useState("");
  const [pagado, setPagado] = useState(false);

  const loadData = async (userId) => {
    const data = await listVentasByUsuario(userId);
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
    setComprador("");
    setKilos("");
    setPrecioKilo("");
    setFecha("");
    setPagado(false);
    setEditingId(null);
  };

  const validateForm = () => {
    if (!comprador.trim() || !kilos.trim() || !precioKilo.trim()) {
      Alert.alert("Faltan datos", "Completa comprador, kilos y precio.");
      return false;
    }
    if (!fecha.trim() || !dateRegex.test(fecha.trim())) {
      Alert.alert("Fecha invalida", "Usa formato dd-mm-aaaa.");
      return false;
    }
    if (Number.isNaN(Number(kilos)) || Number(kilos) <= 0) {
      Alert.alert("Kilos invalidos", "Ingresa un valor numerico mayor a 0.");
      return false;
    }
    if (Number.isNaN(Number(precioKilo)) || Number(precioKilo) <= 0) {
      Alert.alert("Precio invalido", "Ingresa un valor numerico mayor a 0.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!usuarioId) return;
    if (!validateForm()) return;

    const payload = {
      comprador: comprador.trim(),
      kilos: Number(kilos),
      precio_kilo: Number(precioKilo),
      pagado,
      fecha: fecha.trim(),
      usuario_id: usuarioId,
    };

    try {
      if (editingId) {
        await updateVenta({ id: editingId, ...payload });
      } else {
        await createVenta(payload);
      }
      await loadData(usuarioId);
      resetForm();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la venta.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setComprador(item.comprador);
    setKilos(String(item.kilos));
    setPrecioKilo(String(item.precio_kilo));
    setFecha(item.fecha);
    setPagado(Boolean(item.pagado));
  };

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "Deseas eliminar esta venta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteVenta(id);
          await loadData(usuarioId);
        },
      },
    ]);
  };

  const total = Number(kilos || 0) * Number(precioKilo || 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ventas</Text>

      <TextInput
        style={styles.input}
        placeholder="Comprador"
        placeholderTextColor="#7aa9c7"
        value={comprador}
        onChangeText={setComprador}
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
        placeholder="Precio kilo"
        placeholderTextColor="#7aa9c7"
        keyboardType="numeric"
        value={precioKilo}
        onChangeText={setPrecioKilo}
      />
      <Text style={styles.helperText}>Total calculado: {total.toFixed(2)}</Text>
      <TextInput
        style={styles.input}
        placeholder="Fecha (dd-mm-aaaa)"
        placeholderTextColor="#7aa9c7"
        value={fecha}
        onChangeText={setFecha}
      />
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Pagado</Text>
        <Switch value={pagado} onValueChange={setPagado} />
      </View>

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

      <Text style={styles.sectionTitle}>Ventas recientes</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.comprador}</Text>
            <Text style={styles.cardText}>Kilos: {item.kilos}</Text>
            <Text style={styles.cardText}>Precio kilo: {item.precio_kilo}</Text>
            <Text style={styles.cardText}>Total: {item.total}</Text>
            <Text style={styles.cardText}>
              Estado: {item.pagado ? "Pagado" : "Pendiente"}
            </Text>
            <Text style={styles.cardText}>Fecha: {item.fecha}</Text>
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
  helperText: {
    color: "#3d6f95",
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  switchLabel: {
    color: "#2677b8",
    fontSize: 16,
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

export default VentasScreen;
