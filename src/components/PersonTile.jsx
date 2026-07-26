import PersonAvatar from './PersonAvatar'

export default function PersonTile({ person, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col items-center gap-2 text-center"
    >
      <PersonAvatar person={person} size="xl" />
      <span className="w-full truncate font-serif text-sm text-ink">{person.name}</span>
    </button>
  )
}
