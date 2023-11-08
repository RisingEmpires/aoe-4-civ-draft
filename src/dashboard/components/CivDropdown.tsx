import React, { useCallback } from 'react';
import Select, { type SingleValue } from 'react-select';
import { useReplicant } from 'use-nodecg';

interface DropdownOption {
  value: string;
  label: string;
  picked?: boolean;
}

type CivDropdownProps = {
  civs: DropdownOption[];
  target: number;
  replicant: string;
  value?: DropdownOption[];
};


export const CivDropdown = ({ civs, target, replicant, value }: CivDropdownProps) => {
  const [replicantValue, set_replicantValue] = useReplicant<DropdownOption[]>(replicant, [{ value: '', label: '', picked: false }]);

  //Prevent the module from crashing upon new DB
  if (!value) {
    console.log("nope")
    value = []
  }

  const handleChange = useCallback(
    (selectedOption: SingleValue<DropdownOption>) => {
      if (!selectedOption) return
      const newRepValue = replicantValue.slice(0);
      //newRepValue[target] = selectedOption;
      newRepValue[target] = {
        value: selectedOption.value,
        label: selectedOption.label,
        picked: replicantValue[target]?.picked || false
      }
      
      console.log(newRepValue[target])

      set_replicantValue(newRepValue);
    },
    [replicantValue, target],
  );

  const handlePickedChange = () => {
    let newRepValue = replicantValue.slice(0);

    console.log("Civ marked as Played")

    console.log(replicantValue)

    let opposite = !(replicantValue[target]?.picked)
    newRepValue[target] = {
      value: replicantValue[target]?.value || '',
      label: replicantValue[target]?.label || '',
      picked: opposite
    }

    console.log(newRepValue)

    set_replicantValue(newRepValue);
  };

  return (
    <div className='py-2'>
      <Select className="civDropdown" options={civs} onChange={handleChange} value={value[target]} />
      <label>Civ Played?</label>
      <input className='mr-4' type='checkbox' checked={value[target]?.picked} onChange={handlePickedChange} />
    </div>
  );
};
