interface Props {
  text: string;
  children?: React.ReactNode;
}

const HomeCard = ({ text, children }: Props) => {
  return (
    <div className="flex flex-col justify-between h-72 w-52 bg-darkdarkblue text-white hover:text-brightpale p-3 rounded-xl border-gray-950 transition-all hover:-translate-y-2 hover:cursor-pointer hover:shadow-2xl hover:border-brightpale hover:bg-darkblue">
      <h2 className="font-bold">
        {text}
        <span className="material-icons align-bottom">arrow_forward</span>
      </h2>
      <div className="mb-4">{children}</div>
    </div>
  );
};

export default HomeCard;
