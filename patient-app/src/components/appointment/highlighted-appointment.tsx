import type { Appointment } from "@/utils/types";
import { Link } from "expo-router";
import { View } from "react-native";
import { Icon, Surface, Text, useTheme } from "react-native-paper";
import { Avatar } from "../avatar";
import { StatusBadge } from "./status-badge";

type Props = {
  appointment: Appointment;
};

export function HighlightedAppointment({ appointment }: Props) {
  const { id, doctor, date, startTime, endTime } = appointment;

  const theme = useTheme();

  return (
    <View style={{ paddingVertical: 24 }}>
      <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: "bold" }}>
        Upcoming Appointment
      </Text>
      <Link href={{ pathname: "/appointment/[id]", params: { id } }}>
        <Surface style={{ width: "100%", padding: 16, borderRadius: 8 }}>
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
            <View style={{ marginRight: "auto" }}>
              <Text numberOfLines={1} style={{ maxWidth: 128, fontSize: 16 }}>
                Dr. {doctor.firstName} {doctor.lastName}
              </Text>
              <Text style={{ opacity: 0.7 }}>{doctor.specialties[0]}</Text>
            </View>
            <StatusBadge appointment={appointment} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
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
          <Text
            style={{
              alignSelf: "flex-end",
              color: theme.colors.primary,
              fontSize: 12,
            }}
          >
            View details &gt;
          </Text>
        </Surface>
      </Link>
    </View>
  );
}
