import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, CATEGORY_COLORS } from '../theme';

export default function PackageCard({ item, onPress }) {
  const categoryColor = CATEGORY_COLORS[item.category] || colors.primary;

  return (
    <TouchableOpacity style={[styles.card, shadows.card]} onPress={onPress} activeOpacity={0.92}>
      <View>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color={colors.bodyText} />
            <Text style={styles.metaText}> {item.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={12} color={colors.bodyText} />
            <Text style={styles.metaText}> Max {item.maxPeople}</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={12} color={colors.bodyText} />
            <Text style={styles.metaText}> {item.region}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

        <View style={styles.footer}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={styles.rating}> {item.rating}</Text>
            <Text style={styles.reviews}> ({item.reviewCount} reviews)</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceFrom}>from </Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={onPress} activeOpacity={0.85}>
          <Text style={styles.bookText}>Book Now  </Text>
          <Ionicons name="arrow-forward" size={14} color={colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 180,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    padding: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    color: colors.bodyText,
    fontSize: 11,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gunmetal,
    marginTop: 8,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: colors.bodyText,
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gunmetal,
  },
  reviews: {
    fontSize: 11,
    color: colors.bodyText,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceFrom: {
    fontSize: 11,
    color: colors.bodyText,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: borderRadius.full,
  },
  bookText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
