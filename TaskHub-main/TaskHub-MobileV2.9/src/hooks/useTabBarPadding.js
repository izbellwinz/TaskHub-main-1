import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useTabBarPadding() {
  const { bottom } = useSafeAreaInsets();
  return 72 + bottom;
}
