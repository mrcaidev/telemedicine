import { useSessionsQuery } from "@/api/session";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Large, Muted } from "@/components/ui/typography";
import type { ChatSession } from "@/utils/types";
import dayjs from "dayjs";
import { Link } from "expo-router";
import {
  CircleCheckBigIcon,
  RotateCwIcon,
  StethoscopeIcon,
} from "lucide-react-native";
import { FlatList, View } from "react-native";

export default function ChatHistoryPage() {
  return (
    <View className="grow max-h-screen">
      <View className="gap-1 px-6 pt-2 pb-4">
        <Text className="text-2xl font-bold">Chat History</Text>
        <Muted>All your previous chat sessions</Muted>
      </View>
      <ChatHistoryList />
    </View>
  );
}

function ChatHistoryList() {
  const { data, isPending, error, refetch, isRefetching } = useSessionsQuery();

  if (isPending) {
    return (
      <View className="gap-2 px-6">
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
          We failed to retrieve your chat history. Don't worry, they are not
          lost!
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
      data={data}
      renderItem={({ item }) => <ChatHistoryItem session={item} />}
      ItemSeparatorComponent={Separator}
      contentContainerClassName="px-6 pb-8"
    />
  );
}

function ChatHistoryItem({
  session,
}: { session: Omit<ChatSession, "history"> }) {
  const createdAtDayjs = dayjs(session.createdAt);

  return (
    <Link href={{ pathname: "/chat/[id]", params: { id: session.id } }}>
      <View className="flex-row items-center justify-between w-full py-3">
        <View>
          <Large className="font-medium">{createdAtDayjs.format("LL")}</Large>
          <Muted>{createdAtDayjs.format("LT")}</Muted>
        </View>
        <View className="flex-row items-center gap-2">
          <Text
            className={
              session.evaluation ? "text-primary" : "text-muted-foreground"
            }
          >
            {session.evaluation ? "Evaluated" : "Ongoing"}
          </Text>
          <Icon
            as={session.evaluation ? CircleCheckBigIcon : StethoscopeIcon}
            size={14}
            className={
              session.evaluation ? "text-primary" : "text-muted-foreground"
            }
          />
        </View>
      </View>
    </Link>
  );
}
