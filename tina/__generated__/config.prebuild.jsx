// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var imageField = (name, label) => ({
  type: "image",
  name,
  label
});
var textArea = { component: "textarea" };
var config_default = defineConfig({
  branch,
  clientId: process.env.TINA_PUBLIC_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: { outputFolder: "admin", publicFolder: "." },
  media: { tina: { mediaRoot: "assets/images", publicFolder: "." } },
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
          router: () => "/"
        },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Home (Top of Page)",
            fields: [{ type: "string", name: "text", label: "Intro Text", ui: textArea }]
          },
          {
            type: "object",
            name: "about",
            label: "About",
            fields: [
              imageField("image", "Image"),
              { type: "string", name: "lead", label: "Lead Paragraph", ui: textArea },
              { type: "string", name: "p1", label: "Paragraph 2", ui: textArea },
              { type: "string", name: "p2", label: "Paragraph 3", ui: textArea },
              {
                type: "object",
                name: "pillars",
                label: "Mission / Vision / Values",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.title }) },
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "text", label: "Text", ui: textArea }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "programs",
            label: "Programs",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title }) },
            fields: [
              imageField("image", "Image"),
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "text", label: "Description", ui: textArea }
            ]
          },
          {
            type: "object",
            name: "events",
            label: "Events",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title }) },
            fields: [
              { type: "string", name: "day", label: "Day (e.g. 14)" },
              { type: "string", name: "month", label: "Month (e.g. OCT)" },
              { type: "string", name: "title", label: "Event Name" },
              { type: "string", name: "time", label: "Time" },
              { type: "string", name: "location", label: "Location" }
            ]
          },
          {
            type: "object",
            name: "impact",
            label: "Impact Numbers",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label }) },
            fields: [
              { type: "string", name: "number", label: "Number" },
              { type: "string", name: "label", label: "Label" }
            ]
          },
          {
            type: "object",
            name: "directors",
            label: "Directors",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.name }) },
            fields: [
              imageField("photo", "Photo"),
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "role", label: "Role" },
              { type: "string", name: "bio", label: "Short Bio", ui: textArea }
            ]
          },
          {
            type: "object",
            name: "officers",
            label: "Officers",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.name }) },
            fields: [
              imageField("photo", "Photo"),
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "role", label: "Role" },
              { type: "string", name: "bio", label: "Short Bio", ui: textArea }
            ]
          },
          {
            type: "object",
            name: "gallery",
            label: "Gallery Photos",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.image || "Photo" }) },
            fields: [imageField("image", "Photo")]
          },
          {
            type: "object",
            name: "involve",
            label: "Get Involved (Volunteer / Donate / Join)",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title }) },
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "text", label: "Text", ui: textArea },
              { type: "string", name: "buttonText", label: "Button Text" },
              { type: "string", name: "buttonUrl", label: "Button Link (web address or #contact)" }
            ]
          },
          {
            type: "object",
            name: "contact",
            label: "Contact",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label }) },
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "value", label: "Value" }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
