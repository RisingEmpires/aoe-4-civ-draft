import React, { useEffect, useState } from 'react';
import { useReplicant } from 'use-nodecg';
import { CivDropdown } from './CivDropdown';
import type { ValueLabelPair } from '../../types/schemas/index';
import { NodeCG } from '@nodecg/types/types/nodecg';
import { Tooltip as ReactTooltip } from "react-tooltip";

interface DropdownOption {
  value: string;
  label: string;
}

export function Aoe4CivDraft() {

  const [options, set_options] = useState<ValueLabelPair[]>([]);
  const [civs, set_civs] = useReplicant<NodeCG.AssetFile[]>('assets:civs', []);

  // Could probably have 1 array instead of 2 replicants?
  const [leftBans, set_leftBans] = useReplicant<ValueLabelPair[]>('leftBans', [{ value: '', label: '' }]);
  const [leftBansCount, set_leftBansCount] = useReplicant<number>('leftBansCount', 1);

  const [leftPicks, set_leftPicks] = useReplicant<ValueLabelPair[]>('leftPicks', [{ value: '', label: '' }]);
  const [leftPicksCount, set_leftPicksCount] = useReplicant<number>('leftPicksCount', 1);

  const [rightPicks, set_rightPicks] = useReplicant<ValueLabelPair[]>('rightPicks', [{ value: '', label: '' }]);
  const [rightPicksCount, set_rightPicksCount] = useReplicant<number>('rightPicksCount', 1);

  const [rightBans, set_rightBans] = useReplicant<ValueLabelPair[]>('rightBans', [{ value: '', label: '' }]);
  const [rightBansCount, set_rightBansCount] = useReplicant<number>('rightBansCount', 1);

  const [leftName, set_leftName] = useReplicant<string>('leftName', '');
  const [rightName, set_rightName] = useReplicant<string>('rightName', '');

  //Used if you have the Aoe-4-team-games
  const [leftSideIcon, set_leftSideIcon] = useReplicant<DropdownOption>('leftSideIcon', { value: '', label: '' }, { namespace: 'aoe-4-team-games' });
  const [rightSideIcon, set_rightSideIcon] = useReplicant<DropdownOption>('rightSideIcon', { value: '', label: '' }, { namespace: 'aoe-4-team-games' });

  const [importNamesFromDraft, set_importNamesFromDraft] = useReplicant<boolean>('importNamesFromDraft', true);
  const [updateDraftOnImport, set_updateDraftOnImport] = useReplicant<boolean>('updateDraftOnImport', true);

  //State of this doesn't matter. We just need it to be updated for useEffect in the graphics to be updated
  const [updateDraft, set_updateDraft] = useReplicant<boolean>('updateDraft', true);

  //Variables to hold the name onChange
  const [_leftName, set__leftName] = useState<string>("");
  const [_rightName, set__rightName] = useState<string>("");

  // Set the options in the dropdown menu to avaliable civs from /assets/aoe4-civ-draft/civ
  useEffect(() => {
    if (civs.length === 0) return;
    const _array: typeof options = [];
    civs.forEach((element) => {
      let { name } = element;
      name = name.replace(/_/g, ' ');
      _array.push({ value: element.url, label: name });
    });
    _array.sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));
    set_options(_array);
  }, [civs]);

  //@ts-ignore
  const handleSubmit = (event) => {
    event.preventDefault();
    
    set_leftName(event.target.leftName.value)
    set_rightName(event.target.rightName.value)

    f_updateDraft(null)
  }

  //@ts-ignore
  const getDraft = (event) => {
    event.preventDefault();
    nodecg.sendMessage('getDraft', event.target.aoe2cmDraft.value)
    console.log(event.target.aoe2cmDraft.value)
  }

  const swapTeams = (event: any) => {
    event.preventDefault();
    console.log("Swapping teams around")


    let tempName = leftName
    set_leftName(rightName)
    set_rightName(tempName)

    let tempBans = leftBans
    set_leftBans(rightBans)
    set_rightBans(tempBans)

    let tempBansCount = leftBansCount
    set_leftBansCount(rightBansCount)
    set_rightBansCount(tempBansCount)

    let tempPicks = leftPicks
    set_leftPicks(rightPicks)
    set_rightPicks(tempPicks)

    let tempPicksCount = leftPicksCount
    set_leftPicksCount(rightPicksCount)
    set_rightPicksCount(tempPicksCount)

    let tempIcon = leftSideIcon
    set_leftSideIcon(rightSideIcon)
    set_rightSideIcon(tempIcon)

    f_updateDraft(null)
  }

  const resetDraft = (event: any) => {
    event.preventDefault();
    console.log("Resetting Draft")

    set_leftName("")
    set_rightName("")

    set_leftBans([])
    set_rightBans([])

    set_leftBansCount(0)
    set_rightBansCount(0)

    set_leftPicks([{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" }])
    set_rightPicks([{ value: "/assets/aoe-4-civ-draft/civs/Random.png", label: "Random" }])

    set_leftPicksCount(1)
    set_rightPicksCount(1)

    f_updateDraft(null)
  }

  const f_updateDraft = (event: any) => {
    if (event) event.preventDefault();
    console.log("Updating Draft")

    set_updateDraft(!updateDraft)
  }

  return (
    <div>
      <div className='flex flex-col'>
        <div>
          <label>Import Names From Draft</label>
          <input type='checkbox' checked={importNamesFromDraft} onChange={(() => set_importNamesFromDraft(!importNamesFromDraft))} />
        </div>
        <div>
          <label>Update Draft on Import</label>
          <input type='checkbox' checked={updateDraftOnImport} onChange={(() => set_updateDraftOnImport(!updateDraftOnImport))} />
        </div>
      </div>

      <form style={{ padding: '0 2rem' }} onSubmit={getDraft}>
        <h1>Import Draft from aoe2cm.net</h1>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <input type="text" placeholder="aoe2cm.net/" name="aoe2cmDraft" style={{ width: '60%' }} />
          <div className='px-16 w-2/5'>
            <input type="submit" value={"Import Draft"} className='importDraft'/>
          </div>
        </div>
      </form>

      <form onSubmit={handleSubmit}>
        <div className='leftSideWrapper flex flex-row justify-center py-4'>

          <div className='px-5'>
            <label className='text-center'>Left Side Name</label>
            <input type="text" placeholder="Left Side Name" name="leftName" defaultValue={leftName} />
          </div>

          <div className='w-1/2 flex flex-col justify-center text-center px-5 self-start'>
            <h1>Left Banned Civs</h1>
            <input
              className='w-1/4 m-auto text-center'
              type="number"
              min={0}
              max={9}
              value={leftBansCount ?? 0}
              onChange={(event) => {
                set_leftBansCount(parseInt(event.target.value, 10));
              }}
            />
            {new Array(leftBansCount).fill(undefined).map((_, i) => (
              <CivDropdown key={i} civs={options} target={i} replicant={'leftBans'} value={leftBans[i]} />
            ))}
          </div>

          <div className='w-1/2 flex flex-col justify-center text-center px-5 self-start'>
            <h1>Left Picked Civs</h1>
            <input
              className='w-1/4 m-auto text-center'
              type="number"
              min={1}
              max={9}
              value={leftPicksCount ?? 0}
              onChange={(event) => {
                set_leftPicksCount(parseInt(event.target.value, 10));
              }}
            />
            {new Array(leftPicksCount).fill(undefined).map((_, i) => (
              <CivDropdown key={i} civs={options} target={i} replicant={'leftPicks'} value={leftPicks[i]} />
            ))}
          </div>
        </div>

        <div className='flex flex-row justify-center w-full'>
          <hr className='m-4 w-1/3' />
          <button onClick={swapTeams} className="swapButton mx-4 px-2 w-36" name="swapTeams">
            Swap Teams
          </button>
          <button onClick={resetDraft} className="resetButton mx-4 px-2 w-36" name="swapTeams">
            Reset Draft
          </button>
          <hr className='m-4 w-1/3' />
        </div>

        <div className='rightSideWrapper flex flex-row justify-center py-4'>

          <div className='px-5'>
            <label>Right Side Name</label>
            <input type="text" placeholder="Right Side Name" name="rightName" defaultValue={rightName} />
          </div>

          <div className='w-1/2 flex flex-col justify-center text-center px-5 self-start'>
            <h1>Right Banned Civs</h1>
            <input
              className='w-1/4 m-auto text-center'
              type="number"
              min={0}
              max={9}
              value={rightBansCount ?? 0}
              onChange={(event) => {
                set_rightBansCount(parseInt(event.target.value, 10));
              }}
            />
            {new Array(rightBansCount).fill(undefined).map((_, i) => (
              <CivDropdown key={i} civs={options} target={i} replicant={'rightBans'} value={rightBans[i]} />
            ))}
          </div>

          <div className='w-1/2 flex flex-col justify-center text-center px-5 self-start'>
            <h1>Right Picked Civs</h1>
            <input
              className='w-1/4 m-auto text-center'
              type="number"
              min={1}
              max={9}
              value={rightPicksCount ?? 0}
              onChange={(event) => {
                set_rightPicksCount(parseInt(event.target.value, 10));
              }}
            />
            {new Array(rightPicksCount).fill(undefined).map((_, i) => (
              <CivDropdown key={i} civs={options} target={i} replicant={'rightPicks'} value={rightPicks[i]} />
            ))}
          </div>

        </div>

        <hr />

        <div className='updateDiv'>
          <input type="submit" value="Update Team Names" className='updateDraft w-1/3' />
        </div>

      </form>
    </div>
  );
}
