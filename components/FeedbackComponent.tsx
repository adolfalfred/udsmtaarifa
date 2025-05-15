import { View, Text, Pressable } from 'react-native'
import type { FeedbackProps } from '@/types/feedback';
import { Link } from 'expo-router';
import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function FeedbackComponent({ item, page = false }: { item: FeedbackProps, page?: boolean }) {
    const colorScheme = useColorScheme()
    // if (!page)
    return (
        <Link href={`/(stack)/(protected)/(tabs)/feedback/${item.id}`} asChild>
            <Pressable className='w-full px-6 py-4'>
                <View className='flex flex-row gap-2 border-none justify-between bg-content2-light dark:bg-content1-dark rounded-xl overflow-hidden'
                    style={{ elevation: 0.5 }}
                >
                    <View className='p-3'>
                        {item?.id
                            ? <Text className='text-xl text-foreground-light dark:text-foreground-dark py-1 font-semibold'>FeedBackId: {item.id.slice(0, 8)}</Text>
                            : null}
                        {item?.title
                            ? <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text>
                            : null}
                        {item?.description
                            ? <Text className='text-foreground-light/60 dark:text-foreground-dark/80'>{item.description}</Text>
                            : null}
                        <View className='flex-row items-center justify-between gap-3'>
                            {item?.type
                                ? <Text className='text-xl text-foreground-light dark:text-foreground-dark py-1'>{item.type.name}</Text>
                                : null}
                            {item?.status
                                ? <Text className='text-lg py-1 capitalize font-semibold'
                                    style={{
                                        color: item.status === 'submitted'
                                            ? colors.primary[colorScheme]
                                            : item.status === 'pending'
                                                ? colors.warning[colorScheme]
                                                : colors.success[colorScheme]
                                    }}
                                >
                                    {item.status}
                                </Text>
                                : null}

                        </View>
                    </View>
                </View>
            </Pressable>
        </Link>
    )
}

export const FeedbackSkeleton = ({ count }: { count: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <View
                    key={i}
                    className='w-full px-6 py-4'
                >
                    <View className='w-full h-96 rounded-2xl bg-foreground-light/5 dark:bg-foreground-dark/5' />
                </View>
            ))}
        </>
    );
}