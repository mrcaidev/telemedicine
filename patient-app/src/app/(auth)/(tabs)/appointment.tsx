import { useAppointmentsInfiniteQuery } from "@/api/appointment";
import { HighlightedAppointmentCard } from "@/components/appointment/highlighted-appointment-card";
import { SimpleAppointmentCard } from "@/components/appointment/simple-appointment-card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";

export default function AppointmentListPage() {
  return (
    <View className="px-6">
      <View className="flex-row items-center justify-between mt-2 mb-6">
        <Text className="text-2xl font-bold">Appointment</Text>
        <Link href="/appointment-history" className="text-primary text-sm">
          View history
        </Link>
      </View>
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
  } = useAppointmentsInfiniteQuery({ limit: 10 });

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading appointments</Text>;
  }

  return (
    <FlatList
      data={appointments}
      renderItem={({ item, index }) =>
        index === 0 ? (
          <HighlightedAppointmentCard appointment={item} />
        ) : (
          <SimpleAppointmentCard appointment={item} />
        )
      }
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={() => (
        <Text className="text-center">No future appointments</Text>
      )}
      ListFooterComponent={
        <Muted className="mt-2 text-center text-sm">
          {hasNextPage ? "Loading more for you..." : "- That's all, for now -"}
        </Muted>
      }
    />
  );
}
