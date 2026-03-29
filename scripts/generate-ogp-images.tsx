import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { ReactNode } from "react";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tools = JSON.parse(
  readFileSync(join(__dirname, "../src/data/tools.json"), "utf-8")
);
const articles = JSON.parse(
  readFileSync(join(__dirname, "../src/data/articles.json"), "utf-8")
);

const SITE_NAME = "AI DIY設計ツール";
const SITE_URL = "ai-diy-design.kuras-plus.com";
const PRIMARY = "#EA580C";
const BG = "#FFF7ED";

async function loadFont(): Promise<ArrayBuffer> {
  // Fetch Noto Sans JP Bold from Google Fonts
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    }
  ).then((r) => r.text());

  const match = css.match(/src: url\(([^)]+)\) format\('woff2'\)/);
  if (!match) throw new Error("Font URL not found in CSS");

  return fetch(match[1]).then((r) => r.arrayBuffer());
}

async function generateImage(
  title: string,
  subtitle: string,
  outputPath: string,
  font: ArrayBuffer
) {
  const svg = await satori(
    ({
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: BG,
          fontFamily: "Noto Sans JP",
          position: "relative",
        },
        children: [
          // Top accent bar
          {
            type: "div",
            props: {
              style: {
                height: "12px",
                backgroundColor: PRIMARY,
                width: "100%",
              },
              children: [],
            },
          },
          // Main content
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: "48px 64px",
                justifyContent: "space-between",
              },
              children: [
                // Top: site name
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          style: { fontSize: "32px" },
                          children: "🪵",
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: "24px",
                            color: PRIMARY,
                            fontWeight: "700",
                          },
                          children: SITE_NAME,
                        },
                      },
                    ],
                  },
                },
                // Middle: title
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    },
                    children: [
                      {
                        type: "h1",
                        props: {
                          style: {
                            fontSize: title.length > 30 ? "40px" : "52px",
                            fontWeight: "700",
                            color: "#1C1917",
                            lineHeight: 1.3,
                            margin: "0",
                          },
                          children: title,
                        },
                      },
                      subtitle
                        ? {
                            type: "p",
                            props: {
                              style: {
                                fontSize: "24px",
                                color: "#78716C",
                                margin: "0",
                                lineHeight: 1.4,
                              },
                              children:
                                subtitle.length > 60
                                  ? subtitle.slice(0, 60) + "…"
                                  : subtitle,
                            },
                          }
                        : { type: "span", props: { children: "" } },
                    ],
                  },
                },
                // Bottom: URL
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "20px",
                      color: "#A8A29E",
                    },
                    children: SITE_URL,
                  },
                },
              ],
            },
          },
        ],
      },
    }) as ReactNode,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans JP",
          data: font,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  const rendered = resvg.render();
  const png = rendered.asPng();

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, png);
  console.log(`Generated: ${outputPath}`);
}

async function main() {
  console.log("Generating OGP images...");

  let font: ArrayBuffer;
  try {
    font = await loadFont();
  } catch (e) {
    console.error("Failed to load font:", e);
    console.log("Skipping OGP image generation due to font load failure.");
    process.exit(0);
  }

  const outDir = join(__dirname, "../public/ogp");

  // Default
  await generateImage(
    SITE_NAME,
    "DIY家具・棚の設計支援ツール。材料リスト・コスト・カット図面を自動計算",
    join(outDir, "default-ogp.png"),
    font
  );

  // Tools
  for (const tool of tools) {
    await generateImage(
      tool.title,
      tool.description,
      join(outDir, "tools", `${tool.slug}.png`),
      font
    );
  }

  // Articles
  for (const article of articles) {
    await generateImage(
      article.title,
      article.description,
      join(outDir, "blog", `${article.slug}.png`),
      font
    );
  }

  console.log("Done! OGP images generated.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
