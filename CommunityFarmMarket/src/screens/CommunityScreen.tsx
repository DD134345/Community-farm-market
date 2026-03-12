import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockCommunityPosts, mockEvents } from '../data/mockData';
import { CommunityPost } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface CommunityScreenProps {
  navigation: any;
}

export default function CommunityScreen({ navigation }: CommunityScreenProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'events'>('feed');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recipe': return 'restaurant';
      case 'tip': return 'bulb';
      case 'announcement': return 'megaphone';
      case 'event': return 'calendar';
      case 'group_buy': return 'cart';
      default: return 'chatbubble';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recipe': return colors.primary;
      case 'tip': return colors.info;
      case 'announcement': return colors.warning;
      case 'event': return colors.secondary;
      case 'group_buy': return colors.primaryLight;
      default: return colors.textMuted;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    if (diff < 1) return 'Just now';
    if (diff < 24) return `${diff}h ago`;
    return `${Math.floor(diff / 24)}d ago`;
  };

  const renderPost = ({ item }: { item: CommunityPost }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAuthor}>
          <View style={styles.authorAvatar}>
            <Ionicons name="person" size={20} color={colors.textMuted} />
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{item.authorName}</Text>
            <Text style={styles.postTime}>{formatTime(item.createdAt)}</Text>
          </View>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
          <Ionicons name={getTypeIcon(item.type) as any} size={12} color={colors.textLight} />
          <Text style={styles.typeText}>{item.type.replace('_', ' ')}</Text>
        </View>
      </View>

      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent} numberOfLines={3}>{item.content}</Text>

      {item.images && item.images.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.postImage} />
      )}

      {item.eventDate && (
        <TouchableOpacity style={styles.eventCard}>
          <View style={styles.eventIcon}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventDate}>
              {new Date(item.eventDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            {item.eventLocation && (
              <Text style={styles.eventLocation}>{item.eventLocation}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.rsvpButton}>
            <Text style={styles.rsvpText}>RSVP</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {item.groupBuyDetails && (
        <View style={styles.groupBuyCard}>
          <View style={styles.groupBuyHeader}>
            <Text style={styles.groupBuyTitle}>{item.groupBuyDetails.productName}</Text>
            <Text style={styles.groupBuyDiscount}>{item.groupBuyDetails.discount}% OFF</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(item.groupBuyDetails.currentQuantity / item.groupBuyDetails.targetQuantity) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.groupBuyProgress}>
            {item.groupBuyDetails.currentQuantity}/{item.groupBuyDetails.targetQuantity} joined
          </Text>
        </View>
      )}

      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEvent = ({ item }: { item: typeof mockEvents[0] }) => (
    <TouchableOpacity style={styles.eventCardLarge}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventContentLarge}>
        <View style={[styles.eventTypeBadge, { backgroundColor: getTypeColor(item.type) }]}>
          <Text style={styles.eventTypeText}>{item.type.replace('_', ' ')}</Text>
        </View>
        <Text style={styles.eventTitleLarge}>{item.title}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
            <Text style={styles.eventDetailText}>
              {new Date(item.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.eventDetail}>
            <Ionicons name="location-outline" size={16} color={colors.textMuted} />
            <Text style={styles.eventDetailText}>{item.location}</Text>
          </View>
          <View style={styles.eventDetail}>
            <Ionicons name="people-outline" size={16} color={colors.textMuted} />
            <Text style={styles.eventDetailText}>{item.attendees} attending</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.attendButton}>
          <Text style={styles.attendButtonText}>Attend Event</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => setActiveTab('feed')}
        >
          <Ionicons
            name="grid"
            size={20}
            color={activeTab === 'feed' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>
            Feed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Ionicons
            name="calendar"
            size={20}
            color={activeTab === 'events' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
            Events
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'feed' ? (
        <FlatList
          data={mockCommunityPosts}
          keyExtractor={item => item.id}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={mockEvents}
          keyExtractor={item => item.id}
          renderItem={renderEvent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  activeTab: {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
  tabText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    marginLeft: spacing.sm,
  },
  authorName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  postTime: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  postTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  postContent: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  eventDate: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  eventLocation: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  rsvpButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  rsvpText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textLight,
  },
  groupBuyCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  groupBuyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  groupBuyTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  groupBuyDiscount: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.error,
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
  groupBuyProgress: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  actionText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  eventCardLarge: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.border,
  },
  eventContentLarge: {
    padding: spacing.md,
  },
  eventTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  eventTypeText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  eventTitleLarge: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  eventDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  eventDetails: {
    marginBottom: spacing.md,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  eventDetailText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
  attendButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  attendButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textLight,
  },
});
