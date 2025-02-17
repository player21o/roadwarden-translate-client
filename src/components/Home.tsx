import { useContext, useEffect } from "react";
import HomeCard from "./HomeCard";
import { UserContext } from "../contexts/UserContext";
import useGetUser from "../hooks/GetUser";
import { Tracks, UserPermission } from "../protocol/packets";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  //Title,
  Tooltip,
  //Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { prot } from "../protocol/client";

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

  useEffect(() => {
    const today = new Date();
    const that_day = new Date(new Date().setDate(new Date().getDate() - 60));

    //console.log("wtf");

    prot
      .send(
        {
          start: {
            year: today.getFullYear(),
            month: today.getMonth(),
            day: today.getDate(),
          },
          end: {
            year: that_day.getFullYear(),
            month: that_day.getMonth(),
            day: that_day.getDate(),
          },
        },
        Tracks.stats
      )
      .then((an) => console.log(an));
  }, []);

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
              labels: [...Array(30).keys()]
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
              //scales: { x: { ticks: { display: true, autoSkip: false } } },
              responsive: true,
              plugins: {
                title: { display: false, text: "Переведённые карточки" },
              },
            }}
            height={200}
            //width={1000}
          />
        </HomeCard>
      </div>
    </>
  ) : null;
};

export default Home;
