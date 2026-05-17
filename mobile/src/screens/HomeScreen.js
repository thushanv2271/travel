import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HeroSlider from '../components/HeroSlider';
import DestinationCard from '../components/DestinationCard';
import PackageCard from '../components/PackageCard';
import { heroSlides } from '../data/packages';
import { destinations } from '../data/destinations';
import { packages } from '../data/packages';
import { colors, spacing, borderRadius, shadows } from '../theme';

const FEATURED_DESTINATIONS = destinations.filter((_, i) => [0, 2, 6, 8].includes(i));
const FEATURED_PACKAGES = packages.slice(0, 3);

function SectionHeader({ title, subtitle, onSeeAll }) {
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      <TouchableOpacity onPress={onSeeAll} style={styles.seeAllBtn}>
        <Text style={styles.seeAllText}>See All </Text>
        <Ionicons name="arrow-forward" size={14} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.headerContent}>
          <View style={styles.helpline}>
            <Ionicons name="call" size={14} color={colors.white} />
            <Text style={styles.helplineText}> +94 72 280 0251</Text>
          </View>
          <View style={styles.logoBox}>
            <Text style={styles.logoTruly}>Truly </Text>
            <Text style={styles.logoSL}>Sri Lanka</Text>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <Ionicons name="search" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <HeroSlider slides={heroSlides} />

        <View style={styles.ctaStrip}>
          <View style={styles.ctaLeft}>
            <Text style={styles.ctaTitle}>Ready to Explore Sri Lanka?</Text>
            <Text style={styles.ctaText}>Tailor-made tours from $25/day</Text>
          </View>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Book')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Popular Destinations"
            subtitle="Discover iconic places"
            onSeeAll={() => navigation.navigate('Destinations')}
          />
          <FlatList
            data={FEATURED_DESTINATIONS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalList}
            nestedScrollEnabled
            renderItem={({ item }) => (
              <DestinationCard
                item={item}
                style={styles.destinationCard}
                onPress={() => navigation.navigate('Destinations')}
              />
            )}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>500+</Text>
            <Text style={styles.statLabel}>Happy Clients</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>16</Text>
            <Text style={styles.statLabel}>Destinations</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>9</Text>
            <Text style={styles.statLabel}>Packages</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8★</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Featured Packages"
            subtitle="Curated travel experiences"
            onSeeAll={() => navigation.navigate('Packages')}
          />
          <View style={styles.packagesList}>
            {FEATURED_PACKAGES.map((item) => (
              <PackageCard
                key={item.id}
                item={item}
                onPress={() => navigation.navigate('Book')}
              />
            ))}
          </View>
        </View>

        <View style={styles.contactBanner}>
          <Ionicons name="chatbubble-ellipses-outline" size={32} color={colors.white} />
          <Text style={styles.contactTitle}>Need a Custom Tour?</Text>
          <Text style={styles.contactText}>
            Our travel experts are ready to craft your perfect Sri Lanka journey.
          </Text>
          <TouchableOpacity style={styles.contactBtn}>
            <Text style={styles.contactBtnText}>Enquire Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>
            <Text style={styles.footerTruly}>Truly </Text>
            <Text style={styles.footerSL}>Sri Lanka</Text>
          </Text>
          <Text style={styles.footerTagline}>
            Your Gateway to the Pearl of the Indian Ocean
          </Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-facebook" size={20} color={colors.bodyText} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-instagram" size={20} color={colors.bodyText} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-youtube" size={20} color={colors.bodyText} />
            </TouchableOpacity>
          </View>
          <Text style={styles.copyright}>© 2026 Truly Sri Lanka. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  safeHeader: {
    backgroundColor: colors.dark,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  helpline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helplineText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTruly: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  logoSL: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  searchBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  ctaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  ctaLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  ctaTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  ctaText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  ctaButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
  },
  ctaButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gunmetal,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.bodyText,
    marginTop: 2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: spacing.md,
  },
  destinationCard: {
    width: 200,
    marginRight: 12,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.dark,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  packagesList: {
    paddingHorizontal: spacing.md,
  },
  contactBanner: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  contactTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    marginTop: spacing.sm,
    marginBottom: 6,
  },
  contactText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: spacing.md,
  },
  contactBtn: {
    backgroundColor: colors.white,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
  },
  contactBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerBrand: {
    marginBottom: 6,
    fontSize: 22,
    fontWeight: '800',
  },
  footerTruly: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.gunmetal,
  },
  footerSL: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  footerTagline: {
    color: colors.bodyText,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  socialRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  socialBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 6,
  },
  copyright: {
    color: colors.bodyText,
    fontSize: 11,
  },
});
