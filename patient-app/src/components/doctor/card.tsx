import type { Doctor } from "@/utils/types";
import { Link } from "expo-router";
import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
import { Muted } from "../ui/typography";

export function DoctorCard({
  doctor,
}: { doctor: Omit<Doctor, "role" | "email"> }) {
  return (
    <Link href={{ pathname: "/doctor/[id]", params: { id: doctor.id } }}>
      <View className="flex-row items-center gap-3 w-full p-4 border border-border/50 rounded-lg">
        <Avatar
          alt={`Dr. ${doctor.firstName} ${doctor.lastName}'s profile photo`}
        >
          <AvatarImage source={{ uri: doctor.avatarUrl ?? undefined }} />
          <AvatarFallback>
            <Muted>
              {doctor.firstName[0]}
              {doctor.lastName[0]}
            </Muted>
          </AvatarFallback>
        </Avatar>
        <View>
          <Text className="font-semibold">
            {doctor.firstName} {doctor.lastName}
          </Text>
          <Muted className="text-sm">{doctor.specialties.join(", ")}</Muted>
        </View>
      </View>
    </Link>
  );
}
