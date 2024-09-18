

export default function Footer() {
    return (
        <footer className="text-center  text-custom-black italic border-t bg-gray-200 absolute bottom-0 right-0 left-0">

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
