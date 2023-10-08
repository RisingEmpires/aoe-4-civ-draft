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
        <div className='draft-civContainer'>
            <img src={civ?.value} className={banned ? 'draft-civBanned draft-civBannedFilter' : 'draft-civPicked'} />
            {banned ? <div className='draft-banned'>╲</div> : ''}
        </div>
    )
}