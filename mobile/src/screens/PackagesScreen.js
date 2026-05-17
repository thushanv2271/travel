import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FilterChips from '../components/FilterChips';
import PackageCard from '../components/PackageCard';
import { packages, packageFilters } from '../data/packages';
import { colors, spacing } from '../theme';

export default function PackagesScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const navigation = useNavigation();

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return packages;
    return packages.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Tour Packages</Text>
          <Text style={styles.headerSub}>{filtered.length} packages available</Text>
        </View>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <FilterChips
            filters={packageFilters}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="briefcase-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No packages found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PackageCard
            item={item}
            onPress={() => navigation.navigate('Book')}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lightBg },
  header: { backgroundColor: colors.dark },
  headerContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitle: { color: colors.white, fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyBox: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: colors.bodyText, fontSize: 15 },
});
