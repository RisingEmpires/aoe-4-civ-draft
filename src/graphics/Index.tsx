import React, { useEffect } from 'react';
import type { NodeCG } from '@nodecg/types/types/nodecg';
import { useReplicant } from 'use-nodecg';
import type { ValueLabelPair } from '../types/schemas/index';
import { CivDisplay } from './CivDisplay';

export function Index() {
	// Could probably have 1 array instead of 2 replicants?
	const [leftBans, set_leftBans] = useReplicant<ValueLabelPair[]>('leftBans', []);
	const [leftBansCount, set_leftBansCount] = useReplicant<number>('leftBansCount', 1);

	const [leftPicks, set_leftPicks] = useReplicant<ValueLabelPair[]>('leftPicks', []);
	const [leftPicksCount, set_leftPicksCount] = useReplicant<number>('leftPicksCount', 1);

	const [rightPicks, set_rightPicks] = useReplicant<ValueLabelPair[]>('rightPicks', []);
	const [rightPicksCount, set_rightPicksCount] = useReplicant<number>('rightPicksCount', 1);

	const [rightBans, set_rightBans] = useReplicant<ValueLabelPair[]>('rightBans', []);
	const [rightBansCount, set_rightBansCount] = useReplicant<number>('rightBansCount', 1);

	const [leftName, set_leftName] = useReplicant<string>('leftName', '');
	const [rightName, set_rightName] = useReplicant<string>('rightName', '');

	const [updateDraft, set_updateDraft] = useReplicant<boolean>('updateDraft', true);

	//Alright,, this is pretty bad.. But it works.. Creates a duplicate of the options/settings to the be updated when Update Draft button is clicked
	const [l_leftBans, set_l_leftBans] = useReplicant<ValueLabelPair[]>('l_leftBans', []);
	const [l_leftBansCount, set_l_leftBansCount] = useReplicant<number>('l_leftBansCount', 1);

	const [l_leftPicks, set_l_leftPicks] = useReplicant<ValueLabelPair[]>('l_leftPicks', []);
	const [l_leftPicksCount, set_l_leftPicksCount] = useReplicant<number>('l_leftPicksCount', 1);

	const [l_rightPicks, set_l_rightPicks] = useReplicant<ValueLabelPair[]>('l_rightPicks', []);
	const [l_rightPicksCount, set_l_rightPicksCount] = useReplicant<number>('l_rightPicksCount', 1);

	const [l_rightBans, set_l_rightBans] = useReplicant<ValueLabelPair[]>('l_rightBans', []);
	const [l_rightBansCount, set_l_rightBansCount] = useReplicant<number>('l_rightBansCount', 1);

	const [l_leftName, set_l_leftName] = useReplicant<string>('l_leftName', '');
	const [l_rightName, set_l_rightName] = useReplicant<string>('l_rightName', '');

	const [gfxReady, set_gfxReady] = useReplicant<boolean>('gfxReady', false);

	function delay(time: number | undefined) {
		return new Promise(resolve => setTimeout(resolve, time));
	}

	useEffect(() => {
		const setGraphics = async () => {
			console.log("wait")
			await delay(500)
			console.log("ok go")

			set_l_leftBans(leftBans)
			console.log(l_leftBans)
			set_l_leftBansCount(leftBansCount)
			set_l_leftPicks(leftPicks)
			set_l_leftPicksCount(leftPicksCount)
			set_l_rightPicks(rightPicks)
			set_l_rightPicksCount(rightPicksCount)
			set_l_rightBans(rightBans)
			set_l_rightBansCount(rightBansCount)
			set_l_leftName(leftName)
			set_l_rightName(rightName)
			set_gfxReady(true)
		}

		setGraphics();

	}, [updateDraft])

	return (
		<>
			{gfxReady ? <>
				<h1 className='leftName'>{l_leftName}</h1>
				<div className='leftBans' style={{}}>
					{new Array(l_leftBansCount).fill(undefined).map((_, i) => (
						<CivDisplay civ={l_leftBans[i]} banned={true} />
					))}
				</div>

				<div className='leftPicks'>
					{new Array(l_leftPicksCount).fill(undefined).map((_, i) => (
						<CivDisplay civ={l_leftPicks[i]} banned={false} />
					))}
				</div>

				<h1 className='rightName'>{l_rightName}</h1>
				<div className='rightPicks'>
					{new Array(l_rightPicksCount).fill(undefined).map((_, i) => (
						<CivDisplay civ={l_rightPicks[i]} banned={false} />
					))}
				</div>

				<div className='rightBans' style={{}}>
					{new Array(l_rightBansCount).fill(undefined).map((_, i) => (
						<CivDisplay civ={l_rightBans[i]} banned={true} />
					))}
				</div>
				</>:<></>
		}
		</>
	);
}
