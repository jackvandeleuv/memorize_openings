import React from 'react';
import { DeckInfo } from './learn/page';
import { BeatLoader } from 'react-spinners';
import Image from 'next/image';
import AboutDeckButton from './AboutDeckButton';

interface DropdownRowProps {
	info: DeckInfo;
	isLoaded: boolean;
	handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const DropdownRow: React.FC<DropdownRowProps> = ({ info, isLoaded, handleClick }) => {
	return (
		<>
			{isLoaded && info !== undefined ? 
				<div onClick={(e) => {handleClick(e)}} id={info.deck_id.toString()} className='flex flex-row items-center p-2 hover:bg-indigo-200'>
					<div className='flex justify-center items-center'>
						<Image
							src={info.image_path}
							alt="logo"
							height={48}
							width={48}
						/>
					</div>
					<div className='flex flex-col p-2'>
						<div className="text-lg sm:text-xl">
							{info.name}
						</div>
						<div className="flex flex-row gap-2 text-sm sm:text-md">
							<div>
								New: {info.newDue}
							</div>
							<div>
								Review: {info.reviewDue}
							</div>
						</div>
					</div> 
				</div> :
				<div className='flex justify-center items-center py-8'>
					<BeatLoader color={"#818cf8"} loading={!isLoaded} size={12} />
				</div>
			}
		</>
	);
};

export default DropdownRow;
