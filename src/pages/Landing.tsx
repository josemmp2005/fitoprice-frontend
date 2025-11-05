import Header from "../components/Header";
import Hero from "../components/Hero";
import Background from "../components/Background";
import Problems from "../components/Problems";
import Characteristics from "../components/Characteristics";
import LandingFooter from "../components/LandingFooter";


export default function Landing() {
    return (
        <>
            <Header />
            <Background />
            <main className="relative min-h-screen flex flex-col p-4 mx-auto lg:max-w-2/3 items-center">
                <Hero />
                <Problems />
                <Characteristics />
                <LandingFooter />

            </main>

        </>
    )
}