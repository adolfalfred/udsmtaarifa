import { EventComponent, EventSkeleton } from "@/components/EventComponent";
import { ScrollAwareView } from "@/components/ScrollAwareView";
import { useEventQuery } from "@/queries/useEventsQuery";
import { useLocalSearchParams } from "expo-router";

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data } = useEventQuery(id);

    return (
        <ScrollAwareView className="flex-1 pt-24">
            {data ? <EventComponent item={data} page /> : <EventSkeleton count={1} />}
        </ScrollAwareView>
    )
}