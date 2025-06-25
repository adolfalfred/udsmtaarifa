import { View, Text, Pressable } from 'react-native'
import type { FeedbackProps } from '@/types/feedback';
import { Link } from 'expo-router';
import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { convertISOToReadable } from '@/lib/utils';

export function FeedbackComponent({ item, page = false }: { item: FeedbackProps, page?: boolean }) {
    const colorScheme = useColorScheme()
    if (!page)
        return (
            <Link href={`/(stack)/(protected)/(tabs)/feedback/${item.id}`} asChild>
                <Pressable className='overflow-hidden h-36 w-full px-3 my-1.5'>
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
    return (
        <View className='w-full py-4'>
            <View className='px-4'>
                {item?.id
                    ? <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>FeedBackId: {item.id.slice(0, 8)}</Text>
                    : null}
                {item?.title
                    ? <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text>
                    : null}
                {item?.description
                    ? <Text className='text-foreground-light/60 dark:text-foreground-dark/80'>{item.description}</Text>
                    : null}
                {item?.reviewDate ?
                    <View className='flex-row gap-2 mt-2'>
                        <FontAwesome size={14} name="calendar-times-o" className='w-4 shrink-0' color={colors.secondary[colorScheme]} />
                        <Text
                            className='text-foreground-light/60 dark:text-foreground-dark/80'
                        >
                            {convertISOToReadable(item.reviewDate)}
                        </Text>
                    </View>
                    : null}
                <View className='flex-row items-center justify-between gap-3 mt-2'>
                    <View className='flex-col items-center'>
                        <Text className='w-fit text-foreground-light/60 dark:text-foreground-dark/60'>Type</Text>
                        {item?.typeId
                            ? <Text className='text-success-light dark:text-success-dark py-1'>{item.typeId}</Text>
                            : null}
                    </View>
                    <View className='flex-col items-center'>
                        <Text className='w-fit text-foreground-light/60 dark:text-foreground-dark/60'>Status</Text>
                        {item?.status
                            ? <Text className='py-1 capitalize font-semibold'
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
        </View>
    )
}

export const FeedbackSkeleton = ({ count, page }: { count: number, page?: true }) => {
    if (page) return (
        <View className='w-full py-1.5'>
            <View className='mx-4 mt-4 gap-1'>
                <View className='h-6 w-48 rounded mb-0.5 bg-foreground-light/5 dark:bg-foreground-dark/5' />
                <View className='h-6 w-80 rounded mb-0.5 bg-foreground-light/5 dark:bg-foreground-dark/5' />
                {Array.from({ length: 9 }).map((_, i) => <View key={i} className='h-5 w-[500px] rounded-md bg-foreground-light/5 dark:bg-foreground-dark/5' />)}
                <View className='h-5 w-80 rounded-md bg-foreground-light/5 dark:bg-foreground-dark/5' />
                <View className='flex-row justify-between'>
                    <View className='h-8 w-24 rounded-md bg-foreground-light/5 dark:bg-foreground-dark/5' />
                    <View className='h-8 w-24 rounded-md bg-foreground-light/5 dark:bg-foreground-dark/5' />
                </View>
            </View>
        </View>
    )
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <View
                    key={i}
                    className='w-full px-3 py-1.5'
                >
                    <View className='w-full h-36 rounded-2xl bg-foreground-light/5 dark:bg-foreground-dark/5' />
                </View>
            ))}
        </>
    );
}