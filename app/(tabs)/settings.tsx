import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, CreditCard, Bell, Shield, Palette, Download, CircleHelp as HelpCircle, Mail, ChevronRight, LogOut } from 'lucide-react-native';
import GradientBackground from '@/components/ui/GradientBackground';
import Card from '@/components/ui/Card';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', hasChevron: true },
        { icon: CreditCard, label: 'Payment Methods', hasChevron: true },
        { icon: Shield, label: 'Privacy & Security', hasChevron: true },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: Bell, 
          label: 'Notifications', 
          hasSwitch: true, 
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled 
        },
        { 
          icon: Shield, 
          label: 'Biometric Authentication', 
          hasSwitch: true, 
          value: biometricEnabled,
          onToggle: setBiometricEnabled 
        },
        { icon: Palette, label: 'Appearance', hasChevron: true },
        { icon: Download, label: 'Export Data', hasChevron: true },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', hasChevron: true },
        { icon: Mail, label: 'Contact Support', hasChevron: true },
      ]
    }
  ];

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity key={index} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <item.icon size={20} color="#8B5CF6" />
        </View>
        <Text style={styles.settingLabel}>{item.label}</Text>
      </View>
      
      <View style={styles.settingRight}>
        {item.hasSwitch && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#F3F4F6', true: '#8B5CF6' }}
            thumbColor="#FFFFFF"
          />
        )}
        {item.hasChevron && (
          <ChevronRight size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <Card style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>EE</Text>
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>Efe Edewor</Text>
                <Text style={styles.profileEmail}>efe.edewor@example.com</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </Card>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </Card>
          ))}

          {/* Subscription Stats */}
          <Card style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Subscription Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>₦74,552</Text>
                <Text style={styles.statLabel}>Monthly</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>₦894,624</Text>
                <Text style={styles.statLabel}>Yearly</Text>
              </View>
            </View>
          </Card>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  settingsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsCard: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 20,
  },
});