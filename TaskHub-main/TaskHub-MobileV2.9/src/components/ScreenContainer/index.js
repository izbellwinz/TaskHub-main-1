
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../../styles/theme';

export default function ScreenContainer({
  children,
  scroll = false,
  background = colors.background,
}) {

  if (scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },
});
