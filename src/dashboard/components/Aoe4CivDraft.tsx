import React, { useEffect, useState } from 'react';
import { useReplicant } from 'use-nodecg';
import { CivDropdown } from './CivDropdown';
import type { ValueLabelPair } from '../../types/schemas/index';
import type { NodeCG } from '@nodecg/types/types/nodecg';

export function Aoe4CivDraft() {
  const [options, set_options] = useState<ValueLabelPair[]>([]);
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
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Left Side</label>
        <input type="text" placeholder="Left Side Name" name="leftName" defaultValue={leftName} />

        <h1>Left Banned Civs</h1>
        <input
          type="number"
          min={0}
          max={9}
          value={leftBansCount ?? 0}
          onChange={(event) => {
            set_leftBansCount(parseInt(event.target.value, 10));
          }}
        />
        {new Array(leftBansCount).fill(undefined).map((_, i) => (
          <CivDropdown key={i} civs={options} target={i} replicant={'leftBans'} />
        ))}
        <br /> <br />
      </div>

      <div>
        <h1>Left Picked Civs</h1>
        <input
          type="number"
          min={0}
          max={9}
          value={leftPicksCount ?? 0}
          onChange={(event) => {
            set_leftPicksCount(parseInt(event.target.value, 10));
          }}
        />
        {new Array(leftPicksCount).fill(undefined).map((_, i) => (
          <CivDropdown key={i} civs={options} target={i} replicant={'leftPicks'} />
        ))}
        <br />
        <br />
      </div>

      <div>

        <label>Right Side</label>
        <input type="text" placeholder="Right Side Name" name="rightName" defaultValue={rightName} />

        <h1>Right Picked Civs</h1>
        <input
          type="number"
          min={0}
          max={9}
          value={rightPicksCount ?? 0}
          onChange={(event) => {
            set_rightPicksCount(parseInt(event.target.value, 10));
          }}
        />
        {new Array(rightPicksCount).fill(undefined).map((_, i) => (
          <CivDropdown key={i} civs={options} target={i} replicant={'rightPicks'} />
        ))}
        <br />
        <br />
      </div>

      <div>
        <h1>Right Banned Civs</h1>
        <input
          type="number"
          min={0}
          max={9}
          value={rightBansCount ?? 0}
          onChange={(event) => {
            set_rightBansCount(parseInt(event.target.value, 10));
          }}
        />
        {new Array(rightBansCount).fill(undefined).map((_, i) => (
          <CivDropdown key={i} civs={options} target={i} replicant={'rightBans'} />
        ))}
        <br /> <br />
      </div>

      <input type="submit" />

    </form>
  );
}
