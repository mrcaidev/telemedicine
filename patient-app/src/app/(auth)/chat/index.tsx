import { useActiveSessionQuery, useStartSessionMutation } from "@/api/session";
import { ErrorScreen } from "@/components/error-screen";
import { LoadingScreen } from "@/components/loading-screen";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function ActiveSessionRedirect() {
  const { data, isPending, error } = useActiveSessionQuery();

  const { mutate } = useStartSessionMutation();

  const router = useRouter();

  useEffect(() => {
    // 如果还不知道有没有进行中的会话，就先不创建。
    if (isPending) {
      return;
    }

    // 如果有进行中的会话，就跳转过去。
    if (data?.id) {
      router.replace({ pathname: "/chat/[id]", params: { id: data.id } });
      return;
    }

    // 如果没有进行中的会话，就创建一个，然后跳转过去。
    mutate(undefined, {
      onSuccess: (data) => {
        router.replace({ pathname: "/chat/[id]", params: { id: data.id } });
      },
    });
  }, [isPending, data?.id, router.replace, mutate]);

  if (error) {
    return <ErrorScreen message={error.message} />;
  }

  return <LoadingScreen />;
}
