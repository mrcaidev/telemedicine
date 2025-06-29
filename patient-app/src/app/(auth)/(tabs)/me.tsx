import { useLogOutMutation, useMeQuery } from "@/api/auth";
import { Spinner } from "@/components/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { Link, useRouter } from "expo-router";
import {
  CodeXmlIcon,
  ExternalLinkIcon,
  LifeBuoyIcon,
  LogOutIcon,
  type LucideIcon,
  SettingsIcon,
  ShieldIcon,
} from "lucide-react-native";
import type { ComponentProps } from "react";
import { View } from "react-native";

export default function MePage() {
  const { data: me } = useMeQuery();

  if (!me) {
    return null;
  }

  return (
    <View className="mx-6 mt-24">
      <View className="flex-row items-center gap-4 mx-3">
        <Avatar alt="My profile photo" className="size-16">
          <AvatarImage source={{ uri: me.avatarUrl ?? undefined }} />
          <AvatarFallback>
            <Muted className="text-2xl">
              {(me.nickname?.[0] ?? me.email[0])?.toUpperCase()}
            </Muted>
          </AvatarFallback>
        </Avatar>
        <View className="gap-1">
          <Text className="text-xl font-bold line-clamp-1">
            {me.nickname ?? "Anonymous user"}
          </Text>
          <Muted className="line-clamp-1">{me.email}</Muted>
        </View>
      </View>
      <Separator className="my-4" />
      <ButtonLink href="/settings" icon={SettingsIcon}>
        Settings
      </ButtonLink>
      <ButtonLink href="/privacy" icon={ShieldIcon}>
        Privacy Policy
      </ButtonLink>
      <ButtonLink
        href="https://github.com/mrcaidev/telemedicine/issues"
        icon={LifeBuoyIcon}
      >
        Support
      </ButtonLink>
      <ButtonLink
        href="https://github.com/mrcaidev/telemedicine"
        icon={CodeXmlIcon}
      >
        Source Code
      </ButtonLink>
      <Separator className="my-4" />
      <LogOutButton />
    </View>
  );
}

function ButtonLink({
  icon,
  children,
  ...props
}: ComponentProps<typeof Link> & { icon: LucideIcon }) {
  return (
    <Link {...props} asChild>
      <Button variant="ghost" className="justify-start">
        <Icon as={icon} />
        <Text>{children}</Text>
        {props.href.toString().startsWith("/") || (
          <Icon as={ExternalLinkIcon} />
        )}
      </Button>
    </Link>
  );
}

function LogOutButton() {
  const { mutate, isPending } = useLogOutMutation();

  const router = useRouter();

  const logOut = () => {
    mutate(undefined, {
      onSuccess: () => {
        router.replace("/login");
      },
    });
  };

  return (
    <Button variant="secondary" onPress={logOut} disabled={isPending}>
      {isPending ? <Spinner /> : <Icon as={LogOutIcon} />}
      <Text>Log Out</Text>
    </Button>
  );
}
