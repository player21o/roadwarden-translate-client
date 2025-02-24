import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginProtected from "./components/LoginProtected";
import Home from "./components/Home";
import Login from "./components/Login";
import { UserContext } from "./contexts/UserContext";
import { useState } from "react";
import Landing from "./components/Landing";
import ConnectionManager from "./components/ConnectionManager";
import Editor from "./components/Editor";

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
  const [user, setUser] = useState({ authenticated: false, id: "-1" });
  const value = { user, setUser };

  return (
    <UserContext.Provider value={value}>
      <ConnectionManager>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/home"
              element={
                <LoginProtected>
                  <Home />
                </LoginProtected>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </BrowserRouter>
      </ConnectionManager>
    </UserContext.Provider>
  );
}

export default App;
