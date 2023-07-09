import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="p-20 bg-indigo-500 text-indigo-200">
            <div className="flex justify-center">
            <a href='https://fried-liver.com/about' className='hover:text-indigo-300'>About</a>
            &nbsp;|&nbsp;<a href='https://fried-liver.com/faq' className='hover:text-indigo-300'>FAQ</a>
            &nbsp;|&nbsp;<a href='https://github.com/jackvandeleuv/memorize_openings' className='hover:text-indigo-300'>GitHub</a>    
            </div>
        </footer>
    );
};

export default Footer;
