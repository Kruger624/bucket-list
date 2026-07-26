import PersonTile from './PersonTile'

export default function PeopleView({ people, onOpenPerson, onAddPerson }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-inkMuted">Everyone who's part of the memories.</p>
        <button
          type="button"
          onClick={onAddPerson}
          className="shrink-0 rounded-lg border-2 border-ink px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-ink hover:text-parchment"
        >
          + Add person
        </button>
      </div>

      {people.length === 0 ? (
        <div className="rounded-card border border-dashed border-borderSoft py-12 text-center">
          <p className="font-serif text-lg text-ink">No one here yet</p>
          <p className="mt-1 text-sm text-inkMuted">
            Add the people you share these memories with.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
          {people.map((person) => (
            <PersonTile key={person.id} person={person} onOpen={() => onOpenPerson(person)} />
          ))}
        </div>
      )}
    </div>
  )
}
