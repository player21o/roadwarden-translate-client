import HomeCard from "./HomeCard";

const Home = () => {
  return (
    <>
      <h1 className="m-10">Главная</h1>
      <div className="flex gap-6 grid-cols-3">
        <HomeCard text="Редактор">
          <h3 className="italic">beach.rpy</h3>
          <h3>prologue.rpy</h3>
        </HomeCard>
        <HomeCard text="Профиль"></HomeCard>
        <HomeCard text="Статистика"></HomeCard>
      </div>
    </>
  );
};

export default Home;
