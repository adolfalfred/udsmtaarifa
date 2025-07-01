import { useSessionStore } from '@/lib/zustand/useSessionStore';
import { View, Text, Pressable } from 'react-native'
import type { ChatProps } from '@/types/chat';
import { Link } from 'expo-router';
import { Image } from 'expo-image';

export function ChatComponent({ item }: { item: ChatProps }) {
    const { user } = useSessionStore()

    const member = item.type === 'chat' ? item.members.find((item) => item.user.id !== user?.id) : null

    return (
        <Link href={`/(stack)/(protected)/(tabs)/message/${item.id}`} asChild>
            <Pressable className='overflow-hidden h-20 w-full px-3 my-1.5'>
                <View className='flex-row gap-2 rounded-2xl h-full w-full p-3 bg-foreground-light/5 dark:bg-foreground-dark/5'>
                    <View className='rounded-full overflow-hidden h-full aspect-auto'>
                        {item.type === 'chat' && member ? (
                            <Image
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    borderRadius: '100%'
                                }}
                                source={member.user.image}
                                cachePolicy='none'
                                contentFit="cover"
                            />
                        ) : (
                            <View className='bg-foreground-light/10 dark:bg-foreground-dark/10 w-full h-full' />
                        )}
                    </View>
                    <View className='flex-col gap-1 flex-grow'>
                        <Text className='text-foreground-light dark:text-foreground-dark font-semibold'>{item.type === 'chat' ? member ? member.user.name : "New Chat" : item.name}</Text>
                        {item.messages.length > 0 ? <Text numberOfLines={1} ellipsizeMode="tail" className='text-foreground-light/60 dark:text-foreground-dark/60'>{item.messages[0].content}</Text> : null}
                    </View>
                </View>
            </Pressable>
        </Link>
    )
}

export const ChatSkeleton = ({ count }: { count: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <View
                    key={i}
                    className='w-full px-3 py-1.5'
                >
                    <View className='w-full h-20 rounded-2xl bg-foreground-light/5 dark:bg-foreground-dark/5' />
                </View>
            ))}
        </>
    );
}