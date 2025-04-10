import { useForm } from "@tanstack/react-form";
import { Link } from "expo-router";
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

export default function RegisterPage() {
  const { Field, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
      accepted: false,
    },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  const theme = useTheme();

  return (
    <View style={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ marginBottom: 8, fontSize: 28, fontWeight: "bold" }}>
        Welcome aboard
      </Text>
      <Text style={{ marginBottom: 20 }}>
        Start your journey now on Telemedicine 🚀
      </Text>
      <Field
        name="email"
        validators={{
          onSubmit: v.pipe(v.string(), v.email("Invalid email format")),
        }}
      >
        {(field) => (
          <View>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.length > 0}
              mode="outlined"
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            {field.state.meta.errors[0] ? (
              <HelperText type="error" padding="none">
                {field.state.meta.errors[0].message}
              </HelperText>
            ) : (
              <View style={{ height: 8 }} />
            )}
          </View>
        )}
      </Field>
      <Field
        name="otp"
        validators={{
          onSubmit: v.pipe(
            v.string(),
            v.digits("OTP should be 6 digits"),
            v.length(6, "OTP should be 6 digits"),
          ),
        }}
      >
        {(field) => (
          <View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                error={field.state.meta.errors.length > 0}
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
            {field.state.meta.errors[0] ? (
              <HelperText type="error" padding="none">
                {field.state.meta.errors[0].message}
              </HelperText>
            ) : (
              <View style={{ height: 8 }} />
            )}
          </View>
        )}
      </Field>
      <Field
        name="password"
        validators={{
          onSubmit: v.pipe(
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
        }}
      >
        {(field) => (
          <View>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.length > 0}
              mode="outlined"
              label="Password"
              placeholder="8-20 characters"
              textContentType="newPassword"
              secureTextEntry
            />
            {field.state.meta.errors[0] ? (
              <HelperText type="error" padding="none">
                {field.state.meta.errors[0].message}
              </HelperText>
            ) : (
              <View style={{ height: 8 }} />
            )}
          </View>
        )}
      </Field>
      <Field
        name="confirmPassword"
        validators={{
          onSubmit: ({ value, fieldApi: { form } }) => {
            if (value !== form.getFieldValue("password")) {
              return new Error("Passwords do not match");
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <View>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.length > 0}
              mode="outlined"
              label="Confirm password"
              placeholder="Type password again"
              textContentType="password"
              secureTextEntry
            />
            {field.state.meta.errors[0] ? (
              <HelperText type="error" padding="none">
                {field.state.meta.errors[0].message}
              </HelperText>
            ) : (
              <View style={{ height: 8 }} />
            )}
          </View>
        )}
      </Field>
      <Field
        name="accepted"
        validators={{
          onSubmit: v.literal(true, "Please accept before continuing"),
        }}
      >
        {(field) => (
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                status={field.state.value ? "checked" : "unchecked"}
                onPress={() => field.setValue((checked) => !checked)}
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
            {field.state.meta.errors[0] ? (
              <HelperText type="error" padding="none">
                {field.state.meta.errors[0].message}
              </HelperText>
            ) : (
              <View style={{ height: 8 }} />
            )}
          </View>
        )}
      </Field>
      <Button mode="contained" icon="account-plus" onPress={handleSubmit}>
        Register
      </Button>
      <Divider style={{ marginTop: 24, marginBottom: 16 }} />
      <View style={{ alignItems: "center" }}>
        <Text>
          Already have an account?&nbsp;
          <Link href="/login" style={{ color: theme.colors.primary }}>
            Log in
          </Link>
        </Text>
      </View>
    </View>
  );
}

function SendOtpButton() {
  return (
    <Button
      mode="outlined"
      icon="send"
      contentStyle={{ paddingVertical: 4 }}
      style={{ borderRadius: 4 }}
    >
      Send
    </Button>
  );
}
