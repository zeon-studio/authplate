export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="section">
      <div className="container">
        <div className="row justify-center">
          <div className="col-12 md:col-6">
            <div className="px-10 py-14 bg-light rounded-md">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
