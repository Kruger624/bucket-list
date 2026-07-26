export default function ImageUploadField({ label, previewUrl, placeholder, aspect, onFileSelected, onRemove }) {
  return (
    <div className="flex flex-col gap-1.5 text-sm font-medium text-ink">
      {label}
      <div
        className={`relative w-full max-w-[240px] overflow-hidden rounded-lg border-2 ${aspect}`}
        style={{ borderColor: placeholder.accent, backgroundColor: placeholder.badgeBg }}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center font-serif text-3xl"
            style={{ color: placeholder.badgeText }}
          >
            {placeholder.letter}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <label className="cursor-pointer rounded-lg border border-borderSoft bg-card px-3 py-1.5 text-xs font-medium text-ink hover:bg-tan">
          {previewUrl ? 'Replace' : 'Upload'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onFileSelected(file)
              e.target.value = ''
            }}
          />
        </label>
        {previewUrl && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-medium text-inkMuted hover:text-[#D85A30]"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
