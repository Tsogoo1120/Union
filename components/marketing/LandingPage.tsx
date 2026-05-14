import Navbar from "./Navbar";
import Hero from "./Hero";
import VideoIntro from "./VideoIntro";
import FeatureCards from "./FeatureCards";
import PricingCard from "./PricingCard";
import FAQ from "./FAQ";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main id="main-content">
        <Hero />
        <VideoIntro />
        <FeatureCards />
        <PricingCard />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
