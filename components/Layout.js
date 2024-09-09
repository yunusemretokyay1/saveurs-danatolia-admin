import Nav from "@/components/Nav";
import Footer from "./Footer";
import { useSession, signIn, signOut } from "next-auth/react"






export default function Layout({ children }) {
    const { data: session } = useSession();
    if (!session) {
        return (
            <div className='bg-black min-h-screen '>
                <div className="text-center w-full">
                    <button onClick={() => signIn('google')} className="bg-white p-2 rounded-md">Login with Google</button>
                </div>
            </div>

        );
    }

    return (
        <div className='bg-black min-h-screen flex'>
            <Nav />
            <div className="bg-white flex-grow mt-2 mr-2 rounded-lg p-4">{children}</div>
            <Footer />
        </div>
    );
}
