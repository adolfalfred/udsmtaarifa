import { LegendList } from "@legendapp/list"
import { useState } from 'react';
import type { PostProps } from '@/types/post';
import { usePostsQuery } from '@/queries/usePostsQuery';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostComponent, PostSkeleton } from '@/components/PostComponent';

export default function HomeScreen() {
  const [page, setPage] = useState(1)

  const { data, nextPage } = usePostsQuery('', page)

  const handleLoadMore = () => {
    if (nextPage) setPage(prev => prev + 1)
  }

  const renderPost = ({ item }: { item: PostProps }) => <PostComponent item={item} />

  return (
    <SafeAreaView className='flex-1 pt-20 bg-background-light dark:bg-background-dark'>
      <LegendList
        data={data}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        // estimatedItemSize={400}
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={handleRefresh}
        //     tintColor={colors.white}
        //     colors={[colors.white]}
        //   />
        // }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={nextPage ? <PostSkeleton count={1} /> : null}
        recycleItems
      />
    </SafeAreaView>
  );
}