type Props = {
  title: string;
};

export default function PageTitle({ title }: Props) {
  return (
    <div className="mb-4 flex items-center justify-center">
      <h1 className="mb-4 text-3xl font-bold md:text-6xl lg:text-7xl">{title}</h1>
    </div>
  );
}
