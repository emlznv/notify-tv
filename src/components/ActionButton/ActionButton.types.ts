import React from 'react';
import { ButtonType } from '../../typescript/enums';

export interface ActionButtonProps {
  isShowAdded: boolean;
  type: ButtonType;
  onClick: (e: React.MouseEvent<SVGSVGElement>) => void
}
