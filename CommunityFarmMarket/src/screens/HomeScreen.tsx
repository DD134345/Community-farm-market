import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { mockProducts, mockSellers, mockCommunityPosts, mockEvents } from '../data/mockData';
import SearchBar from '../components/SearchBar';
import { CategoryFilter, DietaryFilter, DistrictFilter } from '../components/Filters';
import ProductCard from '../components/ProductCard';
import SellerCard from '../components/SellerCard';
import { ProductCategory, DietaryTag, Product } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { addToCart, selectedDistrict, setSelectedDistrict, dietaryFilters, setDietaryFilters } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const districts = ['District 1', 'District 2', 'District 3', 'District 7', 'District 9'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesDietary = dietaryFilters.length === 0 || 
      dietaryFilters.some(tag => product.dietary.includes(tag));
    return matchesSearch && matchesCategory && matchesDietary;
  });

  const featuredProducts = filteredProducts.slice(0, 6);
  const seasonalProducts = filteredProducts.filter(p => p.originalPrice).slice(0, 4);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning!</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={styles.location}>{selectedDistrict === 'All' ? 'All Districts' : selectedDistrict}</Text>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="chevron-down" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => navigation.navigate('Filters')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {dietaryFilters.length > 0 && (
          <DietaryFilter selected={dietaryFilters} onToggle={(tag) => {
            setDietaryFilters(prev => 
              prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
            );
          }} />
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Sellers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={mockSellers}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <SellerCard
                seller={item}
                onPress={() => navigation.navigate('SellerProfile', { seller: item })}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fresh This Morning</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={featuredProducts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                onAddToCart={() => handleAddToCart(item)}
                distance={2.5}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Seasonal Deals</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={seasonalProducts.length > 0 ? seasonalProducts : featuredProducts.slice(0, 4)}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                onAddToCart={() => handleAddToCart(item)}
                distance={2.5}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community</Text>
          </View>
          {mockCommunityPosts.slice(0, 2).map(post => (
            <TouchableOpacity key={post.id} style={styles.communityCard}>
              <View style={styles.communityHeader}>
                <View style={styles.communityAvatar}>
                  <Ionicons name="person" size={20} color={colors.textMuted} />
                </View>
                <View style={styles.communityInfo}>
                  <Text style={styles.communityAuthor}>{post.authorName}</Text>
                  <Text style={styles.communityTime}>2 hours ago</Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: getTypeColor(post.type) }]}>
                  <Text style={styles.typeText}>{post.type}</Text>
                </View>
              </View>
              <Text style={styles.communityTitle}>{post.title}</Text>
              <Text style={styles.communityContent} numberOfLines={2}>{post.content}</Text>
              <View style={styles.communityFooter}>
                <View style={styles.communityStat}>
                  <Ionicons name="heart-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.statText}>{post.likes}</Text>
                </View>
                <View style={styles.communityStat}>
                  <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.statText}>{post.comments}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {mockEvents.slice(0, 2).map(event => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <View style={styles.eventImage}>
                <Ionicons name="calendar" size={24} color={colors.primary} />
              </View>
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventDetail}>
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.eventText}>{formatEventDate(event.date)}</Text>
                </View>
                <View style={styles.eventDetail}>
                  <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.eventText}>{event.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'recipe': return colors.primary;
    case 'tip': return colors.info;
    case 'event': return colors.secondary;
    case 'announcement': return colors.warning;
    default: return colors.textMuted;
  }
}

function formatEventDate(date: Date): string {
  const now = new Date();
  const diff = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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
  greeting: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '600',
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  seeAll: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  horizontalList: {
    paddingHorizontal: spacing.md,
  },
  communityCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  communityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  communityAuthor: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  communityTime: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  communityTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  communityContent: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  communityFooter: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  communityStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  statText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  eventImage: {
    width: 80,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContent: {
    flex: 1,
    padding: spacing.md,
  },
  eventTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginLeft: 4,
  },
  bottomPadding: {
    height: 100,
  },
});
