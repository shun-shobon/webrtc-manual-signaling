import { minifyHtml } from "vite-plugin-html";

const config = {
  esbuild: {
    jsxInject: 'import React from "react"',
  },
  plugins: [minifyHtml()],
};

export default config;
