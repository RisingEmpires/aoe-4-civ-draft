import React from 'react';
import type { ValueLabelPair } from '../types/schemas/index';

type CivDisplayProps = {
    civ: ValueLabelPair;
    banned?: boolean;
    sniped?: boolean;
}

export const CivDisplay = ({ civ, banned, sniped }: CivDisplayProps) => {
    //TODO add a slash over the Civ image to highlight it was banned, in addition to fading the image
    //
    return (
        <div className='civContainer'>
            <img src={civ?.value} className={banned ? 'civBanned civBannedFilter' : 'civPicked'} />
            {banned ? <div className='banned'>╲</div> : ''}
        </div>
    )
}