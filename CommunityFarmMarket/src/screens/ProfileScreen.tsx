import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface ProfileScreenProps {
  navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user } = useApp();

  const menuItems = [
    { icon: 'receipt-outline', title: 'My Orders', subtitle: 'View order history', screen: 'Orders' },
    { icon: 'heart-outline', title: 'Favorites', subtitle: 'Saved sellers & products', screen: 'Favorites' },
    { icon: 'location-outline', title: 'Addresses', subtitle: 'Manage delivery addresses', screen: 'Addresses' },
    { icon: 'wallet-outline', title: 'Payment Methods', subtitle: 'Manage payment options', screen: 'Payment' },
    { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Configure alerts', screen: 'Notifications' },
    { icon: 'settings-outline', title: 'Settings', subtitle: 'App preferences', screen: 'Settings' },
    { icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'FAQ and contact', screen: 'Support' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{ uri: user?.avatar || 'https://picsum.photos/seed/default/200' }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userPhone}>{user?.phone}</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.menuIcon}>
              <Ionicons name={item.icon as any} size={22} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sellerSection}>
        <TouchableOpacity style={styles.sellerButton}>
          <Ionicons name="storefront" size={24} color={colors.primary} />
          <Text style={styles.sellerButtonText}>Become a Seller</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Community Farm Market v1.0.0</Text>
        <TouchableOpacity>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
  },
  settingsButton: {
    padding: spacing.sm,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.border,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  userEmail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userPhone: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.divider,
  },
  menuSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  menuTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  menuSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  sellerSection: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sellerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  sellerButtonText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: 100,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  logoutText: {
    fontSize: fontSize.md,
    color: colors.error,
    fontWeight: '500',
  },
});
