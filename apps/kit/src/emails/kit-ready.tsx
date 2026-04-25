import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface KitReadyEmailProps {
  kitName: string;
  kitUrl: string;
  previewUrl?: string;
}

export const kitReadySubject = "Tu brand kit está listo";

export function KitReadyEmail({
  kitName,
  kitUrl,
  previewUrl,
}: KitReadyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{kitReadySubject}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>{kitReadySubject}</Heading>
          <Text style={text}>
            {kitName} ya tiene logo, variaciones, moodboard y bento listos.
          </Text>
          {previewUrl ? (
            <Section>
              <Img
                alt={kitName}
                height="360"
                src={previewUrl}
                style={image}
                width="480"
              />
            </Section>
          ) : null}
          <Button href={kitUrl} style={button}>
            View kit
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#0c0c0b",
  color: "#f4f1e8",
  fontFamily: "Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "32px 20px",
  width: "560px",
};

const heading = {
  color: "#f4f1e8",
  fontSize: "28px",
  lineHeight: "36px",
};

const text = {
  color: "#d6d0c7",
  fontSize: "16px",
  lineHeight: "24px",
};

const image = {
  border: "1px solid #2b2925",
  borderRadius: "8px",
  objectFit: "cover" as const,
};

const button = {
  backgroundColor: "#d8ff5f",
  borderRadius: "6px",
  color: "#10110a",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: 700,
  marginTop: "24px",
  padding: "12px 18px",
  textDecoration: "none",
};
