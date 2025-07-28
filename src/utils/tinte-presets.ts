// Extract themes for theme showcase
export function extractTinteThemeData(isDark = false) {
  return tintePresets.map((preset, index) => {
    const colorData = isDark ? preset.dark : preset.light;
    return {
      id: `tinte-${index + 1}`,
      name: preset.name,
      colors: {
        primary: colorData.primary,
        secondary: colorData.secondary,
        accent: colorData.accent,
        background: colorData.background,
        foreground: colorData.text,
      },
      createdAt: '2024-01-20',
      rawTheme: {
        light: preset.light,
        dark: preset.dark
      }
    };
  });
}

export const tintePresets = [
  {
    name: "Vercel",
    light: {
      text: "#1D2127",
      accent: "#7D00CC",
      text_2: "#808080",
      text_3: "#b3b3b3",
      primary: "#C31562",
      accent_2: "#0F7E32",
      accent_3: "#000000",
      interface: "#e6e6e6",
      secondary: "#0060F1",
      background: "#FFFFFF",
      interface_2: "#d9d9d9",
      interface_3: "#cccccc",
      background_2: "#f2f2f2"
    },
    dark: {
      text: "#EDEDED",
      accent: "#C372FC",
      text_2: "#A3A3A3",
      text_3: "#8F8F8F",
      primary: "#FF4C8D",
      accent_2: "#00CA51",
      accent_3: "#EDEDED",
      interface: "#171717",
      secondary: "#47A8FF",
      background: "#000000",
      interface_2: "#212121",
      interface_3: "#2B2B2B",
      background_2: "#0D0D0D"
    }
  },
  {
    name: "One Hunter",
    light: {
      text: "#1D2127",
      accent: "#0483c5",
      text_2: "#808080",
      text_3: "#b3b3b3",
      primary: "#bb1b3f",
      accent_2: "#178a78",
      accent_3: "#e26d14",
      interface: "#dedede",
      secondary: "#1D2128",
      background: "#F7F7F7",
      interface_2: "#d1d1d1",
      interface_3: "#c4c4c4",
      background_2: "#ebebeb"
    },
    dark: {
      text: "#E3E1E1",
      accent: "#50C2F7",
      text_2: "#A3A3A3",
      text_3: "#8F8F8F",
      primary: "#F06293",
      accent_2: "#66DFC4",
      accent_3: "#F7BC62",
      interface: "#35373A",
      secondary: "#E3E1E2",
      background: "#1D2127",
      interface_2: "#3E4043",
      interface_3: "#47494D",
      background_2: "#2C2E31"
    }
  },
  {
    name: "Tailwind",
    light: {
      text: "#1D2127",
      accent: "#0d9488",
      text_2: "#808080",
      text_3: "#b3b3b3",
      primary: "#7c3aed",
      accent_2: "#5046e5",
      accent_3: "#d97708",
      interface: "#e6e6e6",
      secondary: "#0084c7",
      background: "#FFFFFF",
      interface_2: "#d9d9d9",
      interface_3: "#cccccc",
      background_2: "#f2f2f2"
    },
    dark: {
      text: "#F9FAFB",
      accent: "#D1D5DB",
      text_2: "#98aecd",
      text_3: "#6486b4",
      primary: "#F471B5",
      accent_2: "#7DD3FC",
      accent_3: "#FDE68A",
      interface: "#293e5b",
      secondary: "#98F6E4",
      background: "#1B293D",
      interface_2: "#32496c",
      interface_3: "#38537a",
      background_2: "#21324a"
    }
  },
  {
    name: "Supabase",
    light: {
      text: "#171717",
      accent: "#019A55",
      text_2: "#595959",
      text_3: "#8c8c8c",
      primary: "#A0A0A0",
      accent_2: "#019A55",
      accent_3: "#171717",
      interface: "#e6e6e6",
      secondary: "#019A55",
      background: "#FFFFFF",
      interface_2: "#d9d9d9",
      interface_3: "#cccccc",
      background_2: "#f2f2f2"
    },
    dark: {
      text: "#FFFFFF",
      accent: "#3ECF8E",
      text_2: "#A3A3A3",
      text_3: "#8F8F8F",
      primary: "#A0A0A0",
      accent_2: "#3ECF8E",
      accent_3: "#EDEDED",
      interface: "#262c29",
      secondary: "#3ECF8E",
      background: "#171717",
      interface_2: "#343c38",
      interface_3: "#4e5651",
      background_2: "#212121"
    }
  },
  {
    name: "Flexoki",
    light: {
      text: "#100F0F",
      accent: "#BC5214",
      text_2: "#6F6E68",
      text_3: "#B7B5AC",
      primary: "#66800C",
      accent_2: "#24837B",
      accent_3: "#205EA6",
      interface: "#E6E4D9",
      secondary: "#A02F6F",
      background: "#FEFCF0",
      interface_2: "#DAD8CE",
      interface_3: "#CECDC3",
      background_2: "#F2F0E5"
    },
    dark: {
      text: "#CECDC3",
      accent: "#DA702C",
      text_2: "#87857F",
      text_3: "#575653",
      primary: "#889A39",
      accent_2: "#39A99F",
      accent_3: "#4485BE",
      interface: "#282726",
      secondary: "#CE5D97",
      background: "#100F0F",
      interface_2: "#343331",
      interface_3: "#403E3C",
      background_2: "#1C1B1A"
    }
  }
];