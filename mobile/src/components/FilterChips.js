import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

export default function FilterChips({ filters, activeId, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((f) => {
        const active = f.id === activeId;
        return (
          <TouchableOpacity
            key={f.id}
            style={[styles.chip, active ? styles.activeChip : styles.inactiveChip]}
            onPress={() => onSelect(f.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, active ? styles.activeChipText : styles.inactiveChipText]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  inactiveChip: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeChipText: {
    color: colors.white,
  },
  inactiveChipText: {
    color: colors.bodyText,
  },
});
