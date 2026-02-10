import React, { useEffect, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { listRegistrosByUsuario, sumKilosByUsuario } from "../database/registros";
import { listGastosByUsuario, sumGastosByUsuario } from "../database/gastos";
import { listVentasByUsuario, sumVentasByUsuario } from "../database/ventas";
import { exportReportToCSV, exportReportToPDF } from "../services/exportService";

const ReportesScreen = () => {
  const [loading, setLoading] = useState(true);
  const [kilosTotales, setKilosTotales] = useState(0);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [registros, setRegistros] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [gastos, setGastos] = useState([]);

  const loadData = async () => {
    setLoading(true);
    const storedUserId = await AsyncStorage.getItem("sessionUserId");
    if (!storedUserId) {
      setLoading(false);
      return;
    }
    const userId = Number(storedUserId);

    const [kilos, ventasSum, gastosSum, registrosList, ventasList, gastosList] =
      await Promise.all([
        sumKilosByUsuario(userId),
        sumVentasByUsuario(userId),
        sumGastosByUsuario(userId),
        listRegistrosByUsuario(userId),
        listVentasByUsuario(userId),
        listGastosByUsuario(userId),
      ]);

    setKilosTotales(Number(kilos));
    setTotalVentas(Number(ventasSum));
    setTotalGastos(Number(gastosSum));
    setRegistros(registrosList);
    setVentas(ventasList);
    setGastos(gastosList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resultado = totalVentas - totalGastos;

  const handleExportCSV = async () => {
    try {
      await exportReportToCSV(
        { kilosTotales, totalVentas, totalGastos, resultado },
        registros,
        ventas,
        gastos
      );
      Alert.alert("Exportacion lista", "CSV generado en tu dispositivo.");
    } catch (error) {
      Alert.alert("Error", "No se pudo exportar a CSV.");
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportReportToPDF(
        { kilosTotales, totalVentas, totalGastos, resultado },
        registros,
        ventas,
        gastos
      );
      Alert.alert("Exportacion lista", "PDF generado en tu dispositivo.");
    } catch (error) {
      Alert.alert("Error", "No se pudo exportar a PDF.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4aa3df" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen general</Text>
      <Text style={styles.item}>Kilos totales: {kilosTotales}</Text>
      <Text style={styles.item}>Total ventas: {totalVentas.toFixed(2)}</Text>
      <Text style={styles.item}>Total gastos: {totalGastos.toFixed(2)}</Text>
      <Text style={styles.resultado}>Resultado: {resultado.toFixed(2)}</Text>

      <TouchableOpacity style={styles.button} onPress={handleExportCSV}>
        <Text style={styles.buttonText}>Exportar a Excel (CSV)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleExportPDF}>
        <Text style={styles.buttonText}>Exportar a PDF</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondary} onPress={loadData}>
        <Text style={styles.secondaryText}>Actualizar resumen</Text>
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
  loading: {
    flex: 1,
    backgroundColor: "#e6f4ff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    color: "#2677b8",
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    fontSize: 16,
    color: "#3d6f95",
    marginBottom: 8,
  },
  resultado: {
    fontSize: 18,
    color: "#2677b8",
    fontWeight: "600",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4aa3df",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 17,
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
});

export default ReportesScreen;
