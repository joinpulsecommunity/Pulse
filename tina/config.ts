import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const area = { component: "textarea" };
const text = (name: string, label: string, long = false): any => ({
  type: "string",
  name,
  label,
  ...(long ? { ui: area } : {}),
});
const image = (name: string, label: string): any => ({ type: "image", name, label });
const itemLabel = (key: string) => ({ itemProps: (item: any) => ({ label: item?.[key] || "(empty)" }) });
const list = (name: string, labelText: string, key: string, fields: any[]): any => ({
  type: "object",
  name,
  label: labelText,
  list: true,
  ui: itemLabel(key),
  fields,
});
const section = (name: string, labelText: string, fields: any[]): any => ({
  type: "object",
  name,
  label: labelText,
  fields: [text("eyebrow", "Small Heading (above title)"), text("heading", "Section Title"), ...fields],
});
const person = [image("photo", "Photo"), text("name", "Name"), text("role", "Role"), text("bio", "Short Bio", true)];

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || process.env.TINA_PUBLIC_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: { outputFolder: "admin", publicFolder: "public" },
  media: { tina: { mediaRoot: "assets/images", publicFolder: "public" } },

  schema: {
    collections: [
      {
        name: "site",
        label: "Website Content",
        path: "content",
        format: "json",
        match: { include: "site" },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => "/",
        },
        fields: [
          {
            type: "object",
            name: "header",
            label: "Top Bar",
            fields: [text("subtitle", "Subtitle under PULSE"), text("cta", "Button Text")],
          },
          {
            type: "object",
            name: "hero",
            label: "Home (Top of Page)",
            fields: [
              text("eyebrow", "Small Heading"),
              text("title", "Big Title"),
              text("fullName", "Full Name"),
              text("text", "Intro Text", true),
              image("image", "Image"),
              text("primaryLabel", "First Button Text"),
              text("primaryUrl", "First Button Link"),
              text("secondaryLabel", "Second Button Text"),
              text("secondaryUrl", "Second Button Link"),
            ],
          },
          list("strip", "Word Bar", "word", [text("word", "Word")]),
          section("about", "About", [
            image("image", "Image"),
            text("lead", "Lead Paragraph", true),
            text("p1", "Paragraph 2", true),
            text("p2", "Paragraph 3", true),
            list("pillars", "Mission / Vision / Values", "title", [text("title", "Title"), text("text", "Text", true)]),
          ]),
          section("programs", "Programs", [
            list("items", "Programs", "title", [image("image", "Image"), text("title", "Title"), text("text", "Description", true)]),
          ]),
          section("events", "Events", [
            text("detailsLabel", "Details Link Text"),
            list("items", "Events", "title", [
              text("day", "Day (e.g. 14)"),
              text("month", "Month (e.g. OCT)"),
              text("title", "Event Name"),
              text("time", "Time"),
              text("location", "Location"),
            ]),
          ]),
          section("impact", "Impact Numbers", [
            list("items", "Numbers", "label", [text("number", "Number"), text("label", "Label")]),
          ]),
          section("leadership", "Directors, Officers & Leads", [
            text("directorsTitle", "Directors Heading"),
            list("directors", "Directors", "name", person),
            text("officersTitle", "Officers Heading"),
            list("officers", "Officers", "name", person),
            text("leadsTitle", "Committee Leads Heading"),
            list("leads", "Committee Leads", "name", person),
          ]),
          section("gallery", "Gallery", [list("images", "Photos", "image", [image("image", "Photo")])]),
          section("involve", "Get Involved", [
            list("items", "Cards", "title", [
              text("title", "Title"),
              text("text", "Text", true),
              text("buttonText", "Button Text"),
              text("buttonUrl", "Button Link (web address or #contact)"),
            ]),
          ]),
          section("contact", "Contact", [list("items", "Contact Info", "label", [text("label", "Label"), text("value", "Value")])]),
          {
            type: "object",
            name: "footer",
            label: "Footer",
            fields: [text("tagline", "Full Name Line"), text("school", "School Name")],
          },
        ],
      },
    ],
  },
});
