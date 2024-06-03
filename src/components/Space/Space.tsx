import MovingCircle from 'assets/images/Window/Moving/Moving-Circle.gif';
import MovingLine from 'assets/images/Window/Moving/Moving-Line.gif';
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
import { selectScreen } from 'store/screen';

import Star, { StarProps } from 'components/Space/Star';

import { CSSProperties, Fragment, MouseEvent, useEffect } from 'react';
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
  const screen = useAppSelector(selectScreen);
  const dispatch = useDispatch();

  const getMessages = async () => {
    dispatch(modeActions.setStars([]));
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
  const handleOnMouseDown = async (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dispatch(
      modeActions.setMovingPosition([
        e.clientX - rect.left,
        e.clientY - rect.top,
      ]),
    );
    dispatch(modeActions.setIsLoading());

    getMessages();
  };

  /** Initial Loading. */
  useEffect(() => {
    if (mode.searchingState.stars.length === 0) {
      dispatch(modeActions.setIsLoading());

      getMessages();
    }
  }, []);

  /** Space Animation */
  const testAnimationTrigger = () => {
    dispatch(modeActions.setNextAnimation());
  };

  const testAnimationLast = () => {
    dispatch(modeActions.setNextAnimation());
    dispatch(modeActions.setIsLoading());
  };

  useEffect(() => {
    const startAnimation =
      mode.searchingState.isLoading &&
      mode.searchingState.currentAnimation === 0 &&
      setInterval(testAnimationTrigger, 0);
    const movingCircleAnimation =
      mode.searchingState.isLoading &&
      mode.searchingState.currentAnimation === 1 &&
      setInterval(testAnimationTrigger, 666);
    const settingCurrentStars =
      mode.searchingState.isLoading &&
      mode.searchingState.currentAnimation === 2 &&
      setInterval(testAnimationTrigger, 500);
    const movingCurrentStars =
      mode.searchingState.isLoading &&
      mode.searchingState.currentAnimation === 3 &&
      setInterval(testAnimationTrigger, 500);
    const movingLineAnimation =
      mode.searchingState.isLoading &&
      mode.searchingState.currentAnimation === 4 &&
      setInterval(testAnimationLast, 2000);
    return () => {
      if (startAnimation) {
        clearInterval(startAnimation);
      }
      if (movingCircleAnimation) {
        clearInterval(movingCircleAnimation);
      }
      if (settingCurrentStars) {
        clearInterval(settingCurrentStars);
      }
      if (movingCurrentStars) {
        clearInterval(movingCurrentStars);
      }
      if (movingLineAnimation) {
        clearInterval(movingLineAnimation);
      }
    };
  }, [mode.searchingState.isLoading, mode.searchingState.currentAnimation]);

  return (
    <div id='Space' draggable='false' style={{ ...props }}>
      <div
        id='Empty Space'
        onMouseDown={handleOnMouseDown}
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: `${mode.searchingState.isLoading ? 'none' : 'auto'}`,
        }}
      />
      {mode.searchingState.currentAnimation === 1 ||
      mode.searchingState.currentAnimation === 2 ||
      mode.searchingState.currentAnimation === 3 ? (
        <div
          id='Moving Circle'
          style={{
            left: `${mode.searchingState.movingPosition[0] - screen.width * 0.05625}px`,
            top: `${mode.searchingState.movingPosition[1] - screen.height * 0.1}px`,
            width: '11.5%',
            height: '20%',
            position: 'absolute',
            display: 'flex',
            backgroundImage: `url(${MovingCircle})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ) : null}
      {mode.searchingState.currentAnimation === 2 ||
      mode.searchingState.currentAnimation === 3 ||
      mode.searchingState.currentAnimation === 4 ? (
        <div
          id='Moving Line'
          style={{
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            position: 'absolute',
            backgroundImage: `url(${MovingLine})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ) : null}
      <div id='Stars'>
        {mode.searchingState.stars.map((starProps, index) => (
          <Star key={index} {...starProps} />
        ))}
      </div>
    </div>
  );
}

export default Space;
