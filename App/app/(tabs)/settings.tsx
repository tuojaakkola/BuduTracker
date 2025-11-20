import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  fetchCategories,
  deleteCategory,
  fetchSettings,
  updateSettings,
} from "../../src/services/api";
import { Category, Settings as SettingsType } from "../../src/types";
import AddCategoryModal from "../../src/components/AddCategoryModal";
import { colors, spacing } from "../../src/styles";

export default function Settings() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<"income" | "expense">(
    "expense"
  );
  const [showExpenseCategories, setShowExpenseCategories] = useState(false);
  const [showIncomeCategories, setShowIncomeCategories] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  // Budget settings
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      Alert.alert("Virhe", "Kategorioiden lataus epäonnistui");
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setBudgetEnabled(data.budgetEnabled);
      setBudgetAmount(
        data.budgetAmount > 0 ? data.budgetAmount.toString() : ""
      );
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCategories();
      loadSettings();
    }, [])
  );

  const handleDeleteCategory = async (category: Category) => {
    Alert.alert(
      "Poista kategoria",
      `Haluatko varmasti poistaa kategorian "${category.name}"?`,
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Poista",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(category.id);
              Alert.alert("Onnistui", "Kategoria poistettu");
              loadCategories();
            } catch (error: any) {
              Alert.alert(
                "Virhe",
                error.message || "Kategorian poisto epäonnistui"
              );
            }
          },
        },
      ]
    );
  };

  const handleAddCategory = () => {
    loadCategories();
    setModalVisible(false);
    setEditMode(false);
    setSelectedCategory(undefined);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setSelectedType(category.type);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleOpenAddModal = (type: "income" | "expense") => {
    setSelectedType(type);
    setEditMode(false);
    setSelectedCategory(undefined);
    setModalVisible(true);
  };

  const handleSaveBudget = async () => {
    try {
      setSettingsLoading(true);
      const amount = parseFloat(budgetAmount);

      if (budgetEnabled && (isNaN(amount) || amount <= 0)) {
        Alert.alert("Virhe", "Anna kelvollinen budjettisumma");
        return;
      }

      await updateSettings({
        budgetEnabled,
        budgetAmount: budgetEnabled ? amount : 0,
      });

      Alert.alert("Onnistui", "Budjettiasetukset tallennettu");
    } catch (error) {
      Alert.alert("Virhe", "Asetusten tallennus epäonnistui");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleToggleBudget = async (value: boolean) => {
    setBudgetEnabled(value);

    // If disabling, save immediately
    if (!value) {
      try {
        await updateSettings({
          budgetEnabled: false,
          budgetAmount: 0,
        });
      } catch (error) {
        console.error("Error disabling budget:", error);
      }
    }
  };

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Asetukset</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.categoriesTitle}>Kategoriat</Text>

        {/* Expense Categories */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.collapsibleHeader}
            onPress={() => setShowExpenseCategories(!showExpenseCategories)}
          >
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons
                name={showExpenseCategories ? "chevron-down" : "chevron-right"}
                size={24}
                color={colors.text.primary}
              />
              <Text style={styles.sectionTitle}>
                Menokategoriat ({expenseCategories.length})
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={(e) => {
                e.stopPropagation();
                handleOpenAddModal("expense");
              }}
            >
              <MaterialCommunityIcons
                name="plus"
                size={24}
                color={colors.success}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          {showExpenseCategories &&
            expenseCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleEditCategory(category)}
              >
                <View style={styles.categoryInfo}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: category.color },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={category.icon as any}
                      size={24}
                      color="#fff"
                    />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEditCategory(category);
                    }}
                    style={styles.editButton}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={18}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category);
                    }}
                    style={styles.deleteButton}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={18}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Income Categories */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.collapsibleHeader}
            onPress={() => setShowIncomeCategories(!showIncomeCategories)}
          >
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons
                name={showIncomeCategories ? "chevron-down" : "chevron-right"}
                size={24}
                color={colors.text.primary}
              />
              <Text style={styles.sectionTitle}>
                Tulokategoriat ({incomeCategories.length})
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={(e) => {
                e.stopPropagation();
                handleOpenAddModal("income");
              }}
            >
              <MaterialCommunityIcons
                name="plus"
                size={24}
                color={colors.success}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          {showIncomeCategories &&
            incomeCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleEditCategory(category)}
              >
                <View style={styles.categoryInfo}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: category.color },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={category.icon as any}
                      size={24}
                      color="#fff"
                    />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEditCategory(category);
                    }}
                    style={styles.editButton}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={18}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category);
                    }}
                    style={styles.deleteButton}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={18}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Budget Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kuukausibudjetti</Text>

          <View style={[styles.budgetContainer, { marginTop: spacing.md }]}>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetLabel}>Budjettiseuranta</Text>
              <Switch
                value={budgetEnabled}
                onValueChange={handleToggleBudget}
                trackColor={{
                  false: colors.text.muted,
                  true: colors.background.secondary,
                }}
                thumbColor={
                  budgetEnabled ? colors.success : colors.background.tertiary
                }
              />
            </View>

            {budgetEnabled && (
              <>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Kuukausibudjetti (€)</Text>
                  <TextInput
                    style={styles.budgetInput}
                    placeholder="Esim. 1500"
                    placeholderTextColor={colors.text.muted}
                    value={budgetAmount}
                    onChangeText={(text) => {
                      const formattedText = text.replace(".", ",");
                      setBudgetAmount(formattedText);
                    }}
                    keyboardType="decimal-pad"
                  />
                </View>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveBudget}
                  disabled={settingsLoading}
                >
                  <MaterialCommunityIcons
                    name="content-save"
                    size={20}
                    color={colors.text.primary}
                  />
                  <Text style={styles.saveButtonText}>
                    {settingsLoading ? "Tallennetaan..." : "Tallenna"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <AddCategoryModal
        visible={modalVisible}
        type={selectedType}
        onClose={() => {
          setModalVisible(false);
          setEditMode(false);
          setSelectedCategory(undefined);
        }}
        onSubmit={handleAddCategory}
        editMode={editMode}
        initialData={selectedCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: "center",
  },
  header: {
    width: "100%",
    backgroundColor: "rgba(9, 56, 7, 0.95)",
    paddingTop: 60,
    paddingBottom: spacing.xxl,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 30,
    fontWeight: "bold",
  },
  content: {
    width: "100%",
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  categoriesTitle: {
    color: colors.text.primary,
    fontSize: 21,
    fontWeight: "bold",
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  addButton: {
    padding: spacing.xs,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  categoryName: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  editButton: {
    padding: spacing.sm,
    opacity: 0.6,
  },
  deleteButton: {
    padding: spacing.sm,
    opacity: 0.6,
  },
  budgetContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 12,
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: spacing.lg,
  },
  budgetLabel: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  inputWrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  budgetInput: {
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: 8,
    gap: spacing.sm,
  },
  saveButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: "600",
  },
});
