import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text
} from "react-email";
import * as React from "react";

interface SignInEmailOTPProps {
  otp: string;
  expiresInMinutes?: number;
}

const colors = {
  background: "#ffffff",
  foreground: "#0a0a0a",
  muted: "#f5f5f5",
  mutedForeground: "#737373",
  border: "#e5e5e5"
};

const fontSans =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const fontMono =
  "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

const darkModeCss = `
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  @media (prefers-color-scheme: dark) {
    .email-body { background-color: #0a0a0a !important; }
    .email-card { background-color: #171717 !important; border-color: #262626 !important; }
    .email-text { color: #fafafa !important; }
    .email-muted { color: #a3a3a3 !important; }
    .email-code-box { background-color: #262626 !important; border-color: #333333 !important; }
    .email-hr { border-color: #262626 !important; }
  }
`;

export default function SignInEmailOTP({
  otp,
  expiresInMinutes = 10
}: SignInEmailOTPProps) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{darkModeCss}</style>
      </Head>
      <Preview>{`Your Warlok verification code is ${otp}`}</Preview>
      <Body className="email-body" style={body}>
        <Container style={container}>
          <Section className="email-card" style={card}>
            <Text className="email-text" style={logo}>
              Warlok
            </Text>

            <Text className="email-text" style={heading}>
              Your verification code
            </Text>

            <Text className="email-muted" style={paragraph}>
              Enter the code below to sign in to your Warlok account.
            </Text>

            <Section className="email-code-box" style={codeBox}>
              <Text className="email-text" style={code}>
                {otp}
              </Text>
            </Section>

            <Text className="email-muted" style={paragraph}>
              This code expires in {expiresInMinutes} minutes and can only be
              used once.
            </Text>

            <Hr className="email-hr" style={hr} />

            <Text className="email-muted" style={note}>
              If you didn&apos;t request this code, you can safely ignore this
              email. Someone may have entered your email address by mistake.
              Never share this code with anyone.
            </Text>
          </Section>

          <Text className="email-muted" style={footer}>
            &copy; {new Date().getFullYear()} Warlok. This is an automated
            message, please do not reply.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

SignInEmailOTP.PreviewProps = {
  otp: "482916",
  expiresInMinutes: 10
} satisfies SignInEmailOTPProps;

const body: React.CSSProperties = {
  backgroundColor: colors.muted,
  fontFamily: fontSans,
  margin: 0,
  padding: "40px 12px"
};

const container: React.CSSProperties = {
  maxWidth: "480px",
  margin: "0 auto"
};

const card: React.CSSProperties = {
  backgroundColor: colors.background,
  border: `1px solid ${colors.border}`,
  borderRadius: "8px",
  padding: "32px"
};

const logo: React.CSSProperties = {
  margin: "0 0 28px",
  fontSize: "18px",
  lineHeight: "24px",
  fontWeight: 700,
  letterSpacing: "-0.3px",
  color: colors.foreground
};

const heading: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: "22px",
  lineHeight: "28px",
  fontWeight: 600,
  color: colors.foreground
};

const paragraph: React.CSSProperties = {
  margin: "0 0 24px",
  fontSize: "14px",
  lineHeight: "22px",
  color: colors.mutedForeground
};

const codeBox: React.CSSProperties = {
  backgroundColor: colors.muted,
  border: `1px solid ${colors.border}`,
  borderRadius: "8px",
  padding: "20px 12px",
  margin: "0 0 24px",
  textAlign: "center"
};

const code: React.CSSProperties = {
  margin: 0,
  paddingLeft: "10px",
  fontFamily: fontMono,
  fontSize: "32px",
  lineHeight: "40px",
  fontWeight: 700,
  letterSpacing: "10px",
  color: colors.foreground
};

const hr: React.CSSProperties = {
  borderColor: colors.border,
  margin: "0 0 20px"
};

const note: React.CSSProperties = {
  margin: 0,
  fontSize: "12px",
  lineHeight: "20px",
  color: colors.mutedForeground
};

const footer: React.CSSProperties = {
  margin: "20px 0 0",
  fontSize: "12px",
  lineHeight: "18px",
  color: colors.mutedForeground,
  textAlign: "center"
};
