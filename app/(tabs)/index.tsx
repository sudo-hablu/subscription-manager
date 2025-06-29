import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Plus, ChevronLeft, Bell } from 'lucide-react-native';
import GradientBackground from '@/components/ui/GradientBackground';
import SwipeableSubscriptionCard from '@/components/subscription/SwipeableSubscriptionCard';
import { mockSubscriptions } from '@/data/mockData';
import { Subscription } from '@/types/subscription';

export default function HomeScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>(mockSubscriptions);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredSubscriptions(subscriptions);
    } else {
      const filtered = subscriptions.filter(sub =>
        sub.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSubscriptions(filtered);
    }
  };

  const handleDelete = (id: string) => {
    const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id);
    setSubscriptions(updatedSubscriptions);
    
    // Update filtered list as well
    if (searchText.trim() === '') {
      setFilteredSubscriptions(updatedSubscriptions);
    } else {
      const filtered = updatedSubscriptions.filter(sub =>
        sub.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSubscriptions(filtered);
    }
  };

  const totalMonthlyExpense = subscriptions.reduce((total, sub) => {
    if (sub.currency === '₦') {
      return total + sub.amount;
    }
    return total + (sub.amount * 415); // Convert USD to Naira
  }, 0);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity>
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All subscriptions</Text>
            <TouchableOpacity>
              <Bell size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search subscriptions"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Monthly Total</Text>
            <Text style={styles.summaryAmount}>₦{totalMonthlyExpense.toLocaleString()}</Text>
            <Text style={styles.summarySubtext}>
              {filteredSubscriptions.length} active subscriptions
            </Text>
          </View>

          {/* Subscriptions List */}
          <View style={styles.subscriptionsList}>
            {filteredSubscriptions.map((subscription) => (
              <SwipeableSubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onPress={() => router.push(`/subscription/${subscription.id}`)}
                onDelete={handleDelete}
              />
            ))}
            
            {filteredSubscriptions.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchText ? 'No subscriptions found' : 'No subscriptions yet'}
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchText ? 'Try a different search term' : 'Add your first subscription to get started'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => router.push('/subscription/add')}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  subscriptionsList: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
});