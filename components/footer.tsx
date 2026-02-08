import { GithubIcon } from "lucide-react";
import Link from "next/link";

const Footer = () => {

    // render return
    return (
        <div
            className="w-full flex flex-col">
            <div className="grow bg-muted" />
            <footer className="border-t">
                <div className="max-w-(--breakpoint-xl) mx-auto">

                    <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
                        {/* Copyright */}
                        <span className="text-muted-foreground">
                            &copy; {new Date().getFullYear()}{" "}
                            <Link href="/" target="_blank">
                                Created by José Reynoso
                            </Link>
                            . All rights reserved.
                        </span>

                        <div className="flex items-center gap-5 text-muted-foreground">
                            <Link href="https://github.com/Joreynoso" target="_blank">
                                <GithubIcon className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;