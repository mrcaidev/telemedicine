import {
  useLogOutMutation,
  useMeQuery,
  useSendOtpMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
} from "@/api/auth";
import { useUpdatePatientMutation } from "@/api/patient";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Text } from "@/components/ui/text";
import { Muted, Small } from "@/components/ui/typography";
import { useCountdown } from "@/hooks/use-countdown";
import { bioAuth } from "@/utils/bio-auth";
import { passwordPolicy } from "@/utils/password-policy";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "expo-router";
import {
  EditIcon,
  KeyIcon,
  MailCheckIcon,
  MailIcon,
  TagIcon,
  VenusAndMarsIcon,
} from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import * as v from "valibot";

export default function SettingsPage() {
  return (
    <ScrollView className="grow" contentContainerClassName="px-6 pt-2 pb-8">
      <Text className="text-2xl font-bold">Settings</Text>
      <View className="gap-3 mt-4">
        <Text className="text-xl font-semibold">Profile</Text>
        <NicknameSetting />
        <GenderSetting />
      </View>
      <View className="gap-3 mt-4">
        <Text className="text-xl font-semibold">Account</Text>
        <EmailSetting />
        <PasswordSetting />
      </View>
    </ScrollView>
  );
}

function NicknameSetting() {
  const { data: me } = useMeQuery();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      nickname: me!.nickname ?? "",
    },
    resolver: valibotResolver(
      v.object({
        nickname: v.pipe(
          v.string(),
          v.minLength(2, "Nickname should be 2-20 characters"),
          v.maxLength(20, "Nickname should be 2-20 characters"),
        ),
      }),
    ),
  });

  const { mutate, isPending } = useUpdatePatientMutation();

  const updateNickname = handleSubmit((data) => {
    mutate(data);
  });

  return (
    <View className="gap-3 p-4 border border-border rounded-md">
      <View className="flex-row items-center gap-2">
        <Icon as={TagIcon} />
        <Text className="text-lg font-medium">Nickname</Text>
      </View>
      <Controller
        control={control}
        name="nickname"
        render={({ field, fieldState }) => (
          <View className="gap-1">
            <Input
              {...field}
              onChangeText={field.onChange}
              placeholder="2-20 characters"
              textContentType="nickname"
            />
            {fieldState.error && (
              <Small className="text-destructive">
                {fieldState.error.message}
              </Small>
            )}
          </View>
        )}
      />
      <View className="flex-row items-center justify-between">
        <Muted className="max-w-[180px] text-sm">
          Your preferred display name
        </Muted>
        <Button size="sm" onPress={updateNickname} disabled={isPending}>
          {isPending ? <Spinner size={14} /> : <Icon as={EditIcon} size={14} />}
          <Text>Update</Text>
        </Button>
      </View>
    </View>
  );
}

function GenderSetting() {
  const { data: me } = useMeQuery();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      gender: me!.gender,
    },
    // @ts-ignore
    resolver: valibotResolver(
      v.object({
        gender: v.union([v.literal("male"), v.literal("female")]),
      }),
    ),
  });

  const { mutate, isPending } = useUpdatePatientMutation();

  const updateGender = handleSubmit((data) => {
    mutate(data);
  });

  return (
    <View className="gap-3 p-4 border border-border rounded-md">
      <View className="flex-row items-center gap-2">
        <Icon as={VenusAndMarsIcon} />
        <Text className="text-lg font-medium">Gender</Text>
      </View>
      <Controller
        control={control}
        name="gender"
        render={({ field, fieldState }) => (
          <View className="gap-1">
            {/* @ts-ignore */}
            <RadioGroup
              {...field}
              onValueChange={field.onChange}
              className="flex-row"
            >
              <View className="grow flex-row items-center gap-2">
                <RadioGroupItem value="male" />
                <Label>Male</Label>
              </View>
              <View className="grow flex-row items-center gap-2">
                <RadioGroupItem value="female" />
                <Label>Female</Label>
              </View>
            </RadioGroup>
            {fieldState.error && (
              <Small className="text-destructive">
                {fieldState.error.message}
              </Small>
            )}
          </View>
        )}
      />
      <View className="flex-row items-center justify-between">
        <Muted className="max-w-[180px] text-sm">Your biological sex</Muted>
        <Button size="sm" onPress={updateGender} disabled={isPending}>
          {isPending ? <Spinner size={14} /> : <Icon as={EditIcon} size={14} />}
          <Text>Update</Text>
        </Button>
      </View>
    </View>
  );
}

function EmailSetting() {
  const { data: me } = useMeQuery();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      email: "",
      otp: "",
    },
    resolver: valibotResolver(
      v.object({
        email: v.pipe(
          v.string("Invalid email address"),
          v.email("Invalid email address"),
        ),
        otp: v.pipe(
          v.string(),
          v.length(6, "OTP should be 6 digits"),
          v.digits("OTP should be 6 digits"),
        ),
      }),
    ),
  });
  const email = watch("email");

  const { mutate: updateEmailMutate, isPending: isMutatingEmail } =
    useUpdateEmailMutation();
  const { mutate: logOutMutate, isPending: isLoggingOut } = useLogOutMutation();
  const isPending = isMutatingEmail || isLoggingOut;

  const router = useRouter();

  const updateEmail = handleSubmit(async (data) => {
    const passed = await bioAuth();

    if (!passed) {
      return;
    }

    updateEmailMutate(data, {
      onSuccess: () => {
        logOutMutate(undefined, {
          onSuccess: () => {
            router.navigate("/login");
          },
        });
      },
    });
  });

  return (
    <View className="gap-3 p-4 border border-border rounded-md">
      <View className="flex-row items-center gap-2">
        <Icon as={MailIcon} />
        <Text className="text-lg font-medium">Email</Text>
      </View>
      <Input value={me!.email} editable={false} />
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <View className="gap-1">
            <Input
              {...field}
              onChangeText={field.onChange}
              placeholder="New email address"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            {fieldState.error && (
              <Small className="text-destructive">
                {fieldState.error.message}
              </Small>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="otp"
        render={({ field, fieldState }) => (
          <View className="gap-1">
            <View className="flex-row gap-2">
              <Input
                {...field}
                onChangeText={field.onChange}
                placeholder="6-digit OTP"
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                className="grow"
              />
              <SendOtpButton email={email} />
            </View>
            {fieldState.error && (
              <Small className="text-destructive">
                {fieldState.error.message}
              </Small>
            )}
          </View>
        )}
      />
      <View className="flex-row items-center justify-between">
        <Muted className="max-w-[180px] text-sm">
          Login credential and notification
        </Muted>
        <Button size="sm" onPress={updateEmail} disabled={isPending}>
          {isPending ? <Spinner size={14} /> : <Icon as={EditIcon} size={14} />}
          <Text>Update</Text>
        </Button>
      </View>
    </View>
  );
}

function SendOtpButton({ email }: { email: string }) {
  const { success: emailValid } = v.safeParse(
    v.pipe(v.string(), v.email()),
    email,
  );

  const { mutate, isPending } = useSendOtpMutation();

  const { countdown, isCounting, start } = useCountdown(60);

  const sendOtp = () => {
    mutate(
      { email },
      {
        onSuccess: () => {
          start();
        },
      },
    );
  };

  return (
    <Button
      variant="outline"
      disabled={!emailValid || isPending || isCounting}
      onPress={sendOtp}
    >
      {isPending ? (
        <Spinner />
      ) : isCounting ? (
        <Icon as={MailCheckIcon} />
      ) : (
        <Icon as={MailIcon} />
      )}
      <Text>{isCounting ? `Retry in ${countdown}s` : "Send OTP"}</Text>
    </Button>
  );
}

function PasswordSetting() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: valibotResolver(
      v.pipe(
        v.object({
          oldPassword: passwordPolicy,
          newPassword: passwordPolicy,
          confirmPassword: v.string(),
        }),
        v.forward(
          v.check(({ newPassword, confirmPassword }) => {
            return newPassword === confirmPassword;
          }, "Passwords do not match"),
          ["confirmPassword"],
        ),
      ),
    ),
  });

  const { mutate, isPending } = useUpdatePasswordMutation();

  const updatePassword = handleSubmit(async ({ confirmPassword, ...data }) => {
    const passed = await bioAuth();

    if (!passed) {
      return;
    }

    mutate(data);
  });

  return (
    <View className="gap-3 p-4 border border-border rounded-md">
      <View className="flex-row items-center gap-2">
        <Icon as={KeyIcon} />
        <Text className="text-lg font-medium">Password</Text>
      </View>
      <Controller
        control={control}
        name="oldPassword"
        render={({ field, fieldState }) => (
          <View className="gap-1">
            <Input
              {...field}
              onChangeText={field.onChange}
              placeholder="Old password"
              textContentType="password"
              secureTextEntry
            />
            {fieldState.error && (
              <Small className="text-destructive">
                {fieldState.error.message}
              </Small>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="newPassword"
        render={({ field, fieldState }) => (
          <View className="gap-1">
            <Input
              {...field}
              onChangeText={field.onChange}
              placeholder="New password"
              textContentType="newPassword"
              secureTextEntry
            />
            {fieldState.error && (
              <Small className="text-destructive">
                {fieldState.error.message}
              </Small>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <View className="gap-1">
            <Input
              {...field}
              onChangeText={field.onChange}
              placeholder="Type new password again"
              textContentType="password"
              secureTextEntry
            />
            {fieldState.error && (
              <Small className="text-destructive">
                {fieldState.error.message}
              </Small>
            )}
          </View>
        )}
      />
      <View className="flex-row items-center justify-between">
        <Muted className="max-w-[180px] text-sm">Login credential</Muted>
        <Button size="sm" onPress={updatePassword} disabled={isPending}>
          {isPending ? <Spinner size={14} /> : <Icon as={EditIcon} size={14} />}
          <Text>Update</Text>
        </Button>
      </View>
    </View>
  );
}
