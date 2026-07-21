function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">

      <h3 className="text-gray-500 text-sm font-medium">
        {title}
      </h3>

      <p className="text-4xl font-bold text-gray-800 mt-3">
        {value}
      </p>

    </div>
  );
}

export default Card;