/**
 *  Background component that provides a layered radial gradient background from https://www.bgvault.tech/
 *
 */
    
export default function Background() {
    return (
        <>
            <div className="fixed inset-0 bg-white dark:bg-gray-950 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.15)_0%,rgba(0, 55, 131, 0)_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.15)_0%,rgba(15,23,42,0)_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15)_0%,rgba(139,92,246,0)_60%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15)_0%,rgba(139,92,246,0)_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.15)_0%,rgba(14,165,233,0)_60%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.15)_0%,rgba(14,165,233,0)_60%)]" />
            </div>
        </>

    )
}