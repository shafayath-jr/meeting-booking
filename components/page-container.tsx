type Props = {
  children: React.ReactNode;
};

export default function PageContainer({ children }: Props) {
  return <div className="container mx-auto py-10 px-6">{children}</div>;
}
