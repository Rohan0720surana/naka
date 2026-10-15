import { Hero } from "@/components/landing/Hero";
import { Nav } from "@/components/landing/Nav";
import { DemoCta, Features, Footer, HowItWorks, Inclusive, Problem, TradeMarquee } from "@/components/landing/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <TradeMarquee />
        <Problem />
        <HowItWorks />
        <Features />
        <Inclusive />
        <DemoCta />
      </main>
      <Footer />
    </>
  );
}
