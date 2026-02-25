type Props = {
  children: React.ReactNode;
};

export default function PageContainer({ children }: Props) {
  return <div className="container mx-auto space-y-4 px-6 py-10">{children}</div>;
}
