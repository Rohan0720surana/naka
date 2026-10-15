import { Hero } from "@/components/landing/Hero";
import { MorningStory } from "@/components/landing/MorningStory";
import { Nav } from "@/components/landing/Nav";
import { DemoCta, DesignLedger, FeatureWall, Footer, Personas, PosterWall, SignBand } from "@/components/landing/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <SignBand />
        <MorningStory />
        <Personas />
        <PosterWall />
        <FeatureWall />
        <DesignLedger />
        <DemoCta />
      </main>
      <Footer />
    </>
  );
}
