import { StatusBar } from 'expo-status-bar';
import { Platform, Text, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

const APP_FONT = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = [Text.defaultProps.style, { fontFamily: APP_FONT }];

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.style = [TextInput.defaultProps.style, { fontFamily: APP_FONT }];

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
