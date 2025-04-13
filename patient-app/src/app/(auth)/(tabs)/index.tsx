import { useUpcomingAppointmentQuery } from "@/api/appointment";
import { useMeQuery } from "@/api/auth";
import {
  HighlightedAppointmentCard,
  HighlightedAppointmentError,
  HighlightedAppointmentSkeleton,
} from "@/components/appointment/highlighted-appointment-card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { ArrowRightIcon, BotIcon } from "lucide-react-native";
import { ScrollView, View } from "react-native";

export default function HomePage() {
  return (
    <ScrollView className="px-6">
      <Greeting />
      <View className="flex-row items-center justify-between mt-8 mb-3">
        <Text className="text-lg font-semibold">Upcoming Appointment</Text>
        <Link href="/appointment" className="text-primary text-sm">
          View all
        </Link>
      </View>
      <UpcomingAppointment />
      <Text className="mt-4 mb-3 text-lg font-semibold">Not Feeling Well?</Text>
      <ChatPageLink />
    </ScrollView>
  );
}

function Greeting() {
  const { data: me } = useMeQuery();

  const { text, emoji } = (() => {
    const hour = new Date().getHours();
    if (hour < 6) {
      return { text: "It's late", emoji: "🛏" };
    }
    if (hour < 12) {
      return { text: "Good morning", emoji: "🍞" };
    }
    if (hour < 18) {
      return { text: "Good afternoon", emoji: "☀" };
    }
    return { text: "Good evening", emoji: "🌙" };
  })();

  return (
    <View className="gap-1 mt-4">
      <Text className="text-lg font-medium">
        {text}, {me?.nickname ?? "user"} {emoji}
      </Text>
      <Muted>How are you feeling today?</Muted>
    </View>
  );
}

function UpcomingAppointment() {
  const { data, error, isPending } = useUpcomingAppointmentQuery();

  if (isPending) {
    return <HighlightedAppointmentSkeleton />;
  }

  if (error) {
    return <HighlightedAppointmentError message={error.message} />;
  }

  return <HighlightedAppointmentCard data={data} />;
}

function ChatPageLink() {
  return (
    <Link href="/chat">
      <LinearGradient
        colors={["#0b4f4a", "#009689"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-row items-center gap-3 w-full p-4 rounded-lg overflow-hidden"
      >
        <View className="items-center justify-center size-12 rounded-full bg-background/40">
          <Icon as={BotIcon} size={24} className="text-primary-foreground" />
        </View>
        <View className="mr-auto">
          <Text className="text-primary-foreground text-lg font-medium">
            AI Symptom Evaluation
          </Text>
          <Text className="text-primary-foreground/75 text-sm">
            Chat and get instant guidance
          </Text>
        </View>
        <Icon as={ArrowRightIcon} className="text-primary-foreground" />
      </LinearGradient>
    </Link>
  );
}
