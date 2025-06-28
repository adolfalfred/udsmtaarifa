// import { NotificationComponent, NotificationSkeleton } from "@/components/NotificationComponent";
// import { useNotificationQuery } from "@/queries/useNotificationQuery";
// import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

export default function PostDetailScreen() {
    // const { id } = useLocalSearchParams<{ id: string }>();
    // const { data } = useNotificationQuery(id);

    return (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {/* {data ? <NotificationComponent item={data} page /> : <NotificationSkeleton count={1} page />} */}
        </ScrollView>
    )
}