import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nastavenia</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Účet</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Upraviť osobné údaje</Text>
            <Ionicons name="chevron-forward" size={24} color="#C8C8C8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Zmena hesla</Text>
            <Ionicons name="chevron-forward" size={24} color="#C8C8C8" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Oznámenia</Text>
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Push notifikácie</Text>
            <Switch value={true} />
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Emailové notifikácie</Text>
            <Switch value={false} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zabezpečenie</Text>
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Prihlásenie odtlačkom prsta</Text>
            <Switch value={true} />
          </View>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Dvojfaktorové overenie</Text>
            <Ionicons name="chevron-forward" size={24} color="#C8C8C8" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ostatné</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Pomoc a podpora</Text>
            <Ionicons name="chevron-forward" size={24} color="#C8C8C8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Podmienky používania</Text>
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
  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  menuItem: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  menuItemText: { color: '#FFF', fontSize: 16 },
});
    
