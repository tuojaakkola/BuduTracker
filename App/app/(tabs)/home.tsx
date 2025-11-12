import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import SummaryCard from "../../src/components/SummaryCard";
import AddTransactionModal, {
  TransactionData,
} from "../../src/components/AddTransactionModal";
import { useSummaryData } from "../../src/hooks/useSummaryData";
import { createExpense, createIncome } from "../../src/services/api";
import { useState } from "react";

export default function HomeScreen() {
  const { totalIncomes, totalExpenses, loading, error, loadData } =
    useSummaryData();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"income" | "expense">("income");

  const handleOpenModal = (type: "income" | "expense") => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async (data: TransactionData) => {
    try {
      if (modalType === "income") {
        await createIncome({
          name: data.name,
          amount: parseFloat(data.amount),
          categoryId: parseInt(data.categoryId),
          date: data.date,
        });
        Alert.alert("Onnistui!", "Tulo lisätty");
      } else {
        await createExpense({
          name: data.name,
          amount: parseFloat(data.amount),
          categoryId: parseInt(data.categoryId),
          date: data.date,
        });
        Alert.alert("Onnistui!", "Meno lisätty");
      }

      // Päivitä data
      loadData();
      handleCloseModal();
    } catch (error) {
      Alert.alert("Virhe", "Tallennus epäonnistui");
      console.error("Submit error:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0b7708ff" />
        <Text style={{ color: "#ecececff", marginTop: 10 }}>Ladataan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text
          style={{
            color: "#ff6b6b",
            fontSize: 16,
            textAlign: "center",
            marginHorizontal: 20,
          }}
        >
          {error}
        </Text>
        <TouchableOpacity
          onPress={loadData}
          style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 10,
            backgroundColor: "#0b7708ff",
          }}
        >
          <Text style={{ color: "#94ca94ff", fontWeight: "bold" }}>
            Yritä uudelleen
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", top: 40, zIndex: 10 }}>
        <Text
          style={{
            color: "#ecececff",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Syyskuu 2024
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>Kuukauden tilanne</Text>
        </View>

        <SummaryCard
          totalIncomes={totalIncomes}
          totalExpenses={totalExpenses}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleOpenModal("income")}
            style={styles.addIncomeButton}
          >
            <Text style={styles.buttonText}>+ Lisää Tulo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOpenModal("expense")}
            style={styles.addExpenseButton}
          >
            <Text style={styles.buttonText}>- Lisää Meno</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>Viimeisimmät tapahtumat</Text>
        </View>
      </ScrollView>

      <AddTransactionModal
        visible={modalVisible}
        type={modalType}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#093807ff",
    alignItems: "center",
  },
  scrollContainer: {
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 24,
  },
  titleSection: {
    width: "90%",
    marginBottom: 12,
  },
  eventsSection: {
    width: "90%",
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#ecececff",
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
    width: "90%",
  },
  addIncomeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#0b7708ff",
    alignItems: "center",
    justifyContent: "center",
  },
  addExpenseButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#4d0e0eff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ecececff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
