export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="relative w-20 h-20 border-4 border-gray-600 rounded-full animate-spin">
        <div className="absolute inset-2 border-4 border-t-red-600 border-b-transparent rounded-full animate-spin" />
      </div>
      <span className="ml-4 text-red-500 text-xl font-bold tracking-widest">
        LOADING...
      </span>
    </div>
  );
}
