import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Seller } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface SellerCardProps {
  seller: Seller;
  onPress: () => void;
}

export default function SellerCard({ seller, onPress }: SellerCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: seller.avatar }} style={styles.avatar} />
      {seller.verified && (
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{seller.name}</Text>
        <Text style={styles.description} numberOfLines={1}>{seller.description}</Text>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={colors.rating} />
            <Text style={styles.ratingText}>{seller.rating}</Text>
            <Text style={styles.reviewCount}>({seller.reviewCount})</Text>
          </View>
          {seller.distance !== undefined && (
            <View style={styles.distance}>
              <Ionicons name="location-outline" size={12} color={colors.textMuted} />
              <Text style={styles.distanceText}>{seller.distance.toFixed(1)} km</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 280,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.round,
    backgroundColor: colors.border,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: spacing.md + 40,
    left: spacing.md + 44,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.round,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginLeft: 2,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginLeft: 2,
  },
});
