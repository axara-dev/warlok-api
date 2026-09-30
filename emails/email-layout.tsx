import {
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text
} from "react-email";
import * as React from "react";

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <style>{`
          @media (prefers-color-scheme: dark) {
            .email-body {
              background-color: #000000 !important;
            }

            .email-container {
              background-color: #111111 !important;
              border-color: #222222 !important;
            }

            .email-brand {
              color: #ffffff !important;
            }

            .email-heading {
              color: #f5f5f5 !important;
            }

            .email-text {
              color: #a1a1aa !important;
            }

            .email-muted {
              color: #71717a !important;
            }

            .email-url {
              color: #d4d4d8 !important;
            }

            .email-divider {
              border-color: #27272a !important;
            }
          }
        `}</style>
      </Head>

      <Preview>{preview}</Preview>

      <Section className="email-body" style={main}>
        <Container className="email-container" style={container}>
          <Text className="email-brand" style={brand}>
            Warlok
          </Text>

          {children}

          <Text className="email-muted" style={footer}>
            © {new Date().getFullYear()} Warlok. All rights reserved.
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: "#f5f5f5",
  padding: "48px 16px"
};

const container = {
  width: "100%",
  maxWidth: "480px",
  margin: "0 auto",
  padding: "40px",
  backgroundColor: "#ffffff",
  border: "1px solid #eaeaea",
  borderRadius: "8px"
};

const brand = {
  margin: "0 0 40px",
  color: "#111111",
  fontSize: "20px",
  lineHeight: "28px",
  fontWeight: "600",
  letterSpacing: "-0.5px"
};

const footer = {
  margin: "32px 0 0",
  color: "#999999",
  fontSize: "12px",
  lineHeight: "18px"
};
