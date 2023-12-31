import React, { useEffect, useState } from 'react';
import type { NodeCG } from '@nodecg/types/types/nodecg';
import { useReplicant } from 'use-nodecg';
import { CivDisplay } from './CivDisplay';

interface ValueLabelPair {
	value: string;
	label: string;
}

interface DropdownOption {
	value: string;
	label: string;
	picked: boolean;
  }

export function Index() {

	const [theme, set_theme] = useReplicant<{ value: string; label: string; }>('theme', { value: '../../../assets/nodecg-themer/themes/default.css', label: 'default' }, { namespace: 'nodecg-themer' });

	// Could probably have 1 array instead of 2 replicants?
	const [leftBans, set_leftBans] = useReplicant<DropdownOption[]>('leftBans', [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }]);
	const [leftBansCount, set_leftBansCount] = useReplicant<number>('leftBansCount', 1);

	const [leftPicks, set_leftPicks] = useReplicant<DropdownOption[]>('leftPicks', [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }]);
	const [leftPicksCount, set_leftPicksCount] = useReplicant<number>('leftPicksCount', 1);

	const [rightPicks, set_rightPicks] = useReplicant<DropdownOption[]>('rightPicks', [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }]);
	const [rightPicksCount, set_rightPicksCount] = useReplicant<number>('rightPicksCount', 1);

	const [rightBans, set_rightBans] = useReplicant<DropdownOption[]>('rightBans', [{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random", picked: false }]);
	const [rightBansCount, set_rightBansCount] = useReplicant<number>('rightBansCount', 1);

	const [leftName, set_leftName] = useReplicant<string>('leftName', '');
	const [leftUnderText, set_leftUnderText] = useReplicant<string>('leftUnderText', '');
	const [rightName, set_rightName] = useReplicant<string>('rightName', '');
	const [rightUnderText, set_rightUnderText] = useReplicant<string>('rightUnderText', '');

	const [updateDraft, set_updateDraft] = useReplicant<boolean>('updateDraft', true);

	const [graphics, set_graphics] = useState(<></>)
	useEffect(() => {
		set_graphics(<>
			<h1 className='draft-leftName'>{leftName}</h1>
			<h1 className='draft-leftUnderText'>{leftUnderText}</h1>
			<div className='draft-leftBans' style={{}}>
				{new Array(leftBansCount).fill(undefined).map((_, i) => (
					<CivDisplay civ={leftBans[i]} banned={true} />
				))}
			</div>

			<div className='draft-leftPicks'>
				{new Array(leftPicksCount).fill(undefined).map((_, i) => (
					<CivDisplay civ={leftPicks[i]} picked={leftPicks[i]?.picked} banned={false} displayName/>
				))}
			</div>

			<h1 className='draft-rightName'>{rightName}</h1>
			<h1 className='draft-rightUnderText'>{rightUnderText}</h1>
			<div className='draft-rightPicks'>
				{new Array(rightPicksCount).fill(undefined).map((_, i) => (
					<CivDisplay civ={rightPicks[i]} picked={rightPicks[i]?.picked} banned={false} displayName/>
				))}
			</div>

			<div className='draft-rightBans' style={{}}>
				{new Array(rightBansCount).fill(undefined).map((_, i) => (
					<CivDisplay civ={rightBans[i]} banned={true}/>
				))}
			</div></>)
	}, [updateDraft])

	const [themeDiv, set_themeDiv] = useState(<></>)

	useEffect(() => {
		console.log(theme)
		if (!theme) return;
		console.log(theme)
		set_themeDiv(<link rel='stylesheet' type='text/css' href={theme.value} />)
	}, [theme])

	return (
		<>
			{themeDiv}
			{graphics}
		</>
	);
}
