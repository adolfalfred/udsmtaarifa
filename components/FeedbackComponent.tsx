import { View, Text, Pressable } from 'react-native'
import type { FeedbackProps } from '@/types/feedback';
import { Link } from 'expo-router';

export function FeedbackComponent({ item, page = false }: { item: FeedbackProps, page?: boolean }) {
    if (!page)
        return (
            <Link href={`/(stack)/(protected)/(tabs)/feedback/${item.id}`} asChild>
                <Pressable className='w-full px-6 py-4'>
                    <View className='flex flex-row gap-2 justify-between border border-foreground-light/20 dark:border-foreground-dark/20 rounded-xl overflow-hidden'>
                        <View className='p-3'>
                            {item?.title
                                ? <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text>
                                : null}
                            {item?.description
                                ? <Text className='text-foreground-light/60 dark:text-foreground-dark/80'>{item.content}</Text>
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