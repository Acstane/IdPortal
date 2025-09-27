import { FiLoader } from 'react-icons/fi';

export default function Loading() {
  return (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
          <FiLoader className="text-fuchsia-600 w-8 h-8 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Processing your request
        </h1>
        <p className="text-gray-600 text-sm">This may take a few moments...</p>
      </div>
      <div className="text-center text-sm text-gray-500 mt-6">
        <p>Please don't close this window while we complete your request.</p>
      </div>
    </>
  );
}
