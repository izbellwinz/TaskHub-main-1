
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../../styles/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  style,
}) {

  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.button,
        isGhost ? styles.ghostButton : styles.primaryButton,
        style,
      ]}
    >
      <Text style={[
        styles.text,
        isGhost ? styles.ghostText : styles.primaryText,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButton: {
    backgroundColor: colors.accent,
  },

  ghostButton: {
    backgroundColor: 'transparent',
  },

  text: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
  },

  primaryText: {
    color: colors.textOnDark,
  },

  ghostText: {
    color: colors.accent,
  },
});
