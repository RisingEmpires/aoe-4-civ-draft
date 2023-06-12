import React, { useCallback } from 'react';
import Select, { type SingleValue } from 'react-select';
import { useReplicant } from 'use-nodecg';
import { type ValueLabelPair } from '../../types/schemas/index';

type CivDropdownProps = {
  civs: ValueLabelPair[];
  target: number;
  replicant: string;
};

export const CivDropdown = ({ civs, target, replicant }: CivDropdownProps) => {
  const [replicantValue, set_replicantValue] = useReplicant<ValueLabelPair[]>(replicant, [{ value: '', label: '' }]);

  const handleChange = useCallback(
    (selectedOption: SingleValue<ValueLabelPair>) => {
      if (!selectedOption) return
      const newRepValue = replicantValue.slice(0);
      newRepValue[target] = selectedOption;
      set_replicantValue(newRepValue);
    },
    [replicantValue, target],
  );

  return (
    <div>
      <Select className="civDropdown" options={civs} onChange={handleChange} />
    </div>
  );
};
