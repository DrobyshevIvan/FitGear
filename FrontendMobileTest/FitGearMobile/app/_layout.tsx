import "./api";
import { Fragment, ReactNode } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";

console.log("!!! _layout.tsx rendered !!!");

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
