import { RefObject, useEffect, useRef } from "react";
import TransitionEffect from "./TransitionEffect";

type TProps = {
  canvasRef: RefObject<HTMLCanvasElement>
}

export default function TransitionEffectUI(props: TProps) {
  const {canvasRef} = props;
  const transitionEffectRef = useRef<TransitionEffect | null>(null);

  useEffect(() => {
    if(canvasRef.current && !transitionEffectRef.current) {
      transitionEffectRef.current = new TransitionEffect(canvasRef.current);
    }

    return () => {
      transitionEffectRef.current?.onDispose();
    }
  }, [])

  return null;
}
