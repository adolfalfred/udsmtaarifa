import { PostComponent, PostSkeleton } from "@/components/PostComponent";
import { ScrollAwareView } from "@/components/ScrollAwareView";
import { usePostQuery } from "@/queries/usePostsQuery";
import { useLocalSearchParams } from "expo-router";

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data } = usePostQuery(id);

    return (
        <ScrollAwareView className="flex-1 pt-24">
            {data ? <PostComponent item={data} page schooling /> : <PostSkeleton count={1} />}
        </ScrollAwareView>
    )
}