/**
 * Landing page
 */

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Shops from "@/components/Shops";
import Contact from "@/components/Contact";
import LandingFooter from "@/components/LandingFooter";

export default function Landing() {
    return (
        <div className="min-h-screen overflow-x-clip">
            <Header />
            <main>
                <Hero />
                <HowItWorks />
                <Shops />
                <Contact />
            </main>
            <LandingFooter />
        </div>
    );
}
