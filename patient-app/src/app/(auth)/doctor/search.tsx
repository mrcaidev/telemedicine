import { useDoctorSearchQuery } from "@/api/doctor";
import { DoctorCard } from "@/components/doctor/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RotateCwIcon, SearchIcon } from "lucide-react-native";
import { useState } from "react";
import { FlatList, View } from "react-native";

export default function DoctorSearchPage() {
  return (
    <View className="grow max-h-screen px-6">
      <Text className="pt-2 pb-4 text-2xl font-bold">Search Result</Text>
      <SearchDoctorInput />
      <Doctors />
    </View>
  );
}

function SearchDoctorInput() {
  const { q: defaultQ = "" } = useLocalSearchParams<{ q?: string }>();
  const [q, setQ] = useState(defaultQ);

  const router = useRouter();

  const search = () => {
    if (q.length > 0) {
      router.push(`/doctor/search?q=${q}`);
    }
  };

  return (
    <View className="mb-3">
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

function Doctors() {
  const { q = "" } = useLocalSearchParams<{ q?: string }>();
  const {
    data: doctors,
    isPending,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useDoctorSearchQuery(q);

  if (isPending) {
    return (
      <View className="gap-2">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="grow items-center justify-center gap-2">
        <Muted className="max-w-xs text-center">
          Something went wrong when we are searching for doctors. Please try
          again.
        </Muted>
        <Button
          variant="link"
          size="sm"
          onPress={() => refetch()}
          disabled={isRefetching}
        >
          <Icon as={RotateCwIcon} />
          <Text>Try again</Text>
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      data={doctors}
      renderItem={({ item }) => <DoctorCard doctor={item} />}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      ListFooterComponent={
        <Muted className="mt-2 text-center text-sm">
          {hasNextPage ? "Loading more for you..." : "- That's all, for now -"}
        </Muted>
      }
      className="grow"
      contentContainerClassName="gap-2 pb-8"
    />
  );
}
