import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_900Black,
  useFonts,
} from "@expo-google-fonts/poppins";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  Animated,
  Easing,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#4F46E5";

type Structure = {
  id: string;
  name: string;
  location: string;
  available: number;
  total: number;
};

const STRUCTURES: Structure[] = [
  { id: "PS1", name: "Parking Structure 1", location: "Near Student Services West", available: 142, total: 350 },
  { id: "PS2", name: "Parking Structure 2", location: "Near Campanile Drive", available: 0, total: 280 },
  { id: "PS3", name: "Parking Structure 3", location: "Near College of Engineering", available: 57, total: 310 },
  { id: "PS4", name: "Parking Structure 4", location: "Near LOVE Library", available: 23, total: 290 },
  { id: "PS5", name: "Parking Structure 5", location: "Near Aztec Recreation Center", available: 198, total: 400 },
  { id: "PS6", name: "Parking Structure 6", location: "Near College of Business", available: 11, total: 260 },
  { id: "PS7", name: "Parking Structure 7", location: "Near The Conrad Prebys Aztec Student Union", available: 88, total: 320 },
  { id: "PS8", name: "Parking Structure 8", location: "Near South Campus Plaza", available: 205, total: 380 },
];

function statusLabel(available: number): string {
  if (available === 0) return "Full";
  if (available <= 25) return "Limited";
  return "Available";
}

function statusColor(available: number): string {
  if (available === 0) return "#EF4444";
  if (available <= 25) return "#F59E0B";
  return "#22C55E";
}


function ReportModal({
  structure,
  onClose,
}: {
  structure: Structure | null;
  onClose: () => void;
}) {
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(400)).current;

  const [arrived, setArrived] = useState(false);
  const [left, setLeft] = useState(false);
  const [infoWrong, setInfoWrong] = useState(false);

  const visible = structure !== null;

  useEffect(() => {
    if (visible) {
      setArrived(false);
      setLeft(false);
      setInfoWrong(false);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sheetAnim, {
          toValue: 0,
          duration: 440,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 280,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sheetAnim, {
          toValue: 400,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!structure) return null;

  const color = statusColor(structure.available);
  const label = statusLabel(structure.available);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropAnim }]} />
        </TouchableOpacity>

        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}>
          <View style={styles.sheetHandle} />

          {/* Sheet header */}
          <View style={styles.sheetHeader}>
            <View style={styles.cardIdBadge}>
              <Text style={styles.cardIdText}>{structure.id}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.sheetTitle}>{structure.name}</Text>
              <Text style={styles.sheetSubtitle}>{structure.location}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: color + "22" }]}>
              <View style={[styles.statusDot, { backgroundColor: color }]} />
              <Text style={[styles.statusText, { color }]}>{label}</Text>
            </View>
          </View>

          <View style={styles.sheetDivider} />

          {/* Arrived / Left buttons */}
          <View style={styles.fieldRow}>
            <TouchableOpacity
              style={[styles.actionBtn, arrived && styles.actionBtnActive]}
              activeOpacity={0.75}
              onPress={() => setArrived((v) => !v)}
            >
              <Ionicons
                name={arrived ? "checkmark-circle" : "enter-outline"}
                size={20}
                color={arrived ? "#fff" : PRIMARY}
              />
              <Text style={[styles.actionBtnText, arrived && styles.actionBtnTextActive]}>
                {arrived ? "Arrived" : "I Arrived"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, left && styles.actionBtnLeftActive]}
              activeOpacity={0.75}
              onPress={() => setLeft((v) => !v)}
            >
              <Ionicons
                name={left ? "checkmark-circle" : "exit-outline"}
                size={20}
                color={left ? "#fff" : "#6B7280"}
              />
              <Text style={[styles.actionBtnText, left && styles.actionBtnTextActive]}>
                {left ? "Left" : "I Left"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Report wrong info */}
          <TouchableOpacity
            style={[styles.reportToggle, infoWrong && styles.reportToggleActive]}
            activeOpacity={0.75}
            onPress={() => setInfoWrong((v) => !v)}
          >
            <Ionicons
              name={infoWrong ? "warning" : "warning-outline"}
              size={18}
              color={infoWrong ? "#fff" : "#F59E0B"}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.reportToggleText, infoWrong && styles.reportToggleTextActive]}>
              {infoWrong ? "Flagged — availability looks wrong" : "Report: availability looks wrong"}
            </Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={onClose}>
            <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default function Home() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_900Black,
  });

  const router = useRouter();
  const [selected, setSelected] = useState<Structure | null>(null);

  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.root}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>SDSU Parking Structures</Text>
          <View style={styles.headerActions}>
            {/* Alerts bell with unread badge */}
            <View>
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => router.push("/alerts")}>
                <Ionicons name="notifications-outline" size={20} color="#1a1a2e" />
              </TouchableOpacity>
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>4</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => router.push("/history")}>
              <Ionicons name="time-outline" size={20} color="#1a1a2e" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => router.push("/settings")}>
              <Ionicons name="settings-outline" size={20} color="#1a1a2e" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {STRUCTURES.map((s) => {
            const pct = Math.round((s.available / s.total) * 100);
            const color = statusColor(s.available);
            const label = statusLabel(s.available);

            return (
              <TouchableOpacity
                key={s.id}
                style={styles.card}
                activeOpacity={0.75}
                onPress={() => setSelected(s)}
              >
                {/* Top row: id badge + status */}
                <View style={styles.cardTop}>
                  <View style={styles.cardIdBadge}>
                    <Text style={styles.cardIdText}>{s.id}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: color + "26" }]}>
                    <View style={[styles.statusDot, { backgroundColor: color }]} />
                    <Text style={[styles.statusText, { color }]}>{label}</Text>
                  </View>
                </View>

                {/* Name & location */}
                <Text style={styles.cardName}>{s.name}</Text>
                <Text style={styles.cardLocation}>{s.location}</Text>

                {/* Progress bar */}
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: color }]} />
                </View>

                {/* Spots count */}
                <View style={styles.cardFooter}>
                  <Text style={styles.spotsNumber}>{s.available}</Text>
                  <Text style={styles.spotsLabel}> / {s.total} spots free</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      <ReportModal structure={selected} onClose={() => setSelected(null)} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backgroundImage: { opacity: 0.75 },
  safe: { flex: 1 },

  // ── Header ──────────────────────────────────────────
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: "#1a1a2e",
    letterSpacing: 0.2,
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.8)",
  },
  notifBadgeText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 9,
    color: "#fff",
  },

  // ── Scroll ───────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 14,
  },

  // ── Card ─────────────────────────────────────────────
  card: {
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.95)",
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardIdBadge: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  cardIdText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 12,
    color: "#fff",
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },
  cardName: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#1a1a2e",
    marginBottom: 2,
  },
  cardLocation: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 14,
  },
  barTrack: {
    height: 5,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginBottom: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  spotsNumber: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: "#1a1a2e",
  },
  spotsLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#6B7280",
  },

  // ── Report Modal ──────────────────────────────────────
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 18,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
    color: "#1a1a2e",
  },
  sheetSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },
  sheetDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    backgroundColor: "#EEF2FF",
  },
  actionBtnActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  actionBtnLeftActive: {
    backgroundColor: "#6B7280",
    borderColor: "#6B7280",
  },
  actionBtnText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: PRIMARY,
  },
  actionBtnTextActive: {
    color: "#fff",
  },
  reportToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#F59E0B",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFFBEB",
  },
  reportToggleActive: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  reportToggleText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#92400E",
    flex: 1,
  },
  reportToggleTextActive: {
    color: "#fff",
  },
  submitBtn: {
    flexDirection: "row",
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: PRIMARY,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  submitText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#fff",
  },
});
