import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save, Upload, Calendar, DollarSign, Tag, Bell } from 'lucide-react-native';
import GradientBackground from '@/components/ui/GradientBackground';
import Card from '@/components/ui/Card';

interface NewSubscription {
  name: string;
  icon: string;
  color: string;
  amount: string;
  currency: '₦' | '$';
  billingCycle: 'monthly' | 'yearly';
  nextPayment: string;
  category: 'Entertainment' | 'Productivity' | 'Health' | 'Education' | 'Social' | 'Other';
  description: string;
  paymentMethod: string;
  reminderDays: string;
}

export default function AddSubscriptionScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<NewSubscription>({
    name: '',
    icon: '',
    color: '#8B5CF6',
    amount: '',
    currency: '₦',
    billingCycle: 'monthly',
    nextPayment: '',
    category: 'Entertainment',
    description: '',
    paymentMethod: '',
    reminderDays: '1',
  });

  const [errors, setErrors] = useState<Partial<NewSubscription>>({});

  const categories = ['Entertainment', 'Productivity', 'Health', 'Education', 'Social', 'Other'];
  const currencies = ['₦', '$'];
  const billingCycles = ['monthly', 'yearly'];
  const colors = ['#8B5CF6', '#E50914', '#FFCB0B', '#0056D3', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  const validateForm = () => {
    const newErrors: Partial<NewSubscription> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.nextPayment.trim()) {
      newErrors.nextPayment = 'Next payment date is required';
    }

    if (!formData.icon.trim()) {
      newErrors.icon = 'Icon is required (enter a letter or emoji)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    // In a real app, this would make an API call to save the subscription
    Alert.alert(
      'Success',
      'Subscription added successfully!',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  const updateFormData = (field: keyof NewSubscription, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Subscription</Text>
          <TouchableOpacity onPress={handleSave}>
            <Save size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Service Info */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Service Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="e.g., Netflix, Spotify"
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Icon *</Text>
              <View style={styles.iconInputContainer}>
                <TextInput
                  style={[styles.iconInput, errors.icon && styles.inputError]}
                  placeholder="N, 🎵, etc."
                  value={formData.icon}
                  onChangeText={(text) => updateFormData('icon', text)}
                  maxLength={2}
                />
                <View style={[styles.iconPreview, { backgroundColor: formData.color }]}>
                  <Text style={styles.iconPreviewText}>{formData.icon || '?'}</Text>
                </View>
              </View>
              {errors.icon && <Text style={styles.errorText}>{errors.icon}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Color</Text>
              <View style={styles.colorPicker}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      formData.color === color && styles.colorOptionSelected
                    ]}
                    onPress={() => updateFormData('color', color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryPicker}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      formData.category === category && styles.categoryOptionSelected
                    ]}
                    onPress={() => updateFormData('category', category as any)}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      formData.category === category && styles.categoryOptionTextSelected
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Optional description"
                value={formData.description}
                onChangeText={(text) => updateFormData('description', text)}
                multiline
                numberOfLines={3}
              />
            </View>
          </Card>

          {/* Billing Info */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Billing Information</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Amount *</Text>
                <TextInput
                  style={[styles.input, errors.amount && styles.inputError]}
                  placeholder="0.00"
                  value={formData.amount}
                  onChangeText={(text) => updateFormData('amount', text)}
                  keyboardType="numeric"
                />
                {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Currency</Text>
                <View style={styles.currencyPicker}>
                  {currencies.map((currency) => (
                    <TouchableOpacity
                      key={currency}
                      style={[
                        styles.currencyOption,
                        formData.currency === currency && styles.currencyOptionSelected
                      ]}
                      onPress={() => updateFormData('currency', currency)}
                    >
                      <Text style={[
                        styles.currencyOptionText,
                        formData.currency === currency && styles.currencyOptionTextSelected
                      ]}>
                        {currency}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Billing Cycle</Text>
              <View style={styles.billingCyclePicker}>
                {billingCycles.map((cycle) => (
                  <TouchableOpacity
                    key={cycle}
                    style={[
                      styles.billingCycleOption,
                      formData.billingCycle === cycle && styles.billingCycleOptionSelected
                    ]}
                    onPress={() => updateFormData('billingCycle', cycle as any)}
                  >
                    <Text style={[
                      styles.billingCycleOptionText,
                      formData.billingCycle === cycle && styles.billingCycleOptionTextSelected
                    ]}>
                      {cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Next Payment Date *</Text>
              <TextInput
                style={[styles.input, errors.nextPayment && styles.inputError]}
                placeholder="YYYY-MM-DD"
                value={formData.nextPayment}
                onChangeText={(text) => updateFormData('nextPayment', text)}
              />
              {errors.nextPayment && <Text style={styles.errorText}>{errors.nextPayment}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Payment Method</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Visa ending in 1234"
                value={formData.paymentMethod}
                onChangeText={(text) => updateFormData('paymentMethod', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reminder (days before)</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                value={formData.reminderDays}
                onChangeText={(text) => updateFormData('reminderDays', text)}
                keyboardType="numeric"
              />
            </View>
          </Card>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Subscription</Text>
          </TouchableOpacity>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  iconInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  iconPreview: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPreviewText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#374151',
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryOptionSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  categoryOptionTextSelected: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  currencyPicker: {
    flexDirection: 'row',
    gap: 8,
  },
  currencyOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  currencyOptionSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  currencyOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  currencyOptionTextSelected: {
    color: '#FFFFFF',
  },
  billingCyclePicker: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  billingCycleOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  billingCycleOptionSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  billingCycleOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  billingCycleOptionTextSelected: {
    color: '#374151',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});