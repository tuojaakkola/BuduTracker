import React, { useState } from "react";
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
import { createCategory, updateCategory } from "../services/api";
import { colors, spacing } from "../styles";
import { Category } from "../types";
import { ICON_OPTIONS, COLOR_OPTIONS } from "../utils/categoryUtils";

interface AddCategoryModalProps {
  visible: boolean;
  type: "income" | "expense";
  onClose: () => void;
  onSubmit: () => void;
  editMode?: boolean;
  initialData?: Category;
}

export default function AddCategoryModal({
  visible,
  type,
  onClose,
  onSubmit,
  editMode = false,
  initialData,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("cart");
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");
  const [loading, setLoading] = useState(false);

  // Update state when initialData changes
  React.useEffect(() => {
    if (editMode && initialData) {
      setName(initialData.name);
      setSelectedIcon(initialData.icon);
      setSelectedColor(initialData.color);
    } else {
      setName("");
      setSelectedIcon("cart");
      setSelectedColor("#FF6B6B");
    }
  }, [editMode, initialData, visible]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Virhe", "Anna kategorian nimi");
      return;
    }

    try {
      setLoading(true);
      if (editMode && initialData) {
        await updateCategory(initialData.id, {
          name: name.trim(),
          icon: selectedIcon,
          color: selectedColor,
        });
        Alert.alert("Onnistui", "Kategoria päivitetty");
      } else {
        await createCategory({
          name: name.trim(),
          type,
          icon: selectedIcon,
          color: selectedColor,
        });
        Alert.alert("Onnistui", "Kategoria luotu");
      }
      setName("");
      setSelectedIcon("cart");
      setSelectedColor("#FF6B6B");
      onSubmit();
    } catch (error) {
      Alert.alert(
        "Virhe",
        editMode
          ? "Kategorian päivitys epäonnistui"
          : "Kategorian luonti epäonnistui"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setSelectedIcon("cart");
    setSelectedColor("#FF6B6B");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {editMode
                ? "Muokkaa kategoriaa"
                : `Lisää ${type === "income" ? "tulo" : "meno"}kategoria`}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Category Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nimi</Text>
              <TextInput
                style={styles.input}
                placeholder="Kategorian nimi"
                placeholderTextColor={colors.text.muted}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Icon Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ikoni</Text>
              <View style={styles.iconGrid}>
                {ICON_OPTIONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconOption,
                      selectedIcon === icon && styles.iconOptionSelected,
                      {
                        backgroundColor:
                          selectedIcon === icon
                            ? selectedColor
                            : colors.background.tertiary,
                      },
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <MaterialCommunityIcons
                      name={icon as any}
                      size={24}
                      color={
                        selectedIcon === icon
                          ? colors.text.primary
                          : colors.text.secondary
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Color Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Väri</Text>
              <View style={styles.colorGrid}>
                {COLOR_OPTIONS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color="#fff"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Esikatselu</Text>
              <View style={styles.preview}>
                <View
                  style={[
                    styles.previewIcon,
                    { backgroundColor: selectedColor },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={selectedIcon as any}
                    size={32}
                    color="#fff"
                  />
                </View>
                <Text style={styles.previewText}>
                  {name || "Kategorian nimi"}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Peruuta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading
                  ? editMode
                    ? "Päivitetään..."
                    : "Luodaan..."
                  : editMode
                  ? "Tallenna"
                  : "Lisää"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.medium,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  content: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    backgroundColor: colors.background.tertiary,
  },
  iconOptionSelected: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: colors.success,
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: 12,
  },
  previewIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  previewText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  footer: {
    flexDirection: "row",
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.medium,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.background.tertiary,
  },
  cancelButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: colors.success,
  },
  submitButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
