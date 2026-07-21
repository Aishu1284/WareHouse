function PageHeader({ title, buttonText, onClick }) {
  return (
    <div className="flex justify-between items-center mb-6">

      <h1 className="text-3xl font-bold">
        {title}
      </h1>

      {buttonText && (
        <button
          onClick={onClick}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
        >
          {buttonText}
        </button>
      )}

    </div>
  );
}

export default PageHeader;