import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Notes, resetATM, Transaction, updateNotes } from "../store/atmSlice";
import { Link } from "expo-router";
import { RootState } from "../store/store";

const OperatorScreen = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state: RootState) => state.atm.notes as Notes);
  const withdrawalHistory = useSelector(
    (state: RootState) => state.atm.history
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<{
    type: string;
    value: number;
  } | null>(null);
  const [newQuantity, setNewQuantity] = useState("");

  const handleReset = () => {
    dispatch(resetATM());
    Alert.alert("ATM Reset", "The ATM has been reset to its initial state.");
  };

  const handleUpdateNote = () => {
    if (selectedNote && !isNaN(Number(newQuantity))) {
      const updatedNotes = { [selectedNote.type]: Number(newQuantity) };
      dispatch(updateNotes(updatedNotes));
      setModalVisible(false);
      setSelectedNote(null);
      setNewQuantity("");
      Alert.alert(
        "Note Updated",
        `The quantity of ${selectedNote.type} notes has been updated.`
      );
    } else {
      Alert.alert("Invalid Quantity", "Please enter a valid number.");
    }
  };

  const renderHistoryItem = ({ item }: { item: Transaction }) => (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text>Amount: {item.amount}</Text>
      <Text>Success: {item.success ? "Yes" : "No"}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Notes dispensed: {JSON.stringify(item.notesDispensed)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Operator Screen</Text>
      <View style={styles.notesContainer}>
        {Object.entries(notes).map(([noteType, noteValue]) => (
          <View key={noteType} style={styles.noteContainer}>
            <Text style={styles.noteText}>
              {noteType}: {noteValue} notes
            </Text>
            <Button
              title="Update"
              onPress={() => {
                setSelectedNote({ type: noteType, value: noteValue });
                setModalVisible(true);
              }}
              color="#2196F3"
            />
          </View>
        ))}
      </View>

      <Text style={styles.historyTitle}>Withdrawal History</Text>
      <FlatList
        data={withdrawalHistory}
        style={styles.historyContainer}
        renderItem={renderHistoryItem}
        keyExtractor={(_item, index) => index.toString()}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              Update {selectedNote?.type} Notes
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new quantity"
              keyboardType="numeric"
              value={newQuantity}
              onChangeText={setNewQuantity}
            />
            <Button
              title="Update Note"
              onPress={handleUpdateNote}
              color="#4CAF50"
            />
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="#FF5722"
            />
          </View>
        </View>
      </Modal>

      <Button title="Reset ATM" onPress={handleReset} color="#FF5722" />

      <Link href="/" style={styles.link}>
        Go to User Screen
      </Link>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  notesContainer: {
    width: "100%",
    marginBottom: 20,
  },
  noteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  noteText: {
    fontSize: 16,
  },
  historyTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  historyContainer: {
    width: "100%",
    marginTop: 20,
  },

  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
  },
  link: {
    marginTop: 20,
    fontSize: 18,
    color: "blue",
  },
});

export default OperatorScreen;
