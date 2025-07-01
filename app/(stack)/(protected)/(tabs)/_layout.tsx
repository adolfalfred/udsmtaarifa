import { useExpoNotificationState } from '@/lib/zustand/useNotificationStore';
import { useSessionStore } from '@/lib/zustand/useSessionStore';
import TabBarBackground from '@/components/ui/TabBarBackground';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useColorScheme } from '@/hooks/useColorScheme';
import ProfileButton from '@/components/ProfileButton';
import { useUserQuery } from '@/queries/useUserQuery';
import { HapticTab } from '@/components/HapticTab';
import BackButton from '@/components/BackButton';
import { colors } from '@/constants/Colors';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import api from '@/lib/api';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useSessionStore()
  const { data } = useUserQuery(user!.id)
  const { expoPushToken } = useExpoNotificationState()

  useEffect(() => {
    const updateUser = async () => {
      if (!user?.id) return
      const e = new FormData();
      e.append("notificationId", expoPushToken)
      try {
        const res = await api.patch(`/user/${user.id}`, e, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        console.log(res?.data)
      } catch (e) {
        console.log(e)
      }
    }
    if (data && data?.notificationIds && expoPushToken.length > 0 && !data.notificationIds.includes(expoPushToken)) updateUser()
  }, [data, expoPushToken, user?.id])

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[colorScheme],
        tabBarInactiveTintColor: `${colors.foreground[colorScheme]}a0`,
        headerShown: true,
        headerBackgroundContainerStyle: {
          backgroundColor: `${colors.background[colorScheme]}f0`
        },
        headerStyle: {
          backgroundColor: `${colors.background[colorScheme]}f0`,
          borderBottomWidth: 1,
          borderColor: `${colors.foreground[colorScheme]}10`
        },
        // headerTransparent: true,
        animation: "shift",
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitleStyle: { textTransform: "uppercase" },
        headerRight: (props) => <ProfileButton {...props} />,
        headerRightContainerStyle: { paddingHorizontal: 16, borderRadius: 9999, overflow: 'hidden' },
        headerLeft: (props) => <BackButton {...props} />,
        headerLeftContainerStyle: { paddingHorizontal: 16 },
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
        name="message"
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
