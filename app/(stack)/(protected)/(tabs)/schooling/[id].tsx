import { PostComponent, PostSkeleton } from "@/components/PostComponent";
import { usePostQuery } from "@/queries/usePostsQuery";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data } = usePostQuery(id);

    return (
        <SafeAreaView className='flex-1 pt-20 bg-background-light dark:bg-background-dark' edges={['top']}>
            <ScrollView className="flex-1">
                {data ? <PostComponent item={data} page schooling /> : <PostSkeleton count={1} />}
            </ScrollView>
        </SafeAreaView>
    )
}