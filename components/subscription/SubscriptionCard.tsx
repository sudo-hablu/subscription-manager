import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Subscription } from '@/types/subscription';

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress?: () => void;
}

export default function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
  const formatAmount = (amount: number, currency: string) => {
    if (currency === '₦') {
      return `₦${amount.toLocaleString()}`;
    }
    return `$${amount}`;
  };

  const formatBillingCycle = (cycle: string) => {
    return cycle === 'monthly' ? '/month' : '/year';
  };

  const getDaysUntilPayment = (nextPayment: string) => {
    const today = new Date();
    const paymentDate = new Date(nextPayment);
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderIcon = () => {
    if (subscription.icon.startsWith('http')) {
      return (
        <Image 
          source={{ uri: subscription.icon }} 
          style={[styles.iconImage, { backgroundColor: subscription.color }]}
        />
      );
    }
    
    return (
      <View style={[styles.iconContainer, { backgroundColor: subscription.color }]}>
        <Text style={styles.iconText}>{subscription.icon}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {renderIcon()}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{subscription.name}</Text>
          <Text style={styles.amount}>
            {formatAmount(subscription.amount, subscription.currency)}
            <Text style={styles.cycle}>{formatBillingCycle(subscription.billingCycle)}</Text>
          </Text>
        </View>
        
        <Text style={styles.nextPayment}>
          {subscription.nextPayment} • {getDaysUntilPayment(subscription.nextPayment)} days left
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cycle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
  nextPayment: {
    fontSize: 14,
    color: '#6B7280',
  },
});