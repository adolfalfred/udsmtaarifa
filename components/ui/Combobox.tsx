import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    FlatList,
} from "react-native";

const options = ["Apple", "Banana", "Mango", "Orange", "Pineapple"];

export default function ComboBoxModal() {
    const [selected, setSelected] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [query, setQuery] = useState("");

    const filtered = options.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <View className="w-full mx-auto">
            <TouchableOpacity
                className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-full"
                onPress={() => {
                    setModalVisible(true);
                    setQuery("");
                }}
            >
                <FontAwesome name="graduation-cap" size={16} color="#aaa" className="mr-4" />
                <View className="h-10 flex-col items-center justify-center">
                    <Text className="text-[#aaa] text-lg">
                        {selected || "Programme Taking"}
                    </Text>
                </View>
            </TouchableOpacity>

            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center px-4">
                    <View className="bg-white dark:bg-gray-900 w-full rounded-xl p-4 max-w-md">
                        <TextInput
                            className="border border-gray-300 dark:border-gray-700 p-3 rounded-md mb-3 text-black dark:text-white bg-white dark:bg-gray-800"
                            placeholder="Search..."
                            placeholderTextColor="#999"
                            value={query}
                            onChangeText={(e) => {
                                if (e === '') setSelected('')
                                setQuery(e)
                            }}
                            autoFocus
                        />
                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item}
                            className="max-h-60"
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onPress={() => {
                                        setSelected(item);
                                        setQuery(item)
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text className="text-black dark:text-white">{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            className="mt-4 self-end"
                            onPress={() => setModalVisible(false)}
                        >
                            <Text className="text-blue-500">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
