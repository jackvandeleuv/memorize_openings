import React, { useEffect, useState } from 'react';
import DropdownRow from './DropdownRow';
import { DeckInfo } from '@/app/learn/page';

interface DeckDropdownProps {
  deckIdOptions: Map<number, DeckInfo>;
  deckChoice: number;
  setDeckChoice: React.Dispatch<React.SetStateAction<number>>;
}

const DeckDropdown: React.FC<DeckDropdownProps> = ({ deckIdOptions, deckChoice, setDeckChoice }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	useEffect(() => {
		setIsLoaded(deckIdOptions.size > 0);
	}, [deckIdOptions]);


	function handleClick(e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation();
		setIsOpen(!isOpen);
		setDeckChoice(Number.parseInt(e.currentTarget.id));
	};


	return (
	<div className="flex flex-col">
		<div onClick={() => {setIsOpen(!isOpen)}} className="flex-grow border-2 border-indigo-400 hover:bg-indigo-200">
			{isLoaded ? 
				<DropdownRow 
					key={deckChoice}
					info={deckIdOptions.get(deckChoice)!}
					isLoaded={isLoaded}
					handleClick={() => {setIsOpen(!isOpen)}}
				/> :
				<DropdownRow 
					key={-1}
					info={{
						name: '', 
						newDue: 0, 
						reviewDue: 0, 
						deck_id: -1,
						image_path: ''
					}}
					isLoaded={isLoaded}
					handleClick={() => {}}
				/>
			}
		</div>
		{isOpen && (
			<div>
				{Array.from(deckIdOptions.entries())
				.filter(([key]) => key !== -1 && key !== deckChoice)
				.map(([key, value]) => (
					<DropdownRow
						key={value.name}
						info={value}
						isLoaded={isLoaded}
						handleClick={handleClick}
					/>
				))
				}
			</div>
		)
		}
	</div>
	);
	}

export default DeckDropdown;
