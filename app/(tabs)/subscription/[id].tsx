import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Edit3, Trash2, Calendar, CreditCard, Bell, Tag } from 'lucide-react-native';
import GradientBackground from '@/components/ui/GradientBackground';
import Card from '@/components/ui/Card';
import { mockSubscriptions } from '@/data/mockData';
import { Subscription } from '@/types/subscription';

export default function SubscriptionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(
    mockSubscriptions.find(sub => sub.id === id) || null
  );

  if (!subscription) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Subscription not found</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const formatAmount = (amount: number, currency: string) => {
    if (currency === '₦') {
      return `₦${amount.toLocaleString()}`;
    }
    return `$${amount}`;
  };

  const getDaysUntilPayment = (nextPayment: string) => {
    const today = new Date();
    const paymentDate = new Date(nextPayment);
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Subscription',
      `Are you sure you want to delete ${subscription.name}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would make an API call
            Alert.alert('Success', 'Subscription deleted successfully', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          },
        },
      ]
    );
  };

  const renderIcon = () => {
    if (subscription.icon.startsWith('http')) {
      return (
        <Image 
          source={{ uri: subscription.icon }} 
          style={[styles.heroIcon, { backgroundColor: subscription.color }]}
        />
      );
    }
    
    return (
      <View style={[styles.heroIcon, { backgroundColor: subscription.color }]}>
        <Text style={styles.heroIconText}>{subscription.icon}</Text>
      </View>
    );
  };

  const daysUntilPayment = getDaysUntilPayment(subscription.nextPayment);
  const isPaymentSoon = daysUntilPayment <= 7;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscription Details</Text>
          <TouchableOpacity onPress={() => router.push(`/subscription/edit/${id}`)}>
            <Edit3 size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Card */}
          <Card style={styles.heroCard}>
            <View style={styles.heroContent}>
              {renderIcon()}
              <View style={styles.heroInfo}>
                <Text style={styles.serviceName}>{subscription.name}</Text>
                <Text style={styles.serviceCategory}>{subscription.category}</Text>
                <Text style={styles.serviceAmount}>
                  {formatAmount(subscription.amount, subscription.currency)}
                  <Text style={styles.serviceCycle}>
                    /{subscription.billingCycle === 'monthly' ? 'month' : 'year'}
                  </Text>
                </Text>
              </View>
            </View>
          </Card>

          {/* Payment Status */}
          <Card style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Calendar size={20} color={isPaymentSoon ? '#EF4444' : '#10B981'} />
              <Text style={[styles.statusTitle, { color: isPaymentSoon ? '#EF4444' : '#10B981' }]}>
                {isPaymentSoon ? 'Payment Due Soon' : 'Payment Scheduled'}
              </Text>
            </View>
            <Text style={styles.statusDate}>Next payment: {subscription.nextPayment}</Text>
            <Text style={styles.statusDays}>
              {daysUntilPayment > 0 ? `${daysUntilPayment} days remaining` : 'Payment overdue'}
            </Text>
          </Card>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <Card style={styles.detailCard}>
              <View style={styles.detailIcon}>
                <CreditCard size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>
                {subscription.paymentMethod || 'Not specified'}
              </Text>
            </Card>

            <Card style={styles.detailCard}>
              <View style={styles.detailIcon}>
                <Bell size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.detailLabel}>Reminder</Text>
              <Text style={styles.detailValue}>
                {subscription.reminderDays ? `${subscription.reminderDays} day${subscription.reminderDays > 1 ? 's' : ''} before` : 'None'}
              </Text>
            </Card>

            <Card style={styles.detailCard}>
              <View style={styles.detailIcon}>
                <Tag size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{subscription.category}</Text>
            </Card>

            <Card style={styles.detailCard}>
              <View style={styles.detailIcon}>
                <Calendar size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.detailLabel}>Billing Cycle</Text>
              <Text style={styles.detailValue}>
                {subscription.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
              </Text>
            </Card>
          </View>

          {/* Description */}
          {subscription.description && (
            <Card style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{subscription.description}</Text>
            </Card>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push(`/subscription/edit/${id}`)}
            >
              <Edit3 size={20} color="#8B5CF6" />
              <Text style={styles.editButtonText}>Edit Subscription</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Trash2 size={20} color="#EF4444" />
              <Text style={styles.deleteButtonText}>Delete Subscription</Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  heroCard: {
    marginBottom: 20,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  heroIconText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  heroInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  serviceAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  serviceCycle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
  },
  statusCard: {
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusDate: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  statusDays: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailCard: {
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    paddingVertical: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  descriptionCard: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actionButtons: {
    paddingBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 8,
  },
});