import { useContext } from "react";
import HomeCard from "./HomeCard";
import { UserContext } from "../contexts/UserContext";
import useGetUser from "../hooks/GetUser";
import { UserPermission } from "../protocol/packets";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
  //Legend
);

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
        <HomeCard text="Статистика">
          <h3>За неделю</h3>
          <Bar
            data={{
              labels: [...Array(7).keys()]
                .reverse()
                .map((d) =>
                  new Date(
                    new Date().setDate(new Date().getDate() - d)
                  ).toLocaleDateString("ru-RU")
                ),
              datasets: [
                {
                  label: "Переведённые карточки",
                  backgroundColor: "green",
                  data: [1, 2, 3, 4, 5, 6, 70],
                },
              ],
            }}
            options={{
              scales: { x: { ticks: { display: true, autoSkip: false } } },
              responsive: true,
              plugins: {
                title: { display: false, text: "Переведённые карточки" },
              },
            }}
            height={200}
          />
        </HomeCard>
      </div>
    </>
  ) : null;
};

export default Home;
