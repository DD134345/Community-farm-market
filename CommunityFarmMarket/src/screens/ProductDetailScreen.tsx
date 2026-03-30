import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product, Seller, Allergen, Certification } from '../types';
import { useApp } from '../context/AppContext';
import { mockSellers, mockReviews } from '../data/mockData';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface ProductDetailScreenProps {
  navigation: any;
  route: { params: { product: Product } };
}

const { width } = Dimensions.get('window');

const allergenLabels: Record<Allergen, string> = {
  gluten: 'Gluten',
  dairy: 'Dairy',
  eggs: 'Eggs',
  fish: 'Fish',
  shellfish: 'Shellfish',
  tree_nuts: 'Tree Nuts',
  peanuts: 'Peanuts',
  soy: 'Soy',
  sesame: 'Sesame',
  mustard: 'Mustard',
  celery: 'Celery',
  lupin: 'Lupin',
  molluscs: 'Molluscs',
  sulphites: 'Sulphites',
};

const certificationLabels: Record<Certification, string> = {
  organic: 'Organic',
  halal: 'Halal',
  kosher: 'Kosher',
  fair_trade: 'Fair Trade',
  rainforest_alliance: 'Rainforest Alliance',
  non_gmo: 'Non-GMO',
  grass_fed: 'Grass-Fed',
  free_range: 'Free Range',
  local: 'Local',
};

const temperatureZoneLabels: Record<string, { label: string; color: string }> = {
  frozen: { label: 'Frozen', color: '#03A9F4' },
  cold: { label: 'Cold Storage', color: '#00BCD4' },
  ambient: { label: 'Room Temperature', color: '#4CAF50' },
  hot: { label: 'Hot Food', color: '#FF5722' },
};

export default function ProductDetailScreen({ navigation, route }: ProductDetailScreenProps) {
  const { product } = route.params;
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const seller = mockSellers.find(s => s.id === product.sellerId) || mockSellers[0];
  const productReviews = mockReviews.filter(r => r.sellerId === product.sellerId);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigation.navigate('Cart');
  };

  const handleChatWithSeller = () => {
    navigation.navigate('ChatDetail', { sellerId: seller.id, sellerName: seller.name });
  };

  const getTemperatureZone = () => {
    return temperatureZoneLabels[product.temperatureZone] || { label: 'Unknown', color: colors.textMuted };
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[selectedImage] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={styles.imageNav}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={[styles.tempZoneBadge, { backgroundColor: getTemperatureZone().color }]}>
            <Ionicons name="thermometer" size={14} color={colors.textLight} />
            <Text style={styles.tempZoneText}>{getTemperatureZone().label}</Text>
          </View>
          {product.coldChain && (
            <View style={styles.coldChainBadge}>
              <Ionicons name="snow" size={16} color={colors.coldChain} />
              <Text style={styles.coldChainText}>Requires Refrigeration</Text>
            </View>
          )}
          {product.availableNow && (
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>Available Now</Text>
            </View>
          )}
          {product.preOrder && (
            <View style={styles.preOrderBadge}>
              <Ionicons name="time-outline" size={14} color={colors.textLight} />
              <Text style={styles.preOrderText}>Pre-order ({product.prepTime} min prep)</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.priceSection}>
            <View>
              <Text style={styles.price}>{product.price.toLocaleString()}đ</Text>
              <Text style={styles.unit}>per {product.unit}</Text>
            </View>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>{product.originalPrice.toLocaleString()}đ</Text>
            )}
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

          <View style={styles.sourcingSection}>
            <Ionicons name="leaf" size={20} color={colors.primary} />
            <Text style={styles.sourcingText}>{product.sourcing}</Text>
          </View>

          {product.dietary.length > 0 && (
            <View style={styles.dietaryTags}>
              {product.dietary.map(tag => (
                <View key={tag} style={styles.dietaryTag}>
                  <Text style={styles.dietaryTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.chatSellerButton} onPress={handleChatWithSeller}>
            <Ionicons name="chatbubbles" size={20} color={colors.primary} />
            <Text style={styles.chatSellerText}>Chat with Seller</Text>
          </TouchableOpacity>

          <View style={styles.sellerSection}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <TouchableOpacity
              style={styles.sellerCard}
              onPress={() => navigation.navigate('SellerProfile', { seller })}
            >
              <Image source={{ uri: seller.avatar }} style={styles.sellerAvatar} />
              <View style={styles.sellerInfo}>
                <View style={styles.sellerNameRow}>
                  <Text style={styles.sellerName}>{seller.name}</Text>
                  {seller.verified && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  )}
                </View>
                <View style={styles.sellerStats}>
                  <Ionicons name="star" size={14} color={colors.rating} />
                  <Text style={styles.sellerRating}>{seller.rating}</Text>
                  <Text style={styles.sellerReviews}>({seller.reviewCount} reviews)</Text>
                </View>
                {seller.distance && (
                  <View style={styles.sellerDistance}>
                    <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.distanceText}>{seller.distance.toFixed(1)} km away</Text>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {productReviews.length > 0 && (
            <View style={styles.reviewsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              {productReviews.slice(0, 2).map(review => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image source={{ uri: review.buyerAvatar }} style={styles.reviewerAvatar} />
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>{review.buyerName}</Text>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name="star"
                            size={12}
                            color={i < review.rating ? colors.rating : colors.border}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>2 days ago</Text>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  {review.sellerResponse && (
                    <View style={styles.sellerResponseCard}>
                      <Text style={styles.sellerResponseLabel}>Seller Response:</Text>
                      <Text style={styles.sellerResponseText}>{review.sellerResponse.comment}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={styles.complianceSection}>
            <Text style={styles.sectionTitle}>Compliance & Certifications</Text>
            
            {product.compliance && (
              <>
                {product.compliance.certifications.length > 0 && (
                  <View style={styles.certificationsRow}>
                    {product.compliance.certifications.map(cert => (
                      <View key={cert} style={styles.certificationBadge}>
                        <Ionicons name="shield-checkmark" size={14} color={colors.success} />
                        <Text style={styles.certificationText}>{certificationLabels[cert]}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {product.compliance.allergens.length > 0 && (
                  <View style={styles.allergenWarning}>
                    <Ionicons name="warning" size={18} color={colors.warning} />
                    <Text style={styles.allergenTitle}>Allergen Warning:</Text>
                    <View style={styles.allergenList}>
                      {product.compliance.allergens.map(allergen => (
                        <Text key={allergen} style={styles.allergenText}>
                          {allergenLabels[allergen]}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.storageCard}>
                  <Text style={styles.storageTitle}>
                    <Ionicons name="cube-outline" size={16} color={colors.primary} /> Storage Instructions
                  </Text>
                  <Text style={styles.storageText}>{product.compliance.storageInstructions}</Text>
                </View>

                {product.compliance.bestBefore && (
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                    <Text style={styles.infoText}>Best before: {new Date(product.compliance.bestBefore).toLocaleDateString()}</Text>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.harvestInfo}>
            <Text style={styles.sectionTitle}>Harvest Information</Text>
            {product.harvestDate && (
              <View style={styles.infoRow}>
                <Ionicons name="leaf-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.infoText}>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</Text>
              </View>
            )}
            {product.expiryDate && (
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.infoText}>Best before: {new Date(product.expiryDate).toLocaleDateString()}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantitySection}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Ionicons name="cart" size={20} color={colors.textLight} />
          <Text style={styles.addButtonText}>Add to Cart</Text>
          <Text style={styles.addButtonPrice}>{(product.price * quantity).toLocaleString()}đ</Text>
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
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: width,
    backgroundColor: colors.border,
  },
  imageNav: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coldChainBadge: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 169, 244, 0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  coldChainText: {
    color: colors.textLight,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  availableBadge: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  availableText: {
    color: colors.textLight,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
    paddingBottom: 120,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
  },
  unit: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  originalPrice: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  productName: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  productDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  sourcingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  sourcingText: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  dietaryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  dietaryTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  dietaryTagText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  sellerSection: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.border,
  },
  sellerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.xs,
  },
  sellerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  sellerRating: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  sellerReviews: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  sellerDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  distanceText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginLeft: 2,
  },
  reviewsSection: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
  },
  reviewerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  reviewerName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  reviewRating: {
    flexDirection: 'row',
    marginTop: 2,
  },
  reviewDate: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  reviewComment: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  harvestInfo: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xs,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    minWidth: 40,
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginLeft: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textLight,
    marginLeft: spacing.sm,
  },
  addButtonPrice: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textLight,
    marginLeft: spacing.sm,
  },
  chatSellerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  chatSellerText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  tempZoneBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tempZoneText: {
    color: colors.textLight,
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginLeft: 4,
  },
  preOrderBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.preOrder,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  preOrderText: {
    color: colors.textLight,
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginLeft: 4,
  },
  complianceSection: {
    marginBottom: spacing.md,
  },
  certificationsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.success,
  },
  certificationText: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  allergenWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  allergenTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.warning,
    marginLeft: spacing.sm,
  },
  allergenList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    marginLeft: spacing.xs,
  },
  allergenText: {
    fontSize: fontSize.xs,
    color: colors.warning,
    marginLeft: spacing.xs,
  },
  storageCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  storageTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  storageText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  sellerResponseCard: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  sellerResponseLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  sellerResponseText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
