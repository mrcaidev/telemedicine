import { useUpcomingAppointmentQuery } from "@/api/appointment";
import {
  HighlightedAppointment,
  HighlightedAppointmentError,
  HighlightedAppointmentSkeleton,
} from "@/components/appointment/highlighted-appointment";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

export default function HomePage() {
  return (
    <ScrollView style={{ paddingHorizontal: 24 }}>
      <View style={{ paddingVertical: 24 }}>
        <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: "bold" }}>
          Upcoming Appointment
        </Text>
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
