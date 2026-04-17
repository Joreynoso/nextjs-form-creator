import CardsHome from '@/components/cardshome';
import FAQ from '@/components/faq';
import Hero from "@/components/hero";

export default function Home() {

  // render return
  return (
    <div className="w-full flex  flex-col justify-center items-center">
      <Hero />
      <CardsHome />
      <FAQ />
    </div>
  );
}
