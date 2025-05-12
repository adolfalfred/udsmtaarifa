import DropdownMenu from '@/components/DropdownMenu';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[colorScheme],
        headerShown: true,
        headerBackgroundContainerStyle: {
          backgroundColor: `${colors.background[colorScheme]}d0`
        },
        headerTransparent: true,
        animation: "shift",
        headerTitleAlign: "center",
        headerTitleStyle: { textTransform: "uppercase" },
        headerRight: () => <DropdownMenu />,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            opacity: 0.98,
          },
          default: {
            position: 'absolute',
            opacity: 0.99
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'News',
          tabBarIcon: ({ color }) => <MaterialIcons color={color} size={24} name='home' />,
        }}
      />
      <Tabs.Screen
        name="feedback"
        options={{
          title: 'Feedback',
          tabBarIcon: ({ color }) => <FontAwesome6 color={color} size={20} name='box-open' />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <MaterialIcons color={color} size={24} name='event-note' />
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <MaterialIcons color={color} size={24} name='message' />,
        }}
      />
      <Tabs.Screen
        name="schooling"
        options={{
          title: 'Schooling',
          tabBarIcon: ({ color }) => <FontAwesome6 color={color} size={20} name='graduation-cap' />,
        }}
      />
    </Tabs>
  );
}
