import { PostComponent, PostSkeleton } from '@/components/PostComponent';
import { useCallback, useEffect, useState } from 'react';
import { usePostsQuery } from '@/queries/usePostsQuery';
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import type { PostProps } from '@/types/post';
import { LegendList } from '@legendapp/list';
import { View, Text } from "react-native";

export default function UserPosts() {
    const [page, setPage] = useState(1)
    const [refreshing, setRefreshing] = useState(false)
    const { refresh } = useLocalSearchParams();

    const { data, isLoading, nextPage } = usePostsQuery('', page, '', true)
    const queryClient = useQueryClient();

    const handleLoadMore = () => {
        if (nextPage) setPage(prev => prev + 1)
    }

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await queryClient.invalidateQueries({
            refetchType: "active",
            queryKey: ["post"],
        });
        setPage(1);
        setRefreshing(false);
    }, [queryClient])

    useEffect(() => {
        if (refresh === 'true') handleRefresh()
    }, [handleRefresh, refresh]);

    const renderPost = ({ item }: { item: PostProps }) => <PostComponent item={item} />
    return (
        <>
            <LegendList
                showsVerticalScrollIndicator={false}
                data={data}
                renderItem={renderPost}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={nextPage ? <PostSkeleton count={1} /> : null}
                recycleItems
                ListEmptyComponent={() => {
                    if (isLoading) return <PostSkeleton count={10} />
                    return (
                        <View className="items-center justify-center h-96">
                            <Text className='text-foreground-light dark:text-foreground-dark'>No posts available</Text>
                        </View>
                    )
                }}
            />
        </>
    );
}