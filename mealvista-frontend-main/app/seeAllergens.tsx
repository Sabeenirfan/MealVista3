import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCart } from "../contexts/CartContext";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
}

export default function SeeAllergens() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addToCart } = useCart();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const mealTitle = params.mealTitle as string || "Classic Pasta Carbonara";
  const mealImage = params.mealImage as string || "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800";

  const allergens = [
    {
      id: 1,
      icon: "🥚",
      name: "Contains Eggs",
      severity: "high",
      description: "Raw eggs used in traditional carbonara sauce",
    },
    {
      id: 2,
      icon: "🧈",
      name: "Contains Dairy",
      severity: "high",
      description: "Parmesan cheese and possible cream",
    },
  ];

  const ingredients: Ingredient[] = [
    { id: "1", name: "Eggs", category: "Dairy & Eggs", price: 4.99 },
    { id: "2", name: "Parmesan Cheese", category: "Dairy", price: 8.99 },
    { id: "3", name: "Pasta", category: "Grains", price: 3.99 },
    { id: "4", name: "Bacon", category: "Meat", price: 6.99 },
  ];

  const handleToggleIngredient = (id: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    selectedIngredients.forEach((id) => {
      const ingredient = ingredients.find((ing) => ing.id === id);
      if (ingredient) {
        addToCart({
          id: `ingredient-${ingredient.id}`,
          name: ingredient.name,
          price: ingredient.price,
          category: ingredient.category,
        });
      }
    });
    // Navigate back or show success message
    router.back();
  };

  const handleSeeSubstitutions = () => {
    router.push({
      pathname: "/saveSubstitution",
      params: {
        mealTitle: mealTitle,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C2253" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recipe Allergens</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Recipe Card */}
        <View style={styles.recipeCard}>
          <Image source={{ uri: mealImage }} style={styles.recipeImage} />
        </View>

        {/* Recipe Info */}
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle}>{mealTitle}</Text>
          <View style={styles.recipeDetails}>
            <View style={styles.detailItem}>
              <Feather name="clock" size={14} color="#6B7280" />
              <Text style={styles.detailText}>20 min</Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="users" size={14} color="#6B7280" />
              <Text style={styles.detailText}>4 servings</Text>
            </View>
          </View>
        </View>

        {/* Detected Allergens Alert */}
        <View style={styles.allergenAlert}>
          <View style={styles.allergenAlertHeader}>
            <Feather name="alert-triangle" size={18} color="#DC2626" />
            <Text style={styles.allergenAlertText}>Detected Allergens</Text>
          </View>
        </View>

        {/* Allergens List */}
        <View style={styles.allergensList}>
          {allergens.map((allergen) => (
            <View key={allergen.id} style={styles.allergenCard}>
              <View style={styles.allergenIconContainer}>
                <Text style={styles.allergenEmoji}>{allergen.icon}</Text>
              </View>
              <View style={styles.allergenContent}>
                <View style={styles.allergenHeader}>
                  <Text style={styles.allergenName}>{allergen.name}</Text>
                  <View style={styles.severityBadge}>
                    <Feather name="alert-circle" size={12} color="#DC2626" />
                    <Text style={styles.severityText}>high</Text>
                  </View>
                </View>
                <Text style={styles.allergenDescription}>
                  {allergen.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Ingredients List */}
        <View style={styles.ingredientsSection}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((ingredient) => {
            const isSelected = selectedIngredients.includes(ingredient.id);
            return (
              <TouchableOpacity
                key={ingredient.id}
                style={[
                  styles.ingredientCard,
                  isSelected && styles.ingredientCardSelected,
                ]}
                onPress={() => handleToggleIngredient(ingredient.id)}
              >
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && (
                    <Feather name="check" size={16} color="#fff" />
                  )}
                </View>
                <View style={styles.ingredientInfo}>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  <Text style={styles.ingredientCategory}>
                    {ingredient.category}
                  </Text>
                </View>
                <Text style={styles.ingredientPrice}>Rs {ingredient.price}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          disabled={selectedIngredients.length === 0}
        >
          <Feather name="shopping-cart" size={18} color="#fff" />
          <Text style={styles.addToCartButtonText}>
            Add to Cart ({selectedIngredients.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.substitutionsButton}
          onPress={handleSeeSubstitutions}
        >
          <Text style={styles.substitutionsButtonText}>See Substitutions</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#3C2253",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    marginLeft: 16,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  recipeCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  recipeImage: {
    width: "100%",
    height: 180,
  },
  recipeInfo: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  recipeDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  allergenAlert: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
    padding: 12,
    borderRadius: 8,
  },
  allergenAlertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  allergenAlertText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#991B1B",
  },
  allergensList: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  allergenCard: {
    backgroundColor: "#FFF1F2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#FECDD3",
  },
  allergenIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE4E6",
    alignItems: "center",
    justifyContent: "center",
  },
  allergenEmoji: {
    fontSize: 24,
  },
  allergenContent: {
    flex: 1,
  },
  allergenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  allergenName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#BE123C",
  },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#DC2626",
  },
  allergenDescription: {
    fontSize: 13,
    color: "#9F1239",
    lineHeight: 18,
  },
  ingredientsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  ingredientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  ingredientCardSelected: {
    borderColor: "#3C2253",
    backgroundColor: "#F0EFFF",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#3C2253",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#fff",
  },
  checkboxSelected: {
    backgroundColor: "#3C2253",
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  ingredientCategory: {
    fontSize: 13,
    color: "#6B7280",
  },
  ingredientPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3C2253",
  },
  addToCartButton: {
    backgroundColor: "#3C2253",
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  substitutionsButton: {
    backgroundColor: "#3C2253",
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  substitutionsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 8,
  },
});

