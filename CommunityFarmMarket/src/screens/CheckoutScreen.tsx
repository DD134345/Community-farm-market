import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { mockPickupPoints } from '../data/mockData';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface CheckoutScreenProps {
  navigation: any;
  route: { params: { paymentMethod: string; deliveryFee: number; platformFee: number; total: number } };
}

export default function CheckoutScreen({ navigation, route }: CheckoutScreenProps) {
  const { cart, cartTotal, clearCart } = useApp();
  const { paymentMethod, deliveryFee, platformFee, total } = route.params;
  
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('delivery');
  const [selectedPickup, setSelectedPickup] = useState(mockPickupPoints[0].id);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('morning');

  const timeSlots = [
    { id: 'morning', label: 'Morning', time: '8:00 - 12:00' },
    { id: 'afternoon', label: 'Afternoon', time: '14:00 - 18:00' },
    { id: 'evening', label: 'Evening', time: '18:00 - 21:00' },
  ];

  const handlePlaceOrder = () => {
    Alert.alert(
      'Order Placed!',
      'Your order has been successfully placed. You will receive updates shortly.',
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.navigate('MainTabs');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Checkout</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.itemsCard}>
            {cart.map(item => (
              <View key={item.product.id} style={styles.cartItem}>
                <View style={styles.itemImage}>
                  <Ionicons name="image-outline" size={20} color={colors.textMuted} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                  <Text style={styles.itemQty}>x{item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  {(item.product.price * item.quantity).toLocaleString()}đ
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fulfillment Method</Text>
          <View style={styles.fulfillmentOptions}>
            <TouchableOpacity
              style={[
                styles.fulfillmentOption,
                fulfillmentType === 'delivery' && styles.fulfillmentSelected,
              ]}
              onPress={() => setFulfillmentType('delivery')}
            >
              <Ionicons
                name="bicycle"
                size={24}
                color={fulfillmentType === 'delivery' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.fulfillmentText,
                  fulfillmentType === 'delivery' && styles.fulfillmentTextSelected,
                ]}
              >
                Delivery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.fulfillmentOption,
                fulfillmentType === 'pickup' && styles.fulfillmentSelected,
              ]}
              onPress={() => setFulfillmentType('pickup')}
            >
              <Ionicons
                name="storefront"
                size={24}
                color={fulfillmentType === 'pickup' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.fulfillmentText,
                  fulfillmentType === 'pickup' && styles.fulfillmentTextSelected,
                ]}
              >
                Pickup
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {fulfillmentType === 'pickup' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Pickup Point</Text>
            {mockPickupPoints.map(point => (
              <TouchableOpacity
                key={point.id}
                style={[
                  styles.pickupOption,
                  selectedPickup === point.id && styles.pickupSelected,
                ]}
                onPress={() => setSelectedPickup(point.id)}
              >
                <View style={styles.pickupIcon}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={selectedPickup === point.id ? colors.primary : colors.textSecondary}
                  />
                </View>
                <View style={styles.pickupInfo}>
                  <Text style={styles.pickupName}>{point.name}</Text>
                  <Text style={styles.pickupAddress}>
                    {point.address.street}, {point.address.district}
                  </Text>
                  <Text style={styles.pickupHours}>{point.hours}</Text>
                </View>
                <View style={[
                  styles.radioOuter,
                  selectedPickup === point.id && styles.radioOuterSelected,
                ]}>
                  {selectedPickup === point.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
              <View style={styles.addressIcon}>
                <Ionicons name="home" size={20} color={colors.primary} />
              </View>
              <View style={styles.addressInfo}>
                <Text style={styles.addressLabel}>Home</Text>
                <Text style={styles.addressText}>
                  456 User Street, District 2, Ho Chi Minh City
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Time</Text>
          <View style={styles.timeSlots}>
            {timeSlots.map(slot => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeSlot,
                  selectedTimeSlot === slot.id && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTimeSlot(slot.id)}
              >
                <Text
                  style={[
                    styles.timeSlotLabel,
                    selectedTimeSlot === slot.id && styles.timeSlotLabelSelected,
                  ]}
                >
                  {slot.label}
                </Text>
                <Text
                  style={[
                    styles.timeSlotTime,
                    selectedTimeSlot === slot.id && styles.timeSlotTimeSelected,
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentCard}>
            <Ionicons
              name={paymentMethod === 'cash' ? 'cash' : paymentMethod === 'e-wallet' ? 'wallet' : 'card'}
              size={24}
              color={colors.primary}
            />
            <Text style={styles.paymentText}>
              {paymentMethod === 'cash' ? 'Cash on Delivery' :
               paymentMethod === 'e-wallet' ? 'E-Wallet' : 'Bank Transfer'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{cartTotal.toLocaleString()}đ</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>{deliveryFee.toLocaleString()}đ</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Platform Fee</Text>
              <Text style={styles.summaryValue}>{platformFee.toLocaleString()}đ</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total.toLocaleString()}đ</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
          <View style={styles.orderBadge}>
            <Text style={styles.orderBadgeText}>{total.toLocaleString()}đ</Text>
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
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  itemsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  itemName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text,
  },
  itemQty: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  itemPrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  fulfillmentOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fulfillmentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fulfillmentSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
  fulfillmentText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  fulfillmentTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  pickupOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickupSelected: {
    borderColor: colors.primary,
  },
  pickupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickupInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  pickupName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  pickupAddress: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pickupHours: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  addressLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  addressText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  changeText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  timeSlots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timeSlot: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeSlotSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
  timeSlotLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  timeSlotLabelSelected: {
    color: colors.primary,
  },
  timeSlotTime: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  timeSlotTimeSelected: {
    color: colors.primary,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  paymentText: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.md,
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
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
  bottomPadding: {
    height: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  placeOrderButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  placeOrderText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textLight,
  },
  orderBadge: {
    backgroundColor: colors.textLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  orderBadgeText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
  },
});
