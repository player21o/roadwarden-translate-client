import { useContext } from "react";
import HomeCard from "./HomeCard";
import { UserContext } from "../contexts/UserContext";
import useGetUser from "../hooks/GetUser";
import { UserPermission } from "../protocol/packets";

const Home = () => {
  const {
    user: { id },
  } = useContext(UserContext);

  const user = useGetUser(id);

  return user != null ? (
    <>
      <h1 className="m-10">Главная</h1>
      <div className="flex gap-6 grid-cols-3">
        <HomeCard text="Редактор">
          {user.permissions
            .filter(([p]) => p == UserPermission.file)
            .map(([_, file_name]) => (
              <h3 key={file_name}>{file_name}</h3>
            ))}
        </HomeCard>
        <HomeCard text="Профиль">
          <img
            src={user.avatar_url}
            alt=""
            className="m-auto rounded-full scale-75"
          />
          <h3>Недавние действия</h3>
        </HomeCard>
        <HomeCard text="Статистика"></HomeCard>
      </div>
    </>
  ) : null;
};

export default Home;
