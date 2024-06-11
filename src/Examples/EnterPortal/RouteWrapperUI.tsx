import { BrowserRouter, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ReactNode } from "react";

import "./EnterPortalUI.css";

export default function Wrapper(props: {children: ReactNode}) {
    return (
      <BrowserRouter>
        {props.children}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/item/:id" element={<></>} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }
  
  function Layout() {
    const navigate = useNavigate();
    const {id} = useParams<"id">();
  
    return (
      <div className={"layout"}>
          <a 
            style={{ position: 'absolute', top: 40, left: 40, fontSize: '13px' }} 
            href="#" 
            onClick={() => navigate('/')}>
              {id ? '< back' : 'double click to enter portal'}
          </a>
      </div>
    )
  }