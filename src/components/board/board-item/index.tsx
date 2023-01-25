import React, { useEffect, useState } from 'react';

import '../index.scss';

interface IBoardItemProps {
  img: string;
  name: string;
  onClickCallback?: (field: string, index?: number) => void;
  isOpen?: boolean;
  className?: string;
}

const Item = ({ img, name, onClickCallback, className = 'board--item', isOpen = false }: IBoardItemProps) => {
  const [isItemClicked, setIsItemClicked] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) setIsItemClicked(true);
  }, [isOpen]);

  const onItemClick = () => {
    console.log(`${img} with name: ${name} clicked`);
    setIsItemClicked(true);
    if (onClickCallback) onClickCallback(name);
  };

  return (
    <div className={`${className} ${isItemClicked ? `${className}--clicked` : ''}`} onClick={onItemClick}>
      <div className={`${className}--front`}>{img}</div>

      <div className={`${className}--back`} />
    </div>
  );
};

export default Item;
