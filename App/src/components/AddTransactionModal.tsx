import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchCategoriesByType } from "../services/api";
import { Category, Expense, Income } from "../types";
import { parseLocaleCurrency, formatCurrency } from "../utils/formatUtils";
import { colors, spacing, typography, theme } from "../styles";

interface AddTransactionModalProps {
  visible: boolean;
  type: "income" | "expense";
  onClose: () => void;
  onSubmit: (data: TransactionData) => void;
  onDelete?: (id: number) => void;
  editMode?: boolean;
  initialData?: Expense | Income;
}

export interface TransactionData {
  id?: number;
  name: string;
  amount: string;
  categoryId: string;
  date: string;
}

export default function AddTransactionModal({
  visible,
  type,
  onClose,
  onSubmit,
  onDelete,
  editMode = false,
  initialData,
}: AddTransactionModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load initial data when in edit mode
  useEffect(() => {
    if (visible && editMode && initialData) {
      setName(initialData.name);
      setAmount(formatCurrency(initialData.amount));
      setCategoryId(initialData.categoryId.toString());
    } else if (visible && !editMode) {
      setName("");
      setAmount("");
      setCategoryId("");
    }
  }, [visible, editMode, initialData]);

  // Search categories when modal opens
  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible, type]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategoriesByType(type);
      setCategories(data);
    } catch (error) {
      Alert.alert("Virhe", "Kategorioiden lataus epäonnistui");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setMessage("Tapahtumalla täytyy olla nimi");
      return;
    }
    const parsedAmount = parseLocaleCurrency(amount.trim());
    if (!amount.trim() || isNaN(parsedAmount)) {
      setMessage("Tapahtumalla täytyy olla summa");
      return;
    }
    if (parsedAmount <= 0) {
      setMessage("Summa täytyy olla positiivinen luku");
      return;
    }
    if (!categoryId) {
      setMessage("Tapahtumalla täytyy olla kategoria");
      return;
    }

    onSubmit({
      ...(editMode && initialData ? { id: initialData.id } : {}),
      name: name.trim(),
      amount: parsedAmount.toString(),
      categoryId,
      date:
        editMode && initialData ? initialData.date : new Date().toISOString(),
    });

    setName("");
    setAmount("");
    setCategoryId("");
    setMessage("");
  };

  const handleClose = () => {
    setName("");
    setAmount("");
    setCategoryId("");
    setMessage("");
    onClose();
  };

  const title = editMode
    ? type === "income"
      ? "Muokkaa Tuloa"
      : "Muokkaa Menoa"
    : type === "income"
    ? "Lisää Tulo"
    : "Lisää Meno";
  const buttonColor = type === "income" ? colors.success : colors.danger;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nimi *</Text>
              <TextInput
                style={[
                  styles.input,
                  message === "Tapahtumalla täytyy olla nimi" &&
                    styles.inputError,
                ]}
                placeholder="Tapahtuman nimi"
                placeholderTextColor={colors.text.muted}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (message === "Tapahtumalla täytyy olla nimi") {
                    setMessage("");
                  }
                }}
              />
              {message === "Tapahtumalla täytyy olla nimi" && (
                <Text style={styles.errorMessage}>{message}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Summa (€) *</Text>
              <TextInput
                style={[
                  styles.input,
                  (message === "Tapahtumalla täytyy olla summa" ||
                    message === "Summa täytyy olla positiivinen luku") &&
                    styles.inputError,
                ]}
                placeholder="0,00"
                placeholderTextColor={colors.text.muted}
                value={amount}
                onChangeText={(text) => {
                  // Replace dots with commas automatically
                  const formattedText = text.replace(".", ",");
                  setAmount(formattedText);
                  if (
                    message === "Tapahtumalla täytyy olla summa" ||
                    message === "Summa täytyy olla positiivinen luku"
                  ) {
                    setMessage("");
                  }
                }}
                keyboardType="decimal-pad"
              />
              {(message === "Tapahtumalla täytyy olla summa" ||
                message === "Summa täytyy olla positiivinen luku") && (
                <Text style={styles.errorMessage}>{message}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kategoria *</Text>
              <View
                style={[
                  styles.categoryContainer,
                  message === "Tapahtumalla täytyy olla kategoria" &&
                    styles.categoryContainerError,
                ]}
              >
                {loading ? (
                  <Text style={styles.loadingText}>Ladataan...</Text>
                ) : (
                  categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        categoryId === category.id.toString() &&
                          styles.categoryButtonSelected,
                      ]}
                      onPress={() => {
                        setCategoryId(category.id.toString());
                        if (message === "Tapahtumalla täytyy olla kategoria") {
                          setMessage("");
                        }
                      }}
                    >
                      <View
                        style={[
                          styles.categoryIconContainer,
                          { backgroundColor: category.color },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={(category.icon as any) || "help-circle"}
                          size={20}
                          color={colors.text.primary}
                        />
                      </View>
                      <Text
                        style={[
                          styles.categoryText,
                          categoryId === category.id.toString() &&
                            styles.categoryTextSelected,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
              {message === "Tapahtumalla täytyy olla kategoria" && (
                <Text style={styles.errorMessage}>{message}</Text>
              )}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            {editMode && onDelete && initialData && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  Alert.alert(
                    "Poista tapahtuma",
                    "Haluatko varmasti poistaa tämän tapahtuman?",
                    [
                      { text: "Peruuta", style: "cancel" },
                      {
                        text: "Poista",
                        style: "destructive",
                        onPress: () => {
                          onDelete(initialData.id);
                          handleClose();
                        },
                      },
                    ]
                  );
                }}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.deleteButtonText}>Poista</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: editMode ? colors.success : buttonColor },
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {editMode ? "Päivitä" : "Tallenna"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.medium,
  },
  modalTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
  formContainer: {
    padding: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.xxl,
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: spacing.md,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.background.tertiary,
  },
  errorMessage: {
    color: colors.danger,
    fontSize: typography.sizes.sm,
    marginTop: spacing.sm,
    fontWeight: typography.weights.semibold,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  categoryContainerError: {
    opacity: 0.6,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: "transparent",
    gap: spacing.sm,
  },
  categoryButtonSelected: {
    borderColor: colors.success,
    backgroundColor: colors.background.primary,
  },
  categoryIconContainer: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: {
    fontSize: typography.sizes.base,
    color: colors.text.muted,
  },
  categoryTextSelected: {
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.danger,
    gap: spacing.sm,
  },
  deleteButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  submitButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  submitButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});
