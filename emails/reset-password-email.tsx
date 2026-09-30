import { Button, Hr, Text } from "react-email";
import * as React from "react";

import { EmailLayout } from "./email-layout";

interface ResetPasswordEmailProps {
  url: string;
}

export default function ResetPasswordEmail({ url }: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Reset your Warlok password">
      <Text className="email-heading" style={heading}>
        Reset your password
      </Text>

      <Text className="email-text" style={paragraph}>
        We received a request to reset the password for your Warlok account.
        Click the button below to choose a new password.
      </Text>

      <Button href={url} style={button}>
        Reset password
      </Button>

      <Text className="email-text" style={paragraph}>
        If you didn&apos;t request a password reset, you can safely ignore this
        email. Your password will remain unchanged.
      </Text>

      <Hr className="email-divider" style={divider} />

      <Text className="email-muted" style={muted}>
        If the button above doesn&apos;t work, copy and paste the following URL
        into your browser:
      </Text>

      <Text className="email-url" style={urlText}>
        {url}
      </Text>
    </EmailLayout>
  );
}

const heading = {
  margin: "0 0 16px",
  color: "#111111",
  fontSize: "24px",
  lineHeight: "32px",
  fontWeight: "600",
  letterSpacing: "-0.5px"
};

const paragraph = {
  margin: "0 0 24px",
  color: "#666666",
  fontSize: "14px",
  lineHeight: "24px"
};

const button = {
  display: "inline-block",
  marginBottom: "24px",
  padding: "12px 20px",
  backgroundColor: "#111111",
  color: "#ffffff",
  borderRadius: "6px",
  fontSize: "14px",
  lineHeight: "20px",
  fontWeight: "600",
  textDecoration: "none"
};

const divider = {
  margin: "32px 0 24px",
  borderColor: "#eeeeee"
};

const muted = {
  margin: "0 0 12px",
  color: "#999999",
  fontSize: "12px",
  lineHeight: "18px"
};

const urlText = {
  margin: "0",
  color: "#666666",
  fontSize: "12px",
  lineHeight: "18px",
  wordBreak: "break-all" as const
};
