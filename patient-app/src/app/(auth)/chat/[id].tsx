import { useSendMessageMutation, useSessionQuery } from "@/api/session";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import type { ChatEvaluation } from "@/utils/types";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useLocalSearchParams } from "expo-router";
import {
  BotIcon,
  CornerDownLeftIcon,
  HistoryIcon,
  RotateCwIcon,
} from "lucide-react-native";
import { type PropsWithChildren, useRef, useState } from "react";
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
      <SendMessageForm />
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
      {session.evaluation && (
        <View className="py-4">
          <EvaluationCard evaluation={session.evaluation} />
        </View>
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

function SendMessageForm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mutate, isPending } = useSendMessageMutation(id);

  const [content, setContent] = useState("");

  const sendMessage = () => {
    mutate({ content });
    setContent("");
  };

  return (
    <View className="gap-2">
      {isPending && (
        <View className="self-center">
          <Muted className="text-sm">Assistant is thinking...</Muted>
        </View>
      )}
      <View className="flex-row items-center gap-2 px-6 pb-2">
        <Input
          value={content}
          onChangeText={setContent}
          placeholder="Ask the assistant..."
          className="grow"
        />
        <Button
          variant="secondary"
          size="icon"
          onPress={sendMessage}
          disabled={!content || isPending}
        >
          <Icon as={CornerDownLeftIcon} size={18} />
        </Button>
      </View>
    </View>
  );
}

function EvaluationCard({ evaluation }: { evaluation: ChatEvaluation }) {
  return (
    <LinearGradient
      colors={["#f0fdfa", "#cbfbf1"]}
      className="gap-3 p-5 rounded-md border border-teal-100/50 overflow-hidden"
    >
      <Text className="text-lg font-bold">🩺&nbsp;&nbsp;Evaluation Result</Text>
      <View className="gap-1">
        <Text className="font-medium">💊&nbsp;&nbsp;Symptom</Text>
        <Text>{evaluation.symptom}</Text>
      </View>
      <View className="gap-1">
        <Text className="font-medium">🚨&nbsp;&nbsp;Urgency</Text>
        <Text>{translateUrgency(evaluation.urgency)}</Text>
      </View>
      <View className="gap-1">
        <Text className="font-medium">🔎&nbsp;&nbsp;Suggestion</Text>
        <Text className="leading-snug">{evaluation.suggestion}</Text>
      </View>
    </LinearGradient>
  );
}

function translateUrgency(urgency: number) {
  switch (urgency) {
    case 1:
      return "Critical";
    case 2:
      return "Urgent";
    case 3:
      return "Minor";
    default:
      return "Unknown";
  }
}
