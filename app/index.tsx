import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearError, withdraw } from "../store/atmSlice";
import { Link } from "expo-router";
import { RootState } from "../store/store";

const UserScreen = () => {
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => state.atm.error);
  const lastDispensedNotes = useSelector(
    (state: RootState) => state.atm.lastDispensedNotes
  );

  const handleWithdraw = () => {
    const withdrawalAmount = parseInt(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid withdrawal amount.");
      return;
    }

    dispatch(withdraw(withdrawalAmount));
    setAmount("");
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Withdrawal Error", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ATM Withdrawal</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount to withdraw"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Withdraw" onPress={handleWithdraw} color="#4CAF50" />

      {lastDispensedNotes && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Dispensed Notes:</Text>
          {Object.entries(lastDispensedNotes).map(([note, count]) => (
            <Text key={note} style={styles.resultText}>
              {count} x {note}{" "}
              {note === "20000"
                ? "HUF"
                : note === "10000"
                ? "HUF"
                : note === "5000"
                ? "HUF"
                : "HUF"}
            </Text>
          ))}
        </View>
      )}
      <Link href="/operator" style={styles.link}>
        Go to Operator Screen
      </Link>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "80%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e7f3fe",
    borderRadius: 5,
    borderColor: "#2196F3",
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2196F3",
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
  link: {
    marginTop: 20,
    fontSize: 18,
    color: "blue",
  },
});

export default UserScreen;
