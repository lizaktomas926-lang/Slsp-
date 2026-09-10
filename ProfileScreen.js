import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function ProfileScreen({ navigation, route }) {
  const { userData } = route.params || { userData: { name: 'Tomáš Lizák', email: 'tomas.lizak@slsp.sk', balance: 1100.00 } };
  const { transactions } = route.params || { transactions: [] };

  const generatePDFReport = async () => {
    try {
      const htmlContent = `
        <html>
          <body>
            <h1>Výpis z účtu</h1>
            <p><strong>Meno:</strong> ${userData.name}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Aktuálny zostatok:</strong> ${userData.balance.toFixed(2)} €</p>
            <h2>História transakcií</h2>
            <table border="1" style="width: 100%; border-collapse: collapse;">
              <tr>
                <th>Príjemca</th>
                <th>IBAN</th>
                <th>Suma</th>
                <th>Dátum</th>
              </tr>
              ${transactions.map(t => `
                <tr>
                  <td>${t.recipient}</td>
                  <td>${t.iban}</td>
                  <td>-${t.amount.toFixed(2)} €</td>
                  <td>${t.date}</td>
                </tr>
              `).join('')}
            </table>
          </body>
        </html>
      `;
      alert('V produkčnej verzii by sa vygenerovalo a zdieľalo PDF.');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userData.name.split(' ').map(n => n[0]).join('')}</Text>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Účty</Text>
          <View style={styles.accountCard}>
            <View>
              <Text style={styles.accountType}>Hlavný účet</Text>
              <Text style={styles.accountIban}>SK12 0200 0000 0000 0000 0001</Text>
            </View>
            <Text style={styles.accountBalance}>{userData.balance.toFixed(2)} €</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akcie účtu</Text>
          <TouchableOpacity style={styles.menuItem} onPress={generatePDFReport}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="document-text-outline" size={24} color="#007AFF" />
            </View>
            <Text style={styles.menuItemText}>Exportovať výpis (PDF)</Text>
            <Ionicons name="chevron-forward" size={24} color="#C8C8C8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backButton: { marginRight: 15 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  profileCard: { backgroundColor: '#1E1E1E', padding: 24, borderRadius: 16, marginHorizontal: 20, alignItems: 'center', marginBottom: 20 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  userName: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  userEmail: { color: '#B0B0B0', fontSize: 16, marginTop: 5 },
  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  accountCard: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accountType: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  accountIban: { color: '#B0B0B0', fontSize: 12, marginTop: 5 },
  accountBalance: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  menuItem: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  menuIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuItemText: { color: '#FFF', fontSize: 16, flex: 1 },
});
