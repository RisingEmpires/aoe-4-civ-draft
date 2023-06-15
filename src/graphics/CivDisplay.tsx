import React from 'react';
import type { ValueLabelPair } from '../types/schemas/index';

type CivDisplayProps = {
    civ: ValueLabelPair;
    banned?: boolean;
    sniped?: boolean;
}

export const CivDisplay = ({ civ, banned, sniped }: CivDisplayProps) => {
    //TODO Implement sniped civs to differenciate between banned and sniped
    return (
        <div className='civContainer'>
            <img src={civ?.value} className={banned ? 'civBanned civBannedFilter' : 'civPicked'} />
            {banned ? <div className='banned'>╲</div> : ''}
        </div>
    )
}