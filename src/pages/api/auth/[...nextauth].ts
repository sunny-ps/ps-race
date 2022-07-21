import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
// import AzureADProvider from "next-auth/providers/azure-ad";

export default NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER,
    }),
    // AzureADProvider({
    //   clientId: process.env.AZURE_AD_CLIENT_ID!,
    //   clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
    //   tenantId: process.env.AZURE_AD_TENANT_ID,
    // }),
  ],
  pages: {
    signIn: "/signin",
  },
});
