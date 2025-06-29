import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Plus } from 'lucide-react-native';
import GradientBackground from '@/components/ui/GradientBackground';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import { mockSubscriptions } from '@/data/mockData';

export default function ServicesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', 'Entertainment', 'Productivity', 'Health', 'Education', 'Social'];
  
  const filteredSubscriptions = selectedCategory === 'All' 
    ? mockSubscriptions 
    : mockSubscriptions.filter(sub => sub.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'All': '#8B5CF6',
      'Entertainment': '#E50914',
      'Productivity': '#8B5CF6',
      'Health': '#06B6D4',
      'Education': '#0056D3',
      'Social': '#FFCB0B',
    };
    return colors[category] || '#8B5CF6';
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Services</Text>
          <TouchableOpacity>
            <Filter size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{filteredSubscriptions.length}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                ₦{filteredSubscriptions.reduce((total, sub) => {
                  if (sub.currency === '₦') return total + sub.amount;
                  return total + (sub.amount * 415);
                }, 0).toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Monthly</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {filteredSubscriptions.filter(sub => {
                  const nextPayment = new Date(sub.nextPayment);
                  const today = new Date();
                  const diffDays = Math.ceil((nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  return diffDays <= 7;
                }).length}
              </Text>
              <Text style={styles.statLabel}>Due Soon</Text>
            </View>
          </View>

          {/* Category Header */}
          <View style={styles.sectionHeader}>
            <View style={styles.categoryIndicator}>
              <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(selectedCategory) }]} />
              <Text style={styles.sectionTitle}>
                {selectedCategory} ({filteredSubscriptions.length})
              </Text>
            </View>
          </View>

          {/* Services List */}
          <View style={styles.servicesList}>
            {filteredSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onPress={() => {
                  // Navigate to subscription details
                }}
              />
            ))}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab}>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  categoryText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  categoryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  servicesList: {
    paddingBottom: 100,
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