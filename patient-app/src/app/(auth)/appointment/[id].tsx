import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function AppointmentDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Appointment {id}</Text>
    </View>
  );
}
