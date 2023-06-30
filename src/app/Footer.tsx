import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-indigo-400 p-4 text-white text-center w-full">
            <div className="container mx-auto">
                <p className="mb-3">
                    &copy; {new Date().getFullYear()} Fried Liver
                </p>
            </div>
        </footer>
    );
};

export default Footer;
