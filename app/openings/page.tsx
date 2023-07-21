'use client';

import React from "react";
import Image from 'next/image';

const ChessOpeningsPage: React.FC = () => {
    return (
        <div className="flex flex-col sm:grid sm:grid-cols-[1.2fr,1.8fr] bg-slate-700 w-full">
            
            {/* King's Gambit */}
            <div className="flex justify-center items-top sm:ml-8 sm:mt-4 px-4 sm:px-0 py-2 sm:p-4">
                <div>
                <Image src="/kingsgambit-position.png" alt="King's Gambit" width={500} height={500} />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-cols-[3rem,1fr] sm:grid-cols-[1fr, 1fr] items-center gap-4 px-4 sm:px-6 sm:pl-8 pb-4 sm:pb-2 pt-4 sm:pt-8 bg-slate-700">
                    <div><Image className='rounded-md' src="/kingsgambit.png" alt="King's Gambit" width={48} height={48} /></div>
                    <h2 className="text-3xl font-bold">{"King's Gambit"}</h2>
                </div>
                <div className="mb-6 sm:pt-4 sm:pr-8 px-4 sm:px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
                    {"The King's Gambit, beginning with 1.e4 e5 2.f4, is a daring and aggressive opening, in which White sacrifices the f-pawn to gain quick development and control of the center. While uncommon in master level play, the opening is still one of the sharpest and most aggressive openings, and can serve a prepared amateur well."}
                    <br /><br />
                    {"Playing the King's Gambit requires not only theoretical knowledge, but also a combative spirit and a willingness to embrace complex positions. However, the upside is that you will be playing a sharp opening that is likely unfamiliar to your opponent, which comes with its own advantages."}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 mt-4 rounded-md shadow-md">
                        <ul className="list-decimal space-y-2">
                            {[
                                { title: 'Positions', value: '1,565' },
                                { title: 'Coverage', value: '80% of lines' },
                                { title: 'Depth', value: '15 moves' },
                                { title: 'Opponent', value: 'Lichess 1600' }
                            ].map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded">
                                    <span className="font-semibold">{item.title}:</span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>



                        
            {/* Evan's Fried Italian Liver */}
            <div className="flex justify-center items-top sm:ml-8 sm:mt-4 px-4 sm:px-0 py-2 sm:p-4">
                <div>
                <Image src="/trapitalian-position.png" alt="French Defense" width={500} height={500} />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-cols-[3rem,1fr] items-center gap-4 px-4 sm:px-6 sm:pl-8 pb-4 sm:pb-2 pt-4 sm:pt-8 bg-slate-700">
                    <div>
                        <Image className='rounded-md' src="/trapitalian.png" alt="French Defense" width={48} height={48} />
                    </div>
                    <h2 className="text-3xl font-bold">{"Evans Fried Italian Liver"}</h2>
                </div>
                <div className="mb-6 sm:pt-4 sm:pr-8 px-4 sm:px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
                    {"This deck teaches the respectably solid Italian Opening, but takes every opportunity to lead black into two of white's wildest haymakers: the Fried Liver Attack and the Evan's Gambit."}
                    <br /><br />
                    {"The Fried Liver Attack is one of the most aggressive openings in chess. White aims their knight and bishop directly at black's king with Ng5. Without careful play from your opponent, you can win a decisive advantage, or even the game, in only a few moves."}
                    <br /><br />
                    {"If black develops their bishop first instead of their knight, you can play the Evans Gambit, named for Welsh sea captain William Davies Evans. This gambit offers the b4 pawn in exchange for rapid development and control of the center."}

                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 mt-4 rounded-md shadow-md">
                        <ul className="list-decimal space-y-2">
                            {[
                                { title: 'Positions', value: '1,934' },
                                { title: 'Coverage', value: '92.5% of lines' },
                                { title: 'Depth', value: '16 moves' },
                                { title: 'Opponent', value: 'Lichess 1600' }
                            ].map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded">
                                    <span className="font-semibold">{item.title}:</span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>



                        
            {/* Scandinavian Defense */}
            <div className="flex justify-center items-top sm:ml-8 sm:mt-4 px-4 sm:px-0 py-2 sm:p-4">
                <div>
                <Image src="/scandinavian-position.png" alt="French Defense"width={500} height={500} />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-cols-[3rem,1fr] items-center gap-4 px-4 sm:px-6 sm:pl-8 pb-4 sm:pb-2 pt-4 sm:pt-8 bg-slate-700">
                    <div><Image className='rounded-md' src="/scandinavian.png" alt="French Defense" width={48} height={48} /></div>
                    <h2 className="text-3xl font-bold">{"Scandinavian Defense"}</h2>
                </div>
                <div className="mb-6 sm:pt-4 sm:pr-8 px-4 sm:px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
                    {"This somewhat unconventional response to 1. e4 has been employed by grandmasters at the highest levels and offers an interesting alternative to black's more typical choices. Black aims to rapidly develop their pieces immediately challenging white's control of the center."}
                    <br /><br />
                    {"This deck teaches the Modern Scandinavian, which delays capturing the pawn immediately with black queen. This variation of the Scandinavian can lead to unbalanced positions that catch some opponents off guard, especially if they are more accustomed to facing 2...Qxd5."}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 mt-4 rounded-md shadow-md">
                        <ul className="list-decimal space-y-2">
                            {[
                                { title: 'Positions', value: '825' },
                                { title: 'Coverage', value: '80% of lines' },
                                { title: 'Depth', value: '13 moves' },
                                { title: 'Opponent', value: 'Lichess 1600' }
                            ].map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded">
                                    <span className="font-semibold">{item.title}:</span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>


            {/* French Defense */}
            <div className="flex justify-center items-top sm:ml-8 sm:mt-4 px-4 sm:px-0 py-2 sm:p-4">
                <div>
                <Image src="/french-position.png" alt="French Defense" width={500} height={500} />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-cols-[3rem,1fr] items-center gap-4 px-4 sm:px-6 sm:pl-8 pb-4 sm:pb-2 pt-4 sm:pt-8 bg-slate-700">
                    <div><Image className='rounded-md' src="/french.png" alt="French Defense" width={48} height={48} /></div>
                    <h2 className="text-3xl font-bold">{"French Defense"}</h2>
                </div>
                <div className="mb-6 sm:pt-4 sm:pr-8 px-4 sm:px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
                    {"The French Defense is one of the most well-established answers to 1.e4, characterized by the moves: 1. e4 e6. The pawn on e6 helps to support a later ...d5 push, directly contesting White's claim to the center."}
                    <br /><br />
                    {"The French Defense is rich in strategic and tactical motifs. It allows for a wide range of middle game positions, from quiet positional games to sharp tactical battles, and remains a favorite among club players and professionals alike."}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 mt-4 rounded-md shadow-md">
                        <ul className="list-decimal space-y-2">
                            {[
                                { title: 'Positions', value: '766' },
                                { title: 'Coverage', value: '80% of lines' },
                                { title: 'Depth', value: '13 moves' },
                                { title: 'Opponent', value: 'Lichess 1600' }
                            ].map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded">
                                    <span className="font-semibold">{item.title}:</span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>



            {/* King's Indian */}
            <div className="flex justify-center items-top sm:ml-8 sm:mt-4 px-4 sm:px-0 py-2 sm:p-4">
                <div>
                <Image src="/kingsindian-position.png" alt="French Defense" width={500} height={500} />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-cols-[3rem,1fr] items-center gap-4 px-4 sm:px-6 sm:pl-8 pb-4 sm:pb-2 pt-4 sm:pt-8 bg-slate-700">
                    <div><Image className='rounded-md' src="/kingsindian.png" alt="King's Indian Defense" width={48} height={48} /></div>
                    <h2 className="text-3xl font-bold">{"King's Indian Defense"}</h2>
                </div>
                <div className="mb-6 sm:pt-4 sm:pr-8 px-4 sm:px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
                    {"The King's Indian Defense showcases two major schools of thought in opening theory. While white takes the traditional approach and establishes pawns in the center, black delays the immediate confrontation, aiming to control the center from a distance and counter later. This style, known as hypermodern, provides a new and interesting way of thinking about chess openings."}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 mt-4 rounded-md shadow-md">
                        <ul className="list-decimal space-y-2">
                            {[
                                { title: 'Positions', value: '2,306' },
                                { title: 'Coverage', value: '80% of lines' },
                                { title: 'Depth', value: '13 moves' },
                                { title: 'Opponent', value: 'Lichess 1600' }
                            ].map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded">
                                    <span className="font-semibold">{item.title}:</span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>


            {/* English Opening */}
            <div className="flex justify-center items-top sm:ml-8 sm:mt-4 px-4 sm:px-0 py-2 sm:p-4">
                <div>
                <Image src="/english-position.png" alt="French Defense" width={500} height={500} />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-cols-[3rem,1fr] items-center gap-4 px-4 sm:px-6 sm:pl-8 pb-4 sm:pb-2 pt-4 sm:pt-8 bg-slate-700">
                    <div><Image className='rounded-md' src="/english.png" alt="King's Indian Defense" width={48} height={48} /></div>
                    <h2 className="text-3xl font-bold">{"English Opening"}</h2>
                </div>
                <div className="mb-6 sm:pt-4 sm:pr-8 px-4 sm:px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
                    {"The English Opening, characterized by 1. c4 is white's third most popular opening, less popular by far compared to e4 and d4. Nevertheless, the English is a solid and well-developed opening that is not uncommon in top-level play."}
                    <br /><br />
                    {"A hypermodern opening like the King's Indian, the English Opening is known for its flexibility, and straddles the boundary between open and closed games. It can be an advantage to amateurs who want to take their opponent out of their comfort zone."}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 mt-4 rounded-md shadow-md">
                        <ul className="list-decimal space-y-2">
                            {[
                                { title: 'Positions', value: '3,800' },
                                { title: 'Coverage', value: '80% of lines' },
                                { title: 'Depth', value: '12 moves' },
                                { title: 'Opponent', value: 'Lichess 1600' }
                            ].map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded">
                                    <span className="font-semibold">{item.title}:</span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            
            {/* Sicilian Defense */}
            <div className="flex justify-center items-top sm:ml-8 sm:mt-4 px-4 sm:px-0 py-2 sm:p-4">
                <div>
                <Image src="/sicilian-position.png" alt="Sicilian Defense" width={500} height={500} />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-cols-[3rem,1fr] items-center gap-4 px-4 sm:px-6 sm:pl-8 pb-4 sm:pb-2 pt-4 sm:pt-8 bg-slate-700">
                    <div><Image className='rounded-md' src="/sicilian.png" alt="Sicilian Defense" width={48} height={48} /></div>
                    <h2 className="text-3xl font-bold">{"Sicilian Defense"}</h2>
                </div>
                <div className="mb-6 sm:pt-4 sm:pr-8 px-4 sm:px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
                    {'One of the most popular and well-analyzed responses to 1. e4, the Sicilian has been called the Cadillac of chess openings!'}
                    <br /><br />
                    {"Instead of mirroring white, black plays 1...c5, preparing to challenge white's central pawns while opening the c-file. The asymmetry of the Sicilian tends to lead to dynamic, fighting games."}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 mt-4 rounded-md shadow-md">
                        <ul className="list-decimal space-y-2">
                            {[
                                { title: 'Positions', value: '1,383' },
                                { title: 'Coverage', value: '80% of lines' },
                                { title: 'Depth', value: '13 moves' },
                                { title: 'Opponent', value: 'Lichess 1600' }
                            ].map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded">
                                    <span className="font-semibold">{item.title}:</span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>


            {/* Reti Opening */}
            <div className="flex justify-center items-top sm:ml-8 sm:mt-4 px-4 sm:px-0 py-2 sm:p-4">
                <div>
                <Image src="/reti-position.png" alt="Reti Opening" width={500} height={500} />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-cols-[3rem,1fr] items-center gap-4 px-4 sm:px-6 sm:pl-8 pb-4 sm:pb-2 pt-4 sm:pt-8 bg-slate-700">
                    <div><Image className='rounded-md' src="/reti.png" alt="Reti Opening" width={48} height={48} /></div>
                    <h2 className="text-3xl font-bold">{"Reti Opening"}</h2>
                </div>
                <div className="mb-6 sm:pt-4 sm:pr-8 px-4 sm:px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
                    {"The Reti Opening is the fourth most popular first move in chess. Like the English, the Reti is considered hypermodern, meaning it allows the opponent to occupy the center first, with the idea of undermining and counterattacking it later. The Reti is highly adaptible, allowing white to think a little more outside the box."}
                    <br /><br />
                    {"Consequently, the Reti is a little more forgiving in its early moves, with fewer sharp lines compared to openings like the Sicilian, where a single misstep at a critical point can be disastrous."}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 mt-4 rounded-md shadow-md">
                        <ul className="list-decimal space-y-2">
                            {[
                                { title: 'Positions', value: '1,732' },
                                { title: 'Coverage', value: '80% of lines' },
                                { title: 'Depth', value: '10 moves' },
                                { title: 'Opponent', value: 'Lichess 1600' }
                            ].map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded">
                                    <span className="font-semibold">{item.title}:</span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>


            {/* Fried Liver Attack */}
            <div className="flex justify-center items-top sm:ml-8 sm:mt-4 px-4 sm:px-0 py-2 sm:p-4">
                <div>
                <Image src="/friedliver-position.png" alt="Fried Liver Attack" width={500} height={500} />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-cols-[3rem,1fr] items-center gap-4 px-4 sm:px-6 sm:pl-8 pb-4 sm:pb-2 pt-4 sm:pt-8 bg-slate-700">
                    <div><Image className='rounded-md' src="/logo.png" alt="Fried Liver Attack" width={48} height={48} /></div>
                    <h2 className="text-3xl font-bold">{"Fried Liver Attack"}</h2>
                </div>
                <div className="mb-6 sm:pt-4 sm:pr-8 px-4 sm:px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
                    {"This deck offers a brief look at one of the most dangerous openings in chess: the Fried Liver Attack. White launches an early attack, threatening to fork the queen and rook. This line requires careful play from black, who risks losing a rook or being checkmated in the first few moves."}
                    <br /><br />
                    {"While the Fried Liver is a fun surprise, a well-prepared opponent will be able to stop the inital attack, and perhaps even respond with the dreaded Traxler Counterattack, which demands equally precise play from white."}
                    <br /><br />
                    {"If the Fried Liver is giving you a taste for blood, check out the Evans Fried Italian Liver deck, which offers a more expansive array of aggressive early-game tactics."}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 mt-4 rounded-md shadow-md">
                        <ul className="list-decimal space-y-2">
                            {[
                                { title: 'Positions', value: '54' },
                                { title: 'Coverage', value: '90% of lines' },
                                { title: 'Depth', value: '15 moves' },
                                { title: 'Opponent', value: 'Lichess 1600' }
                            ].map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded">
                                    <span className="font-semibold">{item.title}:</span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>


            {/* Open Game (White) */}
            <div className="flex justify-center items-top sm:ml-8 sm:mt-4 px-4 sm:px-0 py-2 sm:p-4">
                <div>
                <Image src="/opengamewhite-position.png" alt="Open Game (White)" width={500} height={500} />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-cols-[3rem,1fr] items-center gap-4 px-4 sm:px-6 sm:pl-8 pb-4 sm:pb-2 pt-4 sm:pt-8 bg-slate-700">
                    <div><Image className='rounded-md' src="/opengamewhite.png" alt="Open Game (White)" width={48} height={48} /></div>
                    <h2 className="text-3xl font-bold">{"Open Game (White)"}</h2>
                </div>
                <div className="mb-6 sm:pt-4 sm:pr-8 px-4 sm:px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
                    {"This deck offers the most straightforward application of the learning techinque used by this website. You'll learn the moves made by at least 80% of 1600-rated Lichess players, and the best responses to each, chosen by Stockfish. In the process, you'll learn to face popular black defenses like the Sicilian and the French."}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 mt-4 rounded-md shadow-md">
                        <ul className="list-decimal space-y-2">
                            {[
                                { title: 'Positions', value: '1,266' },
                                { title: 'Coverage', value: '80% of lines' },
                                { title: 'Depth', value: '12 moves' },
                                { title: 'Opponent', value: 'Lichess 1600' }
                            ].map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded">
                                    <span className="font-semibold">{item.title}:</span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>


            {/* Closed Game (White) */}
            <div className="flex justify-center items-top sm:ml-8 sm:mt-4 px-4 sm:px-0 py-2 sm:p-4">
                <div>
                <Image src="/closedgamewhite-position.png" alt="Closed Game (White)" width={500} height={500} />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-cols-[3rem,1fr] items-center gap-4 px-4 sm:px-6 sm:pl-8 pb-4 sm:pb-2 pt-4 sm:pt-8 bg-slate-700">
                    <div><Image className='rounded-md' src="/closedgamewhite.png" alt="Closed Game (White)" width={48} height={48} /></div>
                    <h2 className="text-3xl font-bold">{"Closed Game (White)"}</h2>
                </div>
                <div className="mb-6 sm:pt-4 sm:pr-8 px-4 sm:px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
                    {"Like the above deck, Closed Game (White) examines all of black's most popular reponses after 1. d4, at the Lichess 1600 level, with most games resulting in a Queen's Gambit."}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 mt-4 rounded-md shadow-md">
                        <ul className="list-decimal space-y-2">
                            {[
                                { title: 'Positions', value: '1,815' },
                                { title: 'Coverage', value: '80% of lines' },
                                { title: 'Depth', value: '12 moves' },
                                { title: 'Opponent', value: 'Lichess 1600' }
                            ].map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded">
                                    <span className="font-semibold">{item.title}:</span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>


            {/* Closed Game (Black) */}
            <div className="flex justify-center items-top sm:ml-8 sm:mt-4 px-4 sm:px-0 py-2 sm:p-4">
                <div>
                <Image src="/closedgameblack-position.png" alt="Closed Game (Black)" width={500} height={500} />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-cols-[3rem,1fr] items-center gap-4 px-4 sm:px-6 sm:pl-8 pb-4 sm:pb-2 pt-4 sm:pt-8 bg-slate-700">
                    <div><Image className='rounded-md' src="/closedgame.png" alt="Closed Game (Black)" width={48} height={48} /></div>
                    <h2 className="text-3xl font-bold">{"Closed Game (Black)"}</h2>
                </div>
                <div className="mb-6 sm:pt-4 sm:pr-8 px-4 sm:px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
                    {"This deck unleashes stockfish on d4 openings from black's perspective. It offers traditional, symmetric play, which allows for solid development early in the game."}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 mt-4 rounded-md shadow-md">
                        <ul className="list-decimal space-y-2">
                            {[
                                { title: 'Positions', value: '2,205' },
                                { title: 'Coverage', value: '80% of lines' },
                                { title: 'Depth', value: '13 moves' },
                                { title: 'Opponent', value: 'Lichess 1600' }
                            ].map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded">
                                    <span className="font-semibold">{item.title}:</span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>


        </div>
    );};

export default ChessOpeningsPage;
