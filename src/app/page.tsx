import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Planner } from "@/components/planner";
import { Credibility } from "@/components/credibility";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <Planner />
      <Credibility />
      <Footer />
    </main>
  );
}
