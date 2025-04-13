import { useSendOtpMutation } from "@/api/auth";
import { useCreatePatientMutation } from "@/api/patient";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Muted, Small } from "@/components/ui/typography";
import { useCountdown } from "@/hooks/use-countdown";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Link, useRouter } from "expo-router";
import {
  MailCheckIcon,
  MailIcon,
  UserRoundPlusIcon,
} from "lucide-react-native";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { View } from "react-native";
import * as v from "valibot";

const formSchema = v.pipe(
  v.object({
    email: v.pipe(v.string(), v.email("Invalid email format")),
    otp: v.pipe(
      v.string(),
      v.length(6, "OTP should be 6 digits"),
      v.digits("OTP should be 6 digits"),
    ),
    password: v.pipe(
      v.string(),
      v.minLength(
        8,
        "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
      ),
      v.maxLength(
        20,
        "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
      ),
      v.regex(
        /[A-Za-z]/,
        "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
      ),
      v.regex(
        /\d/,
        "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
      ),
      v.regex(
        /[`~!@#$%^&*()\-_=+\[{\]}\\|;:'",<.>\/?]/,
        "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
      ),
    ),
    confirmPassword: v.string(),
    accepted: v.literal(true as boolean, "Please accept before continuing"),
  }),
  v.forward(
    v.check(({ password, confirmPassword }) => {
      return password === confirmPassword;
    }, "Passwords do not match"),
    ["confirmPassword"],
  ),
);

type FormSchema = v.InferOutput<typeof formSchema>;

export default function RegisterPage() {
  const form = useForm({
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
      accepted: false,
    },
    resolver: valibotResolver(formSchema),
  });

  return (
    <View className="grow justify-center p-6">
      <Text className="mb-1 text-3xl font-bold">Welcome aboard</Text>
      <Muted className="mb-6">Start your journey now on Telemedicine 🚀</Muted>
      <View className="gap-4">
        <FormProvider {...form}>
          <EmailInput />
          <OtpInput />
          <PasswordInput />
          <ConfirmPasswordInput />
          <AcceptCheckbox />
          <RegisterButton />
        </FormProvider>
      </View>
      <Separator className="mt-6 mb-4" />
      <LogInPrompt />
    </View>
  );
}

function EmailInput() {
  return (
    <Controller
      name="email"
      render={({ field, fieldState }) => (
        <View className="gap-1">
          <Label>Email</Label>
          <Input
            {...field}
            onChangeText={field.onChange}
            placeholder="you@example.com"
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
  );
}

function OtpInput() {
  return (
    <Controller
      name="otp"
      render={({ field, fieldState }) => (
        <View className="gap-1">
          <Label>OTP</Label>
          <View className="flex-row gap-2">
            <Input
              {...field}
              onChangeText={field.onChange}
              placeholder="000000"
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              className="grow"
            />
            <SendOtpButton />
          </View>
          {fieldState.error && (
            <Small className="text-destructive">
              {fieldState.error.message}
            </Small>
          )}
        </View>
      )}
    />
  );
}

function SendOtpButton() {
  const { watch } = useFormContext<FormSchema>();
  const email = watch("email");
  const { success: emailValid } = v.safeParse(formSchema.entries.email, email);

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

function PasswordInput() {
  return (
    <Controller
      name="password"
      render={({ field, fieldState }) => (
        <View className="gap-1">
          <Label>Password</Label>
          <Input
            {...field}
            onChangeText={field.onChange}
            placeholder="8-20 characters"
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
  );
}

function ConfirmPasswordInput() {
  return (
    <Controller
      name="confirmPassword"
      render={({ field, fieldState }) => (
        <View className="gap-1">
          <Label>Confirm password</Label>
          <Input
            {...field}
            onChangeText={field.onChange}
            placeholder="Type password again"
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
  );
}

function AcceptCheckbox() {
  return (
    <Controller
      name="accepted"
      render={({ field, fieldState }) => (
        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            <Checkbox
              {...field}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label>
              I accept&nbsp;
              <Link href="/terms" className="text-primary">
                Terms of Service
              </Link>
              &nbsp;and&nbsp;
              <Link href="/privacy" className="text-primary">
                Privacy Policy
              </Link>
            </Label>
          </View>
          {fieldState.error && (
            <Small className="text-destructive">
              {fieldState.error.message}
            </Small>
          )}
        </View>
      )}
    />
  );
}

function RegisterButton() {
  const { handleSubmit } = useFormContext<FormSchema>();

  const { mutate, isPending } = useCreatePatientMutation();

  const router = useRouter();

  const register = handleSubmit((variables) => {
    const { email, password, otp } = variables;
    mutate(
      { email, password, otp },
      {
        onSuccess: () => {
          router.navigate("/");
        },
      },
    );
  });

  return (
    <Button disabled={isPending} onPress={register}>
      {isPending ? <Spinner /> : <Icon as={UserRoundPlusIcon} />}
      <Text>Register</Text>
    </Button>
  );
}

function LogInPrompt() {
  return (
    <Text className="text-center">
      Already have an account?&nbsp;
      <Link href="/login" className="text-primary">
        Log in
      </Link>
    </Text>
  );
}
