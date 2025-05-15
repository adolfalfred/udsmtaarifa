import { LegendList } from "@legendapp/list"
import { useCallback, useEffect, useState } from 'react';
import type { PostProps } from '@/types/post';
import { usePostsQuery } from '@/queries/usePostsQuery';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostComponent, PostSkeleton } from '@/components/PostComponent';
import { TouchableOpacity, View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

export default function HomeScreen() {
  const [page, setPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const { refresh } = useLocalSearchParams();

  const { data, isLoading, nextPage, } = usePostsQuery('', page, 'class')
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

  const renderPost = ({ item }: { item: PostProps }) => <PostComponent item={item} schooling />
  return (
    <SafeAreaView className='relative flex-1 bg-background-light dark:bg-background-dark'>
      <LegendList
        data={data}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
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
              <Text className='text-foreground-light dark:text-foreground-dark'>No news available</Text>
            </View>
          )
        }}
      />
      <View className="absolute bottom-20 right-5 z-50">
        <Link href="/(stack)/(protected)/post?type=class" asChild>
          <TouchableOpacity className="rounded-full bg-primary-light dark:bg-primary-dark p-4" style={{ elevation: 3 }}>
            <MaterialIcons color="#ffffff" size={24} name="add" />
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}