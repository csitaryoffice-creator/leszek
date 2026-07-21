import { defineConfig } from "vite";
import { resolve } from "node:path";

const productionLinks = [
  ["../local-preview.html", "/"],
  ["local-preview-foglalasi-szabalyzat.html", "/foglalasi-szabalyzat"],
  ["local-preview-ter-csillag.html", "/terek/csillag"],
  ["local-preview-ter-soszoba.html", "/terek/soszoba"],
  ["local-preview-ter-fokusz.html", "/terek/fokusz"],
  ["local-preview-ter-sziget.html", "/terek/sziget"],
  ["local-preview-ter-muhely.html", "/terek/muhely"],
  ["local-preview-ter-mag.html", "/terek/mag"],
  ["local-preview-ter-ter.html", "/terek/ter"],
  ["local-preview-adatvedelem.html", "/adatvedelem"],
  ["local-preview-impresszum.html", "/impresszum"],
  ["local-preview-kapcsolat.html", "/kapcsolat"],
  ["local-preview-foglalas.html", "/foglalas"],
  ["local-preview-rolunk.html", "/rolunk"],
  ["local-preview-terek.html", "/terek"],
  ["local-preview.html", "/"]
];

export default defineConfig({
  plugins: [
    {
      name: "leszek-production-links",
      apply: "build",
      transformIndexHtml(html) {
        return productionLinks.reduce(
          (result, [localPath, productionPath]) => result.replaceAll(localPath, productionPath),
          html
        );
      }
    }
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), "index.html"),
        home: resolve(process.cwd(), "local-preview.html"),
        about: resolve(process.cwd(), "local-preview-rolunk.html"),
        spaces: resolve(process.cwd(), "local-preview-terek.html"),
        booking: resolve(process.cwd(), "local-preview-foglalas.html"),
        bookingRules: resolve(process.cwd(), "local-preview-foglalasi-szabalyzat.html"),
        contact: resolve(process.cwd(), "local-preview-kapcsolat.html"),
        privacy: resolve(process.cwd(), "local-preview-adatvedelem.html"),
        imprint: resolve(process.cwd(), "local-preview-impresszum.html"),
        admin: resolve(process.cwd(), "local-preview-foglalas/admin.html"),
        roomCsillag: resolve(process.cwd(), "local-preview-ter-csillag.html"),
        roomMag: resolve(process.cwd(), "local-preview-ter-mag.html"),
        roomSoszoba: resolve(process.cwd(), "local-preview-ter-soszoba.html"),
        roomSziget: resolve(process.cwd(), "local-preview-ter-sziget.html"),
        roomTer: resolve(process.cwd(), "local-preview-ter-ter.html"),
        roomMuhely: resolve(process.cwd(), "local-preview-ter-muhely.html"),
        roomFokusz: resolve(process.cwd(), "local-preview-ter-fokusz.html")
      }
    }
  }
});
