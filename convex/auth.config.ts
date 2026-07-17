import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://eternal-koala-81.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
