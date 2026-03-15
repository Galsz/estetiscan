import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import VisualProof from "@/components/VisualProof";
import Demo from "@/components/Demo";
import Ethics from "@/components/Ethics";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Benefits />
        <HowItWorks />
        <VisualProof />
        <Demo />
        <Ethics />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
