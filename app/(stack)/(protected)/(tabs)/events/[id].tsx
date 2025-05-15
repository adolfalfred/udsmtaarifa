import { EventComponent, EventSkeleton } from "@/components/EventComponent";
import { useEventQuery } from "@/queries/useEventsQuery";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data } = useEventQuery(id);

    return (
        <SafeAreaView className='flex-1 pt-20 bg-background-light dark:bg-background-dark' edges={['top']}>
            <ScrollView className="flex-1">
                {data ? <EventComponent item={data} page /> : <EventSkeleton count={1} />}
            </ScrollView>
        </SafeAreaView>
    )
}