import type { Appointment } from "@/utils/types";
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
  data: Appointment;
};

const dateFormat = Intl.DateTimeFormat("en-SG", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

const timeFormat = Intl.DateTimeFormat("en-SG", {
  hour: "numeric",
  minute: "numeric",
});

export function HighlightedAppointmentCard({ data }: Props) {
  const { id, doctor, date, startTime, endTime } = data;

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
          <View className="mr-auto">
            <Text className="max-w-40 font-medium line-clamp-1">
              Dr. {doctor.firstName} {doctor.lastName}
            </Text>
            <Muted className="text-sm">{doctor.specialties[0] ?? "..."}</Muted>
          </View>
          <StatusBadge appointment={data} />
        </View>
        <View className="flex-row items-center gap-2 mb-2">
          <Icon as={CalendarIcon} className="text-muted-foreground" />
          <Text>{dateFormat.format(new Date(date))}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Icon as={ClockIcon} className="text-muted-foreground" />
          <Text>
            {timeFormat.format(new Date(`${date} ${startTime}`))}
            &nbsp;-&nbsp;
            {timeFormat.format(new Date(`${date} ${endTime}`))}
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
        <Skeleton className="w-20 h-6 rounded-full" />
      </View>
      <Skeleton className="h-6 mb-2" />
      <Skeleton className="h-6" />
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
