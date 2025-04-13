import { useUpcomingAppointmentQuery } from "@/api/appointment";
import {
  HighlightedAppointmentCard,
  HighlightedAppointmentError,
  HighlightedAppointmentSkeleton,
} from "@/components/appointment/highlighted-appointment-card";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { ScrollView, View } from "react-native";

export default function HomePage() {
  return (
    <ScrollView className="px-6">
      <View className="h-6" />
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold">Upcoming Appointment</Text>
        <Link href="/appointment" className="text-primary text-sm">
          View all
        </Link>
      </View>
      <UpcomingAppointment />
    </ScrollView>
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
