import { ModeToggle } from "./themetoggle"

export default function Navbar() {

    // render return
    return (
        <nav className="flex items-center justify-between p-4">
            <h2 className="text-3xl font-bold">Form Creator</h2>
            <ModeToggle />
        </nav>
    )
}