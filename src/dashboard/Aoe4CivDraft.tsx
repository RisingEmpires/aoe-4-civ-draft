import React, { useEffect, useState } from 'react';
import { useReplicant } from 'use-nodecg';
import { CivDropdown } from './CivDropdown';
import * as NumericInput from "react-numeric-input";

export function Aoe4CivDraft() {

	//@ts-ignore
	const [options, set_options] = useState([]);
	const [civs, set_civs] = useReplicant<Array<any>>('assets:civs', []);

	//Could probably have 1 array instead of 3 replicants?
	const [leftBans, set_leftBans] = useReplicant<Array<any>>('leftBans', [{value: '', label: ''}]);
	const [leftBansCount, set_leftBansCount] = useReplicant<number>('leftBansCount', 1);
	const [leftBansDropdowns, set_leftBansDropdowns] = useState([]);

	const [leftPicks, set_leftPicks] = useReplicant<Array<any>>('leftPicks', ['']);
	const [leftPicksCount, set_leftPicksCount] = useReplicant<number>('leftPicksCount', 1);
	const [leftPicksDropdowns, set_leftPicksDropdowns] = useState([]);

	const [rightPicks, set_rightPicks] = useReplicant<Array<any>>('rightPicks', ['']);
	const [rightPicksCount, set_rightPicksCount] = useReplicant<number>('rightPicksCount', 1);
	const [rightPicksDropdowns, set_rightPicksDropdowns] = useState(['']);

	const [rightBans, set_rightBans] = useReplicant<Array<any>>('rightBans', ['']);
	const [rightBansCount, set_rightBansCount] = useReplicant<number>('rightBansCount', 1);
	const [rightBansDropdowns, set_rightBansDropdowns] = useState([]);

	//Set the options in the dropdown menu to avaliable civs from /assets/aoe4-civ-draft/civ
	useEffect(() => {
		console.log(civs)
		if (civs.length === 0) return;
		let _array = []
		civs.forEach((element, i) => {
			//Sometimes just fuck TypeScript.. I give up.. Ignore Errors and it still work 5head
			var name = element.name
			name = name.replace(/_/g, ' ');
			console.log(name)
			//@ts-ignore
			_array.push({ value: element.url, label: name });
		});
		//@ts-ignore
		_array.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))
		set_options(_array);
		console.log(JSON.stringify(options))
	}, [civs]);

	//Dropdown for Left bans
	useEffect(() => {
		let _array = []
		for (let i = 0; i < leftBansCount; i++) {
			//@ts-ignore
			_array.push(<CivDropdown civs={options} target={i} replicant={'leftBans'}/>)
		}
		set_leftBansDropdowns(_array);
	}, [leftBansCount, leftBans])

	//Dropdown for Left picks
	useEffect(() => {
		let _array = []
		for (let i = 0; i < leftPicksCount; i++) {
			//@ts-ignore
			_array.push(<CivDropdown civs={options} target={[i]} replicant={'leftPicks'} />)
		}
		set_leftPicksDropdowns(_array);
	}, [leftPicksCount, leftPicks])

	//Dropdown for Right bans
	useEffect(() => {
		let _array = []
		for (let i = 0; i < rightBansCount; i++) {
			//@ts-ignore
			_array.push(<CivDropdown civs={options} target={[i]} replicant={'rightBans'} />)
		}
		set_rightBansDropdowns(_array);
	}, [rightBansCount, rightBans])

	//Dropdown for Right picks
	useEffect(() => {
		let _array = []
		for (let i = 0; i < rightPicksCount; i++) {
			//@ts-ignore
			_array.push(<CivDropdown civs={options} target={[i]} replicant={'rightPicks'} />)
		}
		set_rightPicksDropdowns(_array);
	}, [rightPicksCount, rightPicks])

	useEffect(() => {
		set_leftBans([{value: '', label: ''}])
		set_rightBans([{value: '', label: ''}])
		set_leftPicks([{value: '', label: ''}])
		set_rightPicks([{value: '', label: ''}])
	},[])

	return (
		<>
			<div>
				<h1>Left Banned Civs</h1>
				<NumericInput min={0} max={9} value={leftBansCount} onChange={(newValue) => set_leftBansCount(newValue)} />
				{leftBansCount}
				{leftBansDropdowns}
				Bans:
				{JSON.stringify(leftBans)}
				<br/> <br/>
			</div>

			<div>
				<h1>Left Picked Civs</h1>
				<NumericInput min={0} max={9} value={leftPicksCount} onChange={(newValue) => set_leftPicksCount(newValue)} />
				{leftPicksCount}
				{leftPicksDropdowns}
				Picks:
				{JSON.stringify(leftPicks)}
				<br/><br/>
			</div>

			<div>
				<h1>Right Picked Civs</h1>
				<NumericInput min={0} max={9} value={rightPicksCount} onChange={(newValue) => set_rightPicksCount(newValue)} />
				{rightPicksCount}
				{rightPicksDropdowns}
				Picks:
				{JSON.stringify(rightPicks)}
				<br/><br/>
			</div>

			<div>
				<h1>Right Banned Civs</h1>
				<NumericInput min={0} max={9} value={rightBansCount} onChange={(newValue) => set_rightBansCount(newValue)} />
				{rightBansCount}
				{rightBansDropdowns}
				Bans:
				{JSON.stringify(rightBans)}
				<br/> <br/>
			</div>
		</>
	)
}