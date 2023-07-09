import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="p-20 bg-indigo-500 text-indigo-100">
            <div className="flex justify-center">
                &copy; {new Date().getFullYear()} Fried Liver
            </div>
        </footer>
    );
};

export default Footer;