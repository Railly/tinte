import * as React from "react";

interface SubscribedEmailProps {
  firstName: string;
  productName: string;
  unsubscribeLink: string;
}

export const SubscribedEmail: React.FC<Readonly<SubscribedEmailProps>> = ({
  firstName,
  productName,
  unsubscribeLink,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      lineHeight: "1.6",
      color: "#333",
    }}
  >
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{ backgroundColor: "#f5f5f5", padding: "20px" }}
    >
      <tr>
        <td>
          <table
            width="600"
            align="center"
            cellPadding="0"
            cellSpacing="0"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <tr>
              <td style={{ padding: "40px" }}>
                <h1
                  style={{
                    fontSize: "24px",
                    marginBottom: "20px",
                    color: "#1C3658",
                  }}
                >
                  Welcome to the Tinte Community, {firstName}! 🎨
                </h1>
                <p style={{ marginBottom: "20px" }}>
                  We're thrilled to have you join the colorful world of{" "}
                  {productName}! Get ready to transform your development
                  environment with stunning themes.
                </p>
                <p style={{ marginBottom: "20px" }}>
                  As a valued member of our community, you'll be the first to
                  know about:
                </p>
                <ul style={{ marginBottom: "20px", paddingLeft: "20px" }}>
                  <li>New VS Code and Shadcn UI themes</li>
                  <li>Exciting features and updates</li>
                  <li>Exclusive offers and tips for theme customization</li>
                </ul>
                <p style={{ marginBottom: "20px" }}>
                  Stay tuned for a splash of inspiration in your inbox!
                </p>
                <p
                  style={{ marginTop: "30px", fontSize: "12px", color: "#999" }}
                >
                  Let's keep the conversation colorful! Follow us on 𝕏:
                  <br />
                  <a
                    href="https://twitter.com/@crafterstation"
                    style={{ color: "#1C3658", textDecoration: "underline" }}
                  >
                    @crafterstation
                  </a>
                  {" and "}
                  <a
                    href="https://twitter.com/@raillyhugo"
                    style={{ color: "#1C3658", textDecoration: "underline" }}
                  >
                    @raillyhugo
                  </a>
                </p>
                <p
                  style={{ marginTop: "30px", fontSize: "12px", color: "#999" }}
                >
                  If you ever need to tone things down, you can unsubscribe{" "}
                  <a
                    href={unsubscribeLink}
                    style={{ color: "#1C3658", textDecoration: "underline" }}
                  >
                    here
                  </a>
                  . But we hope you'll stick around for the vibrant journey
                  ahead!
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
);
