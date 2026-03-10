import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import CartItemComponent from '../components/CartItem';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface CartScreenProps {
  navigation: any;
}

export default function CartScreen({ navigation }: CartScreenProps) {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartTotal } = useApp();
  const [selectedPayment, setSelectedPayment] = useState('cash');

  const deliveryFee = cart.length > 0 ? 15000 : 0;
  const platformFee = Math.round(cartTotal * 0.05);
  const total = cartTotal + deliveryFee + platformFee;

  const groupedBySeller = cart.reduce((acc, item) => {
    if (!acc[item.sellerId]) {
      acc[item.sellerId] = [];
    }
    acc[item.sellerId].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigation.navigate('Checkout', {
      paymentMethod: selectedPayment,
      deliveryFee,
      platformFee,
      total,
    });
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Start adding fresh produce from local sellers!</Text>
        <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={styles.exploreText}>Explore Marketplace</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={Object.entries(groupedBySeller)}
        keyExtractor={([sellerId]) => sellerId}
        renderItem={({ item: [sellerId, items] }) => (
          <View style={styles.sellerSection}>
            <View style={styles.sellerHeader}>
              <Ionicons name="storefront-outline" size={16} color={colors.primary} />
              <Text style={styles.sellerName}>Seller {sellerId}</Text>
            </View>
            {items.map(item => (
              <CartItemComponent
                key={item.product.id}
                item={item}
                onUpdateQuantity={(qty) => updateCartQuantity(item.product.id, qty)}
                onRemove={() => removeFromCart(item.product.id)}
              />
            ))}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{cartTotal.toLocaleString()}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{deliveryFee.toLocaleString()}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform Fee (5%)</Text>
            <Text style={styles.summaryValue}>{platformFee.toLocaleString()}đ</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()}đ</Text>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[styles.paymentOption, selectedPayment === 'cash' && styles.paymentSelected]}
              onPress={() => setSelectedPayment('cash')}
            >
              <Ionicons name="cash-outline" size={24} color={selectedPayment === 'cash' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.paymentText, selectedPayment === 'cash' && styles.paymentTextSelected]}>Cash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentOption, selectedPayment === 'e-wallet' && styles.paymentSelected]}
              onPress={() => setSelectedPayment('e-wallet')}
            >
              <Ionicons name="wallet-outline" size={24} color={selectedPayment === 'e-wallet' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.paymentText, selectedPayment === 'e-wallet' && styles.paymentTextSelected]}>E-Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentOption, selectedPayment === 'bank_transfer' && styles.paymentSelected]}
              onPress={() => setSelectedPayment('bank_transfer')}
            >
              <Ionicons name="card-outline" size={24} color={selectedPayment === 'bank_transfer' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.paymentText, selectedPayment === 'bank_transfer' && styles.paymentTextSelected]}>Bank</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <View style={styles.checkoutBadge}>
            <Text style={styles.checkoutBadgeText}>{cart.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
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
  clearText: {
    fontSize: fontSize.md,
    color: colors.error,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  sellerSection: {
    marginBottom: spacing.md,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sellerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
  exploreButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  exploreText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textLight,
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderTopRadius.xl,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summarySection: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentSection: {
    marginBottom: spacing.md,
  },
  paymentTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  paymentSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
  paymentText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  paymentTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  checkoutText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textLight,
  },
  checkoutBadge: {
    backgroundColor: colors.textLight,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
  },
});
