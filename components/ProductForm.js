import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const adminEmails = ['yunusemretokyay@gmail.com'];

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET, // Secret anahtarını güncelledik
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID, // GOOGLE_ID yerine GOOGLE_CLIENT_ID kullanın
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // GOOGLE_SECRET yerine GOOGLE_CLIENT_SECRET kullanın
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        session: ({ session, token, user }) => {
            // Admin email kontrolü
            if (adminEmails.includes(session?.user?.email)) {
                return session;
            } else {
                return false; // veya res.redirect('/unauthorized') gibi bir yönlendirme yapılabilir
            }
        },
    },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!adminEmails.includes(session?.user?.email)) {
        res.status(401).end();
        throw new Error('Not an admin');
    }
}
