type Props = {
  title: string;
};

export default function PageTitle({ title }: Props) {
  return (
    <div className="flex items-center justify-center mb-4">
      <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-4">
        {title}
      </h1>
    </div>
  );
}
