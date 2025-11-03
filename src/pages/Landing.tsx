import Header from "../components/Header";
import Hero from "../components/Hero";
import Background from "../components/Background";
import Problems from "../components/Problems";
import LandingFooter from "../components/LandingFooter";


export default function Landing() {
    return (
        <>
            <Header />
            <Background />
            <main className="relative min-h-screen flex flex-col p-4 mx-auto max-w-7xl items-center">
                <Hero />
                <Problems />
                <LandingFooter />

            </main>

        </>
    )
}