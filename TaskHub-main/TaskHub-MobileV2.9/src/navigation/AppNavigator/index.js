import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import WelcomeScreen from '../../screens/Welcome';
import LoginScreen from '../../screens/Login';
// import RegisterScreen from '../../screens/Register';
import DashboardScreen from '../../screens/Home';
import TasksScreen from '../../screens/Tasks';
import CalendarScreen from '../../screens/Calendar';
import StatsScreen from '../../screens/Stats';
import ProfileScreen from '../../screens/Profile';
import SidebarContent from '../../components/Sidebar';
import { authService } from '../../services/api';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../styles/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TAB_ICONS = {
  [ROUTES.DASHBOARD]: 'home',
  [ROUTES.TASKS]: 'check-square',
  [ROUTES.CALENDAR]: 'calendar',
  [ROUTES.STATS]: 'bar-chart-2',
};

function TabNavigator() {
  const { bottom } = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Feather name={TAB_ICONS[route.name]} size={22} color={color} />
        ),
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.secondaryText,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          height: 72 + bottom,
          paddingBottom: bottom,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: {
          paddingTop: 6,
          paddingBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen name={ROUTES.DASHBOARD} component={DashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name={ROUTES.TASKS} component={TasksScreen} options={{ title: 'Tasks' }} />
      <Tab.Screen name={ROUTES.CALENDAR} component={CalendarScreen} options={{ title: 'Calendar' }} />
      <Tab.Screen name={ROUTES.STATS} component={StatsScreen} options={{ title: 'Stats' }} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SidebarContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerStyle: { width: 280 },
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erro ao verificar sessao:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={user ? 'App' : ROUTES.WELCOME}
      >
        <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
        {/* <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} /> */}
        <Stack.Screen name="App" component={DrawerNavigator} />
        <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
