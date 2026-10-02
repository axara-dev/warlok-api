import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text
} from "react-email";
import * as React from "react";

interface WhitelistInviteEmailProps {
  authUrl: string;
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

const darkModeCss = `
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  @media (prefers-color-scheme: dark) {
    .email-body { background-color: #0a0a0a !important; }
    .email-card { background-color: #171717 !important; border-color: #262626 !important; }
    .email-text { color: #fafafa !important; }
    .email-muted { color: #a3a3a3 !important; }
    .email-button { background-color: #fafafa !important; color: #0a0a0a !important; }
    .email-hr { border-color: #262626 !important; }
  }
`;

export default function WhitelistInviteEmail({
  authUrl
}: WhitelistInviteEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{darkModeCss}</style>
      </Head>
      <Preview>You&apos;re invited to Warlok</Preview>
      <Body className="email-body" style={body}>
        <Container style={container}>
          <Section className="email-card" style={card}>
            <Text className="email-text" style={logo}>
              Warlok
            </Text>

            <Text className="email-text" style={heading}>
              You&apos;re invited
            </Text>

            <Text className="email-muted" style={paragraph}>
              Thanks for joining the whitelist. Your spot is ready. Sign in with
              this email address to get early access to Warlok.
            </Text>

            <Section style={buttonWrapper}>
              <Button className="email-button" href={authUrl} style={button}>
                Get started
              </Button>
            </Section>

            <Text className="email-muted" style={paragraph}>
              Use the same email address this message was sent to. Invitations
              are tied to that address.
            </Text>

            <Hr className="email-hr" style={hr} />

            <Text className="email-muted" style={note}>
              If you didn&apos;t sign up for the Warlok whitelist, you can
              safely ignore this email.
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

WhitelistInviteEmail.PreviewProps = {
  authUrl: "http://example.com"
} satisfies WhitelistInviteEmailProps;

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

const buttonWrapper: React.CSSProperties = {
  margin: "0 0 24px",
  textAlign: "center"
};

const button: React.CSSProperties = {
  backgroundColor: colors.foreground,
  color: colors.background,
  borderRadius: "8px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block"
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
