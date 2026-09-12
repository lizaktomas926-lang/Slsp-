Intl.NumberFormatimport React, { useState, useEffect } from 'react';
import {
StyleSheet,
Text,
View,
TouchableOpacity,
SafeAreaView,
ScrollView,
TextInput,
ActivityIndicator,
Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY = '@bank_app_state_v1';
export default function App() {
const [loading, setLoading] = useState(true);
const [balance, setBalance] = useState(1250.50);
const [transactions, setTransactions] = useState([
{ id: '1', title: 'Nákup potraviny', amount: -24.50, date: '12.09.2026' },
{ id: '2', title: 'Výplata', amount: 1500.00, date: '10.09.2026' },
]);
const [amountInput, setAmountInput] = useState('');
const [titleInput, setTitleInput] = useState('');
// 1. Načítanie uloženého stavu pri spustení aplikácie
useEffect(() => {
loadSavedState();
}, []);
// 2. Automatické uloženie stavu pri každej zmene zostatku alebo transakcií
useEffect(() => {
if (!loading) {
saveCurrentState();
}
}, [balance, transactions]);
const loadSavedState = async () => {
try {
const savedData = await AsyncStorage.getItem(STORAGE_KEY);
if (savedData !== null) {
const parsed = JSON.parse(savedData);
if (parsed.balance !== undefined) setBalance(parsed.balance);
if (parsed.transactions) setTransactions(parsed.transactions);
}
} catch (error) {
console.error('Chyba pri načítavaní dát:', error);
} finally {
setLoading(false);
}
};
const saveCurrentState = async () => {
try {
const dataToSave = {
balance,
transactions,
};
await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
} catch (error) {
console.error('Chyba pri ukladaní dát:', error);
}
};
const handleAddTransaction = (isIncome) => {
const numericAmount = parseFloat(amountInput.replace(',', '.'));
if (isNaN(numericAmount) || numericAmount <= 0) {
Alert.alert('Chyba', 'Zadajte platnú sumu.');
return;
}
if (!titleInput.trim()) {
Alert.alert('Chyba', 'Zadajte názov transakcie.');
return;
}
const finalAmount = isIncome ? numericAmount : -numericAmount;
const newTx = {
id: Date.now().toString(),
title: titleInput.trim(),
amount: finalAmount,
date: new Date().toLocaleDateString('sk-SK'),
};
setBalance((prev) => prev + finalAmount);
setTransactions((prev) => [newTx, ...prev]);
setAmountInput('');
setTitleInput('');
};
const handleResetData = async () => {
try {
await AsyncStorage.removeItem(STORAGE_KEY);
setBalance(1250.50);
setTransactions([]);
Alert.alert('Obnovené', 'Údaje boli vymazané a nastavené na predvolené.');
} catch (error) {
console.error('Chyba pri mazaní:', error);
}
};
if (loading) {
return (
<View style={styles.loadingContainer}>
<ActivityIndicator size="large" color="#005AA7" />
<Text style={styles.loadingText}>Načítavam bankové dáta...</Text>
</View>
);
}
return (
<SafeAreaView style={styles.container}>
<ScrollView contentContainerStyle={styles.scrollContent}>
<View style={styles.header}>
<Text style={styles.headerTitle}>Banková Aplikácia</Text>
<Text style={styles.subTitle}>Moje konto</Text>
</View>
{/* Karta so zostatkom */}
<View style={styles.balanceCard}>
<Text style={styles.balanceLabel}>Aktuálny zostatok</Text>
<Text style={styles.balanceValue}>{balance.toFixed(2)} €</Text>
</View>
{/* Formulár na novú transakciu */}
<View style={styles.formCard}>
<Text style={styles.sectionTitle}>Nová transakcia</Text>
<TextInput
style={styles.input}
placeholder="Názov (popis)"
value={titleInput}
onChangeText={setTitleInput}
/>
<TextInput
style={styles.input}
placeholder="Suma v €"
keyboardType="numeric"
value={amountInput}
onChangeText={setAmountInput}
/>
<View style={styles.buttonRow}>
<TouchableOpacity
style={[styles.button, styles.expenseBtn]}
onPress={() => handleAddTransaction(false)}
>
<Text style={styles.buttonText}>- Výdavok</Text>
</TouchableOpacity>
<TouchableOpacity
style={[styles.button, styles.incomeBtn]}
onPress={() => handleAddTransaction(true)}
>
<Text style={styles.buttonText}>+ Príjem</Text>
</TouchableOpacity>
</View>
</View>
{/* Zoznam transakcií */}
<View style={styles.historyCard}>
<Text style={styles.sectionTitle}>História transakcií</Text>
{transactions.length === 0 ? (
<Text style={styles.emptyText}>Žiadne transakcie</Text>
) : (
transactions.map((tx) => (
<View key={tx.id} style={styles.txRow}>
<View>
<Text style={styles.txTitle}>{tx.title}</Text>
<Text style={styles.txDate}>{tx.date}</Text>
</View>
<Text
style={[
styles.txAmount,
tx.amount < 0 ? styles.negative : styles.positive,
]}
>
{tx.amount > 0 ? +${tx.amount.toFixed(2)} : tx.amount.toFixed(2)} €
</Text>
</View>
))
)}
</View>
<TouchableOpacity style={styles.resetButton} onPress={handleResetData}>
<Text style={styles.resetText}>Resetovať uložene dáta</Text>
</TouchableOpacity>
</ScrollView>
</SafeAreaView>
);
}
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#F3F4F6',
},
loadingContainer: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
},
loadingText: {
marginTop: 12,
color: '#4B5563',
},
scrollContent: {
padding: 16,
},
header: {
marginBottom: 16,
},
headerTitle: {
fontSize: 24,
fontWeight: 'bold',
color: '#1E3A8A',
},
subTitle: {
fontSize: 14,
color: '#6B7280',
},
balanceCard: {
backgroundColor: '#005AA7',
padding: 20,
borderRadius: 16,
marginBottom: 16,
},
balanceLabel: {
color: '#E0F2FE',
fontSize: 14,
},
balanceValue: {
color: '#FFFFFF',
fontSize: 32,
fontWeight: 'bold',
marginTop: 4,
},
formCard: {
backgroundColor: '#FFFFFF',
padding: 16,
borderRadius: 12,
marginBottom: 16,
},
sectionTitle: {
fontSize: 16,
fontWeight: '600',
marginBottom: 12,
color: '#1F2937',
},
input: {
borderWidth: 1,
borderColor: '#D1D5DB',
borderRadius: 8,
padding: 10,
marginBottom: 10,
},
buttonRow: {
flexDirection: 'row',
justifyContent: 'space-between',
gap: 8,
},
button: {
flex: 1,
padding: 12,
borderRadius: 8,
alignItems: 'center',
},
incomeBtn: {
backgroundColor: '#10B981',
},
expenseBtn: {
backgroundColor: '#EF4444',
},
buttonText: {
color: '#FFFFFF',
fontWeight: '600',
},
historyCard: {
backgroundColor: '#FFFFFF',
padding: 16,
borderRadius: 12,
},
emptyText: {
color: '#9CA3AF',
textAlign: 'center',
marginVertical: 12,
},
txRow: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingVertical: 10,
borderBottomWidth: 1,
borderBottomColor: '#F3F4F6',
},
txTitle: {
fontSize: 14,
fontWeight: '500',
color: '#1F2937',
},
txDate: {
fontSize: 12,
color: '#9CA3AF',
},
txAmount: {
fontSize: 15,
fontWeight: '600',
},
positive: {
color: '#10B981',
},
negative: {
color: '#EF4444',
},
resetButton: {
marginTop: 20,
alignItems: 'center',
},
resetText: {
color: '#6B7280',
fontSize: 12,
textDecorationLine: 'underline',
},
});