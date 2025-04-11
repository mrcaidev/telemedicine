import { useUpcomingAppointmentQuery } from "@/api/appointment";
import { HighlightedAppointment } from "@/components/appointment/highlighted-appointment";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

export default function HomePage() {
  return (
    <ScrollView style={{ paddingHorizontal: 24 }}>
      <UpcomingAppointment />
    </ScrollView>
  );
}

function UpcomingAppointment() {
  const { data: appointment, error, isPending } = useUpcomingAppointmentQuery();

  if (isPending) {
    return <Text>Skeleton</Text>;
  }

  if (error) {
    return (
      <View>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return <HighlightedAppointment appointment={appointment} />;
}
