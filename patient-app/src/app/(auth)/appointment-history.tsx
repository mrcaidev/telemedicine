import { useAppointmentsInfiniteQuery } from "@/api/appointment";
import { SimpleAppointmentCard } from "@/components/appointment/simple-appointment-card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { FlatList, View } from "react-native";

export default function AppointmentHistoryPage() {
  return (
    <View className="px-6">
      <Text className="mt-2 mb-6 text-2xl font-bold">Appointment History</Text>
      <Appointments />
    </View>
  );
}

function Appointments() {
  const {
    data: appointments,
    error,
    isPending,
    hasNextPage,
    fetchNextPage,
  } = useAppointmentsInfiniteQuery({ limit: 10, sortOrder: "desc" });

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading appointments</Text>;
  }

  return (
    <FlatList
      data={appointments}
      renderItem={({ item }) => <SimpleAppointmentCard appointment={item} />}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={() => (
        <Text className="text-center">No history appointments</Text>
      )}
      ListFooterComponent={
        <Muted className="mt-2 text-center text-sm">
          {hasNextPage ? "Loading more for you..." : "- That's all, for now -"}
        </Muted>
      }
    />
  );
}
