import { LegendList } from "@legendapp/list"
import { useCallback, useEffect, useState } from 'react';
import type { FeedbackProps } from '@/types/feedback';
import { useFeedbacksQuery } from '@/queries/useFeedbackQuery';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedbackComponent, FeedbackSkeleton } from '@/components/FeedbackComponent';
import { TouchableOpacity, View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

export default function Feedback() {
    const [page, setPage] = useState(1)
    const [refreshing, setRefreshing] = useState(false)
    const { refresh } = useLocalSearchParams();

    const { data, isLoading, nextPage, } = useFeedbacksQuery('', page, "")
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
    const renderFeedback = ({ item }: { item: FeedbackProps }) => <FeedbackComponent item={item} />
    return (
        <SafeAreaView className='relative flex-1 bg-background-light dark:bg-background-dark pt-20'>
            <LegendList
                data={data}
                renderItem={renderFeedback}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 0 }}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={nextPage ? <FeedbackSkeleton count={1} /> : null}
                recycleItems
                ListEmptyComponent={() => {
                    if (isLoading)
                        return (
                            <View className="items-center justify-center">
                                <FeedbackSkeleton count={1} />
                            </View>
                        )
                    return (
                        <View className="items-center justify-center h-96">
                            <Text className='text-foreground-light dark:text-foreground-dark'>No feedback available</Text>
                        </View>
                    )
                }}
            // ListHeaderComponent={() => (
            //     <ScrollView horizontal className="py-2 px-6 pt-20">
            //         <TouchableOpacity className="px-5 py-2 rounded-full mr-1"
            //             style={{ backgroundColor: category === '' ? `${colors.primary[colorScheme]}80` : `${colors.foreground[colorScheme]}20` }}
            //             onPress={() => setCategory('')}
            //         >
            //             <Text className="text-foreground-light dark:text-foreground-dark">
            //                 All
            //             </Text>
            //         </TouchableOpacity>
            //         {categories.map((item) => (
            //             <TouchableOpacity key={item.id} className="px-5 py-2 rounded-full mr-1"
            //                 style={{ backgroundColor: category === item.id ? `${colors.primary[colorScheme]}80` : `${colors.foreground[colorScheme]}20` }}
            //                 onPress={() => setCategory(item.id)}
            //             >
            //                 <Text className="text-foreground-light dark:text-foreground-dark">
            //                     {item.name}
            //                 </Text>
            //             </TouchableOpacity>
            //         ))}
            //     </ScrollView>
            // )}
            />
            <View className="absolute bottom-28 right-5 z-50">
                <Link href="/(stack)/(protected)/feedbackpost" asChild>
                    <TouchableOpacity className="rounded-full bg-primary-light dark:bg-primary-dark p-4" style={{ elevation: 3 }}>
                        <MaterialIcons color="#ffffff" size={24} name="add" />
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    )
}