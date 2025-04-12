import { useUpcomingAppointmentQuery } from "@/api/appointment";
import {
  HighlightedAppointment,
  HighlightedAppointmentError,
  HighlightedAppointmentSkeleton,
} from "@/components/appointment/highlighted-appointment";
import { Link } from "expo-router";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

export default function HomePage() {
  return (
    <ScrollView style={{ paddingHorizontal: 24 }}>
      <View style={{ paddingVertical: 24 }}>
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

  return <HighlightedAppointment data={data} />;
}
