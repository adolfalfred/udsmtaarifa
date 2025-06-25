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
            <Pressable className='overflow-hidden h-36 w-full px-2 my-1.5'>
                <View
                    className='flex-col rounded-2xl h-full w-full border p-3 bg-foreground-light/5 dark:bg-foreground-dark/5'
                    style={{ borderColor: `${colors.foreground[colorScheme]}20` }}
                >
                    <View className='flex-grow'>
                        {item?.id
                            ? <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                className='text-lg text-foreground-light dark:text-foreground-dark py-1'
                            >
                                FeedBackId: {item.id.slice(0, 8)}
                            </Text>
                            : null}
                        {item?.title
                            ? <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                className='text-lg text-foreground-light dark:text-foreground-dark py-1'
                            >
                                {item.title}
                            </Text>
                            : null}
                        {item?.description
                            ? <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                className='text-foreground-light/60 dark:text-foreground-dark/80 truncate text-xs'
                            >
                                {item.description}
                            </Text>
                            : null}
                    </View>
                    <View className='flex-row items-center justify-between gap-3'>
                        {item?.typeId
                            ? <Text className='text-sm text-success-light dark:text-success-dark py-1'>{item.typeId}</Text>
                            : null}
                        {item?.status
                            ? <Text className='text-sm py-1 capitalize font-semibold'
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