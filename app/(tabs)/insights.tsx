import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react-native';
import GradientBackground from '@/components/ui/GradientBackground';
import Card from '@/components/ui/Card';
import ExpenseChart from '@/components/charts/ExpenseChart';
import { mockExpenseCategories, mockSubscriptions } from '@/data/mockData';

export default function InsightsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'Monthly' | 'Yearly'>('Monthly');
  
  const totalExpenses = mockExpenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
  
  const getMonthlyGrowth = () => {
    // Mock data for demonstration
    return { percentage: 12.5, isPositive: false };
  };

  const growth = getMonthlyGrowth();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Insights</Text>
          <TouchableOpacity>
            <Calendar size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {['Monthly', 'Yearly'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period as 'Monthly' | 'Yearly')}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chart Card */}
          <Card style={styles.chartCard}>
            <ExpenseChart 
              categories={mockExpenseCategories}
              totalAmount={totalExpenses}
            />
          </Card>

          {/* Growth Card */}
          <Card style={styles.growthCard}>
            <View style={styles.growthHeader}>
              <Text style={styles.growthTitle}>Monthly Growth</Text>
              <View style={styles.growthIndicator}>
                {growth.isPositive ? (
                  <TrendingUp size={16} color="#10B981" />
                ) : (
                  <TrendingDown size={16} color="#EF4444" />
                )}
                <Text style={[
                  styles.growthPercentage,
                  { color: growth.isPositive ? '#10B981' : '#EF4444' }
                ]}>
                  {growth.percentage}%
                </Text>
              </View>
            </View>
            <Text style={styles.growthDescription}>
              {growth.isPositive ? 'Increase' : 'Decrease'} from last month
            </Text>
          </Card>

          {/* Categories Breakdown */}
          <Card style={styles.categoriesCard}>
            <Text style={styles.categoriesTitle}>Categories</Text>
            
            {mockExpenseCategories.map((category, index) => (
              <View key={category.name} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.categoryAmounts}>
                  <Text style={styles.categoryAmount}>₦{category.amount.toLocaleString()}</Text>
                  <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
                </View>
              </View>
            ))}
          </Card>

          {/* Top Subscriptions */}
          <Card style={styles.topSubscriptionsCard}>
            <Text style={styles.topSubscriptionsTitle}>Top Subscriptions</Text>
            
            {mockSubscriptions
              .sort((a, b) => {
                const aAmount = a.currency === '₦' ? a.amount : a.amount * 415;
                const bAmount = b.currency === '₦' ? b.amount : b.amount * 415;
                return bAmount - aAmount;
              })
              .slice(0, 3)
              .map((subscription, index) => {
                const amount = subscription.currency === '₦' ? subscription.amount : subscription.amount * 415;
                return (
                  <View key={subscription.id} style={styles.topSubscriptionRow}>
                    <View style={styles.topSubscriptionRank}>
                      <Text style={styles.rankNumber}>{index + 1}</Text>
                    </View>
                    <View style={[styles.subscriptionIcon, { backgroundColor: subscription.color }]}>
                      <Text style={styles.subscriptionIconText}>{subscription.icon}</Text>
                    </View>
                    <View style={styles.topSubscriptionInfo}>
                      <Text style={styles.topSubscriptionName}>{subscription.name}</Text>
                      <Text style={styles.topSubscriptionAmount}>₦{amount.toLocaleString()}/month</Text>
                    </View>
                  </View>
                );
              })
            }
          </Card>
        </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  periodButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chartCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  growthCard: {
    marginBottom: 16,
  },
  growthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  growthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  growthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  growthPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  growthDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoriesCard: {
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  categoryAmounts: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
  topSubscriptionsCard: {
    marginBottom: 20,
  },
  topSubscriptionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  topSubscriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  topSubscriptionRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  subscriptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subscriptionIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  topSubscriptionInfo: {
    flex: 1,
  },
  topSubscriptionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  topSubscriptionAmount: {
    fontSize: 12,
    color: '#6B7280',
  },
});