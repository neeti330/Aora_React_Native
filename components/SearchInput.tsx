import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput: React.FC<{
  initialQuery?: string | string[] | undefined;
}> = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState<string | string[] | undefined>(
    initialQuery || ""
  );

  return (
    <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        placeholder="Search for a video topic"
        value={query as string}
        onChangeText={(e) => setQuery(e)}
        placeholderTextColor={"#CDCDE0"}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input something to search results across database"
            );
          }
          if (pathname.startsWith("/search"))
            router.setParams({ query } as any);
          else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
