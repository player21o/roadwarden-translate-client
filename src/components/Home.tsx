import React from "react";
import HomeCard from "./HomeCard";

const Home = () => {
  return (
    <>
      <h1 className="m-10">Главная</h1>
      <div className="flex gap-6 grid-cols-3">
        <HomeCard text="Редактор"></HomeCard>
        <HomeCard text="Профиль"></HomeCard>
        <HomeCard text="Статистика"></HomeCard>
      </div>
    </>
  );
};

export default Home;
