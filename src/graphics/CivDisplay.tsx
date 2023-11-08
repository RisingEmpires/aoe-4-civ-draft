import React from 'react';

interface ValueLabelPair {
    value: string;
    label: string;
}

type CivDisplayProps = {
    civ: DropdownOption;
    displayName?: boolean
    banned?: boolean;
    sniped?: boolean;
    picked?: boolean
}

interface DropdownOption {
    value: string;
    label: string;
    picked?: boolean;
}

export const CivDisplay = ({ civ, banned, displayName, picked, sniped }: CivDisplayProps) => {
    //TODO Implement sniped civs to differenciate between banned and sniped
    return (
        <div className='draft-civContainer'>
            {displayName ? <h1 className='draft-civName'>{civ?.label}</h1> : ''}
            <img src={civ?.value} className={`${picked ? 'draft-civPlayed' : 'draft-civNotPlayed'} ${banned ? 'draft-civBanned draft-civBannedFilter' : 'draft-civPicked'} `} />
            {banned ? <div className='draft-banned'>╲</div> : ''}
        </div>
    )
}