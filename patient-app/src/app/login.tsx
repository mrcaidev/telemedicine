import { useLogInWithEmailMutation } from "@/api/auth";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Small } from "@/components/ui/typography";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Link, useRouter } from "expo-router";
import { LogInIcon } from "lucide-react-native";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { View } from "react-native";
import * as v from "valibot";

const formSchema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email format")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Password should be 8-20 characters long"),
    v.maxLength(20, "Password should be 8-20 characters long"),
  ),
  accepted: v.literal(true as boolean, "Please accept before continuing"),
});

type FormSchema = v.InferOutput<typeof formSchema>;

export default function LogInPage() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      accepted: false,
    },
    resolver: valibotResolver(formSchema),
  });

  return (
    <View className="grow justify-center p-6">
      <Text className="mb-1 text-3xl font-bold">Welcome back</Text>
      <Text className="mb-6">Log in to your account to continue 👋</Text>
      <View className="gap-4">
        <FormProvider {...form}>
          <EmailInput />
          <PasswordInput />
          <AcceptCheckbox />
          <LogInWithEmailButton />
        </FormProvider>
      </View>
      <RegisterPrompt />
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

function LogInWithEmailButton() {
  const { handleSubmit } = useFormContext<FormSchema>();

  const { mutate, isPending } = useLogInWithEmailMutation();

  const router = useRouter();

  const logIn = handleSubmit((variables) => {
    mutate(variables, {
      onSuccess: () => {
        router.navigate("/");
      },
    });
  });

  return (
    <Button disabled={isPending} onPress={logIn}>
      {isPending ? <Spinner /> : <Icon as={LogInIcon} />}
      <Text>Log in</Text>
    </Button>
  );
}

function RegisterPrompt() {
  return (
    <Text className="mt-4 text-center">
      Doesn&apos;t have an account?&nbsp;
      <Link href="/register" className="text-primary">
        Register
      </Link>
    </Text>
  );
}
