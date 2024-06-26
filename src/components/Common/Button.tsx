import { ButtonProps } from 'types/ButtonProps';

import { CSSProperties, useState } from 'react';

function Button(props: CSSProperties & ButtonProps.ButtonProps) {
  const {
    id,
    image,
    hoverImage,
    clickImage,
    hoverClickImage,
    buttonType,
    clickHandler,
    ...cssProps
  } = props;
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);
  return (
    <div
      id={id}
      draggable='false'
      style={{ ...cssProps }}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => {
        setIsHover(false);
        setIsClick(false);
      }}
      onFocus={() => setIsHover(true)}
      onBlur={() => setIsHover(false)}
      onMouseDown={(e) => {
        setIsClick(true);
        clickHandler(e);
      }}
      onMouseUp={() => setIsClick(false)}
    >
      <img
        draggable='false'
        src={
          buttonType === 'Momentary'
            ? isHover // Momentary Condition
              ? isClick
                ? hoverClickImage
                : hoverImage
              : isClick
                ? clickImage
                : image
            : props.condition // Latching Condition
              ? isHover
                ? hoverClickImage
                : clickImage
              : isHover
                ? hoverImage
                : image
        }
        alt={id}
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}

export default Button;
