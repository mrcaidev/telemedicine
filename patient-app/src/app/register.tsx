import { useSendOtpMutation } from "@/api/auth";
import { useCountdown } from "@/hooks/use-countdown";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Link } from "expo-router";
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
        /[`~!@#$%^&*()-_=+\[{\]}\\|;:'",<.>\/?]/,
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
  const form = useForm<FormSchema>({
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
    <View style={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ marginBottom: 8, fontSize: 28, fontWeight: "bold" }}>
        Welcome aboard
      </Text>
      <Text style={{ marginBottom: 20 }}>
        Start your journey now on Telemedicine 🚀
      </Text>
      <FormProvider {...form}>
        <EmailInput />
        <OtpInput />
        <PasswordInput />
        <ConfirmPasswordInput />
        <AcceptCheckbox />
        <SubmitButton />
      </FormProvider>
      <Divider style={{ marginTop: 24, marginBottom: 16 }} />
      <LogInPrompt />
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

function OtpInput() {
  const { control } = useFormContext<FormSchema>();

  return (
    <Controller
      control={control}
      name="otp"
      render={({ field, fieldState }) => (
        <View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              {...field}
              onChangeText={field.onChange}
              error={fieldState.invalid}
              mode="outlined"
              label="OTP"
              placeholder="6 digits"
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              style={{ flexGrow: 1 }}
            />
            <View style={{ marginTop: 6 }}>
              <SendOtpButton />
            </View>
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

function SendOtpButton() {
  const { watch } = useFormContext<FormSchema>();
  const email = watch("email");
  const { success: emailValid } = v.safeParse(formSchema.entries.email, email);

  const { mutate, isPending } = useSendOtpMutation();

  const { countdown, isCounting, start } = useCountdown(60);

  const sendOtp = () => {
    mutate(email, {
      onSuccess: () => {
        start();
      },
    });
  };

  return (
    <Button
      mode="outlined"
      icon={isCounting ? "email-check" : "send"}
      loading={isPending}
      disabled={!emailValid || isPending || isCounting}
      onPress={sendOtp}
      contentStyle={{ paddingVertical: 4 }}
      style={{ borderRadius: 4 }}
    >
      {isCounting ? `Retry in ${countdown}s` : "Send OTP"}
    </Button>
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
            textContentType="newPassword"
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

function ConfirmPasswordInput() {
  const { control } = useFormContext<FormSchema>();

  return (
    <Controller
      control={control}
      name="confirmPassword"
      render={({ field, fieldState }) => (
        <View>
          <TextInput
            {...field}
            onChangeText={field.onChange}
            error={fieldState.invalid}
            mode="outlined"
            label="Confirm password"
            placeholder="Type password again"
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

function SubmitButton() {
  const { handleSubmit } = useFormContext<FormSchema>();

  return (
    <Button
      mode="contained"
      icon="account-plus"
      onPress={handleSubmit((data) => {
        console.log(data);
      })}
    >
      Register
    </Button>
  );
}

function LogInPrompt() {
  const theme = useTheme();

  return (
    <View style={{ alignItems: "center" }}>
      <Text>
        Already have an account?&nbsp;
        <Link href="/login" style={{ color: theme.colors.primary }}>
          Log in
        </Link>
      </Text>
    </View>
  );
}
