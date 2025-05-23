import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "./context/AuthContext";

const Home = () => {
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      // Если токен уже прописан в axios.defaults.headers.common["Authorization"], он подставится автоматически
      const response = await axios.get(`${API_URL}/Announcements`);
      setData(JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      setData("Ошибка: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button
        title={loading ? "Загрузка..." : "Получить объявления"}
        onPress={fetchAnnouncements}
        disabled={loading}
      />
      <ScrollView style={{ marginTop: 16 }}>
        <Text selectable style={{ fontFamily: "monospace" }}>
          {data}
        </Text>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
