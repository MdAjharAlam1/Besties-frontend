import type { FC } from "react";

interface ErrorInterface {
  message: string;
}

const Error: FC<ErrorInterface> = ({ message }) => {
  return (
    <div className=" animate__animated animate__fadeIn flex items-center justify-center min-h-[150px] bg-red-50 border border-red-200 rounded-2xl p-6 shadow-md animate-fade-in">
      <div className="flex items-center space-x-4 text-red-700">
        <i className="ri-error-warning-fill text-4xl text-red-600 animate-pulse" />
        <div className="text-md font-medium">{message}</div>
      </div>
    </div>
  );
};

export default Error;
