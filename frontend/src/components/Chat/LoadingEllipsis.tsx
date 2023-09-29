const LoadingEllipsis = () => {
  return (
    <div className="flex shrink-0 grow-0 gap-0.5 items-end">
      <div className="animate-bounce animation-delay-0 rounded-[50%] bg-gray-400 w-1 h-1"></div>
      <div className="animate-bounce animation-delay-200 rounded-[50%] bg-gray-400 w-1 h-1"></div>
      <div className="animate-bounce animation-delay-400 rounded-[50%] bg-gray-400 w-1 h-1"></div>
    </div>
  );
};

export default LoadingEllipsis;
