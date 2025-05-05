import { useAppointmentsInfiniteQuery } from "@/api/appointment";
import { useMeQuery } from "@/api/auth";
import {
  HighlightedAppointmentCard,
  HighlightedAppointmentEmpty,
  HighlightedAppointmentError,
  HighlightedAppointmentSkeleton,
} from "@/components/appointment/highlighted-appointment-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { ArrowRightIcon, BotIcon } from "lucide-react-native";
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
  } = useAppointmentsInfiniteQuery({ limit: 1 });

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
