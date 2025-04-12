import type { Appointment } from "@/utils/types";
import { Link } from "expo-router";
import { View } from "react-native";
import { Icon, Surface, Text, useTheme } from "react-native-paper";
import { Avatar } from "../avatar";
import { Skeleton } from "../skeleton";
import { StatusBadge } from "./status-badge";

type Props = {
  data: Appointment;
};

export function HighlightedAppointment({ data }: Props) {
  const { id, doctor, date, startTime, endTime } = data;

  const theme = useTheme();

  return (
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
            size={40}
          />
          <View style={{ marginRight: "auto" }}>
            <Text numberOfLines={1} style={{ maxWidth: 128 }}>
              Dr. {doctor.firstName} {doctor.lastName}
            </Text>
            <Text style={{ fontSize: 12, opacity: 0.7 }}>
              {doctor.specialties[0]}
            </Text>
          </View>
          <StatusBadge appointment={data} />
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
  );
}

export function HighlightedAppointmentSkeleton() {
  return (
    <Surface style={{ padding: 16, borderRadius: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <Skeleton style={{ width: 44, height: 44, borderRadius: "50%" }} />
        <View style={{ gap: 4, marginRight: "auto" }}>
          <Skeleton style={{ width: 120, height: 20 }} />
          <Skeleton style={{ width: 80, height: 16 }} />
        </View>
        <Skeleton style={{ width: 80, height: 24 }} />
      </View>
      <Skeleton style={{ width: "100%", height: 16, marginBottom: 12 }} />
      <Skeleton style={{ alignSelf: "flex-end", width: 80, height: 16 }} />
    </Surface>
  );
}

type ErrorProps = {
  message: string;
};

export function HighlightedAppointmentError({ message }: ErrorProps) {
  return (
    <Surface
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        height: 136,
        padding: 16,
        borderRadius: 8,
      }}
    >
      <Icon source="alert-circle-outline" size={16} />
      <Text>{message}</Text>
    </Surface>
  );
}
