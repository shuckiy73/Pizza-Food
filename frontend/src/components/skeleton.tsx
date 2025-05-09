



const Skeleton: React.FC = () => {
    return (
        <div className="flex h-[450px] animate-pulse">
    <div className="relative w-full overflow-hidden rounded-md shadow before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 hover:shadow-lg before:animate-[shimmer_1.5s_infinite]">
      <div className="h-[260px] w-full pt-8 rounded-lg ">
        <div className="h-[200px] w-[200px] rounded-[100%] m-auto bg-neutral-300"></div>
      </div>
      <div className="space-y-4 mt-3">
        <div className="h-8 w-8/12 rounded-full bg-neutral-300"></div>
        <div className="space-y-1">
          <div className="h-4 w-full rounded-full bg-neutral-300 shadow"></div>
          <div className="h-4 w-full rounded-full bg-neutral-300 shadow"></div>
          <div className="h-4 w-full rounded-full bg-neutral-300 shadow"></div>
          <div className="h-4 w-7/12 rounded-full bg-neutral-300 shadow"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-10 w-24 rounded-full bg-neutral-300"></div>
          <div className="h-10 w-24 rounded-4xl rounded-full bg-neutral-300"></div>
        </div>
      </div>
  </div>
</div>

    );
}
 
export default Skeleton;