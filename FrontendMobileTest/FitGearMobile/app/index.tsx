import { Button, Text, View } from "react-native";
import React from "react";
import "react-native-gesture-handler";
import { useRouter } from "expo-router";

console.log("!!! index.tsx rendered !!!");

export default function Index() {
  const router = useRouter();

  return (
    <View>
      <Text style={{ fontSize: 32, color: "red" }}>Это главная страница!</Text>
      <Button
        title="Перейти на сторінку входу"
        onPress={() => router.push("/Login")}
      />
    </View>
  );
}
