// components/Footer.js

export default function Footer() {
    return (
        <footer className="text-center  text-white italic border-t bg-[#0f1111] absolute bottom-0 right-0 left-0">
            <div className="text-center">
                <p>&copy; {new Date().getFullYear()} My E-commerce Site. All rights reserved.</p>
                <p>
                    Follow us on:
                    <a href="https://twitter.com" className="ml-2 text-blue-400">Twitter</a>,
                    <a href="https://facebook.com" className="ml-2 text-blue-600">Facebook</a>
                </p>
            </div>
        </footer>
    );
}
