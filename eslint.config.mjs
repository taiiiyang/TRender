import { config } from "@TRender/eslint-config/base";

export default config.append({
  ignores: ["apps/**/*", "packages/**/*", "node_modules/**/*", "dist/**/*", ".turbo/**/*"],
});
