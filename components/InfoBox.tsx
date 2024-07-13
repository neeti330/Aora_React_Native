import { View, Text } from "react-native";
import React from "react";

const InfoBox: React.FC<{
  title: string | undefined | number;
  titleStyles: string;
  containerStyle?: string;
  subtitle?: string;
}> = ({ title, subtitle, containerStyle, titleStyles }) => {
  return (
    <View className={containerStyle}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
