import React from 'react';
import type { NodeCG } from '@nodecg/types/types/nodecg';
import { useReplicant } from 'use-nodecg';
import type { ValueLabelPair } from '../types/schemas/index';
import { CivDisplay } from './CivDisplay';

export function Index() {
	const [civs, set_civs] = useReplicant<NodeCG.AssetFile[]>('assets:civs', []);

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

	return (
		<>
			<h1 className='leftName'>{leftName}</h1>
			<div className='leftBans' style={{}}>
				{new Array(leftBansCount).fill(undefined).map((_, i) => (
					<CivDisplay civ={leftBans[i]} banned={true} />
				))}
			</div>

			<div className='leftPicks'>
				{new Array(leftPicksCount).fill(undefined).map((_, i) => (
					<CivDisplay civ={leftPicks[i]} banned={false} />
				))}
			</div>

			<h1 className='rightName'>{rightName}</h1>
			<div className='rightPicks'>
				{new Array(rightPicksCount).fill(undefined).map((_, i) => (
					<CivDisplay civ={rightPicks[i]} banned={false} />
				))}
			</div>

			<div className='rightBans' style={{}}>
				{new Array(rightBansCount).fill(undefined).map((_, i) => (
					<CivDisplay civ={rightBans[i]} banned={true} />
				))}
			</div>
		</>
	);
}
