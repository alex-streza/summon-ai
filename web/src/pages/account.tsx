import { trpc } from "../utils/trpc";

import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  NorthStarIcon,
} from "@primer/octicons-react";
import { GetServerSideProps, type NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useCallback, useState } from "react";
import spacetime from "spacetime";
import { Button } from "../components/buttons/Button";
import Input from "../components/inputs/Input";
import { Layout } from "../components/Layout";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import getStripe from "../utils/getStripe";
import Spinner from "../components/loading/Spinner";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

const Account: NextPage = () => {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);

  const subscriptionsQuery = trpc.auth.getSubscription.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const plansQuery = trpc.auth.getSubscriptionPlans.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const plan = plansQuery.data;

  const resetToken = trpc.auth.resetToken.useMutation({
    onSuccess: ({ token }) => setToken(token ?? ""),
  });
  const cancelPlan = trpc.auth.cancelPlan.useMutation({
    onSuccess: () => setTimeout(() => subscriptionsQuery.refetch(), 1000),
  });
  const reactivatePlan = trpc.auth.reactivatePlan.useMutation({
    onSuccess: () => setTimeout(() => subscriptionsQuery.refetch(), 1000),
  });

  const displayedToken =
    (token != "" ? token : subscriptionsQuery.data?.token) ?? "";

  const subscription = subscriptionsQuery.data?.subscriptions;
  const stats = subscriptionsQuery.data?.stats ?? {
    openjourney: 0,
    restore: 0,
    upscale: 0,
  };

  const cancelAt = subscription?.cancel_at
    ? spacetime(subscription.cancel_at).format(
        "{month-short} {date-ordinal} {year}"
      )
    : null;

  const total = subscriptionsQuery.isLoading
    ? 0
    : stats?.openjourney + stats?.restore + stats?.upscale;

  const isPro = subscriptionsQuery.isLoading
    ? false
    : subscription?.is_subscribed;

  const handleCopy = useCallback(() => {
    setCopied(true);
    navigator.clipboard.writeText(displayedToken);
    setTimeout(() => setCopied(false), 2000);
  }, [displayedToken]);

  const handleResetToken = useCallback(() => {
    resetToken.mutate();
  }, [resetToken]);

  const handleCancelPlan = useCallback(() => {
    if (subscription?.subscription_id) {
      window.confirm("Are you sure you want to cancel your subscription?") &&
        cancelPlan.mutate({
          subscriptionId: subscription?.subscription_id,
        });
    }
  }, [cancelPlan, subscription]);

  const handleReactivatePlan = useCallback(() => {
    if (subscription?.subscription_id) {
      reactivatePlan.mutate({
        subscriptionId: subscription?.subscription_id,
      });
    }
  }, [reactivatePlan, subscription]);

  const reachedLimit = total >= (!isPro ? 10 : 120);

  const handleCheckoutSession = useCallback(() => {
    setLoading(true);
    fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId: plan?.priceId,
        details: plan?.name,
        email: session?.user?.email,
      }),
    })
      .then((res) => res.json())
      .then(async (response) => {
        if (response.statusCode === 500) {
          console.error(response.message);
          return;
        }

        const stripe = await getStripe();
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: response.id,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [plan, session]);

  return (
    <Layout isDark>
      <NextSeo
        title="Summon AI - Account"
        description="Looking for unique, AI generated imagery? Look no further than Summon AI! Our directory is powered by a free and open-source Figma plugin, making it easy to access a limitless supply of professional-grade visuals. Boost your design skills with Summon AI today!"
      />
      {!subscriptionsQuery.isLoading && subscriptionsQuery.data && (
        <div className="mt-10 flex flex-col p-5 text-gray-500 md:flex-row md:items-start md:gap-20">
          <div className="flex gap-5 md:flex-col-reverse">
            <img
              src={session?.user?.image ?? ""}
              alt="User avatar"
              className="w-24 rounded-md md:w-40"
            />
            <div>
              <h1 className="mb-2 text-3xl font-black text-white">
                {session?.user?.name}
              </h1>
              <span>
                member since{" "}
                {spacetime(subscriptionsQuery.data.created_at ?? "").format(
                  "{month-short} {date-ordinal}"
                )}
              </span>
            </div>
          </div>
          <div className="grid md:grid-cols-2">
            <section className="mt-7 max-w-xs md:mt-0">
              <h2 className="mb-5 text-xl font-semibold text-white">
                Settings
              </h2>
              <Input
                label="API Token"
                value={
                  displayedToken.length > 0
                    ? displayedToken
                    : "**********************************"
                }
                icon={
                  displayedToken ? (
                    <button
                      className={`flex ${copied ? "text-green-500" : ""}`}
                      onClick={handleCopy}
                    >
                      {!copied ? <CopyIcon /> : <CheckIcon />}
                    </button>
                  ) : null
                }
                readOnly
              />
              <Button
                size="small"
                className="mt-2"
                onClick={handleResetToken}
                loading={resetToken.isLoading}
              >
                Reset token
              </Button>
              <span className="mt-2 block text-xs">
                {displayedToken.length > 0
                  ? "Copy this token and paste inside Summon.AI Figma plugin > Settings"
                  : "If you lost your token, you can reset it here (resets can't be undone)."}
              </span>
            </section>
            <section className="mt-7 md:mt-0">
              <h2 className="mb-5 text-xl font-semibold text-white">Stats</h2>
              {/* <div className="flex items-center gap-2">
                <h3 className="font-medium text-white">GEN1</h3>
                <span className="text-xs">
                  limited by your own DALL-E-2 token
                </span>
              </div> */}
              {/* <div className="mt-2 flex max-w-[148] items-center gap-9">
                <h4>DALL-E-2 images:</h4>
                <span className="text-green-500">
                  {subscriptionsQuery.data?.stats?.dall_e_2}
                </span>
              </div> */}
              <div className="mt-5 flex items-center gap-2">
                <h3 className="font-medium text-white">PRO GEN</h3>
                <span
                  className={`text-xs ${reachedLimit ? "text-red-500" : ""}`}
                >
                  {total}/{isPro ? 120 : 10}, resets monthly{" "}
                </span>
              </div>
              <div className="mt-2 flex max-w-[148] items-center gap-9">
                <h4>OpenJourney images:</h4>
                <span className="text-green-500">
                  {subscriptionsQuery.data?.stats?.openjourney}
                </span>
              </div>
              <div className="mt-2 flex max-w-[148] items-center gap-9">
                <h4>Restored images:</h4>
                <span className="text-green-500">
                  {subscriptionsQuery.data?.stats?.restore}
                </span>
              </div>
              <div className="mt-2 flex max-w-[148] items-center gap-9">
                <h4>Upscaled images:</h4>
                <span className="text-green-500">
                  {subscriptionsQuery.data?.stats?.upscale}
                </span>
              </div>
            </section>
            <section className="mt-7 md:mt-5">
              <h2 className="mb-1.5 text-xl font-semibold text-white">
                Billing
              </h2>
              <span className="text-xs">
                Manage your plan and billing details.
              </span>
              <h3 className="mt-5 mb-2 flex items-center font-medium text-white">
                <span className={`${cancelAt ? "line-through" : ""}`}>
                  Active plan
                </span>
                <span
                  className={`ml-2 flex w-fit gap-1 rounded-full border text-xs ${
                    cancelAt
                      ? "border-red-500 text-red-500"
                      : isPro
                      ? "border-green-500 text-green-500"
                      : ""
                  } bg-gray-800 px-3 py-1.5`}
                >
                  {isPro && <NorthStarIcon />}
                  {cancelAt ? "Canceled" : isPro ? "Pro" : "Free"}
                </span>
              </h3>
              <span className="block max-w-md text-xs">
                {isPro
                  ? "You get up to 120 images generated using OpenJourney, upscale, and restore models per month."
                  : "You get up to 10 images generated using OpenJourney, upscale, and restore models per month."}
              </span>
              {!isPro && plan && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-green-500">{plan.name}</span>
                  <span className="text-xs">{plan.price}</span>
                </div>
              )}
              {cancelAt && (
                <span className="mt-2 block max-w-xs text-xs text-red-500">
                  We are sorry to see you go 😢. Your pro plan will end on{" "}
                  {cancelAt}.
                </span>
              )}
              {!cancelAt &&
                (isPro ? (
                  <Button
                    intent="text"
                    className="!text-xs !text-red-700"
                    onClick={handleCancelPlan}
                    loading={cancelPlan.isLoading}
                  >
                    Cancel plan
                  </Button>
                ) : (
                  <Button
                    className="mt-4 !border-green-500 !text-green-500"
                    onClick={handleCheckoutSession}
                    loading={loading}
                  >
                    Upgrade now <ArrowUpRightIcon size={28} />
                  </Button>
                ))}
              {cancelAt && (
                <Button
                  className="mt-4 !text-green-500"
                  onClick={handleReactivatePlan}
                  loading={reactivatePlan.isLoading}
                  size="small"
                >
                  Reactivate plan <ArrowUpRightIcon />
                </Button>
              )}
            </section>
          </div>
        </div>
      )}
      {subscriptionsQuery.isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Spinner />
        </div>
      )}
    </Layout>
  );
};

export default Account;
