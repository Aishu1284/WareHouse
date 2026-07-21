function Button({
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;