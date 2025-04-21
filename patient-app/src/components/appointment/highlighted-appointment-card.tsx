import { getAppointmentRealtimeStatus } from "@/utils/appointment";
import type { Appointment } from "@/utils/types";
import dayjs from "dayjs";
import { Link } from "expo-router";
import { AlertCircleIcon, CalendarIcon, ClockIcon } from "lucide-react-native";
import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";
import { Muted } from "../ui/typography";
import { StatusBadge } from "./status-badge";

type Props = {
  appointment: Appointment;
};

export function HighlightedAppointmentCard({ appointment }: Props) {
  const { id, doctor, date, startTime, endTime } = appointment;

  const dateObj = dayjs(date);

  return (
    <Link href={{ pathname: "/appointment/[id]", params: { id } }}>
      <View className="w-full p-4 border border-border rounded-lg bg-card">
        <View className="flex-row items-center gap-3 mb-4">
          <Avatar alt="Doctor avatar" className="size-12">
            <AvatarImage source={{ uri: doctor.avatarUrl ?? undefined }} />
            <AvatarFallback>
              <Muted>
                {doctor.firstName[0]}
                {doctor.lastName[0]}
              </Muted>
            </AvatarFallback>
          </Avatar>
          <View className="max-w-40 mr-auto">
            <Text className="font-medium line-clamp-1">
              Dr. {doctor.firstName} {doctor.lastName}
            </Text>
            <Muted className="text-sm line-clamp-1">
              {doctor.specialties.join(", ") || "..."}
            </Muted>
          </View>
          <StatusBadge status={getAppointmentRealtimeStatus(appointment)} />
        </View>
        <View className="flex-row items-center gap-2 mb-2">
          <Icon as={CalendarIcon} className="text-muted-foreground" />
          <Text>{dateObj.format("dddd, LL")}</Text>
          <Muted>
            {dateObj.isToday()
              ? "(today)"
              : dateObj.isTomorrow()
                ? "(tomorrow)"
                : ""}
          </Muted>
        </View>
        <View className="flex-row items-center gap-2">
          <Icon as={ClockIcon} className="text-muted-foreground" />
          <Text>
            {dayjs(`${date} ${startTime}`).format("LT")}
            &nbsp;-&nbsp;
            {dayjs(`${date} ${endTime}`).format("LT")}
          </Text>
        </View>
      </View>
    </Link>
  );
}

export function HighlightedAppointmentSkeleton() {
  return (
    <View className="p-4 border border-border rounded-lg bg-card">
      <View className="flex-row items-center gap-3 mb-4">
        <Skeleton className="size-12 rounded-full" />
        <View className="gap-1.5 mr-auto">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-20 h-4" />
        </View>
        <Skeleton className="self-start w-20 h-6 rounded-full" />
      </View>
      <Skeleton className="h-6 mb-2" />
      <Skeleton className="h-6" />
    </View>
  );
}

export function HighlightedAppointmentEmpty() {
  return (
    <View className="flex-row items-center justify-center gap-2 h-36 p-4 border border-border rounded-lg bg-card">
      <Icon as={CalendarIcon} />
      <Text>No upcoming appointments</Text>
    </View>
  );
}

type ErrorProps = {
  message: string;
};

export function HighlightedAppointmentError({ message }: ErrorProps) {
  return (
    <View className="flex-row items-center justify-center gap-2 h-36 p-4 border border-border rounded-lg bg-card">
      <Icon as={AlertCircleIcon} />
      <Text>{message}</Text>
    </View>
  );
}
