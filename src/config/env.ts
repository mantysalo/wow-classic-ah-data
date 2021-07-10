import { parseEnvironmentVariables } from "@absxn/process-env-parser";
import dotenv from "dotenv";

dotenv.config();

const result = parseEnvironmentVariables({
  DATABASE_URL: { mask: true },
  OAUTH_CREDENTIALS: { mask: true },
});

if (!result.success) {
  throw new Error(`Environment variables not set correctly:\n${JSON.stringify(result.envPrintable)}`);
}

export const env = result.env;
