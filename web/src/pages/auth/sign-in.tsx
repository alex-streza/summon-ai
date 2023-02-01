import { GetServerSideProps } from "next";
import { getProviders, signIn } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

const SignIn = ({ providers }: { providers: Record<string, any> }) => {
  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="mb-5 text-3xl font-black">Sign in</h1>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="border border-gray-900 px-5 py-2.5"
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: "/account",
              })
            }
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SignIn;
