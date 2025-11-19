import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { useState } from "react";
import SummaryCard from "../../src/components/SummaryCard";
import MonthSelector from "../../src/components/MonthSelector";
import AddTransactionModal, {
  TransactionData,
} from "../../src/components/AddTransactionModal";
import TransactionItem from "../../src/components/TransactionItem";
import EmptyTransactionsList from "../../src/components/EmptyTransactionsList";
import { useSummaryData } from "../../src/hooks/useSummaryData";
import {
  createExpense,
  createIncome,
  updateExpense,
  updateIncome,
  deleteExpense,
  deleteIncome,
} from "../../src/services/api";
import { Expense, Income } from "../../src/types";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"income" | "expense">("income");
  const [displayCount, setDisplayCount] = useState(10);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editMode, setEditMode] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    Expense | Income | null
  >(null);
  const { expenses, incomes, loading, error, loadData } =
    useSummaryData(selectedDate);

  const handleOpenModal = (
    type: "income" | "expense",
    transaction?: Expense | Income
  ) => {
    setModalType(type);
    if (transaction) {
      setEditMode(true);
      setSelectedTransaction(transaction);
    } else {
      setEditMode(false);
      setSelectedTransaction(null);
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditMode(false);
    setSelectedTransaction(null);
  };

  const handleSubmit = async (data: TransactionData) => {
    try {
      if (editMode && data.id) {
        // Update existing transaction
        if (modalType === "income") {
          await updateIncome(data.id, {
            name: data.name,
            amount: parseFloat(data.amount),
            categoryId: parseInt(data.categoryId),
            date: data.date,
          });
          Alert.alert("Onnistui!", "Tulo päivitetty");
        } else {
          await updateExpense(data.id, {
            name: data.name,
            amount: parseFloat(data.amount),
            categoryId: parseInt(data.categoryId),
            date: data.date,
          });
          Alert.alert("Onnistui!", "Meno päivitetty");
        }
      } else {
        // Create new transaction
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
      }

      loadData();
      handleCloseModal();
    } catch (error) {
      Alert.alert("Virhe", "Tallennus epäonnistui");
      console.error("Submit error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (modalType === "income") {
        await deleteIncome(id);
        Alert.alert("Onnistui!", "Tulo poistettu");
      } else {
        await deleteExpense(id);
        Alert.alert("Onnistui!", "Meno poistettu");
      }

      loadData();
      handleCloseModal();
    } catch (error) {
      Alert.alert("Virhe", "Poisto epäonnistui");
      console.error("Delete error:", error);
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

  const monthlyTotalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );
  const monthlyTotalIncomes = incomes.reduce(
    (sum, inc) => sum + Number(inc.amount),
    0
  );

  const latestTransactions = [...expenses, ...incomes]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, displayCount);

  const allTransactions = [...expenses, ...incomes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const loadMoreTransactions = () => {
    if (displayCount < allTransactions.length) {
      setDisplayCount((prev) => prev + 10);
    }
  };

  // Change month handler
  const changeMonth = (direction: 1 | -1) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
    setDisplayCount(10);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MonthSelector
          selectedDate={selectedDate}
          onMonthChange={changeMonth}
        />
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
          totalIncomes={monthlyTotalIncomes}
          totalExpenses={monthlyTotalExpenses}
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
        <View style={styles.flatlistContainer}>
          <FlatList
            data={latestTransactions}
            keyExtractor={(item, index) => `${item.id}-${item.date}-${index}`}
            renderItem={({ item }) => (
              <TransactionItem
                item={item}
                onPress={() => {
                  const type =
                    item.category?.type === "income" ? "income" : "expense";
                  handleOpenModal(type, item);
                }}
              />
            )}
            scrollEnabled={false}
            onEndReached={loadMoreTransactions}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<EmptyTransactionsList />}
          />
        </View>
      </ScrollView>

      <AddTransactionModal
        visible={modalVisible}
        type={modalType}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        editMode={editMode}
        initialData={selectedTransaction || undefined}
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
  header: {
    width: "100%",
    backgroundColor: "#093807ff",
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1a1f1aff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollContainer: {
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 36,
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
    fontSize: 21,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 16,
    width: "90%",
  },
  addIncomeButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addExpenseButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  flatlistContainer: {
    width: "90%",
    paddingBottom: 65,
  },
});
