import { useSessionQuery } from "@/api/session";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { Link, useLocalSearchParams } from "expo-router";
import {
  BotIcon,
  CornerDownLeftIcon,
  HistoryIcon,
  RotateCwIcon,
} from "lucide-react-native";
import { type PropsWithChildren, useRef } from "react";
import { ScrollView, View } from "react-native";

export default function ChatSessionPage() {
  return (
    <View className="grow max-h-screen">
      <View className="flex-row items-center justify-between gap-3 px-6 pb-3 border-b border-border">
        <View className="items-center justify-center size-10 rounded-full bg-primary">
          <Icon as={BotIcon} size={20} className="text-primary-foreground" />
        </View>
        <View>
          <Text className="font-medium leading-tight">Smart Assistant</Text>
          <Text className="text-muted-foreground text-sm">
            Get instant medical guidance
          </Text>
        </View>
        <View className="ml-auto">
          <Link href="/chat/history">
            <Icon as={HistoryIcon} size={18} />
          </Link>
        </View>
      </View>
      <ChatInterface />
      <View className="flex-row items-center gap-2 px-6 pb-2">
        <Input placeholder="I don't feel well today..." className="grow" />
        <Button variant="secondary" size="icon">
          <Icon as={CornerDownLeftIcon} size={18} />
        </Button>
      </View>
    </View>
  );
}

function ChatInterface() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: session,
    isPending,
    error,
    refetch,
    isRefetching,
  } = useSessionQuery(id);

  const scrollViewRef = useRef<ScrollView>(null);

  if (isPending) {
    return (
      <View className="grow px-6 py-4">
        <View className="flex-row justify-end py-1.5">
          <Skeleton className="w-3/5 h-12 rounded-md" />
        </View>
        <View className="flex-row justify-start py-1.5">
          <Skeleton className="w-4/5 h-28 rounded-md" />
        </View>
        <View className="flex-row justify-end py-1.5">
          <Skeleton className="w-1/2 h-12 rounded-md" />
        </View>
        <View className="flex-row justify-start py-1.5">
          <Skeleton className="w-4/5 h-20 rounded-md" />
        </View>
        <View className="flex-row justify-end py-1.5">
          <Skeleton className="w-4/5 h-20 rounded-md" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="grow items-center justify-center gap-2">
        <Muted className="max-w-xs text-center">
          We failed to retrieve your chat messages. Don't worry, they are not
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
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }}
      className="grow"
      contentContainerClassName="px-6 py-4"
    >
      {session.history.map((message, index) =>
        message.role === "user" ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: no other way
          <UserMessage key={index}>{message.content}</UserMessage>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: no other way
          <AssistantMessage key={index}>{message.content}</AssistantMessage>
        ),
      )}
    </ScrollView>
  );
}

function UserMessage({ children }: PropsWithChildren) {
  return (
    <View className="flex-row justify-end py-1.5">
      <View className="max-w-[80%] px-4 py-3 rounded-md bg-primary">
        <Text className="text-primary-foreground leading-snug">{children}</Text>
      </View>
    </View>
  );
}

function AssistantMessage({ children }: PropsWithChildren) {
  return (
    <View className="flex-row justify-start py-1.5">
      <View className="max-w-[80%] px-4 py-3 rounded-md bg-secondary">
        <Text className="text-secondary-foreground leading-snug">
          {children}
        </Text>
      </View>
    </View>
  );
}
