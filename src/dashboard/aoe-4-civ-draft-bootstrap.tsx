import React from 'react';
import { createRoot } from 'react-dom/client';
import { Aoe4CivDraft } from './Aoe4CivDraft';

const root = createRoot(document.getElementById('root')!);
root.render(<Aoe4CivDraft />);
