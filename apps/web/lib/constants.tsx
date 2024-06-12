/* eslint-disable @next/next/no-img-element */
import { IconSupabase, IconTailwind, IconVercel } from "@/components/ui/icons";
import { DarkLightPalette } from "./core/types";
export const LANGS = [
  "html",
  "css",
  "tsx",
  "jsx",
  "vue",
  "typescript",
  "javascript",
  "json",
  "php",
  "sql",
  "go",
  "rust",
  "python",
  "ruby",
  "dart",
];

export const DEFAULT_LANGUAGE = "typescript";

export const CODE_SAMPLES: Record<string, string> = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <h1 class="text-2xl font-bold text-blue-500">Hello, World!</h1>
</body>
</html>`,
  css: `body {
  font-family: 'Arial', sans-serif;
  color: #333;
}

h1 {
  color: #007bff;
}`,
  tsx: `import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const Button = ({ onClick, children }: ButtonProps) => (
  <button
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    onClick={onClick}>
    {children}
  </button>
);`,
  jsx: `import React from 'react';

const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);`,
  vue: `<template>
  <button @click="onClick">{{ children }}</button>
</template>

<script>
export default {
  props: ['onClick', 'children'],
};
</script>`,
  json: `{
  "editor.fontSize": 14,
  "editor.fontFamily": "Fira Code",
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false
}`,
  php: `<?php
class Calculator {
    public static function add($a, $b) {
        return $a + $b;
    }
}

$result = Calculator::add(5, 3);
echo "Result: " . $result;
?>`,

  javascript: `function isPalindrome(str) {
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return cleaned === cleaned.split('').reverse().join('');
}

console.log(isPalindrome("A man, a plan, a canal, Panama!"));`,

  typescript: `interface User {
  id: number;
  name: string;
  email: string;
}

function fetchUser(id: number): Promise<User> {
  return fetch(\`/api/users/\${id}\`)
    .then(response => response.json());
}

fetchUser(42).then(user => {
  console.log(\`User: \${user.name} (Email: \${user.email})\`);
});`,

  sql: `SELECT
    p.product_name,
    SUM(oi.quantity) AS total_quantity,
    SUM(oi.quantity * p.price) AS total_revenue
FROM
    products p
    JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY
    p.product_name
ORDER BY
    total_revenue DESC
LIMIT 5;`,

  go: `func countVowels(str string) int {
    vowels := "aeiouAEIOU"
    count := 0
    for _, char := range str {
        if strings.ContainsRune(vowels, char) {
            count++
        }
    }
    return count
}

sentence := "The quick brown fox jumps over the lazy dog"
fmt.Printf("Number of vowels: %d", countVowels(sentence))`,

  rust: `fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len() - 1;

    while left <= right {
        let mid = (left + right) / 2;
        match arr[mid].cmp(&target) {
            Ordering::Equal => return Some(mid),
            Ordering::Less => left = mid + 1,
            Ordering::Greater => right = mid - 1,
        }
    }

    None
}

let numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
let target = 7;
match binary_search(&numbers, target) {
    Some(index) => println!("Target found at index: {}", index),
    None => println!("Target not found"),
}`,

  python: `import re

def extract_email(text):
    pattern = r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b'
    emails = re.findall(pattern, text)
    return emails

text = '''
John Doe: john.doe@example.com
Jane Smith: jane.smith@gmail.com
'''

emails = extract_email(text)
print("Extracted emails:", emails)`,

  ruby: `def fibonacci(n)
  return n if n <= 1
  fibonacci(n - 1) + fibonacci(n - 2)
end

def memoized_fibonacci(n, memo={})
  return memo[n] if memo.key?(n)
  memo[n] = memoized_fibonacci(n - 1, memo) + memoized_fibonacci(n - 2, memo)
end

n = 30
puts "Fibonacci number at position #{n}: #{fibonacci(n)}"
puts "Memoized Fibonacci number at position #{n}: #{memoized_fibonacci(n)}"`,
  dart: `import 'package:flutter/material.dart';
 
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Hello, World!')),
        body: Center(child: Text('Hello, World!')),
      ),
    );
  }
}`,
};

export const BACKGROUND_LESS_PALETTE = {
  dark: {
    text: "#EDEDED",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#171717",
    "interface-2": "#212121",
    "interface-3": "#2B2B2B",
    background: "#000000",
    "background-2": "#0D0D0D",
  },
  light: {
    text: "#1D2127",
    "text-2": "#808080",
    "text-3": "#b3b3b3",
    interface: "#e6e6e6",
    "interface-2": "#d9d9d9",
    "interface-3": "#cccccc",
    background: "#FFFFFF",
    "background-2": "#f2f2f2",
  },
};

export const PRESETS: Record<string, DarkLightPalette> = {
  "One Hunter": {
    dark: {
      text: "#E3E1E1",
      interface: "#35373A",
      "text-2": "#A3A3A3",
      "interface-2": "#3E4043",
      "text-3": "#8F8F8F",
      "interface-3": "#47494D",
      background: "#1D2127",
      accent: "#50C2F7",
      "background-2": "#2C2E31",
      "accent-2": "#66DFC4",
      primary: "#F06293",
      "accent-3": "#F7BC62",
      secondary: "#E3E1E2",
    },
    light: {
      text: "#1D2127",
      interface: "#dedede",
      "text-2": "#808080",
      "interface-2": "#d1d1d1",
      "text-3": "#b3b3b3",
      "interface-3": "#c4c4c4",
      background: "#F7F7F7",
      accent: "#0483c5",
      "background-2": "#ebebeb",
      "accent-2": "#178a78",
      primary: "#bb1b3f",
      "accent-3": "#e26d14",
      secondary: "#1D2128",
    },
  },
  Flexoki: {
    dark: {
      text: "#CECDC3",
      "text-2": "#87857F",
      "text-3": "#575653",
      interface: "#282726",
      "interface-2": "#343331",
      "interface-3": "#403E3C",
      background: "#100F0F",
      "background-2": "#1C1B1A",
      primary: "#889A39",
      secondary: "#CE5D97",
      accent: "#DA702C",
      "accent-2": "#39A99F",
      "accent-3": "#4485BE",
    },
    light: {
      text: "#100F0F",
      "text-2": "#6F6E68",
      "text-3": "#B7B5AC",
      interface: "#E6E4D9",
      "interface-2": "#DAD8CE",
      "interface-3": "#CECDC3",
      background: "#FEFCF0",
      "background-2": "#F2F0E5",
      primary: "#66800C",
      secondary: "#A02F6F",
      accent: "#BC5214",
      "accent-2": "#24837B",
      "accent-3": "#205EA6",
    },
  },
  Vercel: {
    dark: {
      text: "#EDEDED",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#171717",
      "interface-2": "#212121",
      "interface-3": "#2B2B2B",
      background: "#000000",
      "background-2": "#0D0D0D",
      primary: "#FF4C8D",
      secondary: "#47A8FF",
      accent: "#C372FC",
      "accent-2": "#00CA51",
      "accent-3": "#EDEDED",
    },
    light: {
      text: "#1D2127",
      "text-2": "#808080",
      "text-3": "#b3b3b3",
      interface: "#e6e6e6",
      "interface-2": "#d9d9d9",
      "interface-3": "#cccccc",
      background: "#FFFFFF",
      "background-2": "#f2f2f2",
      primary: "#C31562",
      secondary: "#0060F1",
      accent: "#7D00CC",
      "accent-2": "#0F7E32",
      "accent-3": "#000000",
    },
  },
  Supabase: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#262c29",
      "interface-2": "#343c38",
      "interface-3": "#4e5651",
      background: "#171717",
      "background-2": "#212121",
      primary: "#A0A0A0",
      secondary: "#3ECF8E",
      accent: "#3ECF8E",
      "accent-2": "#3ECF8E",
      "accent-3": "#EDEDED",
    },
    light: {
      text: "#171717",
      "text-2": "#595959",
      "text-3": "#8c8c8c",
      interface: "#e6e6e6",
      "interface-2": "#d9d9d9",
      "interface-3": "#cccccc",
      background: "#FFFFFF",
      "background-2": "#f2f2f2",
      primary: "#A0A0A0",
      secondary: "#019A55",
      accent: "#019A55",
      "accent-2": "#019A55",
      "accent-3": "#171717",
    },
  },
  Tailwind: {
    dark: {
      text: "#F9FAFB",
      "text-2": "#98aecd",
      "text-3": "#6486b4",
      interface: "#293e5b",
      "interface-2": "#32496c",
      "interface-3": "#38537a",
      background: "#1B293D",
      "background-2": "#21324a",
      primary: "#F471B5",
      secondary: "#98F6E4",
      accent: "#D1D5DB",
      "accent-2": "#7DD3FC",
      "accent-3": "#FDE68A",
    },
    light: {
      text: "#1D2127",
      "text-2": "#808080",
      "text-3": "#b3b3b3",
      interface: "#e6e6e6",
      "interface-2": "#d9d9d9",
      "interface-3": "#cccccc",
      background: "#FFFFFF",
      "background-2": "#f2f2f2",
      primary: "#C31562",
      secondary: "#0060F1",
      accent: "#7D00CC",
      "accent-2": "#0F7E32",
      "accent-3": "#000000",
    },
  },
  Bitmap: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#3c2020",
      "interface-2": "#512f2f",
      "interface-3": "#6f4444",
      background: "#190707",
      "background-2": "#280b0b",
      primary: "#EB6F6F",
      secondary: "#E42C37",
      accent: "#E42C37",
      "accent-2": "#EBB99D",
      "accent-3": "#E42C37",
    },
    light: {
      text: "#685B5B",
      "text-2": "#948484",
      "text-3": "#b8adad",
      interface: "#e0d2d2",
      "interface-2": "#d5c3c3",
      "interface-3": "#cab4b4",
      background: "#fff5f7",
      "background-2": "#ffebef",
      primary: "#D63937",
      secondary: "#C90028",
      accent: "#C90028",
      "accent-2": "#836250",
      "accent-3": "#D15510",
    },
  },
  Noir: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#2b2b2b",
      "interface-2": "#363636",
      "interface-3": "#454545",
      background: "#181818",
      "background-2": "#1f1f1f",
      primary: "#A7A7A7",
      secondary: "#A7A7A7",
      accent: "#FFFFFF",
      "accent-2": "#A7A7A7",
      "accent-3": "#FFFFFF",
    },
    light: {
      text: "#111111",
      "text-2": "#666666",
      "text-3": "#999999",
      interface: "#dedede",
      "interface-2": "#d1d1d1",
      "interface-3": "#c4c4c4",
      background: "#F7F7F7",
      "background-2": "#ebebeb",
      primary: "#666",
      secondary: "#666",
      accent: "#111111",
      "accent-2": "#666",
      "accent-3": "#111111",
    },
  },
  Ice: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#30353b",
      "interface-2": "#394047",
      "interface-3": "#515a61",
      background: "#1F2427",
      "background-2": "#272c30",
      primary: "#BFC4C8",
      secondary: "#92DEF6",
      accent: "#778CB7",
      "accent-2": "#89C3DC",
      "accent-3": "#00B0E9",
    },
    light: {
      text: "#1C1B29",
      "text-2": "#25778e",
      "text-3": "#49b3d0",
      interface: "#d6f7ff",
      "interface-2": "#c2f3ff",
      "interface-3": "#9ed7e6",
      background: "#fafeff",
      "background-2": "#ebfbff",
      primary: "#81909D",
      secondary: "#00B0E9",
      accent: "#1E3C78",
      "accent-2": "#7CBCD8",
      "accent-3": "#00B0E9",
    },
  },
  Sand: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#484037",
      "interface-2": "#584f46",
      "interface-3": "#66594d",
      background: "#2E2820",
      "background-2": "#393228",
      primary: "#D3B48C",
      secondary: "#C2B181",
      accent: "#F4A461",
      "accent-2": "#EED5B8",
      "accent-3": "#C2B181",
    },
    light: {
      text: "#262217",
      "text-2": "#706443",
      "text-3": "#a99a70",
      interface: "#e5d3bd",
      "interface-2": "#dec8ab",
      "interface-3": "#d7bc98",
      background: "#F3EAE0",
      "background-2": "#ecdfcf",
      primary: "#906937",
      secondary: "#A28C4E",
      accent: "#DA8744",
      "accent-2": "#C57416",
      "accent-3": "#A28C4E",
    },
  },
  Forest: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#2b312b",
      "interface-2": "#3c443d",
      "interface-3": "#4b534d",
      background: "#141815",
      "background-2": "#1e2420",
      primary: "#AAB4A2",
      secondary: "#6A8F71",
      accent: "#86B882",
      "accent-2": "#CBBE6D",
      "accent-3": "#AAB4A2",
    },
    light: {
      text: "#262217",
      "text-2": "#668f56",
      "text-3": "#aac69f",
      interface: "#e2ecdf",
      "interface-2": "#d7e4d2",
      "interface-3": "#ccddc5",
      background: "#f9fbf8",
      "background-2": "#eef4ec",
      primary: "#6A8458",
      secondary: "#6A8F71",
      accent: "#4A8042",
      "accent-2": "#9D891C",
      "accent-3": "#78876E",
    },
  },
  Breeze: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#3a2442",
      "interface-2": "#472f4c",
      "interface-3": "#5f4365",
      background: "#1e0d21",
      "background-2": "#2b132f",
      primary: "#6699FF",
      secondary: "#49E8F2",
      accent: "#F8528D",
      "accent-2": "#E9AEFE",
      "accent-3": "#55E7B1",
    },
    light: {
      text: "#1D2127",
      "text-2": "#bd3d74",
      "text-3": "#d77ea5",
      interface: "#ffe0ed",
      "interface-2": "#ffd1e4",
      "interface-3": "#ffbdd8",
      background: "#fffafc",
      "background-2": "#fff0f6",
      primary: "#4D6FB2",
      secondary: "#2C797B",
      accent: "#BE4578",
      "accent-2": "#666DA6",
      "accent-3": "#426B65",
    },
  },
  Candy: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#443856",
      "interface-2": "#4f4266",
      "interface-3": "#66597d",
      background: "#2B2536",
      "background-2": "#352d43",
      primary: "#FF659C",
      secondary: "#1CC8FF",
      accent: "#73DFA5",
      "accent-2": "#DFD473",
      "accent-3": "#7A7FFD",
    },
    light: {
      text: "#1D2127",
      "text-2": "#808080",
      "text-3": "#b3b3b3",
      interface: "#dedede",
      "interface-2": "#d1d1d1",
      "interface-3": "#c4c4c4",
      background: "#F7F7F7",
      "background-2": "#ebebeb",
      primary: "#DC145E",
      secondary: "#2386A6",
      accent: "#009032",
      "accent-2": "#B2762E",
      "accent-3": "#676DFF",
    },
  },
  Crimson: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#362626",
      "interface-2": "#533c3d",
      "interface-3": "#7e6363",
      background: "#211111",
      "background-2": "#2f1818",
      primary: "#EB6F6F",
      secondary: "#D15510",
      accent: "#C88E8E",
      "accent-2": "#EBB99D",
      "accent-3": "#FDA97A",
    },
    light: {
      text: "#685B5B",
      "text-2": "#a88b8a",
      "text-3": "#b79f9f",
      interface: "#e9dddd",
      "interface-2": "#d9cece",
      "interface-3": "#cec0c0",
      background: "#faf4f4",
      "background-2": "#f5eaea",
      primary: "#BD3B3B",
      secondary: "#C94F0A",
      accent: "#9E7070",
      "accent-2": "#836250",
      "accent-3": "#C94F0A",
    },
  },
  Falcon: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#272525",
      "interface-2": "#2c2a2a",
      "interface-3": "#454545",
      background: "#121212",
      "background-2": "1c1c1c",
      primary: "#99B6B2",
      secondary: "#799DB1",
      accent: "#6D88BB",
      "accent-2": "#789083",
      "accent-3": "#BD9C9C",
    },
    light: {
      text: "#464C65",
      "text-2": "#637b9c",
      "text-3": "#a2b0c3",
      interface: "#e0e4eb",
      "interface-2": "#d0d7e1",
      "interface-3": "#c4cdd9",
      background: "#f6f7f9",
      "background-2": "#edeff3",
      primary: "#464C65",
      secondary: "#839AA7",
      accent: "#6A7C9F",
      "accent-2": "#47615D",
      "accent-3": "#AF6A65",
    },
  },
  Meadow: {
    dark: {
      text: "#EDEDED",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#2a2b27",
      "interface-2": "#464b3a",
      "interface-3": "#6d725f",
      background: "#11130b",
      "background-2": "#1a1e10",
      primary: "#6DD79F",
      secondary: "#E4B164",
      accent: "#B3D767",
      "accent-2": "#E9EB9D",
      "accent-3": "#45B114",
    },
    light: {
      text: "#1D2127",
      "text-2": "#8caa55",
      "text-3": "#bacc99",
      interface: "#e3ead7",
      "interface-2": "#d7e1c6",
      "interface-3": "#cfdbb8",
      background: "#f7faf5",
      "background-2": "#ecf1e4",
      primary: "#009649",
      secondary: "#B6781B",
      accent: "#798B53",
      "accent-2": "#837E51",
      "accent-3": "#2D8801",
    },
  },
  Midnight: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#283234",
      "interface-2": "#364245",
      "interface-3": "#526366",
      background: "#121E20",
      "background-2": "#18282a",
      primary: "#7DA9AB",
      secondary: "#9681C2",
      accent: "#52D0F8",
      "accent-2": "#6D86A4",
      "accent-3": "#75D2B1",
    },
    light: {
      text: "#434447",
      "text-2": "#63859c",
      "text-3": "#a2b6c3",
      interface: "#dde4e9",
      "interface-2": "#ced8df",
      "interface-3": "#c1ced7",
      background: "#f6f8f9",
      "background-2": "#eaeef1",
      primary: "#587678",
      secondary: "#766599",
      accent: "#2F788F",
      "accent-2": "#5F758F",
      "accent-3": "#9EC2B9",
    },
  },
  Raindrop: {
    dark: {
      text: "#EDEDED",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#232934",
      "interface-2": "#363f4f",
      "interface-3": "#5b6576",
      background: "#070f1D",
      "background-2": "#0b172d",
      primary: "#2FD9FF",
      secondary: "#008BB7",
      accent: "#19D6B5",
      "accent-2": "#9CD8EB",
      "accent-3": "#9984EE",
    },
    light: {
      text: "#1D2127",
      "text-2": "#4868ad",
      "text-3": "#90abe4",
      interface: "#d6e0f5",
      "interface-2": "#c6d3f1",
      "interface-3": "#b5c7ed",
      background: "#f7f9fd",
      "background-2": "#e7edf9",
      primary: "#008DAC",
      secondary: "#027BA1",
      accent: "#4F9488",
      "accent-2": "#507683",
      "accent-3": "#7459E1",
    },
  },
  Sunset: {
    dark: {
      text: "#EDEDED",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#2c2721",
      "interface-2": "#4a4036",
      "interface-3": "#7c6b5a",
      background: "#231c15",
      "background-2": "#2d241b",
      primary: "#FFAF64",
      secondary: "#E978A1",
      accent: "#E2D66B",
      "accent-2": "#F9D38C",
      "accent-3": "#E7CF55",
    },
    light: {
      text: "#737568",
      "text-2": "#a47141",
      "text-3": "#e5ac76",
      interface: "#ffe5cc",
      "interface-2": "#edd7c4",
      "interface-3": "#e7cab1",
      background: "#fff7f0",
      "background-2": "#ffefe0",
      primary: "#A1642C",
      secondary: "#AD5A78",
      accent: "#807411",
      "accent-2": "#8D703C",
      "accent-3": "#846F00",
    },
  },
};

export const FEATURED_THEME_LOGOS = {
  "One Hunter": (
    <img
      className="size-5 border rounded-full"
      src="one-hunter-logo.png"
      alt="One Hunter Logo"
    />
  ),
  Flexoki: (
    <img
      className="size-5 border rounded-full"
      src="flexoki-logo.png"
      alt="Flexoki Logo"
    />
  ),
  Vercel: <IconVercel className="mx-0.5" />,
  Supabase: <IconSupabase className="mx-0.5" />,
  Tailwind: <IconTailwind className="mx-0.5" />,
};
