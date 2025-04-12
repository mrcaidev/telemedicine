import { useLogInWithEmailMutation } from "@/api/auth";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Link, useRouter } from "expo-router";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { View } from "react-native";
import {
  Button,
  Checkbox,
  Divider,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
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

export default function LoginPage() {
  const form = useForm<FormSchema>({
    defaultValues: {
      email: "",
      password: "",
      accepted: false,
    },
    resolver: valibotResolver(formSchema),
  });

  return (
    <View style={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ marginBottom: 8, fontSize: 28, fontWeight: "bold" }}>
        Welcome back
      </Text>
      <Text style={{ marginBottom: 20 }}>
        Log in to your account to continue 👋
      </Text>
      <FormProvider {...form}>
        <EmailInput />
        <PasswordInput />
        <AcceptCheckbox />
        <LogInWithEmailButton />
      </FormProvider>
      <Divider style={{ marginTop: 24, marginBottom: 16 }} />
      <RegisterPrompt />
    </View>
  );
}

function EmailInput() {
  const { control } = useFormContext<FormSchema>();

  return (
    <Controller
      control={control}
      name="email"
      render={({ field, fieldState }) => (
        <View>
          <TextInput
            {...field}
            onChangeText={field.onChange}
            error={fieldState.invalid}
            mode="outlined"
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          {fieldState.error ? (
            <HelperText type="error" padding="none">
              {fieldState.error.message}
            </HelperText>
          ) : (
            <View style={{ height: 8 }} />
          )}
        </View>
      )}
    />
  );
}

function PasswordInput() {
  const { control } = useFormContext<FormSchema>();

  return (
    <Controller
      control={control}
      name="password"
      render={({ field, fieldState }) => (
        <View>
          <TextInput
            {...field}
            onChangeText={field.onChange}
            error={fieldState.invalid}
            mode="outlined"
            label="Password"
            placeholder="8-20 characters"
            textContentType="password"
            secureTextEntry
          />
          {fieldState.error ? (
            <HelperText type="error" padding="none">
              {fieldState.error.message}
            </HelperText>
          ) : (
            <View style={{ height: 8 }} />
          )}
        </View>
      )}
    />
  );
}

function AcceptCheckbox() {
  const { control, setValue } = useFormContext<FormSchema>();

  const theme = useTheme();

  return (
    <Controller
      control={control}
      name="accepted"
      render={({ field, fieldState }) => (
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              status={field.value ? "checked" : "unchecked"}
              onPress={() => setValue("accepted", !field.value)}
            />
            <Text style={{ fontSize: 12 }}>
              I accept&nbsp;
              <Link href="/terms" style={{ color: theme.colors.primary }}>
                Terms of Service
              </Link>
              &nbsp;and&nbsp;
              <Link href="/privacy" style={{ color: theme.colors.primary }}>
                Privacy Policy
              </Link>
            </Text>
          </View>
          {fieldState.error ? (
            <HelperText type="error" padding="none">
              {fieldState.error.message}
            </HelperText>
          ) : (
            <View style={{ height: 8 }} />
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
    <Button
      mode="contained"
      icon="login"
      loading={isPending}
      disabled={isPending}
      onPress={logIn}
    >
      Login
    </Button>
  );
}

function RegisterPrompt() {
  const theme = useTheme();

  return (
    <View style={{ alignItems: "center" }}>
      <Text>
        Doesn&apos;t have an account?&nbsp;
        <Link href="/register" style={{ color: theme.colors.primary }}>
          Register
        </Link>
      </Text>
    </View>
  );
}
