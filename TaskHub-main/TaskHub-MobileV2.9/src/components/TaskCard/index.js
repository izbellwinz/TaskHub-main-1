import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../styles/theme';

const PRIORITY_CONFIG = {
  high: { bg: '#FFF7F7', bar: '#F87171', text: COLORS.highText, tint: 'rgba(248, 113, 113, 0.11)' },
  medium: { bg: COLORS.white, bar: '#2F5FD8', text: '#0A1A33', tint: 'rgba(47, 95, 216, 0.10)' },
  low: { bg: '#F7FEFA', bar: '#4ADE80', text: COLORS.lowText, tint: 'rgba(74, 222, 128, 0.12)' },
};

const PRIORITY_LABELS = { high: 'Alta', medium: 'Media', low: 'Baixa' };

export default function TaskCard({ emoji = '•', iconName, title, subtitle, priority = 'medium', color }) {
  const config = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;
  const barColor = color || config.bar;
  const taskIcon = iconName || 'calendar';

  return (
    <View style={[styles.card, { backgroundColor: config.bg }]}>
      <View style={[styles.bar, { backgroundColor: barColor }]} />
      <View style={[styles.decorIcon, { backgroundColor: config.tint }]}>
        <Feather name="calendar" size={42} color={barColor} />
      </View>
      {taskIcon ? (
        <View style={[styles.iconWrap, { backgroundColor: config.tint }]}>
          <Feather name={taskIcon} size={18} color={barColor} />
        </View>
      ) : (
        <Text style={styles.emoji}>{emoji}</Text>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: config.tint }]}>
        <Text style={[styles.badgeText, { color: config.text }]}>{PRIORITY_LABELS[priority]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(10, 26, 51, 0.08)',
    minHeight: 70,
    position: 'relative',
  },
  bar: {
    width: 4,
    alignSelf: 'stretch',
    zIndex: 2,
  },
  emoji: {
    fontSize: 24,
    marginHorizontal: SPACING.sm,
    zIndex: 2,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(10, 26, 51, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.sm,
    zIndex: 2,
  },
  content: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.sm,
    minWidth: 0,
    zIndex: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    lineHeight: 18,
  },
  badge: {
    marginRight: SPACING.md,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(10, 26, 51, 0.10)',
    zIndex: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  decorIcon: {
    position: 'absolute',
    right: -10,
    top: -8,
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.16,
    transform: [{ rotate: '-8deg' }],
  },
});
