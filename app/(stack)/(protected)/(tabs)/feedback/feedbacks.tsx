import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FeedbackProps } from '@/types/feedback';
import { useFeedbacksQuery } from '@/queries/useFeedbackQuery';
import { FeedbackComponent, FeedbackSkeleton } from '@/components/FeedbackComponent';
import { TouchableOpacity, View, Text, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollAwareLegendList } from "@/components/ScrollAwareView";
import { useHideState } from '@/lib/zustand/useHideState';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFeedbacktypesQuery } from '@/queries/useFeedbackTypeQuery';
import { colors } from '@/constants/Colors';

export default function Feedback() {
    const [page, setPage] = useState(1)
    const [type, setType] = useState<string>('')
    const [refreshing, setRefreshing] = useState(false)
    const { refresh } = useLocalSearchParams();
    const { hide } = useHideState()

    const { data, isLoading, nextPage } = useFeedbacksQuery('', page, type, "")
    const queryClient = useQueryClient();

    const handleLoadMore = () => {
        if (nextPage) setPage(prev => prev + 1)
    }

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await queryClient.invalidateQueries({
            refetchType: "active",
            queryKey: ["feedback"],
        });
        setPage(1);
        setRefreshing(false);
    }, [queryClient])

    useEffect(() => {
        if (refresh === 'true') handleRefresh()
    }, [handleRefresh, refresh]);

    useEffect(() => {
        setPage(1);
    }, [type]);

    const header = useMemo(() => (
        <HeaderComponent type={type} setType={setType} />
    ), [type]);

    const renderFeedback = ({ item }: { item: FeedbackProps }) => <FeedbackComponent item={item} />
    return (
        <>
            <ScrollAwareLegendList
                data={data}
                renderItem={renderFeedback}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2}
                ListHeaderComponent={header}
                ListFooterComponent={nextPage ? <FeedbackSkeleton count={1} /> : null}
                recycleItems
                ListEmptyComponent={() => {
                    if (isLoading) return <FeedbackSkeleton count={10} />
                    return (
                        <View className="items-center justify-center h-96">
                            <Text className='text-foreground-light dark:text-foreground-dark'>
                                {`No ${type} feedback available`}
                            </Text>
                        </View>
                    )
                }}
            />
            {!hide && (
                <View className="absolute bottom-28 right-5 z-50">
                    <Link href="/(stack)/(protected)/feedbackpost" asChild>
                        <TouchableOpacity className="rounded-full bg-primary-light dark:bg-primary-dark p-4" style={{ elevation: 3 }}>
                            <MaterialIcons color="#ffffff" size={24} name="add" />
                        </TouchableOpacity>
                    </Link>
                </View>
            )}
        </>
    )
}

const HeaderComponent = ({ type, setType }: { type: string; setType: (e: string) => void; }) => {
    const colorScheme = useColorScheme()
    const { data, isLoading } = useFeedbacktypesQuery('', 1)
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            stickyHeaderIndices={[0]}
            className="py-2"
        >
            <TouchableOpacity className="px-5 py-2"
                style={{
                    backgroundColor: type === '' ? `${colors.primary[colorScheme]}80` : `${colors.foreground[colorScheme]}10`,
                    borderRadius: 9999,
                    marginRight: 4,
                    marginLeft: 14
                }}
                onPress={() => setType('')}
            >
                <Text className="text-foreground-light dark:text-foreground-dark">
                    All
                </Text>
            </TouchableOpacity>
            {data.length > 0 ? data.map((item) => (
                <TouchableOpacity key={item.name} className="px-5 py-2"
                    style={{
                        backgroundColor: type && type === item.name ? `${colors.primary[colorScheme]}80` : `${colors.foreground[colorScheme]}10`,
                        borderRadius: 9999,
                        marginRight: 4
                    }}
                    onPress={() => setType(item.name)}
                >
                    <Text className="text-foreground-light dark:text-foreground-dark">
                        {item.name}
                    </Text>
                </TouchableOpacity>
            )) : (
                <>
                    {isLoading ? Array.from({ length: 9 }).map((_, i) => (
                        <TouchableOpacity key={i} className="px-5 py-2 w-20"
                            style={{
                                backgroundColor: `${colors.foreground[colorScheme]}10`,
                                borderRadius: 9999,
                                marginRight: 4
                            }} />
                    )) : (
                        <></>
                    )}
                </>
            )}
        </ScrollView>
    )
}