import { Button, StyleSheet, Text, TextInput, View, Image } from "react-native";
import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const login = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      const result = await auth.onLogin(email, password);
      console.log("Login successful:", result);
      router.push("/Home");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      const result = await auth.onRegister(email, password);
      console.log("Registration successful:", result);
      await login();
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://galaxies.dev/img/logos/logo--blue.png" }}
        style={styles.image}
      />
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
          editable={!isLoading}
        />
        <Button
          title={isLoading ? "Loading..." : "Login"}
          onPress={login}
          disabled={isLoading}
        />
        <Button
          title={isLoading ? "Loading..." : "Register"}
          onPress={register}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  image: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
  form: {
    gap: 10,
    width: "60%",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
});
