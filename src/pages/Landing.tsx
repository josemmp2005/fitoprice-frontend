import Header from "../components/Header";

export default function Landing() {
    return (
        <>
            <Header />
            <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-card max-w-4xl mx-auto">
                <section>
                    <h2 className="text-2xl">Landing Page</h2>
                </section>
            </main>

        </>
    )
}