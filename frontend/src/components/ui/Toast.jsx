export default function Toast({ message, type = "success" }) {
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm shadow-lg z-50
        ${type === "success" ? "bg-green-100 text-green-800" : ""}
        ${type === "error" ? "bg-red-100 text-red-800" : ""}
      `}
    >
      {message}
    </div>
  );
}
