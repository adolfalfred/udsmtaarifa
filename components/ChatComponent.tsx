import { useSessionStore } from '@/lib/zustand/useSessionStore';
import { View, Text, Pressable } from 'react-native'
import type { ChatProps } from '@/types/chat';
import { Image } from 'expo-image';
import { Link } from 'expo-router';

export function ChatComponent({ item }: { item: ChatProps }) {
    const { user } = useSessionStore()

    const member = item.type === 'chat' ? item.members.find((item) => item.user.id !== user?.id) : null

    return (
        <Link href={`/(stack)/(protected)/${item.id}`} asChild>
            <Pressable className='overflow-hidden h-16 w-full my-3'>
                <View className='flex-row gap-2 rounded-2xl h-full w-full px-4'>
                    <View className='h-16 w-16 shrink-0 rounded-full overflow-hidden bg-foreground-light/20 dark:bg-foreground-dark/20'>
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
                        ) : null}
                    </View>
                    <View className='flex-col justify-center gap-1 shrink'>
                        <Text
                            numberOfLines={3}
                            ellipsizeMode="tail"
                            className='text-foreground-light dark:text-foreground-dark text-lg font-semibold'
                        >
                            {item.type === 'chat' ? member ? member.user.name : "New Chat" : item.name}
                        </Text>
                        {item.messages.length > 0
                            ? <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                className='text-foreground-light/60 dark:text-foreground-dark/60'
                            >
                                {item.messages[0].content}
                            </Text>
                            : <Text
                                className='italic text-foreground-light/60 dark:text-foreground-dark/60'
                            >
                                No messages yet</Text>
                        }
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
                <View key={i} className='overflow-hidden h-16 w-full my-3'>
                    <View className='flex-row gap-2 rounded-2xl h-full w-full px-4'>
                        <View className='h-16 w-16 shrink-0 rounded-full overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5'>
                        </View>
                        <View className='flex-col justify-center gap-2 shrink'>
                            <View className='bg-foreground-light/5 dark:bg-foreground-dark/5 h-4 w-28 rounded' />
                            <View className='bg-foreground-light/5 dark:bg-foreground-dark/5 h-3 w-60 rounded' />
                        </View>
                    </View>
                </View>
            ))}
        </>
    );
}