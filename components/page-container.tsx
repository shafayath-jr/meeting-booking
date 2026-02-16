type Props = {
  children: React.ReactNode;
};

export default function PageContainer({ children }: Props) {
  return <div className="container mx-auto px-6 py-10">{children}</div>;
}
