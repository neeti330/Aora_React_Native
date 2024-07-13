import { Image, ImageSourcePropType, Text, View } from "react-native";

const TabIcon: React.FC<{
  icon: ImageSourcePropType | undefined;
  color: string;
  name: string;
  focused: boolean;
}> = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2 ">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

export default TabIcon;
