import {
  useAppointmentQuery,
  useCancelAppointmentMutation,
} from "@/api/appointment";
import { ErrorScreen } from "@/components/error-screen";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { cn } from "@/components/ui/utils";
import { getAppointmentRealtimeStatus } from "@/utils/appointment";
import dayjs from "dayjs";
import { Link, useLocalSearchParams } from "expo-router";
import {
  ArrowRightIcon,
  CalendarIcon,
  ChartNoAxesColumnIcon,
  ClockIcon,
  type LucideIcon,
  PencilLineIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react-native";
import { ScrollView, View, type ViewProps } from "react-native";

export default function AppointmentPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: appointment, isPending, error } = useAppointmentQuery(id);

  if (isPending) {
    return (
      <View className="grow mx-6">
        <Text className="mt-2 text-2xl font-bold">Appointment Details</Text>
        <ScrollView className="grow mt-6">
          <Row icon={UserRoundIcon} title="Doctor">
            <Skeleton className="w-full h-7" />
          </Row>
          <Separator className="my-4" />
          <Row icon={CalendarIcon} title="Date">
            <Skeleton className="w-full h-5" />
          </Row>
          <Separator className="my-4" />
          <Row icon={ClockIcon} title="Time">
            <Skeleton className="w-full h-5" />
          </Row>
          <Separator className="my-4" />
          <Row icon={ChartNoAxesColumnIcon} title="Status">
            <Skeleton className="w-full h-5" />
          </Row>
          <Separator className="my-4" />
          <Row icon={PencilLineIcon} title="Remark" className="items-start">
            <Skeleton className="w-full h-20" />
          </Row>
        </ScrollView>
        <View className="my-6">
          <CancelAppointmentButton cancelled={false} />
        </View>
      </View>
    );
  }

  if (error) {
    return <ErrorScreen message={error.message} />;
  }

  const { doctor, startAt, endAt, remark } = appointment;
  const realtimeStatus = getAppointmentRealtimeStatus(appointment);

  return (
    <View className="grow mx-6">
      <Text className="mt-2 text-2xl font-bold">Appointment Details</Text>
      <ScrollView className="grow mt-6">
        <Row icon={UserRoundIcon} title="Doctor">
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
        </Row>
        <Separator className="my-4" />
        <Row icon={CalendarIcon} title="Date">
          <Text>{dayjs(startAt).format("dddd, LL")}</Text>
        </Row>
        <Separator className="my-4" />
        <Row icon={ClockIcon} title="Time">
          <Text>
            {dayjs(startAt).format("LT")}
            &nbsp;-&nbsp;
            {dayjs(endAt).format("LT")}
          </Text>
        </Row>
        <Separator className="my-4" />
        <Row icon={ChartNoAxesColumnIcon} title="Status">
          <Text>{realtimeStatus}</Text>
        </Row>
        <Separator className="my-4" />
        <Row icon={PencilLineIcon} title="Remark" className="items-start">
          <Text>{remark}</Text>
        </Row>
      </ScrollView>
      <View className="my-6">
        <CancelAppointmentButton
          cancelled={appointment.status === "cancelled"}
        />
      </View>
    </View>
  );
}

function Row({
  icon,
  title,
  className,
  children,
  ...props
}: ViewProps & { icon: LucideIcon; title: string }) {
  return (
    <View className={cn("flex-row items-center", className)} {...props}>
      <View className="flex-row items-center gap-2 w-24">
        <Icon as={icon} className="text-muted-foreground" />
        <Text className="font-medium">{title}</Text>
      </View>
      {children}
    </View>
  );
}

function CancelAppointmentButton({ cancelled }: { cancelled: boolean }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mutate, isPending } = useCancelAppointmentMutation(id);

  const cancel = () => {
    mutate();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={cancelled}>
          <Icon as={XIcon} />
          <Text>{cancelled ? "Cancelled" : "Cancel appointment"}</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Icon as={XIcon} />
            <Text>Close</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={cancel} disabled={isPending}>
            <Icon as={ArrowRightIcon} />
            <Text>Continue</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
