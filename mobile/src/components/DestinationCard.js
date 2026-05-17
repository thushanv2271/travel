import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../theme';

const REGION_LABELS = {
  west: 'West Coast',
  south: 'South',
  east: 'East Coast',
  north: 'North',
  central: 'Central & Hills',
};

export default function DestinationCard({ item, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.card, shadows.card, style]}
      onPress={onPress}
      activeOpacity={0.92}
    >
      <View style={styles.imageWrapper}>
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(11,45,78,0.82)']}
            style={styles.gradient}
          >
            <View style={styles.regionBadge}>
              <Text style={styles.regionText}>
                {REGION_LABELS[item.region] || item.region}
              </Text>
            </View>
            <View style={styles.footer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={styles.rating}> {item.rating}</Text>
                <Text style={styles.reviews}> ({item.reviewCount.toLocaleString()})</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.cardBg,
  },
  imageWrapper: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    height: 190,
    justifyContent: 'space-between',
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  regionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(26,115,184,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  regionText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    marginBottom: 4,
  },
  name: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  reviews: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
});
