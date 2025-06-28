import { useExpoNotificationState } from '@/lib/zustand/useNotificationStore';
import { sendPushNotification } from '@/lib/expo-notifications';
import Button from '@/components/ui/Button';
import { View, Text } from 'react-native';

export default function NotificationsScreen() {
    const { expoPushToken, notification } = useExpoNotificationState()
    return (
        <View className='flex-1 items-center justify-around'>
            <Text className='text-foreground-light dark:text-foreground-dark'>Your Expo push token: {expoPushToken}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text className='text-foreground-light dark:text-foreground-dark'>Title: {notification && notification.request.content.title} </Text>
                <Text className='text-foreground-light dark:text-foreground-dark'>Body: {notification && notification.request.content.body}</Text>
                <Text className='text-foreground-light dark:text-foreground-dark'>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
            </View>
            <Button
                onPress={async () => await sendPushNotification(expoPushToken)}
                className="bg-primary-light dark:bg-primary-dark rounded-full"
                textClassName="text-foreground-dark text-2xl">
                Press to Send Notification
            </Button>
        </View>
    )
}