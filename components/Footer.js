export default function Footer() {
    return (
        <footer className="text-center text-custom-black italic border-t bg-gray-200 fixed bottom-0 right-0 left-0">
            <div className="py-4">
                <p>&copy; {new Date().getFullYear()} Saveurs d'Anatolie</p>

            </div>
        </footer>
    );
}
