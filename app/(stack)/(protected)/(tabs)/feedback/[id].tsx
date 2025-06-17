import { FeedbackComponent, FeedbackSkeleton } from "@/components/FeedbackComponent";
import { ScrollAwareView } from "@/components/ScrollAwareView";
import { useFeedbackQuery } from "@/queries/useFeedbackQuery";
import { useLocalSearchParams } from "expo-router";

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data } = useFeedbackQuery(id);

    return (
        <ScrollAwareView className="flex-1 pt-24">
            {data ? <FeedbackComponent item={data} page /> : <FeedbackSkeleton count={1} />}
        </ScrollAwareView>
    )
}