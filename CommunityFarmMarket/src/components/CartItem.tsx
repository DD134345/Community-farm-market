import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem as CartItemType } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <TouchableOpacity onPress={onRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
        <Text style={styles.seller}>{product.sourcing}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{product.price.toLocaleString()}đ / {product.unit}</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(quantity - 1)}
            >
              <Ionicons name="remove" size={18} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(quantity + 1)}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        {product.coldChain && (
          <View style={styles.coldChainBadge}>
            <Ionicons name="snow" size={12} color={colors.coldChain} />
            <Text style={styles.coldChainText}>Requires refrigeration</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.border,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.sm,
  },
  seller: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  price: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
  coldChainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    backgroundColor: 'rgba(3, 169, 244, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  coldChainText: {
    fontSize: fontSize.xs,
    color: colors.coldChain,
    marginLeft: 4,
  },
});
