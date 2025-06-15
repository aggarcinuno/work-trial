import { TopNav } from "@/components/navigation/top-nav";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Q&A Data Collection</h1>
        <p className="text-muted-foreground">
          View and manage your collected question-answer pairs
        </p>
        <TopNav />
      </div>
      {children}
    </div>
  );
}
