import { GetServerSideProps } from "next";
import { getProviders, signIn } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { Button } from "../../components/buttons/Button";
import { Layout } from "../../components/Layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

const GoogleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36003 19.27 5.00003 16.25 5.00003 12C5.00003 7.9 8.20003 4.73 12.2 4.73C15.29 4.73 17.1 6.7 17.1 6.7L19 4.72C19 4.72 16.56 2 12.1 2C6.42003 2 2.03003 6.8 2.03003 12C2.03003 17.05 6.16003 22 12.25 22C17.6 22 21.5 18.33 21.5 12.91C21.5 11.76 21.35 11.1 21.35 11.1Z"
      fill="currentColor"
    />
  </svg>
);

const SignIn = ({ providers }: { providers: Record<string, any> }) => {
  return (
    <Layout isDark>
      <NextSeo
        title="Summon AI - Sign In"
        description="Looking for unique, AI generated imagery? Look no further than Summon AI! Our directory is powered by a free and open-source Figma plugin, making it easy to access a limitless supply of professional-grade visuals. Boost your design skills with Summon AI today!"
      />
      <div className="mt-10 flex flex-col items-center px-5 pt-5 text-center text-gray-500">
        <div className="flex max-w-sm flex-col items-center">
          <h1 className="mb-3 text-3xl font-black text-white">
            Join Summon.AI
          </h1>
          <p>
            Get access to better image generation, restoration and upscaling
            features within our Figma plugin.
          </p>
          {Object.values(providers).map((provider) => (
            <div className="mt-8" key={provider.name}>
              <Button
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: "/account",
                  })
                }
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5425 8.8974C18.223 8.41984 18.7349 7.73914 19.0048 6.95283C19.2747 6.16652 19.2889 5.31495 19.0452 4.52013C18.8014 3.7253 18.3124 3.02801 17.6481 2.52815C16.9838 2.02829 16.1784 1.75151 15.3472 1.73747L8.97292 1.63852C8.14165 1.62676 7.328 1.87841 6.64851 2.35741C5.96903 2.83641 5.4586 3.51819 5.19033 4.30507C4.92207 5.09194 4.90975 5.94354 5.15514 6.73785C5.40052 7.53215 5.89102 8.22841 6.55636 8.72687C6.04551 9.08288 5.62661 9.55522 5.33421 10.105C5.04181 10.6547 4.88428 11.2661 4.87461 11.8887C4.86495 12.5112 5.00343 13.1272 5.27863 13.6857C5.55383 14.2443 5.95786 14.7294 6.45742 15.1011C5.90482 15.4875 5.46072 16.0094 5.16767 16.6167C4.87461 17.2239 4.74243 17.8963 4.78377 18.5693C4.82511 19.2424 5.0386 19.8935 5.40377 20.4604C5.76895 21.0272 6.27358 21.4908 6.86932 21.8067C7.46505 22.1225 8.13192 22.2801 8.80603 22.2643C9.48014 22.2486 10.1389 22.0599 10.7192 21.7165C11.2995 21.3731 11.7819 20.8864 12.1201 20.3031C12.4584 19.7198 12.6411 19.0594 12.6509 18.3851L12.702 15.0949C13.1053 15.446 13.5759 15.7114 14.0851 15.8747C14.5943 16.038 15.1314 16.0959 15.6637 16.0448C16.196 15.9937 16.7124 15.8347 17.1812 15.5776C17.6501 15.3204 18.0616 14.9704 18.3908 14.549C18.7199 14.1276 18.9598 13.6435 19.0957 13.1263C19.2317 12.6091 19.2609 12.0697 19.1815 11.5409C19.1021 11.012 18.9159 10.5049 18.6341 10.0504C18.3523 9.59596 17.9809 9.20364 17.5425 8.8974ZM17.7232 5.71233C17.7108 6.35791 17.4436 6.9724 16.98 7.42184C16.5163 7.87128 15.8939 8.11925 15.2482 8.1117L12.811 8.07387L12.8867 3.19946L15.3239 3.23729C15.9695 3.24978 16.5839 3.51695 17.0334 3.98056C17.4828 4.44418 17.7308 5.06666 17.7232 5.71233ZM6.4746 5.53772C6.48709 4.89213 6.75426 4.27765 7.21788 3.8282C7.68149 3.37876 8.30397 3.13079 8.94964 3.13834L11.3868 3.17617L11.3112 8.05059L8.87397 8.01276C8.22839 8.00027 7.6139 7.7331 7.16446 7.26948C6.71502 6.80586 6.46705 6.18338 6.4746 5.53772ZM6.37566 11.912C6.38815 11.2664 6.65532 10.6519 7.11893 10.2024C7.58255 9.75299 8.20503 9.50502 8.85069 9.51258L11.2879 9.55041L11.2122 14.4248L8.77503 14.387C8.12944 14.3745 7.51496 14.1073 7.06552 13.6437C6.61607 13.1801 6.3681 12.5576 6.37566 11.912ZM8.67609 20.7612C8.0297 20.7512 7.41377 20.4848 6.9638 20.0206C6.51383 19.5565 6.26668 18.9326 6.27671 18.2862C6.28675 17.6398 6.55314 17.0239 7.0173 16.5739C7.48146 16.1239 8.10536 15.8768 8.75175 15.8868L11.189 15.9246L11.1511 18.3618C11.1386 19.0074 10.8715 19.6219 10.4078 20.0714C9.94423 20.5208 9.32175 20.7688 8.67609 20.7612ZM15.1493 14.4859C14.5029 14.4759 13.8869 14.2095 13.437 13.7453C12.987 13.2812 12.7399 12.6573 12.7499 12.0109C12.7599 11.3645 13.0263 10.7486 13.4905 10.2986C13.9546 9.84864 14.5785 9.60149 15.2249 9.61152C15.8713 9.62155 16.4872 9.88795 16.9372 10.3521C17.3872 10.8163 17.6343 11.4402 17.6243 12.0866C17.6143 12.7329 17.3479 13.3489 16.8837 13.7988C16.4195 14.2488 15.7956 14.496 15.1493 14.4859Z"
                    fill="currentColor"
                  />
                </svg>
                Sign in with {provider.name}
              </Button>
            </div>
          ))}
          <span className="my-8 block">or register a new one now</span>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <Button
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: "/account",
                  })
                }
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5425 8.8974C18.223 8.41984 18.7349 7.73914 19.0048 6.95283C19.2747 6.16652 19.2889 5.31495 19.0452 4.52013C18.8014 3.7253 18.3124 3.02801 17.6481 2.52815C16.9838 2.02829 16.1784 1.75151 15.3472 1.73747L8.97292 1.63852C8.14165 1.62676 7.328 1.87841 6.64851 2.35741C5.96903 2.83641 5.4586 3.51819 5.19033 4.30507C4.92207 5.09194 4.90975 5.94354 5.15514 6.73785C5.40052 7.53215 5.89102 8.22841 6.55636 8.72687C6.04551 9.08288 5.62661 9.55522 5.33421 10.105C5.04181 10.6547 4.88428 11.2661 4.87461 11.8887C4.86495 12.5112 5.00343 13.1272 5.27863 13.6857C5.55383 14.2443 5.95786 14.7294 6.45742 15.1011C5.90482 15.4875 5.46072 16.0094 5.16767 16.6167C4.87461 17.2239 4.74243 17.8963 4.78377 18.5693C4.82511 19.2424 5.0386 19.8935 5.40377 20.4604C5.76895 21.0272 6.27358 21.4908 6.86932 21.8067C7.46505 22.1225 8.13192 22.2801 8.80603 22.2643C9.48014 22.2486 10.1389 22.0599 10.7192 21.7165C11.2995 21.3731 11.7819 20.8864 12.1201 20.3031C12.4584 19.7198 12.6411 19.0594 12.6509 18.3851L12.702 15.0949C13.1053 15.446 13.5759 15.7114 14.0851 15.8747C14.5943 16.038 15.1314 16.0959 15.6637 16.0448C16.196 15.9937 16.7124 15.8347 17.1812 15.5776C17.6501 15.3204 18.0616 14.9704 18.3908 14.549C18.7199 14.1276 18.9598 13.6435 19.0957 13.1263C19.2317 12.6091 19.2609 12.0697 19.1815 11.5409C19.1021 11.012 18.9159 10.5049 18.6341 10.0504C18.3523 9.59596 17.9809 9.20364 17.5425 8.8974ZM17.7232 5.71233C17.7108 6.35791 17.4436 6.9724 16.98 7.42184C16.5163 7.87128 15.8939 8.11925 15.2482 8.1117L12.811 8.07387L12.8867 3.19946L15.3239 3.23729C15.9695 3.24978 16.5839 3.51695 17.0334 3.98056C17.4828 4.44418 17.7308 5.06666 17.7232 5.71233ZM6.4746 5.53772C6.48709 4.89213 6.75426 4.27765 7.21788 3.8282C7.68149 3.37876 8.30397 3.13079 8.94964 3.13834L11.3868 3.17617L11.3112 8.05059L8.87397 8.01276C8.22839 8.00027 7.6139 7.7331 7.16446 7.26948C6.71502 6.80586 6.46705 6.18338 6.4746 5.53772ZM6.37566 11.912C6.38815 11.2664 6.65532 10.6519 7.11893 10.2024C7.58255 9.75299 8.20503 9.50502 8.85069 9.51258L11.2879 9.55041L11.2122 14.4248L8.77503 14.387C8.12944 14.3745 7.51496 14.1073 7.06552 13.6437C6.61607 13.1801 6.3681 12.5576 6.37566 11.912ZM8.67609 20.7612C8.0297 20.7512 7.41377 20.4848 6.9638 20.0206C6.51383 19.5565 6.26668 18.9326 6.27671 18.2862C6.28675 17.6398 6.55314 17.0239 7.0173 16.5739C7.48146 16.1239 8.10536 15.8768 8.75175 15.8868L11.189 15.9246L11.1511 18.3618C11.1386 19.0074 10.8715 19.6219 10.4078 20.0714C9.94423 20.5208 9.32175 20.7688 8.67609 20.7612ZM15.1493 14.4859C14.5029 14.4759 13.8869 14.2095 13.437 13.7453C12.987 13.2812 12.7399 12.6573 12.7499 12.0109C12.7599 11.3645 13.0263 10.7486 13.4905 10.2986C13.9546 9.84864 14.5785 9.60149 15.2249 9.61152C15.8713 9.62155 16.4872 9.88795 16.9372 10.3521C17.3872 10.8163 17.6343 11.4402 17.6243 12.0866C17.6143 12.7329 17.3479 13.3489 16.8837 13.7988C16.4195 14.2488 15.7956 14.496 15.1493 14.4859Z"
                    fill="currentColor"
                  />
                </svg>
                Sign up with {provider.name}
              </Button>
            </div>
          ))}
          <p className="mt-10">
            Don&apos;t know whether you need an account? Check the{" "}
            <a
              href="https://www.figma.com/community/plugin/1172891596048319817"
              className="text-green-500 underline"
              target="_blank"
              rel="noreferrer"
            >
              Figma extension here
            </a>
            .
          </p>
        </div>
        <div className="mt-20 grid w-screen grid-cols-3 md:hidden">
          <div className="relative aspect-square">
            <Image
              src="https://replicate.delivery/pbxt/ETIiSJPZfekB00EqmOIGkjtIMECrG6EbmM1ft12n35EyUDvgA/out-0.png"
              alt="Summon AI"
              fill
            />
          </div>
          <div className="relative aspect-square">
            <Image
              src="https://imagedelivery.net/_X5WqasCPTrKkrSW6EvwJg/c2aaa66e-0834-407c-00a3-03ead2a40300/public"
              alt="Summon AI"
              fill
            />
          </div>
          <div className="relative aspect-square">
            <Image
              src="https://imagedelivery.net/_X5WqasCPTrKkrSW6EvwJg/9fa83a68-8c04-4e2f-af82-17117b72fa00/public"
              alt="Summon AI"
              fill
            />
          </div>
          <div className="relative aspect-square">
            <Image
              src="https://imagedelivery.net/_X5WqasCPTrKkrSW6EvwJg/94062f5e-7432-4585-3cee-290adb2ec400/public"
              alt="Summon AI"
              fill
            />
          </div>
          <div className="relative aspect-square">
            <Image
              src="https://imagedelivery.net/_X5WqasCPTrKkrSW6EvwJg/aa544a70-d097-484f-4fa6-a9356d02bc00/public"
              alt="Summon AI"
              fill
            />
          </div>
          <div className="relative aspect-square">
            <Image
              src="https://imagedelivery.net/_X5WqasCPTrKkrSW6EvwJg/78095b59-18da-413e-31aa-1f07f69fca00/public"
              alt="Summon AI"
              fill
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
