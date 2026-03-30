import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockGroupBuys, mockSellers, mockProducts } from '../data/mockData';
import { GroupBuyDetails } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface CommunityBulkBuyScreenProps {
  navigation: any;
}

export default function CommunityBulkBuyScreen({ navigation }: CommunityBulkBuyScreenProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'my'>('active');
  const [groupBuys] = useState<GroupBuyDetails[]>(mockGroupBuys);

  const formatTimeLeft = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((new Date(date).getTime() - now.getTime()) / (1000 * 60 * 60));
    if (diff < 1) return 'Ending soon!';
    if (diff < 24) return `${diff}h left`;
    return `${Math.floor(diff / 24)}d left`;
  };

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const renderGroupBuy = ({ item }: { item: GroupBuyDetails }) => {
    const product = mockProducts.find(p => p.id === item.productId);
    const seller = mockSellers.find(s => s.id === item.sellerId);

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerAvatar}>
              <Ionicons name="storefront" size={16} color={colors.primary} />
            </View>
            <Text style={styles.sellerName}>{item.sellerName}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? colors.success : colors.textMuted }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.productRow}>
          {product && (
            <Image source={{ uri: product.images[0] }} style={styles.productImage} />
          )}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.productName}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.discountedPrice}>{item.discountedPrice.toLocaleString()}đ</Text>
              <Text style={styles.originalPrice}>{item.originalPrice.toLocaleString()}đ</Text>
            </View>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>{item.currentQuantity}/{item.targetQuantity} joined</Text>
            <Text style={styles.timeLeft}>{formatTimeLeft(item.endsAt)}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getProgress(item.currentQuantity, item.targetQuantity)}%` }]} />
          </View>
        </View>

        <View style={styles.districtInfo}>
          <Ionicons name="location" size={14} color={colors.textMuted} />
          <Text style={styles.districtText}>{item.district}</Text>
          <Text style={styles.neededText}>
            {item.targetQuantity - item.currentQuantity} more needed to unlock discount
          </Text>
        </View>

        {item.participants.length > 0 && (
          <View style={styles.participantsSection}>
            <Text style={styles.participantsTitle}>Recent joiners:</Text>
            <View style={styles.participantsList}>
              {item.participants.slice(0, 3).map((p, index) => (
                <View key={index} style={styles.participantAvatar}>
                  <Ionicons name="person" size={12} color={colors.textLight} />
                </View>
              ))}
              <Text style={styles.participantCount}>
                +{item.participants.length} people joined
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => Alert.alert('Join Group Buy', `Join this group buy for ${item.discountedPrice.toLocaleString()} VND?`)}
        >
          <Ionicons name="people" size={20} color={colors.textLight} />
          <Text style={styles.joinButtonText}>Join Group Buy</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Bulk Buy</Text>
        <Text style={styles.subtitle}>Team up with neighbors to get better deals!</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Deals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
            My Group Buys
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groupBuys}
        keyExtractor={item => item.id}
        renderItem={renderGroupBuy}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={80} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No active group buys</Text>
            <Text style={styles.emptySubtitle}>Check back soon or start one with a seller!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  activeTab: {
    backgroundColor: colors.primaryLight,
  },
  tabText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  sellerName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  productRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.border,
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  productName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountedPrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginLeft: spacing.sm,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  discountText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  timeLeft: {
    fontSize: fontSize.sm,
    color: colors.warning,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  districtInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  districtText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  neededText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  participantsSection: {
    marginBottom: spacing.md,
  },
  participantsTitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  participantsList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  participantCount: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  joinButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textLight,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
