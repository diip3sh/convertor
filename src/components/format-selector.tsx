"use client";

interface FormatSelectorProps {
  fileType: string;
  value: string | null;
  onChange: (format: string) => void;
  disabled?: boolean;
  currentFormat?: string;
}

export const FormatSelector = ({ fileType, value, onChange, disabled, currentFormat }: FormatSelectorProps) => {
  const getFormats = () => {
    if (fileType === "image") {
      const formats = [
        { value: "webp", label: "WEBP (Lossless)" },
        { value: "png", label: "PNG" },
        { value: "jpg", label: "JPG" },
        { value: "avif", label: "AVIF" },
      ];
      return formats.filter(f => f.value !== currentFormat?.toLowerCase());
    }
    if (fileType === "video") {
      const formats = [
        { value: "gif", label: "GIF (Animated)" },
        { value: "webm", label: "WEBM" },
        { value: "mp4", label: "MP4" },
        { value: "mov", label: "MOV" },
      ];
      return formats.filter(f => f.value !== currentFormat?.toLowerCase());
    }
    if (fileType === "audio") {
      const formats = [
        { value: "mp3", label: "MP3" },
        { value: "wav", label: "WAV" },
        { value: "ogg", label: "OGG" },
        { value: "flac", label: "FLAC" },
      ];
      return formats.filter(f => f.value !== currentFormat?.toLowerCase());
    }
    return [];
  };

  const formats = getFormats();
  const selectId = `format-select-${fileType}`;

  return (
    <div className="w-full">
      <label htmlFor={selectId} className="block text-[0.65rem] uppercase font-semibold tracking-wider mb-2 text-[var(--text-color)]">
        Convert to
      </label>
      <select
        id={selectId}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full appearance-none
          bg-[var(--bg-elevated)] border border-[var(--line-color)] rounded-md
          py-3 px-4 pr-10
          text-sm font-medium text-[var(--text-color)]
          cursor-pointer
          transition-all duration-200 ease-out
          focus:outline-none focus:border-[var(--accent-green)]
          disabled:opacity-50 disabled:cursor-not-allowed
          bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ededed' d='M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.762L10.825 4z'/%3E%3C/svg%3E")]
          bg-no-repeat bg-[right_1rem_center]
        `}
      >
        <option value="">Select format</option>
        {formats.map((format) => (
          <option key={format.value} value={format.value}>
            {format.label}
          </option>
        ))}
      </select>
    </div>
  );
};
