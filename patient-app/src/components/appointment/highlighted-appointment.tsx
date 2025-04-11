import type { Appointment } from "@/utils/types";
import { View } from "react-native";
import { Icon, Surface, Text } from "react-native-paper";
import { Avatar } from "../avatar";
import { StatusBadge } from "./status-badge";

type Props = {
  appointment: Appointment;
};

export function HighlightedAppointment({ appointment }: Props) {
  const { doctor, date, startTime, endTime } = appointment;

  return (
    <View style={{ paddingVertical: 24 }}>
      <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: "bold" }}>
        Upcoming Appointment
      </Text>
      <Surface style={{ padding: 16, borderRadius: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <Avatar
            url={doctor.avatarUrl}
            text={`${doctor.firstName[0]}${doctor.lastName[0]}`}
            size={44}
          />
          <View>
            <Text style={{ fontSize: 16 }}>
              Dr. {doctor.firstName} {doctor.lastName}
            </Text>
            <Text style={{ opacity: 0.7 }}>{doctor.specialties[0]}</Text>
          </View>
          <View style={{ flexGrow: 1 }} />
          <StatusBadge appointment={appointment} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon source="calendar-clock-outline" size={16} />
          <Text style={{ lineHeight: 16 }}>
            {new Date(date).toLocaleDateString("en-SG", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
            &nbsp;
            <Text style={{ fontWeight: "bold" }}>·</Text>
            &nbsp;
            {new Date(`${date} ${startTime}`).toLocaleTimeString("en-SG", {
              hour: "numeric",
              minute: "numeric",
            })}
            &nbsp;-&nbsp;
            {new Date(`${date} ${endTime}`).toLocaleTimeString("en-SG", {
              hour: "numeric",
              minute: "numeric",
            })}
          </Text>
        </View>
      </Surface>
    </View>
  );
}
