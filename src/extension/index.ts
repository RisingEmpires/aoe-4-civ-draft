import type NodeCG from '@nodecg/types';
import { klona } from 'klona';

interface DropdownOption {
	value: string;
	label: string;
	picked?: boolean;
}

interface ValueLabelPair {
	value: string;
	label: string;
}

//Convert from simple name to ValueLabelPair for use in Dashboard and Graphics
let civMap = new Map<string, ValueLabelPair>([
	['AbbasidDynasty', {
		"value": "/assets/aoe-4-civ-draft/civs/Abbasid_Dynasty.png",
		"label": "Abbasid Dynasty"
	}],
	['Chinese', {
		"value": "/assets/aoe-4-civ-draft/civs/Chinese.png",
		"label": "Chinese"
	}],
	['DelhiSultanate', {
		"value": "/assets/aoe-4-civ-draft/civs/Delhi_Sultanate.png",
		"label": "Delhi Sultanate"
	}],
	['English', {
		"value": "/assets/aoe-4-civ-draft/civs/English.png",
		"label": "English"
	}],
	['French', {
		"value": "/assets/aoe-4-civ-draft/civs/French.png",
		"label": "French"
	}],
	['HolyRomanEmpire', {
		"value": "/assets/aoe-4-civ-draft/civs/Holy_Roman_Empire.png",
		"label": "Holy Roman Empire"
	}],
	['Malians', {
		"value": "/assets/aoe-4-civ-draft/civs/Malians.png",
		"label": "Malians"
	}],
	['Mongols', {
		"value": "/assets/aoe-4-civ-draft/civs/Mongols.png",
		"label": "Mongols"
	}],
	['Ottomans', {
		"value": "/assets/aoe-4-civ-draft/civs/Ottomans.png",
		"label": "Ottomans"
	}],
	['Rus', {
		"value": "/assets/aoe-4-civ-draft/civs/Rus.png",
		"label": "Rus"
	}],
	['Byzantines', {
		"value": "/assets/aoe-4-civ-draft/civs/Byzantines.png",
		"label": "Byzantines"
	}],
	['Japanese', {
		"value": "/assets/aoe-4-civ-draft/civs/Japanese.png",
		"label": "Japanese"
	}],
	['Ayyubids', {
		"value": "/assets/aoe-4-civ-draft/civs/Ayyubids.png",
		"label": "Ayyubids"
	}],
	['OrderOfTheDragon', {
		"value": "/assets/aoe-4-civ-draft/civs/Order_Of_The_Dragon.png",
		"label": "Order of The Dragon"
	}],
	['ZhuXisLegacy', {
		"value": "/assets/aoe-4-civ-draft/civs/Zhu_Xi_Legacy.png",
		"label": "Zhu Xi's Legacy"
	}],
	['JeanneDArc', {
		"value": "/assets/aoe-4-civ-draft/civs/Jeanne_D_Arc.png",
		"label": "Jeanne d'Arc"
	}],

])

let aoe2cmCivs = [
	"aoe4.AbbasidDynasty",
	"aoe4.Chinese",
	"aoe4.DelhiSultanate",
	"aoe4.English",
	"aoe4.French",
	"aoe4.HolyRomanEmpire",
	"aoe4.Malians",
	"aoe4.Mongols",
	"aoe4.Ottomans",
	"aoe4.Rus",
	//These might change
	"aoe4.Byzantines",
	"aoe4.Japanese",
	"aoe4.Ayyubids",
	"aoe4.JeanneDArc",
	"aoe4.ZhuXiLegacy",
	"aoe4.OrderOfTheDragon",
]

module.exports = function (nodecg: NodeCG.ServerAPI) {

	let leftBans = nodecg.Replicant('leftBans', 'aoe-4-civ-draft', {
		defaultValue: [{ value: '', label: '', picked: false }]
	})

	let leftPicks = nodecg.Replicant('leftPicks', 'aoe-4-civ-draft', {
		defaultValue: [{ value: '', label: '', picked: false }]
	})

	let rightBans = nodecg.Replicant('rightBans', 'aoe-4-civ-draft', {
		defaultValue: [{ value: '', label: '', picked: false }]
	})

	let rightPicks = nodecg.Replicant('rightPicks', 'aoe-4-civ-draft', {
		defaultValue: [{ value: '', label: '', picked: false }]
	})

	const getDraftInfo = async (draftUrlOrId: string) => {
		const draftIdInfo = getDraftId(draftUrlOrId)
		if (!draftIdInfo.isValid) {
			console.error('Unable to parse aoe2cm.net URL.')

			return
		}

		//@ts-ignore
		const draftResults = await fetchDraftResults(draftIdInfo?.draftId)
		if (!draftResults) {
			console.error('Failed to fetch draft results')

			return
		}

		const parsedDraftResults = parseDraftResults(draftResults)
		if (!parsedDraftResults) {
			console.error('Failed to process draft results')
		}

		return parsedDraftResults
	}

	const getDraftId = (draftUrlOrId: any) => {
		// Assume this is a draft ID
		if (typeof draftUrlOrId === 'string' && draftUrlOrId?.length === 5) {
			return { isValid: true, draftId: draftUrlOrId }
		}
		try {
			const url = new URL(draftUrlOrId)
			const hostname = url.hostname.toLowerCase().replace('www.', '')
			// Looks like: /draft/fvJqL
			const path = url.pathname.split('/')

			if (
				hostname !== 'aoe2cm.net' ||
				path?.[1]?.toLowerCase() !== 'draft' ||
				path?.[2]?.length !== 5
			) {
				return { isValid: false }
			}

			return { isValid: true, draftId: path[2] }
		} catch (error) {
			// If we get here, the URL itself wasn't valid
			return { isValid: false }
		}
	}

	const fetchDraftResults = async (draftId: string) => {
		try {
			const draftResults = await fetch(`https://aoe2cm.net/api/draft/${draftId}`)
			const resultData = await draftResults.json()

			return resultData
		} catch (error) {
			console.error(error)

			return
		}
	}

	const parseDraftResults = (data: { events: any; nameHost: any; nameGuest: any; preset: any; }) => {
		const { events, nameHost, nameGuest, preset } = data

		// Add more support as needed, yo
		console.log(preset)
		const draftType = getDraftType(preset)
		if (!draftType) {
			return
		}

		const processedEventData: any = { GUEST: {}, HOST: {} }
		for (let i = 0; i < events?.length; i++) {
			const event = events[i]
			const { player } = event

			if (!['HOST', 'GUEST'].includes(player)) {
				continue
			}

			const { actionType, chosenOptionId } = event
			// The civs have "aoe4." in front of them. Maps don't appear to
			const mapOrCiv = chosenOptionId.replace('aoe4.', '')

			switch (actionType) {
				case 'pick':
					if (!processedEventData[player]['picks']?.length) {
						processedEventData[player]['picks'] = []
					}

					processedEventData[player]['picks'].push(mapOrCiv)
					break

				case 'ban':
					if (!processedEventData[player]['bans']?.length) {
						processedEventData[player]['bans'] = []
					}

					processedEventData[player]['bans'].push(mapOrCiv)
					break
				case 'snipe':
					// Gotta flip the player we're looking at here, since the picking player !== the person being sniped
					const snipedPlayer = player === 'HOST' ? 'GUEST' : 'HOST'
					if (!processedEventData[snipedPlayer]['sniped']?.length) {
						processedEventData[snipedPlayer]['sniped'] = []
					}

					processedEventData[snipedPlayer]['sniped'].push(mapOrCiv)

					// Gotta remove this pick from the player's pool
					const snipedPickIndex =
						processedEventData[snipedPlayer]['picks'].indexOf(mapOrCiv)
					processedEventData[snipedPlayer]['picks'].splice(snipedPickIndex, 1)

					break

				default:
					// Anything that makes it this far is something I haven't seen
					console.log(`Unknown actionType detected: ${actionType}`)
			}
		}

		const hostEventData = processedEventData.HOST
		const guestEventData = processedEventData.GUEST

		const hostData: any = {
			name: nameHost,
		}
		hostData[draftType] = hostEventData

		const guestData: any = {
			name: nameGuest,
		}
		guestData[draftType] = guestEventData

		return {
			presetId: preset?.presetId,
			presetName: preset?.name,
			draftType,
			team1: hostData,
			team2: guestData,
		}
	}

	const getDraftType = (preset: string) => {

		//@ts-ignore
		switch (preset?.presetId) {
			// RE 2v2 V3
			case 'memHU':
			// Warchief Club v3 & LEL
			case 'byxel':
			// Warchief Club v3 (trial)
			case 'lWygK':
			// Corvinus 2v2
			case 'ifRMd':
				return 'civs'

			// REL S2 Map Draft
			case 'KGDHa':
				return 'maps'
			// If all doesn't go well, lets find out what it is
			default:
				console.log("Trying to get unknown preset")
				//@ts-ignore
				if (aoe2cmCivs.includes(preset.draftOptions[0].name)) {
					console.log("Found a civ as the option, assuming its a civ draft")
					return 'civs'
				} else {
					console.log("No civ found, assuming its a map draft")
					return 'maps'
				}
		}
	}

	nodecg.listenFor('getDraft', async (url: string) => {

		const civDraft = await getDraftInfo(url)

		let lockBans = nodecg.Replicant('lockBans')

		//@ts-ignore
		if (!civDraft?.team1?.civs) {
			console.error('Could not parse civ draft. Could be a bad URL, could be not a civ draft')
			console.log(civDraft)
			return
		} else {
			//how to ruin good looking code by making my own :')

			//Bans not locked, we shall update!
			if (lockBans.value == false) {


				//#region Set bans and banned count
				let _leftBans: (ValueLabelPair | undefined)[] = []
				let _rightBans: (ValueLabelPair | undefined)[] = []

				//Set left side Bans Count & add them to the array
				let _leftBansCount = 0
				//Check if the value exists, can happend depending on how the draft
				if (civDraft.team1?.civs.bans) {
					let _civMap = klona(civMap)
					//Add to the count depending on the length
					_leftBansCount += civDraft.team1?.civs.bans?.length
					//For each civ that was banned, push it in the format that Dashboard and Graphics support (ValueLabelPair)
					civDraft.team1?.civs.bans.forEach((element: any, i: string | number) => {
						_leftBans.push(_civMap.get(element))
					});
				}
				//Check if some civs from the other side was sniped, meaning left side can't play it
				//At some point we could probably figure out how to pass a proper value so that in the Graphics it's highlighted it was sniped and not banned
				if (civDraft.team2?.civs.sniped) {
					//A given object cannot belong to multiple Replicants. So need to do deep clone
					let _civMap = klona(civMap)
					//Add to the count depending on length
					_leftBansCount += civDraft.team2.civs.sniped?.length
					//For each civ that was sniped on the opponents team, add to the banned array
					civDraft.team2?.civs.sniped.forEach((element: any, i: string | number) => {
						_leftBans.push(_civMap.get(element))
					});
				}

				console.log("LeftBansCount" + _leftBansCount)

				//Set the replicant depending on the count from above
				let leftBansCount = nodecg.Replicant('leftBansCount')
				leftBansCount.value = _leftBansCount;


				//Rinse and repeat for right side.
				//Set right side Bans Count
				let _rightBansCount = 0
				if (civDraft.team2?.civs.bans) {
					let rightBansMap = klona(civMap)
					_rightBansCount += civDraft.team2?.civs.bans?.length
					civDraft.team2?.civs.bans.forEach((element: any, i: string | number) => {
						_rightBans.push(rightBansMap.get(element))
					});
				}
				if (civDraft.team1?.civs.sniped) {
					let _civMap = klona(civMap)
					_rightBansCount += civDraft.team1.civs.sniped?.length
					civDraft.team1?.civs.sniped.forEach((element: any, i: string | number) => {
						_rightBans.push(_civMap.get(element))
					});
				}

				console.log("RightBansCount" + _rightBansCount)

				let rightBansCount = nodecg.Replicant('rightBansCount')
				rightBansCount.value = _rightBansCount


				//Set left bans
				let leftBans = nodecg.Replicant('leftBans')
				leftBans.value = _leftBans

				//Set right bans
				let rightBans = nodecg.Replicant('rightBans')
				rightBans.value = _rightBans
				//#endregion


			}

			//#region Set Picks
			let _leftPicks: (DropdownOption | undefined)[] = []
			let _rightPicks: (DropdownOption | undefined)[] = []

			//We can safely assume some civs were picked because if not.. then well.. ???
			let leftPicksCount = nodecg.Replicant('leftPicksCount')
			let rightPicksCount = nodecg.Replicant('rightPicksCount')

			leftPicksCount.value = civDraft.team1.civs.picks.length
			rightPicksCount.value = civDraft.team2.civs.picks.length


			let leftPicks = nodecg.Replicant('leftPicks')
			let rightPicks = nodecg.Replicant('rightPicks')

			civDraft.team1.civs.picks.forEach((element: any) => {
				let _civMap = klona(civMap)
				console.log(element)
				_leftPicks.push(_civMap.get(element))
			})

			civDraft.team2.civs.picks.forEach((element: any) => {
				let _civMap = klona(civMap)
				console.log(element)
				_rightPicks.push(_civMap.get(element))
			})

			leftPicks.value = _leftPicks;
			rightPicks.value = _rightPicks;

			//#endregion

			//Set Names 
			let importNamesFromDraft = nodecg.Replicant('importNamesFromDraft')
			let updateDraftOnImport = nodecg.Replicant('updateDraftOnImport')
			let updateDraft = nodecg.Replicant('updateDraft')


			if (importNamesFromDraft.value == true) {
				let _leftName = nodecg.Replicant('leftName')
				let _rightName = nodecg.Replicant('rightName')

				_leftName.value = civDraft.team1.name
				_rightName.value = civDraft.team2.name
			}

			if (updateDraftOnImport.value == true) {
				console.log("Updating draft aswell")
				updateDraft.value = !updateDraft.value
			}

		}

	})
};
