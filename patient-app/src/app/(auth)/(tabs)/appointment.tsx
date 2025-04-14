import { useAppointmentsQuery } from "@/api/appointment";
import { HighlightedAppointmentCard } from "@/components/appointment/highlighted-appointment-card";
import { SimpleAppointmentCard } from "@/components/appointment/simple-appointment-card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { ScrollView, View } from "react-native";

export default function AppointmentListPage() {
  return (
    <ScrollView className="px-6">
      <View className="flex-row items-center justify-between mt-2 mb-6">
        <Text className="text-2xl font-bold">Appointment</Text>
        <Link href="/appointment" className="text-primary text-sm">
          View history
        </Link>
      </View>
      <AppointmentList />
    </ScrollView>
  );
}

function AppointmentList() {
  const {
    data: appointments,
    error,
    isPending,
  } = useAppointmentsQuery({ limit: 10 });

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading appointments</Text>;
  }

  const [highlightedAppointment, ...restAppointments] = appointments;

  if (!highlightedAppointment) {
    return <Text>No appointments available</Text>;
  }

  return (
    <View>
      <View className="mb-2">
        <HighlightedAppointmentCard appointment={highlightedAppointment} />
      </View>
      {restAppointments.map((appointment, index) => (
        <View key={appointment.id}>
          {index === 0 || <Separator />}
          <SimpleAppointmentCard appointment={appointment} />
        </View>
      ))}
    </View>
  );
}
