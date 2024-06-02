import Star1 from 'assets/images/Window/Star/Star_1.gif';
import Star2 from 'assets/images/Window/Star/Star_2.gif';
import Star3 from 'assets/images/Window/Star/Star_3.gif';
import Star4 from 'assets/images/Window/Star/Star_4.gif';
import Star5 from 'assets/images/Window/Star/Star_5.gif';
import Star6 from 'assets/images/Window/Star/Star_6.gif';
import Star7 from 'assets/images/Window/Star/Star_7.gif';
import Star8 from 'assets/images/Window/Star/Star_8.gif';
import Star9 from 'assets/images/Window/Star/Star_9.gif';
import Star10 from 'assets/images/Window/Star/Star_10.gif';

import { messageAPI } from 'apis/message';

import { useAppSelector } from 'hooks';

import { modeActions, selectMode } from 'store/mode';

import Star, { StarProps } from 'components/Space/Star';

import { CSSProperties, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export type StarInformation = {
  left: number;
  top: number;
  image: string;
};

function Space(props: CSSProperties) {
  const starWidth = 3.13; // 60px when 1920px
  const starHeight = 5.56; // 60px when 1080px

  const maxLeft = 100 - starWidth;
  const maxTop = 80 - starHeight;

  const starImages = [
    Star1,
    Star2,
    Star3,
    Star4,
    Star5,
    Star6,
    Star7,
    Star8,
    Star9,
    Star10,
  ];

  const mode = useAppSelector(selectMode);
  const dispatch = useDispatch();

  const getMessages = async () => {
    const messages = await messageAPI.getMessages();
    if (messages) {
      const stars = messages.map<StarProps>((message) => ({
        id: message.id,
        location: message.location,
        createdAt: message.createdAt,
        message: message.code,
        left: +(Math.random() * maxLeft).toFixed(2),
        top: +(Math.random() * maxTop).toFixed(2),
        image: starImages[Math.floor(Math.random() * 5)],
        width: starWidth,
        height: starHeight,
        position: 'absolute',
        display: 'flex',
      }));
      dispatch(modeActions.setStars(stars));
    }
  };

  const handleOnMouseDown = async () => {
    getMessages();
  };

  useEffect(() => {
    if (mode.searchingState.stars.length === 0) {
      getMessages();
    }
  }, []);

  return (
    <div id='Space' draggable='false' style={{ ...props }}>
      <div
        id='Empty Space'
        onMouseDown={handleOnMouseDown}
        style={{ width: '100%', height: '100%' }}
      />
      {mode.searchingState.stars.map((starProps, index) => (
        <Star key={index} {...starProps} />
      ))}
    </div>
  );
}

export default Space;
