import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Seller, Product } from '../types';
import { useApp } from '../context/AppContext';
import { mockProducts, mockReviews } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface SellerProfileScreenProps {
  navigation: any;
  route: { params: { seller: Seller } };
}

export default function SellerProfileScreen({ navigation, route }: SellerProfileScreenProps) {
  const { seller } = route.params;
  const { addToCart } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'>('products');

  const sellerProducts = mockProducts.filter(p => p.sellerId === seller.id);
  const sellerReviews = mockReviews.filter(r => r.sellerId === seller.id);

  const renderProducts = () => (
    <View style={styles.productGrid}>
      {sellerProducts.map(product => (
        <View key={product.id} style={styles.productItem}>
          <ProductCard
            product={product}
            onPress={() => navigation.navigate('ProductDetail', { product })}
            onAddToCart={() => addToCart(product, 1)}
            distance={seller.distance}
          />
        </View>
      ))}
    </View>
  );

  const renderAbout = () => (
    <View style={styles.aboutSection}>
      <View style={styles.storyCard}>
        <Text style={styles.storyTitle}>Our Story</Text>
        <Text style={styles.storyText}>{seller.story}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Farm Information</Text>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            {seller.address.street}, {seller.address.district}, {seller.address.city}
          </Text>
        </View>
        {seller.distance && (
          <View style={styles.infoRow}>
            <Ionicons name="navigate-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>{seller.distance.toFixed(1)} km from your location</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.infoText}>Member since {new Date(seller.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.badgesSection}>
        <Text style={styles.badgesTitle}>Trust Badges</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            <Text style={styles.badgeText}>Verified Seller</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="leaf" size={24} color={colors.primary} />
            <Text style={styles.badgeText}>Organic</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="star" size={24} color={colors.primary} />
            <Text style={styles.badgeText}>Top Rated</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.reviewsSection}>
      <View style={styles.ratingSummary}>
        <Text style={styles.ratingNumber}>{seller.rating}</Text>
        <View style={styles.ratingStars}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name="star"
              size={20}
              color={i < Math.floor(seller.rating) ? colors.rating : colors.border}
            />
          ))}
        </View>
        <Text style={styles.reviewCount}>{seller.reviewCount} reviews</Text>
      </View>

      {sellerReviews.map(review => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Image source={{ uri: review.buyerAvatar }} style={styles.reviewerAvatar} />
            <View style={styles.reviewerInfo}>
              <Text style={styles.reviewerName}>{review.buyerName}</Text>
              <Text style={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString()}
              </Text>
            </View>
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
          <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Image source={{ uri: seller.coverImage }} style={styles.coverImage} />
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileSection}>
          <Image source={{ uri: seller.avatar }} style={styles.avatar} />
          {seller.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            </View>
          )}
          <Text style={styles.sellerName}>{seller.name}</Text>
          <Text style={styles.sellerDescription}>{seller.description}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{seller.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{seller.reviewCount}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sellerProducts.length}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.followButton}>
            <Ionicons name="add" size={20} color={colors.primary} />
            <Text style={styles.followText}>Follow Seller</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'products' && styles.activeTab]}
            onPress={() => setActiveTab('products')}
          >
            <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
              Products
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'about' && renderAbout()}
          {activeTab === 'reviews' && renderReviews()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSection: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.border,
  },
  headerOverlay: {
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
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: -50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.surface,
    backgroundColor: colors.border,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 150,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  sellerName: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  sellerDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
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
    height: 30,
    backgroundColor: colors.divider,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  followText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
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
  tabContent: {
    padding: spacing.md,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: spacing.md,
  },
  aboutSection: {},
  storyCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  storyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  storyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  infoTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  badgesSection: {},
  badgesTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 100,
  },
  badgeText: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  reviewsSection: {},
  ratingSummary: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
  },
  ratingStars: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  reviewCount: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  reviewerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  reviewerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  reviewDate: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
