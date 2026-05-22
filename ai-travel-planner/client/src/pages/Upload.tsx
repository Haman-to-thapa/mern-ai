import { useState, useRef, useCallback, useEffect, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useTripStore } from "../store/tripStore";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { uploadFile, isLoading, error } = useTripStore();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
  }, [navigate]);

  const handleUpload = () => {
    if (!file) return;
    startTransition(async () => {
      const success = await uploadFile(file);
      if (success) navigate("/dashboard");
    });
  };

  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Upload
        </h1>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition mb-5 ${
            dragging
              ? "border-black bg-gray-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/*"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
            className="hidden"
          />

          {file ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-sm leading-none hover:bg-red-700"
              >
                ✕
              </button>
              <p className="text-lg font-medium break-all">
                {file.name}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-4xl mb-2">📄</p>
              <p className="text-gray-500">
                Drag & drop your PDF or image here
              </p>
              <p className="text-sm text-gray-400 mt-1">
                or click to browse
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-500 mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={isLoading || !file}
          className="bg-black hover:bg-gray-800 transition text-white w-full p-3 rounded-lg font-medium disabled:opacity-50"
        >
          {isLoading ? "Generating..." : "Generate Itinerary"}
        </button>
      </div>
    </div>
  );
};

export default Upload;
