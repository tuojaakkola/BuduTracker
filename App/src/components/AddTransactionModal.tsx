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
import { fetchCategoriesByType } from "../services/api";
import { Category } from "../types";

interface AddTransactionModalProps {
  visible: boolean;
  type: "income" | "expense";
  onClose: () => void;
  onSubmit: (data: TransactionData) => void;
}

export interface TransactionData {
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
}: AddTransactionModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    if (!amount.trim() || isNaN(parseFloat(amount))) {
      setMessage("Tapahtumalla täytyy olla summa");
      return;
    }
    if (parseFloat(amount) <= 0) {
      setMessage("Summa täytyy olla positiivinen luku");
      return;
    }
    if (!categoryId) {
      setMessage("Tapahtumalla täytyy olla kategoria");
      return;
    }

    onSubmit({
      name: name.trim(),
      amount: amount.trim(),
      categoryId,
      date: new Date().toISOString(),
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

  const title = type === "income" ? "Lisää Tulo" : "Lisää Meno";
  const buttonColor = type === "income" ? "#0b7708ff" : "#4d0e0eff";

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
                placeholder="Esim. Ruokaostokset"
                placeholderTextColor="#7a8a7aff"
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
                placeholder="0.00"
                placeholderTextColor="#7a8a7aff"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
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
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
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
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: buttonColor }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Tallenna</Text>
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
    backgroundColor: "#1a1f1aff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2d3d2dff",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ecececff",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2d3d2dff",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#ecececff",
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ecececff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2d3d2dff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#ecececff",
    borderWidth: 1,
    borderColor: "#3d4d3dff",
  },
  inputError: {
    borderColor: "#dc2626",
    backgroundColor: "#3d2626",
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryContainerError: {
    opacity: 0.6,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d3d2dff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryButtonSelected: {
    borderColor: "#4ade80",
    backgroundColor: "#0f2f0fff",
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  categoryTextSelected: {
    color: "#ecececff",
    fontWeight: "600",
  },
  loadingText: {
    color: "#7a8a7aff",
    fontSize: 14,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ecececff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
