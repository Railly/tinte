import { ImageResponse } from "next/og";

export const alt = "Tinte Theme";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function getTheme(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/themes/slug/${slug}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching theme:", error);
    return null;
  }
}

async function loadGoogleFont(font: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const theme = await getTheme(slug);
  const themeUrl = `tinte.dev/workbench/${slug}`;

  // Load Inter font using Google Fonts API
  const interBold = await loadGoogleFont("Inter:wght@700");

  if (!theme) {
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #667eea, #764ba2)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 700,
            color: "white",
          }}
        >
          Tinte
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgba(255, 255, 255, 0.9)",
            marginTop: 16,
          }}
        >
          Theme not found
        </div>
      </div>,
      {
        ...size,
      },
    );
  }

  const lightColors = extractThemeColorsForOG(theme, false);
  const darkColors = extractThemeColorsForOG(theme, true);

  // Get all color values excluding base colors
  const lightPalette = Object.entries(lightColors)
    .filter(([key]) => !["foreground", "background"].includes(key))
    .map(([_, value]) => value)
    .slice(0, 5);

  const darkPalette = Object.entries(darkColors)
    .filter(([key]) => !["foreground", "background"].includes(key))
    .map(([_, value]) => value)
    .slice(0, 5);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        position: "relative",
        padding: "60px 0",
        fontFamily: "'Inter'",
      }}
    >
      {/* Diagonal split background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          background: `linear-gradient(152deg, ${lightColors.background} 50%, ${darkColors.background} 50%)`,
        }}
      />

      {/* Blur gradient orbs */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          display: "flex",
          background: `radial-gradient(circle, ${lightColors.primary}40 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: -100,
          width: 400,
          height: 400,
          display: "flex",
          background: `radial-gradient(circle, ${darkColors.accent}40 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Noise texture overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          zIndex: 10,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 800,
            color: lightColors.foreground,
            mixBlendMode: "difference",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          {theme.name}
        </div>
        {theme.concept && (
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 500,
              color: lightColors.foreground,
              mixBlendMode: "difference",
              opacity: 0.7,
              maxWidth: "70%",
              textAlign: "center",
            }}
          >
            {theme.concept}
          </div>
        )}
      </div>

      {/* Color circles */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "0 80px",
          zIndex: 10,
          marginTop: "-80px",
        }}
      >
        {/* Light theme colors */}
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {lightPalette.map((color, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                width: 70,
                height: 70,
                background: color,
                borderRadius: "50%",
                border: `3px solid ${lightColors.foreground}15`,
                boxShadow: `0 8px 24px ${color}40, 0 2px 8px ${lightColors.foreground}10`,
              }}
            />
          ))}
        </div>

        {/* Dark theme colors */}
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {darkPalette.map((color, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                width: 70,
                height: 70,
                background: color,
                borderRadius: "50%",
                border: `3px solid ${darkColors.foreground}15`,
                boxShadow: `0 8px 24px ${color}40, 0 2px 8px ${darkColors.foreground}10`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          zIndex: 10,
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 1024 1024"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ mixBlendMode: "difference" }}
        >
          <g clipPath="url(#clip0_171_409)">
            <path
              d="M0 0C337.92 0 675.84 0 1024 0C1024 337.92 1024 675.84 1024 1024C686.08 1024 348.16 1024 0 1024C0 686.08 0 348.16 0 0Z"
              fill={darkColors.foreground}
            />
            <path
              d="M447.047 196C471.321 196 495.594 196 520.604 196C519.575 202.51 518.547 209.019 517.487 215.726C514.254 236.204 511.036 256.684 507.825 277.165C507.61 278.533 507.395 279.902 507.174 281.311C506.755 283.988 506.335 286.665 505.915 289.341C505.519 291.869 505.123 294.397 504.725 296.925C503.917 302.081 503.112 307.238 502.348 312.401C502.131 313.867 501.913 315.334 501.689 316.845C501.514 318.052 501.339 319.259 501.159 320.502C500.656 323.244 500.656 323.244 499.409 325.739C550.837 325.739 602.264 325.739 655.249 325.739C653.622 342.837 651.562 359.9 649.016 376.886C571.258 377.503 571.258 377.503 491.929 378.133C490.695 390.483 489.461 402.833 488.189 415.558C487.116 423.814 486.007 432.045 484.761 440.274C484.444 442.407 484.128 444.541 483.812 446.675C481.101 464.814 480.027 484.793 477.792 502.258C474.119 530.95 473.775 557.722 479.462 571.494C482.605 579.106 492.147 591.425 504.396 593.948C567.979 607.047 662.067 544.987 717.585 497.892C718.958 496.735 720.332 495.579 721.705 494.422C724.512 492.056 727.312 489.683 730.106 487.303C732.256 485.476 734.412 483.656 736.583 481.855C740.76 478.373 744.282 474.835 747.507 470.447C748.329 470.859 749.152 471.27 750 471.695C749.29 472.707 749.29 472.707 748.566 473.739C743.957 480.46 740.23 487.259 736.754 494.617C719.772 529.467 694.881 559.74 667.337 586.8C664.967 589.155 664.967 589.155 662.106 592.779C658.848 596.61 655.361 599.707 651.543 602.959C649.202 605.012 647.044 607.143 644.886 609.386C639.189 615.137 632.947 620.158 626.575 625.136C625.685 625.831 624.795 626.527 623.878 627.244C574.676 665.477 518.89 692.289 455.774 693.747C519.83 712.095 571.594 699.683 628.911 668.489C662.295 649.76 693.178 626.006 721.81 600.692C724.927 597.971 728.11 595.336 731.299 592.701C720.877 614.472 705.753 634.362 690.587 653.013C688.988 654.981 687.405 656.962 685.823 658.944C677.286 669.411 667.801 678.956 658.288 688.523C657.296 689.526 657.296 689.526 656.283 690.55C647.63 699.275 638.715 707.318 629.068 714.955C627.503 716.247 625.941 717.542 624.383 718.843C607.293 732.927 588.724 744.438 569.226 754.874C568.425 755.307 567.623 755.739 566.798 756.184C545.319 767.681 523.185 774.748 499.409 779.824C498.334 780.07 497.259 780.316 496.151 780.569C491.934 781.281 487.7 781.524 483.436 781.773C482.572 781.827 481.708 781.881 480.818 781.936C478.704 782.068 476.59 782.194 474.475 782.319C484.059 783.663 493.571 783.799 503.229 783.798C505.932 783.8 508.634 783.823 511.336 783.847C575.66 784.117 634.555 750.269 685.171 713.707C685.993 714.119 686.816 714.53 687.664 714.955C685.561 717.451 683.457 719.945 681.353 722.44C680.772 723.129 680.191 723.819 679.592 724.53C663.545 743.536 646.714 761.371 626.575 776.081C625.521 776.866 624.466 777.651 623.38 778.459C570.548 816.717 503.685 834.153 439.135 824.286C405.466 818.583 373.312 801.171 353.003 773.318C312.72 715.278 327.498 638.954 337.404 573.876C339.7 558.786 341.846 543.675 343.974 528.56C347.794 501.469 351.795 474.408 355.943 447.366C356.342 444.762 356.739 442.159 357.136 439.555C359.617 423.306 362.144 407.069 365.056 390.891C365.261 389.748 365.465 388.605 365.676 387.428C365.866 386.394 366.057 385.36 366.253 384.296C366.417 383.4 366.582 382.505 366.752 381.582C367.257 379.381 367.257 379.381 368.504 376.886C337.648 376.886 306.791 376.886 275 376.886C281.234 338.214 281.234 338.214 282.48 333.224C285.162 331.919 285.162 331.919 288.729 330.948C290.705 330.384 290.705 330.384 292.722 329.808C294.15 329.417 295.579 329.026 297.051 328.623C335.303 317.479 369.611 301.121 398.425 273.344C399.304 272.543 400.183 271.743 401.089 270.917C418.819 254.292 428.916 232.399 439.567 210.97C442.035 206.03 444.504 201.09 447.047 196Z"
              fill={darkColors.background}
            />
          </g>
          <defs>
            <clipPath id="clip0_171_409">
              <rect width="1024" height="1024" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            color: darkColors.foreground,
            mixBlendMode: "difference",
            opacity: 0.9,
          }}
        >
          {themeUrl}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}

function extractThemeColorsForOG(theme: any, isDark = false) {
  const mode = isDark ? "dark" : "light";

  if (!theme) {
    return isDark
      ? {
          primary: "#667eea",
          secondary: "#764ba2",
          accent: "#f093fb",
          foreground: "#ffffff",
          background: "#000000",
        }
      : {
          primary: "#667eea",
          secondary: "#764ba2",
          accent: "#f093fb",
          foreground: "#000000",
          background: "#ffffff",
        };
  }

  // Try rawTheme first (has both light and dark)
  if (theme.rawTheme?.[mode]) {
    const rawTokens = theme.rawTheme[mode];
    return {
      primary: rawTokens.pr,
      secondary: rawTokens.sc,
      accent: rawTokens.ac_1,
      foreground: rawTokens.tx,
      background: rawTokens.bg,
      ui: rawTokens.ui,
      ui_2: rawTokens.ui_2,
      ui_3: rawTokens.ui_3,
    };
  }

  // Fallback to colors object (usually light mode only)
  if (theme.colors) {
    return {
      primary: theme.colors.primary || "#667eea",
      secondary: theme.colors.secondary || "#764ba2",
      accent: theme.colors.accent || "#f093fb",
      foreground: theme.colors.foreground || (isDark ? "#ffffff" : "#000000"),
      background: theme.colors.background || (isDark ? "#000000" : "#ffffff"),
    };
  }

  // Final fallback
  return isDark
    ? {
        primary: "#667eea",
        secondary: "#764ba2",
        accent: "#f093fb",
        foreground: "#ffffff",
        background: "#000000",
      }
    : {
        primary: "#667eea",
        secondary: "#764ba2",
        accent: "#f093fb",
        foreground: "#000000",
        background: "#ffffff",
      };
}
