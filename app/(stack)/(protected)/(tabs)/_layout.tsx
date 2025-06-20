import DropdownMenu from '@/components/DropdownMenu';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, Tabs } from 'expo-router';
import { Platform, TouchableOpacity, Image } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[colorScheme],
        tabBarInactiveTintColor: `${colors.foreground[colorScheme]}a0`,
        headerShown: true,
        headerBackgroundContainerStyle: {
          backgroundColor: `${colors.background[colorScheme]}f0`
        },
        headerTransparent: true,
        animation: "shift",
        headerTitleAlign: 'center',
        headerTitleStyle: { textTransform: "uppercase" },
        headerRight: () => <DropdownMenu />,
        headerLeft: () => {
          if (router.canGoBack()) return (
            <TouchableOpacity onPress={() => router.back()} className='mx-4 p-1.5 rounded-full bg-foreground-light/50 dark:bg-foreground-dark/60'>
              <MaterialIcons color={colors.background[colorScheme]} size={18} name='arrow-back' />
            </TouchableOpacity>
          )
          return (
            <TouchableOpacity onPress={() => router.push('/')} className='mx-4'>
              <Image
                source={require('@/assets/images/icon.png')}
                className="w-10 h-10"
              />
            </TouchableOpacity>
          )
        },
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
        name="news"
        options={{
          title: 'News',
          tabBarIcon: ({ color }) => <MaterialIcons color={color} size={24} name='home' />,
        }}
      />
      <Tabs.Screen
        name="feedback"
        options={{
          title: 'Feedback',
          tabBarIcon: ({ color }) => <FontAwesome6 color={color} size={18} name='box-open' />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <MaterialIcons color={color} size={22} name='event-note' />
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <MaterialIcons color={color} size={22} name='message' />,
        }}
      />
      <Tabs.Screen
        name="schooling"
        options={{
          title: 'Schooling',
          tabBarIcon: ({ color }) => <FontAwesome6 color={color} size={18} name='graduation-cap' />,
        }}
      />
    </Tabs>
  );
}
