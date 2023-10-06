import React, { useEffect, useState } from 'react';
import { useReplicant } from 'use-nodecg';
import { CivDropdown } from './CivDropdown';
import type { ValueLabelPair } from '../../types/schemas/index';
import { NodeCG } from '@nodecg/types/types/nodecg';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { TECollapse, TERipple } from "tw-elements-react";

interface DropdownOption {
  value: string;
  label: string;
}

export function Aoe4CivDraft() {

  const [showSettings, set_showSettings] = useState(false);
  const toggleShowSettings = () => set_showSettings(!showSettings);

  const [options, set_options] = useState<ValueLabelPair[]>([]);
  const [civs, set_civs] = useReplicant<NodeCG.AssetFile[]>('assets:civs', []);

  // Could probably have 1 array instead of 2 replicants?
  const [leftBans, set_leftBans] = useReplicant<ValueLabelPair[]>('leftBans', [{ value: '', label: '' }]);
  const [leftBansCount, set_leftBansCount] = useReplicant<number>('leftBansCount', 0);

  const [leftPicks, set_leftPicks] = useReplicant<ValueLabelPair[]>('leftPicks', [{ value: '', label: '' }]);
  const [leftPicksCount, set_leftPicksCount] = useReplicant<number>('leftPicksCount', 0);

  const [rightPicks, set_rightPicks] = useReplicant<ValueLabelPair[]>('rightPicks', [{ value: '', label: '' }]);
  const [rightPicksCount, set_rightPicksCount] = useReplicant<number>('rightPicksCount', 0);

  const [rightBans, set_rightBans] = useReplicant<ValueLabelPair[]>('rightBans', [{ value: '', label: '' }]);
  const [rightBansCount, set_rightBansCount] = useReplicant<number>('rightBansCount', 0);

  const [leftName, set_leftName] = useReplicant<string>('leftName', '');
  const [leftUnderText, set_leftUnderText] = useReplicant<string>('leftUnderText', '');
  const [rightName, set_rightName] = useReplicant<string>('rightName', '');
  const [rightUnderText, set_rightUnderText] = useReplicant<string>('rightUnderText', '');

  //Used if you have the Aoe-4-team-games
  const [leftSideIcon, set_leftSideIcon] = useReplicant<DropdownOption>('leftSideIcon', { value: '', label: '' }, { namespace: 'aoe-4-team-games' });
  const [rightSideIcon, set_rightSideIcon] = useReplicant<DropdownOption>('rightSideIcon', { value: '', label: '' }, { namespace: 'aoe-4-team-games' });

  const [importNamesFromDraft, set_importNamesFromDraft] = useReplicant<boolean>('importNamesFromDraft', true);
  const [updateDraftOnImport, set_updateDraftOnImport] = useReplicant<boolean>('updateDraftOnImport', true);
  const [lockBans, set_lockBans] = useReplicant<boolean>('lockBans', true);

  //State of this doesn't matter. We just need it to be updated for useEffect in the graphics to be updated
  const [updateDraft, set_updateDraft] = useReplicant<boolean>('updateDraft', true);

  //Variables to hold the name onChange
  const [_leftName, set__leftName] = useState(<></>);
  const [_leftUnderText, set__leftUnderText] = useState(<></>);
  const [_rightName, set__rightName] = useState(<></>);
  const [_rightUnderText, set__rightUnderText] = useState(<></>);

  // Set the options in the dropdown menu to avaliable civs from /assets/aoe4-civ-draft/civ
  useEffect(() => {
    if (civs.length === 0) return;
    const _array: typeof options = [];
    civs.forEach((element) => {
      let { name } = element;
      name = name.replace(/_/g, ' ');
      _array.push({ value: element?.url, label: name });
    });
    _array.sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));
    set_options(_array);
  }, [civs]);

  useEffect(() => {
    console.log("rerendering name input")
    set__leftName(<input type="text" key='ln' disabled={lockBans} placeholder="Left Side Name" name="leftName" defaultValue={leftName} />)
    set__leftUnderText(<input type="text" key='lut' disabled={lockBans} placeholder="Left Side Under Text" name="leftUnderText" defaultValue={leftUnderText} />)
    set__rightName(<input type="text" key='rn' disabled={lockBans} placeholder="Right Side Name" name="rightName" defaultValue={rightName} />)
    set__rightUnderText(<input type="text" key='rut' disabled={lockBans} placeholder="Right Side Under Text" name="rightUnderText" defaultValue={rightUnderText} />)
  }, [leftName, rightName, updateDraft, lockBans])

  //@ts-ignore
  const handleSubmit = (event) => {
    event.preventDefault();

    set_leftName(event.target.leftName.value)
    set_rightName(event.target.rightName.value)

    set_leftUnderText('')
    set_rightUnderText('')

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


    if (!lockBans) {
      set_leftName("")
      set_rightName("")
      set_leftBans([])
      set_rightBans([])

      set_leftBansCount(0)
      set_rightBansCount(0)
    }


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
    <div className='p-2'>
      <button className='absolute right-4' onClick={toggleShowSettings}>
        <svg fill='whitesmoke' xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" /></svg>
      </button>
      <TECollapse show={showSettings} className='flex flex-col pb-8'>
        <div key={'settings'}>
          <label className='importNames px-4'><span className='text-3xl align-middle'>🛈</span> Import Names From Draft</label>
          <input className='w-6 h-6 align-middle' type='checkbox' checked={importNamesFromDraft} onChange={(() => set_importNamesFromDraft(!importNamesFromDraft))} />
          <ReactTooltip
            anchorSelect=".importNames"
            id="tooltip1"
            place="bottom"
            //@ts-ignore
            content={<span>When importing a draft from AoE2CM, also set the Left and Right name from AoE2CM</span>}
          />
        </div>
        <div>
          <label className='updateDraftLabel px-4'><span className='text-3xl align-middle'>🛈</span> Update Draft Graphic on Import</label>
          <input className='w-6 h-6 align-middle' type='checkbox' checked={updateDraftOnImport} onChange={(() => set_updateDraftOnImport(!updateDraftOnImport))} />
          <ReactTooltip
            anchorSelect=".updateDraftLabel"
            id="tooltip1"
            place="bottom"
            //@ts-ignore
            content={<span>Immediately update the Draft Graphics when importing the draft from AoE2CM</span>}
          />
        </div>
        <div className='items-center align-middle'>
          <label className='lockBans px-4'><span className='text-3xl align-middle'>🛈</span> Lock Bans & Names (Global Bans for a series)</label>
          <input className='w-6 h-6 align-middle' type='checkbox' checked={lockBans} onChange={(() => set_lockBans(!lockBans))} />
          <ReactTooltip
            anchorSelect=".lockBans"
            id="tooltip1"
            place="bottom"
            //@ts-ignore
            content={<span>Locks the Bans & Names in the draft, preventing them from being reset when clicking the Reset Draft button. Useful for BO's</span>}
          />
        </div>
      </TECollapse>

      <form onSubmit={getDraft} className='pt-8'>
        <h1>Import Draft from aoe2cm.net</h1>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <input type="text" placeholder="aoe2cm.net/" name="aoe2cmDraft" style={{ width: '60%' }} />
          <div className='px-16 w-2/5'>
            <input type="submit" value={"Import Draft"} className='importDraft' />
          </div>
        </div>
      </form>

      <hr className='my-4' />

      <form onSubmit={handleSubmit} className='flex flex-col justify-evenly'>
        <div className='flex flex-row justify-evenly'>
          <div className='flex flex-col w-1/3'>
            <div className='px-5'>
              <h1 key='lnh1' className='text-center text-xl'>Left Name</h1>
              {_leftName}

              <h1 className='text-center text-xl'>Left Under Text</h1>
              {_leftUnderText}
            </div>
            <hr className='my-4' />
            <div className='flex flex-col borderer '>
              <div className='w-full flex flex-col justify-center text-center px-5 self-start'>
                <h1 className='text-xl'>Left Banned Civs</h1>
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
                  <CivDropdown key={i + 'lb'} civs={options} target={i} replicant={'leftBans'} value={leftBans[i]} />
                ))}
              </div>

              <div className='w-full flex flex-col justify-center text-center px-5 self-start'>
                <h1 className='text-xl'>Left Picked Civs</h1>
                <input
                  className=' m-auto text-center'
                  type="number"
                  min={1}
                  max={9}
                  value={leftPicksCount ?? 0}
                  onChange={(event) => {
                    set_leftPicksCount(parseInt(event.target.value, 10));
                  }}
                />
                {new Array(leftPicksCount).fill(undefined).map((_, i) => (
                  <CivDropdown key={i + 'lp'} civs={options} target={i} replicant={'leftPicks'} value={leftPicks[i]} />
                ))}
              </div>
            </div>
          </div>

          <div className='flex flex-col pt-32 w-1/6  borderer'>
            <button onClick={swapTeams} className="swapButton mx-8 px-2 w-36 h-12" name="swapTeams">
              Swap Teams
            </button>
            <br />
            <button onClick={resetDraft} className="resetButton mx-8 px-2 w-36 h-12" name="swapTeams">
              Reset Draft
            </button>
          </div>

          <div className='flex flex-col w-1/3'>
            <div className='px-5'>
              <h1 className='text-center text-xl'>Right Name</h1>
              {_rightName}

              <h1 className='text-center text-xl'>Right Under Text</h1>
              {_rightUnderText}
            </div>

            <hr className='my-4' />

            <div className='flex flex-col borderer'>
              <div className='w-full flex flex-col justify-center text-center px-5 self-start'>
                <h1 className='text-xl'>Right Banned Civs</h1>
                <input
                  className='m-auto text-center'
                  type="number"
                  min={0}
                  max={9}
                  value={rightBansCount ?? 0}
                  onChange={(event) => {
                    set_rightBansCount(parseInt(event.target.value, 10));
                  }}
                />
                {new Array(rightBansCount).fill(undefined).map((_, i) => (
                  <CivDropdown key={i + 'rb'} civs={options} target={i} replicant={'rightBans'} value={rightBans[i]} />
                ))}
              </div>

              <div className='w-full flex flex-col justify-center text-center px-5 self-start'>
                <h1 className='text-xl'>Right Picked Civs</h1>
                <input
                  className='m-auto text-center'
                  type="number"
                  min={1}
                  max={9}
                  value={rightPicksCount ?? 0}
                  onChange={(event) => {
                    set_rightPicksCount(parseInt(event.target.value, 10));
                  }}
                />
                {new Array(rightPicksCount).fill(undefined).map((_, i) => (
                  <CivDropdown key={i + 'rp'} civs={options} target={i} replicant={'rightPicks'} value={rightPicks[i]} />
                ))}
              </div>

            </div>

          </div>
        </div>
        <hr className='my-8' />

        <div className='updateDiv'>
          <input type="submit" value="Update Draft Graphics" className='updateDraft w-1/3 bg-green-500' />
        </div>
      </form>



    </div>
  );
}
