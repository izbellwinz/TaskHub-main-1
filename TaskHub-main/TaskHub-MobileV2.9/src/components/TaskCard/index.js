import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../styles/theme';

const PRIORITY_CONFIG = {
  high:   { bg: COLORS.high,    bar: '#F87171', text: COLORS.highText },
  medium: { bg: COLORS.medium,  bar: '#60A5FA', text: COLORS.mediumText },
  low:    { bg: COLORS.low,     bar: '#4ADE80', text: COLORS.lowText },
};

const PRIORITY_LABELS = { high: 'Alta', medium: 'Média', low: 'Baixa' };

export default function TaskCard({ emoji = '📌', title, subtitle, priority = 'medium', color }) {
  const config = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;
  const barColor = color || config.bar;

  return (
    <View style={[styles.card, { backgroundColor: config.bg }]}>
      <View style={[styles.bar, { backgroundColor: barColor }]} />
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: barColor }]}>
        <Text style={styles.badgeText}>{PRIORITY_LABELS[priority]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bar: {
    width: 4,
    alignSelf: 'stretch',
  },
  emoji: {
    fontSize: 24,
    marginHorizontal: SPACING.sm,
  },
  content: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },
  badge: {
    marginRight: SPACING.md,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
});
