import type { Appointment } from "@/utils/types";
import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";

type Props = {
  appointment: Appointment;
};

export function StatusBadge({ appointment }: Props) {
  if (appointment.status === "to_be_rescheduled") {
    return (
      <View style={{ ...styles.badge, backgroundColor: "#fff085" }}>
        <Icon source="reload" size={12} />
        <Text style={{ fontSize: 12 }}>rescheduling</Text>
      </View>
    );
  }

  if (appointment.status === "cancelled") {
    return (
      <View style={{ ...styles.badge, backgroundColor: "#ffc9c9" }}>
        <Icon source="cancel" size={12} />
        <Text style={{ fontSize: 12 }}>cancelled</Text>
      </View>
    );
  }

  if (
    new Date().getTime() <
    new Date(`${appointment.date} ${appointment.startTime}`).getTime()
  ) {
    return (
      <View style={{ ...styles.badge, backgroundColor: "#b9f8cf" }}>
        <Icon source="check" size={12} />
        <Text style={{ fontSize: 12 }}>confirmed</Text>
      </View>
    );
  }

  if (
    new Date().getTime() <
    new Date(`${appointment.date} ${appointment.endTime}`).getTime()
  ) {
    return (
      <View style={{ ...styles.badge, backgroundColor: "#bedbff" }}>
        <Icon source="timer-sand-complete" size={12} />
        <Text style={{ fontSize: 12 }}>ongoing</Text>
      </View>
    );
  }

  return (
    <View style={{ ...styles.badge, backgroundColor: "#e2e8f0" }}>
      <Icon source="check-all" size={12} />
      <Text style={{ fontSize: 12 }}>completed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
