import { Image, View } from "react-native";

const FallOutUI = () => {
  return (
    <View className="bg-background-light dark:bg-background-dark flex-1">
      <Image
        source={require("../assets/images/icon.png")}
        className="w-36 h-36 m-auto"
      />
    </View>
  );
};

export default FallOutUI;
