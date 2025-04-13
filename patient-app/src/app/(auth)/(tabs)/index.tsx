import { useUpcomingAppointmentQuery } from "@/api/appointment";
import { useMeQuery } from "@/api/auth";
import {
  HighlightedAppointmentCard,
  HighlightedAppointmentError,
  HighlightedAppointmentSkeleton,
} from "@/components/appointment/highlighted-appointment-card";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { Link } from "expo-router";
import { ScrollView, View } from "react-native";

export default function HomePage() {
  return (
    <ScrollView className="px-6">
      <Greeting />
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold">Upcoming Appointment</Text>
        <Link href="/appointment" className="text-primary text-sm">
          View all
        </Link>
      </View>
      <UpcomingAppointment />
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
    <View className="gap-1 mt-4 mb-8">
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
