export const Avatar = ({ name, width, height }) => {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${
          width ? `w-${width}` : "w-9"
        } ${
          height ? `h-${height}` : "h-9"
        } overflow-hidden bg-gray-100 rounded-full dark:bg-[#C7EAC9]`}
      >
        <span className="font-medium text-gray-600 dark:text-black uppercase">
          {name}
        </span>
      </div>
    );
  };