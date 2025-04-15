import { useAppointmentQuery } from "@/api/appointment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { getAppointmentRealtimeStatus } from "@/utils/appointment";
import dayjs from "dayjs";
import { Link, useLocalSearchParams } from "expo-router";
import {
  CalendarIcon,
  ChartNoAxesColumnIcon,
  ClockIcon,
  PencilLineIcon,
  XIcon,
} from "lucide-react-native";
import { ScrollView, View } from "react-native";

export default function AppointmentDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: appointment, error, isPending } = useAppointmentQuery(id);

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const { doctor, date, startTime, endTime, remark } = appointment;
  const status = getAppointmentRealtimeStatus(appointment);

  return (
    <View className="grow px-6">
      <Text className="mt-2 mb-6 text-2xl font-bold">Appointment Details</Text>
      <ScrollView className="grow">
        <View className="flex-row items-center">
          <View className="flex-row items-center gap-2 w-24">
            <Icon as={ClockIcon} className="text-muted-foreground" />
            <Text className="font-medium">Doctor</Text>
          </View>
          <Link
            href={{ pathname: "/doctor/[id]", params: { id: doctor.id } }}
            className="grow"
          >
            <View className="flex-row items-center gap-2.5">
              <Avatar alt="Doctor avatar" className="size-8">
                <AvatarImage source={{ uri: doctor.avatarUrl ?? undefined }} />
                <AvatarFallback>
                  <Text>
                    {doctor.firstName[0]} {doctor.lastName[0]}
                  </Text>
                </AvatarFallback>
              </Avatar>
              <Text className="max-w-48 mr-auto line-clamp-1">
                {doctor.firstName} {doctor.lastName}
              </Text>
            </View>
          </Link>
        </View>
        <Separator className="my-4" />
        <View className="flex-row items-center">
          <View className="flex-row items-center gap-2 w-24">
            <Icon as={CalendarIcon} className="text-muted-foreground" />
            <Text className="font-medium">Date</Text>
          </View>
          <Text>{dayjs(date).format("dddd, LL")}</Text>
        </View>
        <Separator className="my-4" />
        <View className="flex-row items-center">
          <View className="flex-row items-center gap-2 w-24">
            <Icon as={ClockIcon} className="text-muted-foreground" />
            <Text className="font-medium">Time</Text>
          </View>
          <Text>
            {dayjs(`${date} ${startTime}`).format("LT")}
            &nbsp;-&nbsp;
            {dayjs(`${date} ${endTime}`).format("LT")}
          </Text>
        </View>
        <Separator className="my-4" />
        <View className="flex-row items-center">
          <View className="flex-row items-center gap-2 w-24">
            <Icon
              as={ChartNoAxesColumnIcon}
              className="text-muted-foreground"
            />
            <Text className="font-medium">Status</Text>
          </View>
          <Text>{status}</Text>
        </View>
        <Separator className="my-4" />
        <View className="flex-row items-start">
          <View className="flex-row items-center gap-2 w-24">
            <Icon as={PencilLineIcon} className="text-muted-foreground" />
            <Text className="font-medium">Remark</Text>
          </View>
          <Text>{remark}</Text>
        </View>
      </ScrollView>
      <Button variant="outline" className="my-6">
        <Icon as={XIcon} />
        <Text>Cancel appointment</Text>
      </Button>
    </View>
  );
}
