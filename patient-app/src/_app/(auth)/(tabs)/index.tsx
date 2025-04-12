import { useUpcomingAppointmentQuery } from "@/api/appointment";
import { useMeQuery } from "@/api/auth";
import {
  HighlightedAppointment,
  HighlightedAppointmentError,
  HighlightedAppointmentSkeleton,
} from "@/components/appointment/highlighted-appointment";
import { Icon } from "@/components/ui/icon";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { ArrowRightIcon, BotIcon } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

export default function HomePage() {
  return (
    <ScrollView style={{ paddingHorizontal: 24 }}>
      {/* <View style={{ paddingTop: 12 }}>
        <Greeting />
      </View>
      <View style={{ paddingTop: 28 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Upcoming Appointment
          </Text>
          <Link href="/appointment" style={{ fontSize: 14 }}>
            View all
          </Link>
        </View>
        <UpcomingAppointment />
      </View>
      <View style={{ paddingTop: 24 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Not Feeling Well?
          </Text>
        </View>
        <ChatPageLink />
      </View> */}
    </ScrollView>
  );
}

function Greeting() {
  const { data: me } = useMeQuery();

  const { text, emoji } = greet();

  return (
    <View style={{ gap: 4 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
        {text}, {me?.nickname ?? "user"} {emoji}
      </Text>
      <Text style={{ opacity: 0.7 }}>How are you feeling today?</Text>
    </View>
  );
}

function greet() {
  const hour = new Date().getHours();
  if (hour < 6) {
    return { text: "It's late", emoji: "🛏️" };
  }
  if (hour < 12) {
    return { text: "Good morning", emoji: "🍞" };
  }
  if (hour < 18) {
    return { text: "Good afternoon", emoji: "☀" };
  }
  return { text: "Good evening", emoji: "🌙" };
}

function UpcomingAppointment() {
  const { data, error, isPending } = useUpcomingAppointmentQuery();

  if (isPending) {
    return <HighlightedAppointmentSkeleton />;
  }

  if (error) {
    return <HighlightedAppointmentError message={error.message} />;
  }

  return <HighlightedAppointment data={data} />;
}

function ChatPageLink() {
  return (
    <Link href="/chat">
      <LinearGradient
        colors={["#0b4f4a", "#009689"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <View
          style={{
            padding: 8,
            borderRadius: "50%",
            backgroundColor: "#ffffff44",
          }}
        >
          <Icon as={BotIcon} size={24} />
        </View>
        <View style={{ gap: 2 }}>
          <Text>AI Symptom Evaluation</Text>
          <Text
            style={{
              fontSize: 12,
              opacity: 0.7,
            }}
          >
            Chat and get instant guidance
          </Text>
        </View>
        <View style={{ marginLeft: "auto" }}>
          <Icon as={ArrowRightIcon} size={20} />
        </View>
      </LinearGradient>
    </Link>
  );
}
