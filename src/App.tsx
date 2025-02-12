//import { useEffect, useState } from "react";
import "./App.css";
import { prot } from "./protocol/client";
//import { GetUserPacket, Tracks } from "./protocol/packets";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginProtected from "./components/LoginProtected";
import Home from "./components/Home";
import Login from "./components/Login";
import { ContextUser, UserContext } from "./contexts/UserContext";
import { useState } from "react";

/*
function App() {
  const [status, setStatus] = useState(0);

  const packet: GetUserPacket = { id: 0 };

  useEffect(() => {
    prot.send({ packet: packet, track: Tracks.user }).then((p) => {
      setStatus(p.status!);
    });
  });

  return (
    <>
      <p className="font-bold">{status}</p>
    </>
  );
}
  */

function App() {
  const [user, setUser] = useState({ authenticated: false });
  const value = { user, setUser };

  return (
    <UserContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/home"
            element={
              <LoginProtected>
                <Home />
              </LoginProtected>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
