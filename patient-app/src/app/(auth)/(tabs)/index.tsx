import { useAppointmentsInfiniteQuery } from "@/api/appointment";
import { useMeQuery } from "@/api/auth";
import { useRandomDoctorsQuery } from "@/api/doctor";
import {
  HighlightedAppointmentCard,
  HighlightedAppointmentEmpty,
  HighlightedAppointmentError,
  HighlightedAppointmentSkeleton,
} from "@/components/appointment/highlighted-appointment-card";
import { DoctorCard } from "@/components/doctor/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { ArrowRightIcon, BotIcon, SearchIcon } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function HomePage() {
  return (
    <ScrollView className="px-6">
      <Greeting />
      <View className="flex-row items-center justify-between mt-4 mb-3">
        <Text className="text-lg font-semibold">Upcoming Appointment</Text>
        <Link href="/appointment" className="text-primary text-sm">
          View all
        </Link>
      </View>
      <UpcomingAppointment />
      <Text className="mt-4 mb-3 text-lg font-semibold">Not Feeling Well?</Text>
      <ChatPageLink />
      <Text className="mt-4 mb-3 text-lg font-semibold">Find A Doctor</Text>
      <SearchDoctorInput />
      <RandomDoctors />
    </ScrollView>
  );
}

function Greeting() {
  const { data: me } = useMeQuery();

  if (!me) {
    return null;
  }

  const { text, emoji } = (() => {
    const hour = new Date().getHours();
    if (hour < 6) {
      return { text: "It's late", emoji: "🛏" };
    }
    if (hour < 12) {
      return { text: "Good morning", emoji: "🍞" };
    }
    if (hour < 18) {
      return { text: "Good afternoon", emoji: "☀" };
    }
    return { text: "Good evening", emoji: "🌙" };
  })();

  return (
    <View className="flex-row items-center gap-3 my-2">
      <Link href="/me">
        <Avatar alt="My avatar" className="size-9">
          <AvatarImage source={{ uri: me.avatarUrl ?? undefined }} />
          <AvatarFallback>
            <Muted>{me.nickname?.[0] ?? me.email[0]}</Muted>
          </AvatarFallback>
        </Avatar>
      </Link>
      <Text className="font-medium">
        {text}, {me.nickname || me.email} {emoji}
      </Text>
    </View>
  );
}

function UpcomingAppointment() {
  const {
    data: appointments,
    error,
    isPending,
  } = useAppointmentsInfiniteQuery({
    status: ["normal", "to_be_rescheduled"],
    limit: 1,
  });

  if (isPending) {
    return <HighlightedAppointmentSkeleton />;
  }

  if (error) {
    return <HighlightedAppointmentError message={error.message} />;
  }

  if (!appointments[0]) {
    return <HighlightedAppointmentEmpty />;
  }

  return <HighlightedAppointmentCard appointment={appointments[0]} />;
}

function ChatPageLink() {
  return (
    <Link href="/chat">
      <LinearGradient
        colors={["#0b4f4a", "#009689"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-row items-center gap-3 w-full p-4 rounded-lg overflow-hidden"
      >
        <View className="items-center justify-center size-12 rounded-full bg-background/40">
          <Icon as={BotIcon} size={24} className="text-primary-foreground" />
        </View>
        <View className="mr-auto">
          <Text className="text-primary-foreground text-lg font-medium">
            AI Symptom Evaluation
          </Text>
          <Text className="text-primary-foreground/75 text-sm">
            Chat and get instant guidance
          </Text>
        </View>
        <Icon as={ArrowRightIcon} className="text-primary-foreground" />
      </LinearGradient>
    </Link>
  );
}

function SearchDoctorInput() {
  const [q, setQ] = useState("");

  const router = useRouter();

  const search = () => {
    if (q.length > 0) {
      router.push(`/doctor/search?q=${q}`);
    }
  };

  return (
    <View className="mb-4">
      <Input
        value={q}
        onChangeText={setQ}
        placeholder="Search by name, specialty, keyword..."
        inputMode="search"
        onSubmitEditing={search}
        className="pl-10"
      />
      <View className="absolute left-3 inset-y-0 items-center justify-center">
        <Icon as={SearchIcon} className="text-muted-foreground" />
      </View>
    </View>
  );
}

function RandomDoctors() {
  const { data: doctors, isPending, error } = useRandomDoctorsQuery();

  if (isPending) {
    return (
      <View className="gap-2">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </View>
    );
  }

  if (error) {
    return null;
  }

  return (
    <View className="gap-2">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </View>
  );
}
