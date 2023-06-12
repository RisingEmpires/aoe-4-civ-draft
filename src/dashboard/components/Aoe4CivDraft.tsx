import React, { useEffect, useState } from 'react';
import { useReplicant } from 'use-nodecg';
import { CivDropdown } from './CivDropdown';
import type { LeftBans } from '../../types/schemas/leftBans';
import type { LeftBansCount } from '../../types/schemas/leftBansCount';
import type { LeftPicks, ValueLabelPair } from '../../types/schemas/leftPicks';
import type { LeftPicksCount } from '../../types/schemas/leftPicksCount';
import type { RightPicks } from '../../types/schemas/rightPicks';
import type { RightPicksCount } from '../../types/schemas/rightPicksCount';
import type { RightBans } from '../../types/schemas/rightBans';
import type { RightBansCount } from '../../types/schemas/rightBansCount';
import type { NodeCG } from '@nodecg/types/types/nodecg';

export function Aoe4CivDraft() {
  const [options, set_options] = useState<ValueLabelPair[]>([]);
  const [civs, set_civs] = useReplicant<NodeCG.AssetFile[]>('assets:civs', []);

  // Could probably have 1 array instead of 3 replicants?
  const [leftBans, set_leftBans] = useReplicant<LeftBans>('leftBans', []);
  const [leftBansCount, set_leftBansCount] = useReplicant<LeftBansCount>('leftBansCount', 1);

  const [leftPicks, set_leftPicks] = useReplicant<LeftPicks>('leftPicks', []);
  const [leftPicksCount, set_leftPicksCount] = useReplicant<LeftPicksCount>('leftPicksCount', 1);

  const [rightPicks, set_rightPicks] = useReplicant<RightPicks>('rightPicks', []);
  const [rightPicksCount, set_rightPicksCount] = useReplicant<RightPicksCount>('rightPicksCount', 1);

  const [rightBans, set_rightBans] = useReplicant<RightBans>('rightBans', []);
  const [rightBansCount, set_rightBansCount] = useReplicant<RightBansCount>('rightBansCount', 1);

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

  return (
    <>
      <div>
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
        Bans:
        {JSON.stringify(leftBans)}
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
        Picks:
        {JSON.stringify(leftPicks)}
        <br />
        <br />
      </div>

      <div>
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
        {new Array(leftPicksCount).fill(undefined).map((_, i) => (
          <CivDropdown key={i} civs={options} target={i} replicant={'rightPicks'} />
        ))}
        Picks:
        {JSON.stringify(rightPicks)}
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
        {new Array(leftPicksCount).fill(undefined).map((_, i) => (
          <CivDropdown key={i} civs={options} target={i} replicant={'rightBans'} />
        ))}
        Bans:
        {JSON.stringify(rightBans)}
        <br /> <br />
      </div>
    </>
  );
}
