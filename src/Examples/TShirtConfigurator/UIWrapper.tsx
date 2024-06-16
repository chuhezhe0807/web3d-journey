import { ReactNode } from "react";
import {Provider, useDispatch, useSelector} from "react-redux";

import store, { RootState, setColor, setDecal } from "./Store";
import "./UIWrapper.css";

/**
 * Canvas wrapper. 加载store和渲染canvas外的div
 * @param param0 
 * @returns 
 */
export default function UIWrapper({children}: {children: ReactNode}) {

  return (
    <Provider store={store}>
        {children}
        <Customizer />
    </Provider>
  )
}

/**
 * 自定义T恤印花和T恤颜色
 * @returns 
 */
function Customizer() {
    const shirtCurColor = useSelector((state: RootState) => state.color);
    const shirtColors = useSelector((state: RootState) => state.colors);
    const shirtDecals = useSelector((state: RootState) => state.decals);
    const dispatch = useDispatch();

    return (
      <div className="customizer">
        <div className="color-options">
          {shirtColors.map((color) => (
            <div 
              key={color} 
              className={`circle`} 
              style={{ background: color }} 
              onClick={() => dispatch(setColor(color))} 
            />
          ))}
        </div>
        <div className="decals">
          <div className="decals--container">
            {shirtDecals.map((decal) => (
              <div 
                key={decal} 
                className={`decal`} 
                onClick={() => dispatch(setDecal(decal))}
              >
                <img src={`/pics/thumbPic/${decal}_thumb.png`} alt="brand" />
              </div>
            ))}
          </div>
        </div>
        <button
          className="share"
          style={{ background: shirtCurColor }}
          onClick={() => {
            const link = document.createElement('a')
            link.setAttribute('download', 'canvas.png')
            link.setAttribute('href', document.querySelector('canvas')!.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
            link.click()
          }}>
          DOWNLOAD
        </button>
      </div>
    )
  }