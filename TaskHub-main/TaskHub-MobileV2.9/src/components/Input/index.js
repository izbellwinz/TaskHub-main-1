
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../../styles/theme';

export default function Input({
  label,
  error,
  style,
  ...props
}) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, style]}
        {...props}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  label: {
    marginBottom: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.sm,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.md,
    color: colors.textPrimary,
  },

  error: {
    marginTop: spacing.xs,
    color: colors.error,
    fontSize: typography.sm,
  },
});
