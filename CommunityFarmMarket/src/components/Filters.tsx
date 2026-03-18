import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductCategory, DietaryTag } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function FilterChip({ label, selected, onPress, icon }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={selected ? colors.textLight : colors.textSecondary}
          style={styles.chipIcon}
        />
      )}
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface CategoryFilterProps {
  selected: ProductCategory | 'all';
  onSelect: (category: ProductCategory | 'all') => void;
}

const categories: { key: ProductCategory | 'all'; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'all', label: 'All', icon: 'grid-outline' },
  { key: 'vegetables', label: 'Vegetables', icon: 'leaf-outline' },
  { key: 'fruits', label: 'Fruits', icon: 'nutrition-outline' },
  { key: 'dairy', label: 'Dairy', icon: 'water-outline' },
  { key: 'meat', label: 'Meat', icon: 'restaurant-outline' },
  { key: 'eggs', label: 'Eggs', icon: 'egg-outline' },
  { key: 'seafood', label: 'Seafood', icon: 'fish-outline' },
  { key: 'herbs', label: 'Herbs', icon: 'flower-outline' },
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map(cat => (
        <FilterChip
          key={cat.key}
          label={cat.label}
          selected={selected === cat.key}
          onPress={() => onSelect(cat.key)}
          icon={cat.icon}
        />
      ))}
    </ScrollView>
  );
}

interface DietaryFilterProps {
  selected: DietaryTag[];
  onToggle: (tag: DietaryTag) => void;
}

const dietaryOptions: { key: DietaryTag; label: string }[] = [
  { key: 'organic', label: 'Organic' },
  { key: 'vegan', label: 'Vegan' },
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'halal', label: 'Halal' },
  { key: 'gluten-free', label: 'Gluten Free' },
  { key: 'dairy-free', label: 'Dairy Free' },
];

export function DietaryFilter({ selected, onToggle }: DietaryFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dietaryContainer}>
      {dietaryOptions.map(opt => (
        <FilterChip
          key={opt.key}
          label={opt.label}
          selected={selected.includes(opt.key)}
          onPress={() => onToggle(opt.key)}
        />
      ))}
    </ScrollView>
  );
}

interface DistrictFilterProps {
  selected: string;
  districts: string[];
  onSelect: (district: string) => void;
}

export function DistrictFilter({ selected, districts, onSelect }: DistrictFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.districtContainer}>
      <FilterChip
        label="All Districts"
        selected={selected === 'All'}
        onPress={() => onSelect('All')}
      />
      {districts.map(district => (
        <FilterChip
          key={district}
          label={district}
          selected={selected === district}
          onPress={() => onSelect(district)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipIcon: {
    marginRight: spacing.xs,
  },
  chipLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chipLabelSelected: {
    color: colors.textLight,
  },
  dietaryContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  districtContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
});
