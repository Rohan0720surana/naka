import { Onboarding } from "@/components/worker/Onboarding";

export default async function WelcomePage({ searchParams }: PageProps<"/worker/welcome">) {
  const sp = await searchParams;
  return <Onboarding assisted={sp.for === "saathi"} />;
}
