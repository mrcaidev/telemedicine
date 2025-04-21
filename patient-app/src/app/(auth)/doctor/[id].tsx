import { useBookAppointmentMutation } from "@/api/appointment";
import { useDoctorAvailabilityQuery, useDoctorQuery } from "@/api/doctor";
import { LoadingScreen } from "@/components/loading-screen";
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
import { computeNextDateOfWeekday } from "@/utils/datetime";
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
import { useState } from "react";
import { ScrollView, View } from "react-native";

function useCurrentDoctorQuery() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return useDoctorQuery(id);
}

export default function DoctorDetailsPage() {
  const { data: doctor, isPending, error } = useCurrentDoctorQuery();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return error.message;
  }

  return (
    <ScrollView>
      <View className="absolute inset-x-0 top-0 h-32 bg-primary" />
      <View className="px-6 mt-12">
        <Avatar alt="Doctor avatar" className="size-28 mb-4">
          <AvatarImage source={{ uri: doctor.avatarUrl ?? undefined }} />
          <AvatarFallback>
            <Muted>
              {doctor.firstName[0]} {doctor.lastName[0]}
            </Muted>
          </AvatarFallback>
        </Avatar>
        <View className="flex-row items-center gap-1 mb-1">
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
        <Muted>{doctor.email}</Muted>
      </View>
      <View className="px-6 mt-6 gap-2">
        <Text className="text-lg font-medium">Introduction</Text>
        {doctor.description.split("\n").map((line, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: immutable
          <P key={index} className="text-muted-foreground text-sm">
            {line}
          </P>
        ))}
      </View>
      <View className="px-6 mt-6 gap-2">
        <Text className="text-lg font-medium">Specialties</Text>
        <View className="flex-row items-center gap-1 flex-wrap">
          {doctor.specialties.map((specialty) => (
            <Badge key={specialty} variant="outline">
              <Text>{specialty}</Text>
            </Badge>
          ))}
        </View>
      </View>
      <View className="px-6 mt-6 gap-2">
        <Text className="text-lg font-medium">Book Appointment</Text>
        <AvailabilityTabs />
      </View>
    </ScrollView>
  );
}

function AvailabilityTabs() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: availabilities,
    isPending,
    error,
  } = useDoctorAvailabilityQuery(id);

  const [tabValue, setTabValue] = useState("1");

  if (isPending) {
    return (
      <View className="gap-2">
        <Skeleton className="h-10" />
        <Skeleton className="h-24" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-row items-center justify-center gap-2 h-36 p-4 border border-border rounded-lg bg-card">
        <Icon as={AlertCircleIcon} />
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <Tabs value={tabValue} onValueChange={setTabValue}>
      <TabsList>
        <TabsTrigger value="1">
          <Text>Mon</Text>
        </TabsTrigger>
        <TabsTrigger value="2">
          <Text>Tue</Text>
        </TabsTrigger>
        <TabsTrigger value="3">
          <Text>Wed</Text>
        </TabsTrigger>
        <TabsTrigger value="4">
          <Text>Thu</Text>
        </TabsTrigger>
        <TabsTrigger value="5">
          <Text>Fri</Text>
        </TabsTrigger>
        <TabsTrigger value="6">
          <Text>Sat</Text>
        </TabsTrigger>
        <TabsTrigger value="7">
          <Text>Sun</Text>
        </TabsTrigger>
      </TabsList>
      {[1, 2, 3, 4, 5, 6, 7].map((weekday) => (
        <TabsContent key={weekday} value={String(weekday)}>
          <AvailabilityTab
            availabilities={availabilities.filter((a) => a.weekday === weekday)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function AvailabilityTab({
  availabilities,
}: { availabilities: DoctorAvailability[] }) {
  if (availabilities.length === 0) {
    return (
      <View className="flex-row items-center justify-center gap-2 h-24 border border-border border-dashed rounded-md mt-2">
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
  const date = computeNextDateOfWeekday(availability.weekday);

  const [remark, setRemark] = useState("");

  const { mutate, isPending } = useBookAppointmentMutation();

  const router = useRouter();

  const book = () => {
    mutate(
      {
        doctorId: doctor?.id ?? "",
        date: date.format("YYYY-MM-DD"),
        startTime: availability.startTime,
        endTime: availability.endTime,
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
              Dr. {doctor?.firstName} {doctor?.lastName}
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
          <View className="gap-2 mt-1">
            <Textarea
              value={remark}
              onChangeText={setRemark}
              maxLength={200}
              placeholder="Leave a remark... (optional)"
              className="text-base"
            />
          </View>
        </View>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Icon as={XIcon} />
            <Text>Close</Text>
          </AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onPress={book}>
            {isPending ? <Spinner /> : <Icon as={CheckIcon} />}
            <Text>Confirm</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
