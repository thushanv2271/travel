import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  SafeAreaView, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FilterChips from '../components/FilterChips';
import DestinationCard from '../components/DestinationCard';
import { destinations, regionFilters } from '../data/destinations';
import { colors, spacing } from '../theme';

export default function DestinationsScreen() {
  const [activeRegion, setActiveRegion] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = destinations;
    if (activeRegion !== 'all') {
      list = list.filter((d) => d.region === activeRegion);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) => d.name.toLowerCase().includes(q) || d.subtitle.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeRegion, search]);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Destinations</Text>
          <Text style={styles.headerSub}>Discover Sri Lanka's best places</Text>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={colors.bodyText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations..."
            placeholderTextColor={colors.bodyText}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <FilterChips
            filters={regionFilters}
            activeId={activeRegion}
            onSelect={setActiveRegion}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="map-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No destinations found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <DestinationCard item={item} style={styles.card} />
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
    paddingBottom: spacing.sm,
  },
  headerTitle: { color: colors.white, fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.gunmetal,
  },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  columnWrapper: { gap: 12, marginBottom: 12 },
  card: { flex: 1 },
  emptyBox: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: colors.bodyText, fontSize: 15 },
});
