/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import PanViewer from './ImageViewer';
import { Button } from '@/components/ui/button';
import { FlipHorizontal2Icon, Rotate3dIcon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
// FlipHorizontalIcon
// import { ThemesStyle } from '../Themes/Themes-Style';

// box-shadow: 0px 0px 5px 1px #0c0c0c;

type ReactPanZoomProps = {
  image: string;
  alt?: string;
  ref?: any;
};

const ReactPanZoom = ({ image, alt, ref }: ReactPanZoomProps) => {
  const [dx, setDx] = React.useState(0);
  const [dy, setDy] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [flip, setFlip] = React.useState(false);

  const resetAll = () => {
    setDx(0);
    setDy(0);
    setZoom(1);
    setRotation(0);
    setFlip(false);
  };
  const zoomIn = () => {
    setZoom(zoom + 0.2);
  };

  const zoomOut = () => {
    if (zoom >= 1) {
      setZoom(zoom - 0.2);
    }
  };

  const rotateLeft = () => {
    if (rotation === -3) {
      setRotation(0);
    } else {
      setRotation(rotation - 1);
    }
  };

  const flipImage = () => {
    setFlip(!flip);
  };

  const onPan = (dx: number, dy: number) => {
    setDx(dx);
    setDy(dy);
  };

  return (
    <div>
      <div className='absolute z-10 grid justify-end gap-1 py-2 right-2'>
        <Button variant={"outline"} size={"sm"} onClick={zoomIn}>
          <ZoomInIcon />
        </Button>
        <Button variant={"outline"} size={"sm"} onClick={zoomOut}>
          <ZoomOutIcon />
        </Button>
        <Button variant={"outline"} size={"sm"} onClick={rotateLeft}>
          <Rotate3dIcon />
        </Button>
        <Button variant={"outline"} size={"sm"} onClick={flipImage}>
          <FlipHorizontal2Icon />
        </Button>
        <Button variant={"outline"} size={"sm"} onClick={resetAll}>
          <RotateCcwIcon />
        </Button>
      </div>
      <PanViewer
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}
        zoom={zoom}
        setZoom={setZoom}
        pandx={dx}
        pandy={dy}
        onPan={onPan}
        rotation={rotation}
        key={dx} >
        <img
          style={{
            transform: `rotate(${rotation * 90}deg) scaleX(${flip ? -1 : 1})`,
            width: '100%',
          }}
          src={image}
          alt={alt}
          ref={ref}
        />
      </PanViewer>
    </div>
  );
};

export { PanViewer };
export default ReactPanZoom;