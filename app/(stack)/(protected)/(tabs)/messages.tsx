import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChatProps } from '@/types/chat';
import { useChatsQuery } from '@/queries/useChatsQuery';
import { ChatComponent, ChatSkeleton } from '@/components/ChatComponent';
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollAwareLegendList } from "@/components/ScrollAwareView";
import { useHideState } from '@/lib/zustand/useHideState';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Button from '@/components/ui/Button';

export default function MessagesScreen() {
    const [page, setPage] = useState(1)
    const [type, setType] = useState<ChatProps['type'] | ''>('')
    const [search, setSearch] = useState<string>('')
    const [refreshing, setRefreshing] = useState(false)
    const { refresh } = useLocalSearchParams();
    const { hide } = useHideState()
    const colorScheme = useColorScheme()

    const { data, isLoading, nextPage } = useChatsQuery(search, page, type)
    const queryClient = useQueryClient();

    const handleLoadMore = () => {
        if (nextPage) setPage(prev => prev + 1)
    }

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await queryClient.invalidateQueries({
            refetchType: "active",
            queryKey: ["chat"],
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
        <HeaderComponent search={search} setSearch={setSearch} type={type} setType={setType} />
    ), [search, type]);

    const renderChat = ({ item }: { item: ChatProps }) => <ChatComponent item={item} />
    return (
        <>
            <ScrollAwareLegendList
                data={data}
                renderItem={renderChat}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100, flex: 1, backgroundColor: colors.background[colorScheme] }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2}
                ListHeaderComponent={header}
                ListFooterComponent={nextPage ? <ChatSkeleton count={1} /> : null}
                recycleItems
                ListEmptyComponent={() => {
                    if (isLoading) return <ChatSkeleton count={10} />
                    return (
                        <View className="items-center justify-center h-96">
                            <Text className='text-foreground-light dark:text-foreground-dark'>
                                No chats available
                            </Text>
                        </View>
                    )
                }}
            />
            {!hide && (
                <View className="absolute bottom-28 right-5 z-50">
                    <Link href="/(stack)/(protected)/createchat" asChild>
                        <TouchableOpacity className="rounded-full bg-primary-light dark:bg-primary-dark p-4" style={{ elevation: 3 }}>
                            <MaterialIcons color="#ffffff" size={24} name="add" />
                        </TouchableOpacity>
                    </Link>
                </View>
            )}
        </>
    )
}

const HeaderComponent = ({ search, setSearch, type, setType }: { search: string; setSearch: (e: string) => void; type: ChatProps['type'] | ""; setType: React.Dispatch<React.SetStateAction<ChatProps['type'] | "">> }) => {
    const colorScheme = useColorScheme()
    return (
        <View className='flex-row px-4 py-1 items-end border-b border-foreground-light/10 dark:border-foreground-dark/10'>
            <TextInput
                className={`w-full shrink border border-foreground-light/20 dark:border-foreground-dark/20 px-3 py-3 rounded-[24px] text-black dark:text-white bg-foreground-light/10 dark:bg-foreground-dark/10`}
                placeholder="Search chat"
                placeholderTextColor="#999"
                value={search}
                onChangeText={setSearch}
                cursorColor={colors.primary[colorScheme]}
            />
            <Button
                onPress={() => setType((prev) => {
                    if (prev === '') return 'group'
                    if (prev === 'group') return 'chat'
                    return ''
                })}
                className={`w-16 h-11 shrink-0 bg-primary-light/80 dark:bg-primary-dark/80 rounded-full`}
                textClassName='capitalize text-foreground-dark dark:text-foreground-dark text-xs'
                px='px-2'
                py='py-2'
            >
                {type === '' ? "All" : `${type}s`}
            </Button>
        </View>
    )
}