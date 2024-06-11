const FormContainer = ({ children }: any) => {
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
};

export default FormContainer;
