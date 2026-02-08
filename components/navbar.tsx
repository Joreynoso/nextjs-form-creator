import { ModeToggle } from "./themetoggle"

export default function Navbar() {

    // render return
    return (
        <nav className="w-flull py-8 flex justify-center items-center">
            <nav className='w-full max-w-7xl mx-auto flex justify-between items-center'>
                <h2 className="text-xl font-semibold">Form <span className="text-primary">Builder</span></h2>
                <ModeToggle />
            </nav>
        </nav>
    )
}