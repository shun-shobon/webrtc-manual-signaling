import { minifyHtml } from "vite-plugin-html";

const config = {
  build: {
    target: "esnext",
  },
  plugins: [minifyHtml()],
};

export default config;
