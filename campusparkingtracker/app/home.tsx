import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.emoji}>🚧</Text>
        <Text style={styles.title}>Work In Progress</Text>
        <Text style={styles.subtitle}>Check back soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
  },
});
