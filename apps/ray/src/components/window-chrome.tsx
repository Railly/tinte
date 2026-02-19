interface WindowChromeProps {
  title: string;
  bg: string;
}

export function WindowChrome({ title, bg }: WindowChromeProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 40,
        padding: "0 16px",
        background: bg,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#FF5F57",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#FFBD2E",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#28C840",
          }}
        />
      </div>
      {title && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 200,
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
}
