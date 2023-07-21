import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="py-6 px-2 sm:p-9 bg-slate-800 text-slate-300 text-sm sm:text-lg">
            <div className="flex justify-center">
            <a href='https://github.com/jackvandeleuv/memorize_openings' className='hover:text-slate-200'>GitHub</a>
            &nbsp;|&nbsp;<a href='https://fried-liver.com/about' className='hover:text-slate-200'>About</a>
            &nbsp;|&nbsp;<a href='https://docs.google.com/forms/d/e/1FAIpQLSeQqMmvhuEfcNp2-6OHMnnU9BNPZL0WFYxoQtWSMpfnjiH8Pg/viewform?usp=sf_link'className='hover:text-slate-200'>Feedback</a>
            &nbsp;|&nbsp;<a href='https://docs.google.com/forms/d/e/1FAIpQLSe2anomuhPypOpO79qid2sl141FawDz_H246DAeLVRYWVXVfg/viewform?usp=sf_link'className='hover:text-slate-200'>Delete Account</a>
            </div>
        </footer>
    );
};

export default Footer;
