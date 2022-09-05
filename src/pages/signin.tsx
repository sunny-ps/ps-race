import { GetServerSidePropsContext } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  LiteralUnion,
  signIn,
  getProviders,
} from "next-auth/react";

export default function SignIn<
  T extends Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >
>({ providers }: { providers: T }) {
  return (
    <div className="h-screen w-screen grid place-items-center bg-black">
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: "/",
              })
            }
            className="text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4
                focus:outline-none focus:ring-[#F7BE38]/50 font-medium text-sm px-10 py-4
                text-center"
          >
            Sign in
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(_: GetServerSidePropsContext) {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}
