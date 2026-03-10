import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Search fresh produce...', onFilterPress }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {onFilterPress && (
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons name="options-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.sm,
    paddingVertical: spacing.xs,
  },
  filterButton: {
    marginLeft: spacing.sm,
    backgroundColor: colors.surface,
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
