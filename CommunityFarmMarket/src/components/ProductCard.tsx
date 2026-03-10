import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
  distance?: number;
}

export default function ProductCard({ product, onPress, onAddToCart, distance }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      {product.coldChain && (
        <View style={styles.coldChainBadge}>
          <Ionicons name="snow" size={12} color={colors.coldChain} />
          <Text style={styles.coldChainText}>Cold</Text>
        </View>
      )}
      {product.availableNow && (
        <View style={styles.availableBadge}>
          <Text style={styles.availableText}>Available Now</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.sourcing} numberOfLines={1}>{product.sourcing}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{product.price.toLocaleString()}đ</Text>
          <Text style={styles.unit}>/ {product.unit}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={colors.rating} />
            <Text style={styles.ratingText}>New</Text>
          </View>
          {distance !== undefined && (
            <Text style={styles.distance}>{distance.toFixed(1)} km</Text>
          )}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
          <Ionicons name="add" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 170,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: colors.border,
  },
  coldChainBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 169, 244, 0.1)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  coldChainText: {
    fontSize: fontSize.xs,
    color: colors.coldChain,
    marginLeft: 2,
  },
  availableBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.available,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  availableText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '600',
  },
  content: {
    padding: spacing.sm,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  sourcing: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  unit: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  distance: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  addButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
