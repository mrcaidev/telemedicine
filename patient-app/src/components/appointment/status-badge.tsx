import type { Appointment } from "@/utils/types";
import dayjs from "dayjs";
import {
  CheckCheckIcon,
  CheckIcon,
  HourglassIcon,
  RotateCwIcon,
  XIcon,
} from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { cn } from "../ui/utils";

type Props = {
  appointment: Appointment;
};

export function StatusBadge({ appointment }: Props) {
  const { status, date, startTime, endTime } = appointment;

  const { badgeClassName, icon, text } = (() => {
    if (status === "to_be_rescheduled") {
      return {
        badgeClassName: "bg-yellow-200",
        icon: RotateCwIcon,
        text: "rescheduling",
      };
    }
    if (status === "cancelled") {
      return {
        badgeClassName: "bg-red-200",
        icon: XIcon,
        text: "cancelled",
      };
    }
    if (dayjs().isBefore(`${date} ${startTime}`)) {
      return {
        badgeClassName: "bg-green-200",
        icon: CheckIcon,
        text: "confirmed",
      };
    }
    if (dayjs().isAfter(`${date} ${endTime}`)) {
      return {
        badgeClassName: "bg-blue-200",
        icon: HourglassIcon,
        text: "ongoing",
      };
    }
    return {
      badgeClassName: "bg-gray-200",
      icon: CheckCheckIcon,
      text: "completed",
    };
  })();

  return (
    <View
      className={cn(
        "flex-row items-center gap-1 px-2 py-1 rounded-full",
        badgeClassName,
      )}
    >
      <Icon as={icon} size={12} />
      <Text className="text-xs">{text}</Text>
    </View>
  );
}
