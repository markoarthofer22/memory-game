import React from 'react';

import '../index.scss';

interface IBoardGridProps {
  children: React.ReactNode;
}

const Grid = ({ children }: IBoardGridProps) => <div className="board--wrapper">{children}</div>;

export default Grid;
