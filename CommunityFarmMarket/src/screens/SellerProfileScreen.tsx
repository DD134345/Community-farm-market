import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Seller, Product, SellerBadge, SellerStory } from '../types';
import { useApp } from '../context/AppContext';
import { mockProducts, mockReviews } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface SellerProfileScreenProps {
  navigation: any;
  route: { params: { seller: Seller } };
}

const { width } = Dimensions.get('window');

const badgeConfig: Record<SellerBadge, { label: string; icon: string; color: string; description: string }> = {
  new: { label: 'New Seller', icon: 'sparkles', color: '#9E9E9E', description: 'Just joined our community' },
  trusted: { label: 'Trusted', icon: 'shield-checkmark', color: '#2196F3', description: 'Verified and trusted seller' },
  star: { label: 'Star Seller', icon: 'star', color: '#FFC107', description: 'Top rated with excellent service' },
  top_seller: { label: 'Top Seller', icon: 'trophy', color: '#FF5722', description: 'Among the best in the community' },
};

export default function SellerProfileScreen({ navigation, route }: SellerProfileScreenProps) {
  const { seller } = route.params;
  const { addToCart } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'stories' | 'about' | 'reviews'>('products');

  const sellerProducts = mockProducts.filter(p => p.sellerId === seller.id);
  const sellerReviews = mockReviews.filter(r => r.sellerId === seller.id);
  const sellerStories = seller.stories || [];

  const handleChatWithSeller = () => {
    navigation.navigate('ChatDetail', { sellerId: seller.id, sellerName: seller.name });
  };

  const getBadgeConfig = (badge: SellerBadge) => {
    return badgeConfig[badge] || badgeConfig.new;
  };

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

  const renderStories = () => (
    <View style={styles.storiesSection}>
      <Text style={styles.storiesSectionTitle}>Today's Menu</Text>
      <Text style={styles.storiesSectionSubtitle}>See what the seller is offering today</Text>
      
      {sellerStories.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
          {sellerStories.map((story: SellerStory) => (
            <TouchableOpacity key={story.id} style={styles.storyCard}>
              {story.image && (
                <Image source={{ uri: story.image }} style={styles.storyImage} />
              )}
              <View style={styles.storyContent}>
                <View style={[styles.storyTypeBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.storyTypeText}>Today's Menu</Text>
                </View>
                <Text style={styles.storyTitle} numberOfLines={2}>{story.title}</Text>
                <Text style={styles.storyContentText} numberOfLines={2}>{story.content}</Text>
                <Text style={styles.storyTime}>
                  Expires in {Math.floor((new Date(story.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60))}h
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noStoriesCard}>
          <Ionicons name="restaurant-outline" size={40} color={colors.textMuted} />
          <Text style={styles.noStoriesText}>No today's menu posted yet</Text>
          <Text style={styles.noStoriesSubtext}>Check back soon for fresh offerings!</Text>
        </View>
      )}

      <TouchableOpacity style={styles.postStoryButton}>
        <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.postStoryText}>Ask seller about today's specials</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAbout = () => (
    <View style={styles.aboutSection}>
      <View style={styles.storyCardFull}>
        <Text style={styles.storyTitleFull}>Our Story</Text>
        <Text style={styles.storyText}>{seller.story}</Text>
      </View>

      <View style={styles.sellerStatsCard}>
        <Text style={styles.sellerStatsTitle}>Seller Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{seller.totalSales}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{seller.reviewCount}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{seller.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
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
          <Text style={styles.infoText}>Member since {new Date(seller.memberSince || seller.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.infoText}>Responds {seller.responseTime}</Text>
        </View>
      </View>

      <View style={styles.badgesSection}>
        <Text style={styles.badgesTitle}>Seller Badge</Text>
        <View style={[styles.sellerBadge, { backgroundColor: getBadgeConfig(seller.badge).color + '20' }]}>
          <Ionicons name={getBadgeConfig(seller.badge).icon as any} size={32} color={getBadgeConfig(seller.badge).color} />
          <View style={styles.sellerBadgeInfo}>
            <Text style={[styles.sellerBadgeLabel, { color: getBadgeConfig(seller.badge).color }]}>
              {getBadgeConfig(seller.badge).label}
            </Text>
            <Text style={styles.sellerBadgeDescription}>{getBadgeConfig(seller.badge).description}</Text>
          </View>
        </View>
        {seller.verified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
            <Text style={styles.verifiedText}>Verified Seller - Identity confirmed by platform</Text>
          </View>
        )}
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
            <Text style={styles.reviewDate}>
              {new Date(review.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
          {review.sellerResponse && (
            <View style={styles.sellerResponseCard}>
              <View style={styles.sellerResponseHeader}>
                <Ionicons name="storefront" size={14} color={colors.primary} />
                <Text style={styles.sellerResponseLabel}>Seller Response</Text>
              </View>
              <Text style={styles.sellerResponseText}>{review.sellerResponse.comment}</Text>
              <Text style={styles.sellerResponseTime}>
                {new Date(review.sellerResponse.respondedAt).toLocaleDateString()}
              </Text>
            </View>
          )}
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
            <View style={styles.verifiedBadgePosition}>
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            </View>
          )}
          <Text style={styles.sellerName}>{seller.name}</Text>
          <Text style={styles.sellerDescription}>{seller.description}</Text>
          
          <TouchableOpacity style={styles.chatButton} onPress={handleChatWithSeller}>
            <Ionicons name="chatbubbles" size={18} color={colors.primary} />
            <Text style={styles.chatButtonText}>Chat with Seller</Text>
          </TouchableOpacity>

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
            style={[styles.tab, activeTab === 'stories' && styles.activeTab]}
            onPress={() => setActiveTab('stories')}
          >
            <Text style={[styles.tabText, activeTab === 'stories' && styles.activeTabText]}>
              Today's Menu
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
          {activeTab === 'stories' && renderStories()}
          {activeTab === 'about' && renderAbout()}
          {activeTab === 'reviews' && renderReviews()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerSection: { position: 'relative' },
  coverImage: { width: '100%', height: 180, backgroundColor: colors.border },
  headerOverlay: { position: 'absolute', top: 50, left: spacing.md, right: spacing.md, flexDirection: 'row', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  shareButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  profileSection: { alignItems: 'center', paddingHorizontal: spacing.md, marginTop: -50 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: colors.surface, backgroundColor: colors.border },
  verifiedBadgePosition: { position: 'absolute', top: 130, backgroundColor: colors.surface, borderRadius: 12 },
  sellerName: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  sellerDescription: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs, paddingHorizontal: spacing.lg },
  chatButton: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: borderRadius.round, borderWidth: 1, borderColor: colors.primary },
  chatButtonText: { fontSize: fontSize.md, fontWeight: '600', color: colors.primary, marginLeft: spacing.xs },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, backgroundColor: colors.surface, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: borderRadius.lg },
  statItem: { alignItems: 'center', paddingHorizontal: spacing.lg },
  statValue: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: colors.divider },
  followButton: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: borderRadius.round, borderWidth: 1, borderColor: colors.primary },
  followText: { fontSize: fontSize.md, fontWeight: '600', color: colors.primary, marginLeft: spacing.xs },
  tabBar: { flexDirection: 'row', marginTop: spacing.lg, paddingHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '500' },
  activeTabText: { color: colors.primary, fontWeight: '600' },
  tabContent: { padding: spacing.md },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productItem: { width: '48%', marginBottom: spacing.md },
  storiesSection: { marginBottom: spacing.md },
  storiesSectionTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  storiesSectionSubtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md },
  storiesScroll: { marginBottom: spacing.md },
  storyCard: { width: 200, backgroundColor: colors.surface, borderRadius: borderRadius.lg, marginRight: spacing.md, overflow: 'hidden' },
  storyImage: { width: '100%', height: 120, backgroundColor: colors.border },
  storyContent: { padding: spacing.sm },
  storyTypeBadge: { alignSelf: 'flex-start', paddingHorizontal: spacing.xs, paddingVertical: 2, borderRadius: borderRadius.sm, marginBottom: spacing.xs },
  storyTypeText: { fontSize: fontSize.xs, color: colors.textLight, fontWeight: '600' },
  storyTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  storyContentText: { fontSize: fontSize.xs, color: colors.textSecondary, marginBottom: spacing.xs },
  storyTime: { fontSize: fontSize.xs, color: colors.warning, fontWeight: '500' },
  noStoriesCard: { alignItems: 'center', padding: spacing.xl, backgroundColor: colors.surface, borderRadius: borderRadius.lg },
  noStoriesText: { fontSize: fontSize.md, color: colors.text, fontWeight: '600', marginTop: spacing.sm },
  noStoriesSubtext: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  postStoryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.primary, borderStyle: 'dashed' },
  postStoryText: { fontSize: fontSize.md, color: colors.primary, fontWeight: '500', marginLeft: spacing.sm },
  aboutSection: {},
  storyCardFull: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.md },
  storyTitleFull: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  storyText: { fontSize: fontSize.md, color: colors.textSecondary, lineHeight: 22 },
  sellerStatsCard: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.md },
  sellerStatsTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  infoCard: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.md },
  infoTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  infoText: { fontSize: fontSize.md, color: colors.textSecondary, marginLeft: spacing.sm, flex: 1 },
  badgesSection: {},
  badgesTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  sellerBadge: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  sellerBadgeInfo: { marginLeft: spacing.md },
  sellerBadgeLabel: { fontSize: fontSize.lg, fontWeight: '700' },
  sellerBadgeDescription: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight, padding: spacing.sm, borderRadius: borderRadius.md },
  verifiedText: { fontSize: fontSize.sm, color: colors.primary, marginLeft: spacing.xs },
  reviewsSection: {},
  ratingSummary: { alignItems: 'center', backgroundColor: colors.surface, padding: spacing.lg, borderRadius: borderRadius.lg, marginBottom: spacing.md },
  ratingNumber: { fontSize: 48, fontWeight: '700', color: colors.text },
  ratingStars: { flexDirection: 'row', marginTop: spacing.xs },
  reviewCount: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },
  reviewCard: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.md },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.border },
  reviewerInfo: { flex: 1, marginLeft: spacing.sm },
  reviewerName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  reviewDate: { fontSize: fontSize.xs, color: colors.textMuted },
  reviewRating: { flexDirection: 'row', marginTop: 2 },
  reviewComment: { fontSize: fontSize.md, color: colors.textSecondary, lineHeight: 20 },
  sellerResponseCard: { backgroundColor: colors.background, padding: spacing.sm, borderRadius: borderRadius.sm, marginTop: spacing.sm },
  sellerResponseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  sellerResponseLabel: { fontSize: fontSize.xs, fontWeight: '600', color: colors.primary, marginLeft: spacing.xs },
  sellerResponseText: { fontSize: fontSize.sm, color: colors.textSecondary, fontStyle: 'italic' },
  sellerResponseTime: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.xs },
});
