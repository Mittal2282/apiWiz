function ThemeToggle({ isDark, setIsDark }) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium">
        {isDark ? 'Dark' : 'Light'}
      </label>
      <button
        onClick={() => setIsDark(!isDark)}
        className="relative w-14 h-7 bg-blue-500 rounded-full transition duration-200 ease-in-out"
      >
        <div
          className={`absolute w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform ${
            isDark ? 'translate-x-7' : 'translate-x-1'
          } top-0.5`}
        />
      </button>
    </div>
  );
}

export default ThemeToggle;

