import { useBookAppointmentMutation } from "@/api/appointment";
import { useDoctorAvailabilitiesQuery, useDoctorQuery } from "@/api/doctor";
import { ErrorScreen } from "@/components/error-screen";
import { Spinner } from "@/components/spinner";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { Muted, P } from "@/components/ui/typography";
import type { DoctorAvailability } from "@/utils/types";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircleIcon,
  CalendarIcon,
  CalendarXIcon,
  CheckIcon,
  ClockIcon,
  MarsIcon,
  UserRoundIcon,
  VenusIcon,
  XIcon,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

function useCurrentDoctorId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return id;
}

function useCurrentDoctorQuery() {
  const id = useCurrentDoctorId();
  return useDoctorQuery(id);
}

function useCurrentDoctorAvailabilityQuery() {
  const doctorId = useCurrentDoctorId();
  return useDoctorAvailabilitiesQuery(doctorId);
}

export default function DoctorPage() {
  const { data: doctor, isPending, error } = useCurrentDoctorQuery();

  if (isPending) {
    return (
      <View>
        <View className="absolute inset-x-0 top-0 h-32 bg-primary" />
        <View className="mx-6 mt-12">
          <Skeleton className="size-28 rounded-full" />
          <Skeleton className="w-1/2 h-7 mt-4" />
          <Skeleton className="w-1/3 h-5 mt-1" />
        </View>
        <View className="gap-2 mx-6 mt-6">
          <Text className="text-lg font-medium">Introduction</Text>
          <Skeleton className="h-20" />
        </View>
        <View className="gap-2 mx-6 mt-6">
          <Text className="text-lg font-medium">Specialties</Text>
          <Skeleton className="h-10" />
        </View>
        <View className="gap-2 mx-6 mt-6">
          <Text className="text-lg font-medium">Book Appointment</Text>
          <Skeleton className="h-10" />
          <Skeleton className="h-32" />
        </View>
      </View>
    );
  }

  if (error) {
    return <ErrorScreen message={error.message} />;
  }

  return (
    <ScrollView>
      <View className="absolute inset-x-0 top-0 h-32 bg-primary" />
      <View className="mx-6 mt-12">
        <Avatar alt="Doctor avatar" className="size-28">
          <AvatarImage source={{ uri: doctor.avatarUrl ?? undefined }} />
          <AvatarFallback>
            <Muted className="text-4xl">
              {doctor.firstName[0]}
              {doctor.lastName[0]}
            </Muted>
          </AvatarFallback>
        </Avatar>
        <View className="flex-row items-center gap-1 mt-4">
          <Text className="text-2xl font-bold">
            {doctor.firstName} {doctor.lastName}
          </Text>
          <Icon
            as={doctor.gender === "male" ? MarsIcon : VenusIcon}
            className={
              doctor.gender === "male" ? "text-blue-500" : "text-pink-500"
            }
          />
        </View>
        <Muted className="mt-1">{doctor.email}</Muted>
      </View>
      <View className="gap-2 mx-6 mt-6">
        <Text className="text-lg font-medium">Introduction</Text>
        {doctor.description === "" ? (
          <P className="text-muted-foreground text-sm">No introduction yet</P>
        ) : (
          doctor.description.split("\n").map((line, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: immutable
            <P key={index} className="text-muted-foreground text-sm">
              {line}
            </P>
          ))
        )}
      </View>
      <View className="gap-2 mx-6 mt-6">
        <Text className="text-lg font-medium">Specialties</Text>
        <View className="flex-row items-center gap-1 flex-wrap">
          {doctor.specialties.length === 0 ? (
            <P className="text-muted-foreground text-sm">No specialties yet</P>
          ) : (
            doctor.specialties.map((specialty) => (
              <Badge key={specialty} variant="outline">
                <Text>{specialty}</Text>
              </Badge>
            ))
          )}
        </View>
      </View>
      <View className="gap-2 mx-6 mt-6">
        <Text className="text-lg font-medium">Book Appointment</Text>
        <AvailabilityTabs />
      </View>
    </ScrollView>
  );
}

function weekdayToAbbr(weekday: number) {
  switch (weekday) {
    case 0:
      return "Sun";
    case 1:
      return "Mon";
    case 2:
      return "Tue";
    case 3:
      return "Wed";
    case 4:
      return "Thu";
    case 5:
      return "Fri";
    case 6:
      return "Sat";
    default:
      return "";
  }
}

function AvailabilityTabs() {
  const {
    data: availabilities,
    isPending,
    error,
  } = useCurrentDoctorAvailabilityQuery();

  const baseDay = (dayjs().day() + 1) % 7;
  const [tabValue, setTabValue] = useState(String(baseDay));

  if (isPending) {
    return (
      <View className="gap-2">
        <Skeleton className="h-10" />
        <Skeleton className="h-32" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-row items-center justify-center gap-2 h-40 p-4 border border-border border-dashed rounded-md">
        <Icon as={AlertCircleIcon} className="text-muted-foreground" />
        <Muted>{error.message}</Muted>
      </View>
    );
  }

  const weekdays = Array.from({ length: 7 }, (_, i) => (baseDay + i) % 7);

  return (
    <Tabs value={tabValue} onValueChange={setTabValue}>
      <TabsList>
        {weekdays.map((weekday) => (
          <TabsTrigger key={weekday} value={String(weekday)}>
            <Text>{weekdayToAbbr(weekday)}</Text>
          </TabsTrigger>
        ))}
      </TabsList>
      {weekdays.map((weekday) => (
        <TabsContent key={weekday} value={String(weekday)}>
          <AvailabilityTabContent
            availabilities={availabilities.filter((a) => a.weekday === weekday)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function AvailabilityTabContent({
  availabilities,
}: { availabilities: DoctorAvailability[] }) {
  if (availabilities.length === 0) {
    return (
      <View className="flex-row items-center justify-center gap-2 h-32 p-4 border border-border border-dashed rounded-md mt-2">
        <Icon as={CalendarXIcon} className="text-muted-foreground" />
        <Muted>Not available on this day</Muted>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap mt-2">
      {availabilities.map((availability) => (
        <View key={availability.id} className="w-1/2 p-1">
          <BookButton availability={availability} />
        </View>
      ))}
    </View>
  );
}

function BookButton({ availability }: { availability: DoctorAvailability }) {
  const { data: doctor } = useCurrentDoctorQuery();

  const date = useMemo(() => {
    const today = dayjs();
    const targetDate = dayjs().day(availability.weekday);
    if (today.isBefore(targetDate)) {
      return targetDate;
    }
    return targetDate.add(1, "week");
  }, [availability.weekday]);

  const [remark, setRemark] = useState("");

  const { mutate, isPending } = useBookAppointmentMutation();

  const router = useRouter();

  if (!doctor) {
    return null;
  }

  const book = () => {
    mutate(
      {
        availabilityId: availability.id,
        remark,
      },
      {
        onSuccess: (data) => {
          router.navigate({
            pathname: "/appointment/[id]",
            params: { id: data.id },
          });
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Text>
            {availability.startTime} - {availability.endTime}
          </Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Book Appointment</AlertDialogTitle>
          <AlertDialogDescription>
            You are booking an appointment. Please confirm the details below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Icon as={UserRoundIcon} className="text-muted-foreground" />
            <Text>
              Dr. {doctor.firstName} {doctor.lastName}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={CalendarIcon} className="text-muted-foreground" />
            <Text>{date.format("dddd, LL")}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={ClockIcon} className="text-muted-foreground" />
            <Text>
              {dayjs(availability.startTime, "HH:mm").format("LT")}
              &nbsp;-&nbsp;
              {dayjs(availability.endTime, "HH:mm").format("LT")}
            </Text>
          </View>
        </View>
        <View>
          <Textarea
            value={remark}
            onChangeText={setRemark}
            maxLength={200}
            placeholder="Leave a remark... (optional)"
            className="text-base"
          />
        </View>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Icon as={XIcon} />
            <Text>Close</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={book} disabled={isPending}>
            {isPending ? <Spinner /> : <Icon as={CheckIcon} />}
            <Text>Confirm</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
