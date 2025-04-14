import type { Appointment } from "@/utils/types";
import dayjs from "dayjs";
import { Link } from "expo-router";
import { CalendarClockIcon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { Small } from "../ui/typography";
import { StatusBadge } from "./status-badge";

type Props = {
  appointment: Appointment;
};

export function SimpleAppointmentCard({ appointment }: Props) {
  const { id, doctor, date, startTime, endTime } = appointment;

  return (
    <Link href={{ pathname: "/appointment/[id]", params: { id } }}>
      <View className="flex-row items-center justify-between w-full p-4">
        <View className="gap-1.5 max-w-56 mr-auto">
          <Text className="font-medium line-clamp-1">
            Dr. {doctor.firstName} {doctor.lastName}
          </Text>
          <View className="flex-row items-center gap-2">
            <Icon
              as={CalendarClockIcon}
              size={14}
              className="text-muted-foreground"
            />
            <Small>{dayjs(date).format("L")}</Small>
            <Small>
              {dayjs(`${date} ${startTime}`).format("LT")}
              &nbsp;-&nbsp;
              {dayjs(`${date} ${endTime}`).format("LT")}
            </Small>
          </View>
        </View>
        <StatusBadge appointment={appointment} />
      </View>
    </Link>
  );
}
