import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="p-12 bg-indigo-500 text-black text-lg">
            <div className="flex justify-center">
            <a href='https://fried-liver.com/about' className='hover:text-indigo-300'>About</a>
            &nbsp;|&nbsp;<a href='https://docs.google.com/forms/d/e/1FAIpQLSeQqMmvhuEfcNp2-6OHMnnU9BNPZL0WFYxoQtWSMpfnjiH8Pg/viewform?usp=sf_link'className='hover:text-indigo-300'>Give Feedback</a>
            &nbsp;|&nbsp;<a href='https://docs.google.com/forms/d/e/1FAIpQLSe2anomuhPypOpO79qid2sl141FawDz_H246DAeLVRYWVXVfg/viewform?usp=sf_link'className='hover:text-indigo-300'>Delete Account</a>
            &nbsp;|&nbsp;<a href='https://github.com/jackvandeleuv/memorize_openings' className='hover:text-indigo-300'>GitHub</a>    
            </div>
        </footer>
    );
};

export default Footer;
