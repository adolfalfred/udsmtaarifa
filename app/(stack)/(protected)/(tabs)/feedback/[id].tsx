import { FeedbackComponent, FeedbackSkeleton } from "@/components/FeedbackComponent";
import { useFeedbackQuery } from "@/queries/useFeedbackQuery";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data } = useFeedbackQuery(id);

    return (
        <SafeAreaView className='flex-1 pt-20 bg-background-light dark:bg-background-dark' edges={['top']}>
            <ScrollView className="flex-1">
                {data ? <FeedbackComponent item={data} page /> : <FeedbackSkeleton count={1} />}
            </ScrollView>
        </SafeAreaView>
    )
}