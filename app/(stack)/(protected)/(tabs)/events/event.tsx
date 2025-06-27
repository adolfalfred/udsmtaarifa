import { useCallback, useEffect, useState } from 'react';
import type { EventProps } from '@/types/event';
import { useEventsQuery } from '@/queries/useEventsQuery';
import { EventComponent, EventSkeleton } from '@/components/EventComponent';
import { TouchableOpacity, View, Text, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useCategoryQuery } from "@/queries/useCategoriesQuery";
import { useColorScheme } from "@/hooks/useColorScheme";
import { colors } from "@/constants/Colors";
import { ScrollAwareLegendList } from "@/components/ScrollAwareView";
import { useHideState } from '@/lib/zustand/useHideState';
import type { CategoryProps } from '@/types/category';

export default function HomeScreen() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<null | CategoryProps>(null)
  const [refreshing, setRefreshing] = useState(false)
  const { refresh } = useLocalSearchParams();
  const { hide } = useHideState()

  const { data, isLoading, nextPage } = useEventsQuery('', page, category?.id || '')
  const queryClient = useQueryClient();

  const handleLoadMore = () => {
    if (nextPage) setPage(prev => prev + 1)
  }

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      refetchType: "active",
      queryKey: ["event"],
    });
    setPage(1);
    setRefreshing(false);
  }, [queryClient])

  useEffect(() => {
    if (refresh === 'true') handleRefresh()
  }, [handleRefresh, refresh]);

  useEffect(() => {
    setPage(1);
  }, [category]);

  const renderEvent = ({ item }: { item: EventProps }) => <EventComponent item={item} />
  return (
    <>
      <ScrollAwareLegendList
        data={data}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListHeaderComponent={() => <HeaderComponent category={category} setCategory={setCategory} />}
        ListFooterComponent={nextPage ? <EventSkeleton count={1} /> : null}
        recycleItems
        ListEmptyComponent={() => {
          if (isLoading) return <EventSkeleton count={10} />
          return (
            <View className="items-center justify-center h-96">
              <Text className='text-foreground-light dark:text-foreground-dark capitalize'>
                {category ? `No ${category.name} events available right now` : 'No events available right now'}
              </Text>
            </View>
          )
        }}
      />
      {!hide && (
        <View className="absolute bottom-28 right-5 z-50">
          <Link href="/(stack)/(protected)/eventpost" asChild>
            <TouchableOpacity className="rounded-full bg-primary-light dark:bg-primary-dark p-4" style={{ elevation: 3 }}>
              <MaterialIcons color="#ffffff" size={24} name="add" />
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </>
  );
}

const HeaderComponent = ({ category, setCategory }: { category: null | CategoryProps; setCategory: (e: null | CategoryProps) => void; }) => {
  const colorScheme = useColorScheme()
  const { data, isLoading } = useCategoryQuery('', 1)
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      stickyHeaderIndices={[0]}
      className="py-2"
    >
      <TouchableOpacity className="px-5 py-2"
        style={{
          backgroundColor: category === null ? `${colors.primary[colorScheme]}80` : `${colors.foreground[colorScheme]}10`,
          borderRadius: 9999,
          marginRight: 4,
          marginLeft: 14
        }}
        onPress={() => setCategory(null)}
      >
        <Text className="text-foreground-light dark:text-foreground-dark">
          All
        </Text>
      </TouchableOpacity>
      {data.length > 0 ? data.map((item) => (
        <TouchableOpacity key={item.id} className="px-5 py-2"
          style={{
            backgroundColor: category && category.id === item.id ? `${colors.primary[colorScheme]}80` : `${colors.foreground[colorScheme]}10`,
            borderRadius: 9999,
            marginRight: 4
          }}
          onPress={() => setCategory(item)}
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