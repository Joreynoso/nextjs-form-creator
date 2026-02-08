import Image from "next/image";
import { ModeToggle } from "@/components/themetoggle";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h2 className="text-3xl font-bold">Form Creator</h2>
      <ModeToggle />
    </div>
  );
}
