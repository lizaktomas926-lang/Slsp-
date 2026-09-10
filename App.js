import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Modal, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [balance, setBalance] = useState(1100.00);
  const [modalVisible, setModalVisible] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [iban, setIban] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [history, setHistory] = useState([]);
  const [pdfUri, setPdfUri] = useState(null);

  const handleSend = () => {
    if (recipient && iban && amount) {
      const parsedAmount = parseFloat(amount);
      if (balance >= parsedAmount) {
        setBalance(balance - parsedAmount);
        const newTransaction = { id: Date.now().toString(), recipient, iban, amount: parsedAmount, note, date: new Date().toLocaleString() };
        setHistory([newTransaction, ...history]);
        setRecipient(''); setIban(''); setAmount(''); setNote(''); setModalVisible(false);
      } else {
        alert('Nedostatok financií na účte!');
      }
    } else {
      alert('Vyplňte povinné polia (Príjemca, IBAN, Suma)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Ahoj,</Text>
            <Text style={styles.userName}>Tomáš Lizák</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Zostatok na účte</Text>
          <Text style={styles.balanceAmount}>{balance.toFixed(2)} €</Text>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
            <View style={[styles.iconContainer, { backgroundColor: '#00E676' }]}>
              <Ionicons name="arrow-up-outline" size={24} color="#000" />
            </View>
            <Text style={styles.actionText}>Poslať peniaze</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>História platieb</Text>
        </View>
        <List items={history} />
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nová platba</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-outline" size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Input label="Príjemca" value={recipient} onChange={setRecipient} placeholder="Zadajte meno alebo názov" />
              <Input label="IBAN" value={iban} onChange={setIban} placeholder="SK00 0000 0000 0000 0000 0000" />
              <Input label="Suma" value={amount} onChange={setAmount} placeholder="0,00 €" keyboardType="numeric" />
              <Input label="Poznámka" value={note} onChange={setNote} placeholder="Poznámka pre príjemcu (voliteľné)" />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.sendButtonText}>Odoslať platbu</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Input({ label, value, onChange, placeholder, keyboardType }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#B0B0B0"
        keyboardType={keyboardType || 'default'}
      />
    </View>
  );
}

function List({ items }) {
  if (items.length === 0) {
    return (
      <View style={styles.emptyList}>
        <Text style={styles.emptyListText}>Žiadne transakcie</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.transactionCard}>
          <View style={styles.transactionIcon}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#00E676" />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.recipientName}>{item.recipient}</Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
          </View>
          <Text style={styles.transactionAmount}>-{item.amount.toFixed(2)} €</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  greeting: { color: '#B0B0B0', fontSize: 14 },
  userName: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  settingsButton: { padding: 8, backgroundColor: '#1E1E1E', borderRadius: 8 },
  balanceCard: { backgroundColor: '#1E1E1E', padding: 24, borderRadius: 16, marginHorizontal: 20, alignItems: 'center', marginBottom: 20 },
  balanceTitle: { color: '#B0B0B0', fontSize: 16 },
  balanceAmount: { color: '#FFF', fontSize: 40, fontWeight: 'bold', marginTop: 8 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20, marginBottom: 20 },
  actionButton: { alignItems: 'center' },
  iconContainer: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 10 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#1E1E1E', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  inputContainer: { marginBottom: 15 },
  inputLabel: { color: '#B0B0B0', fontSize: 14, marginBottom: 6 },
  input: { backgroundColor: '#121212', color: '#FFF', padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#2C2C2C' },
  sendButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  sendButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  transactionCard: { backgroundColor: '#1E1E1E', flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginHorizontal: 20, marginBottom: 12 },
  transactionIcon: { marginRight: 15 },
  transactionDetails: { flex: 1 },
  recipientName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  transactionDate: { color: '#B0B0B0', fontSize: 12, marginTop: 2 },
  transactionAmount: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  emptyList: { alignItems: 'center', padding: 40 },
  emptyListText: { color: '#B0B0B0', fontSize: 16 },
});
    
