import React, { useCallback } from 'react'
import Select from 'react-select'
import { useReplicant } from 'use-nodecg';

type CivDropdownProps = {
    civs: Array<any>
    selected?: Object,
    target: string,
    replicant: string,
}

export const CivDropdown = ({ civs, selected, target, replicant }: CivDropdownProps) => {

    const [replicantValue, set_replicantValue] = useReplicant<Array<any>>(replicant, [{value: '', label: ''}]);

    const handleChange = useCallback((selectedOption) => {
        let _array = replicantValue
        console.log(replicant)
        console.log(replicantValue)
        _array[target] = selectedOption
        set_replicantValue(_array)
    }, [replicantValue])


    return (
        <div>
            <Select className='civDropdown' options={civs} onChange={handleChange} />
        </div>
    )
}