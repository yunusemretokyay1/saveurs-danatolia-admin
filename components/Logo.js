// Logo.js
import Link from "next/link";
import LogoSvg from '../public/logo.svg'; // SVG dosyanızı içe aktarın

export default function Logo() {
    return (
        <Link href={'/'} className="flex items-center bg-bgGray">
            <LogoSvg className="w-36 h-36" />

        </Link>
    );
}
