import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart } from "../contexts/CartContext";

const CardDetailsScreen: React.FC = () => {
  const router = useRouter();
  const { getTotalPrice } = useCart();
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [showCvv, setShowCvv] = useState<boolean>(false);

  const orderSummary = {
    items: 8,
    subtotal: getTotalPrice(),
    deliveryFee: 30,
    total: getTotalPrice() + 30,
  };

  // Format card number as 1234 5678 9012 3456
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    setCardNumber(formatted.slice(0, 19)); // Max 16 digits + 3 spaces
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      setExpiryDate(cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4));
    } else {
      setExpiryDate(cleaned);
    }
  };

  const handlePayNow = () => {
    // Validate form
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      return;
    }
    router.push("/paymentSuccessful");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Card Details</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="card-outline" size={22} color="#5A3D7A" />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Payment Information</Text>
              <Text style={styles.cardSubtitle}>
                Enter your card details securely
              </Text>
            </View>
          </View>

          {/* Card Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#B8AFCC"
              value={cardNumber}
              onChangeText={formatCardNumber}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          {/* Expiry Date and CVV */}
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="#B8AFCC"
                value={expiryDate}
                onChangeText={formatExpiryDate}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>CVV</Text>
              <View style={styles.cvvContainer}>
                <TextInput
                  style={[styles.input, styles.cvvInput]}
                  placeholder="123"
                  placeholderTextColor="#B8AFCC"
                  value={cvv}
                  onChangeText={(text) =>
                    setCvv(text.replace(/\D/g, "").slice(0, 4))
                  }
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry={!showCvv}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowCvv(!showCvv)}
                >
                  <Ionicons
                    name={showCvv ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#8B7BA8"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Name on Card */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name on Card</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#B8AFCC"
              value={cardName}
              onChangeText={setCardName}
              autoCapitalize="words"
            />
          </View>

          {/* Secure Payment Info */}
          <View style={styles.securePaymentBox}>
            <Ionicons name="lock-closed" size={20} color="#4CAF50" />
            <View style={styles.securePaymentText}>
              <Text style={styles.secureTitle}>Secure Payment</Text>
              <Text style={styles.secureDescription}>
                Your payment information is encrypted and secure. We never store
                your card details.
              </Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Items ({orderSummary.items})
            </Text>
            <Text style={styles.summaryValue}>Rs. {orderSummary.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>
              Rs. {orderSummary.deliveryFee}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs. {orderSummary.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Pay Now Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
          <Ionicons
            name="lock-closed"
            size={18}
            color="#fff"
            style={styles.lockIcon}
          />
          <Text style={styles.payButtonText}>
            Pay Now • Rs. {orderSummary.total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#5A3D7A" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, color: "#fff", fontWeight: "600" },
  scrollView: { flex: 1, backgroundColor: "#F5F3F7" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  cardHeaderText: { marginLeft: 12, flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C1A3F",
    marginBottom: 2,
  },
  cardSubtitle: { fontSize: 13, color: "#6B5B7F" },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#2C1A3F", marginBottom: 8 },
  input: {
    backgroundColor: "#F8F6FA",
    borderWidth: 1,
    borderColor: "#E5DFF0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#2C1A3F",
  },
  rowInputs: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  halfInput: { flex: 1 },
  cvvContainer: { position: "relative" },
  cvvInput: { paddingRight: 45 },
  eyeIcon: { position: "absolute", right: 12, top: 14, padding: 4 },
  securePaymentBox: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
  },
  securePaymentText: { marginLeft: 12, flex: 1 },
  secureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C1A3F",
    marginBottom: 4,
  },
  secureDescription: { fontSize: 12, color: "#6B5B7F", lineHeight: 17 },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C1A3F",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 14, color: "#6B5B7F" },
  summaryValue: { fontSize: 14, fontWeight: "600", color: "#2C1A3F" },
  divider: { height: 1, backgroundColor: "#E5DFF0", marginVertical: 12 },
  totalRow: { marginBottom: 0 },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#2C1A3F" },
  totalValue: { fontSize: 18, fontWeight: "700", color: "#5A3D7A" },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5DFF0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  payButton: {
    backgroundColor: "#5A3D7A",
    borderRadius: 25,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  lockIcon: { marginRight: 8 },
  payButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});

export default CardDetailsScreen;

