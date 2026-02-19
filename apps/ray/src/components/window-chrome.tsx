interface WindowChromeProps {
  title: string;
  onTitleChange?: (title: string) => void;
  bg: string;
}

export function WindowChrome({ title, onTitleChange, bg }: WindowChromeProps) {
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
      {onTitleChange ? (
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="untitled"
          spellCheck={false}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            background: "transparent",
            border: "none",
            outline: "none",
            textAlign: "center",
            maxWidth: 200,
            width: title ? `${Math.max(title.length + 2, 8)}ch` : "8ch",
            padding: 0,
          }}
        />
      ) : (
        title && (
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
        )
      )}
    </div>
  );
}
