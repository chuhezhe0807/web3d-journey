import { RefObject, useEffect, useRef } from "react";
import Starter from "./Starter";

type TProps = {
  canvasRef: RefObject<HTMLCanvasElement>
}

export default function StarterUI(props: TProps) {
  const {canvasRef} = props;
  const starterRef = useRef<Starter | null>(null);

  useEffect(() => {
    if(canvasRef.current && !starterRef.current) {
      starterRef.current = new Starter(canvasRef.current);
    }

    return () => {
      starterRef.current?.onDispose();
    }
  }, [])

  return null;
}
