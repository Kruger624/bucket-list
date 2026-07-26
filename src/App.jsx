import { useState } from 'react'
import Header from './components/Header'
import NamePrompt from './components/NamePrompt'
import ActiveListView from './components/ActiveListView'
import UpcomingView from './components/UpcomingView'
import MemoriesView from './components/MemoriesView'
import AddItemModal from './components/AddItemModal'
import EditItemModal from './components/EditItemModal'
import MarkDoneModal from './components/MarkDoneModal'
import MarkBookedModal from './components/MarkBookedModal'
import ItemDetailModal from './components/ItemDetailModal'
import PersonProfileModal from './components/PersonProfileModal'
import { useLocalName } from './hooks/useLocalName'
import { useCategories } from './hooks/useCategories'
import { useItems } from './hooks/useItems'
import { useInterest } from './hooks/useInterest'
import { useComments } from './hooks/useComments'
import { usePeople } from './hooks/usePeople'
import { useItemPeople } from './hooks/useItemPeople'

export default function App() {
  const [currentName, setCurrentName] = useLocalName()
  const [editingName, setEditingName] = useState(false)
  const [view, setView] = useState('active')

  const { categories, createCategory, colorFor } = useCategories()
  const { items, addItem, updateItem, deleteItem } = useItems()
  const { byItem: interestByItem, toggle: toggleInterest } = useInterest()
  const { byItem: commentsByItem, addComment } = useComments()
  const { people, createPerson, updatePerson } = usePeople()
  const { byItem: itemPeopleByItem, tagPerson, untagPerson } = useItemPeople()

  const [showAdd, setShowAdd] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [markDoneItem, setMarkDoneItem] = useState(null)
  const [markBookedItem, setMarkBookedItem] = useState(null)
  const [detailItem, setDetailItem] = useState(null)
  const [viewingPersonId, setViewingPersonId] = useState(null)
  const viewingPerson = people.find((p) => p.id === viewingPersonId) || null

  if (!currentName || editingName) {
    return (
      <NamePrompt
        onSubmit={(name) => {
          setCurrentName(name)
          setEditingName(false)
        }}
      />
    )
  }

  async function handleStatusChange(item, status) {
    if (status === 'done') {
      setMarkDoneItem(item)
      return
    }
    if (status === 'booked') {
      setMarkBookedItem(item)
      return
    }
    await updateItem(item.id, { status })
  }

  async function handleDelete(item) {
    if (window.confirm(`Delete "${item.title}"? This can't be undone.`)) {
      await deleteItem(item.id)
    }
  }

  function handleEditFromDetail(item) {
    setDetailItem(null)
    setEditingItem(item)
  }

  function handleDeleteFromDetail(item) {
    setDetailItem(null)
    handleDelete(item)
  }

  function taggedPeopleFor(itemId) {
    return (itemPeopleByItem.get(itemId) || []).map((row) => row.person)
  }

  function handleOpenPersonMemory(item) {
    setViewingPersonId(null)
    const full = items.find((i) => i.id === item.id)
    if (full) setDetailItem(full)
  }

  const sharedListProps = {
    categories,
    colorFor,
    currentName,
    interestByItem,
    commentsByItem,
    itemPeopleByItem,
    onToggleInterest: (itemId) => toggleInterest(itemId, currentName),
    onOpenDetail: setDetailItem,
    onEdit: setEditingItem,
    onDelete: handleDelete
  }

  return (
    <div className="min-h-screen pb-16">
      <Header
        view={view}
        onViewChange={setView}
        currentName={currentName}
        onEditName={() => setEditingName(true)}
        onAddItem={() => setShowAdd(true)}
      />

      <main className="mx-auto max-w-3xl px-4 py-4">
        {view === 'active' && (
          <ActiveListView items={items} onStatusChange={handleStatusChange} {...sharedListProps} />
        )}
        {view === 'upcoming' && (
          <UpcomingView items={items} onStatusChange={handleStatusChange} {...sharedListProps} />
        )}
        {view === 'memories' && <MemoriesView items={items} {...sharedListProps} />}
      </main>

      {showAdd && (
        <AddItemModal
          categories={categories}
          createCategory={createCategory}
          currentName={currentName}
          onClose={() => setShowAdd(false)}
          onSubmit={addItem}
        />
      )}

      {editingItem && (
        <EditItemModal
          item={editingItem}
          categories={categories}
          createCategory={createCategory}
          people={people}
          taggedPeople={taggedPeopleFor(editingItem.id)}
          onTagPerson={tagPerson}
          onUntagPerson={untagPerson}
          onCreatePerson={createPerson}
          onClose={() => setEditingItem(null)}
          onSubmit={updateItem}
        />
      )}

      {markDoneItem && (
        <MarkDoneModal
          item={markDoneItem}
          people={people}
          taggedPeople={taggedPeopleFor(markDoneItem.id)}
          onTagPerson={tagPerson}
          onUntagPerson={untagPerson}
          onCreatePerson={createPerson}
          onClose={() => setMarkDoneItem(null)}
          onConfirm={(fields) => updateItem(markDoneItem.id, { status: 'done', ...fields })}
        />
      )}

      {markBookedItem && (
        <MarkBookedModal
          item={markBookedItem}
          onClose={() => setMarkBookedItem(null)}
          onConfirm={(fields) => updateItem(markBookedItem.id, { status: 'booked', ...fields })}
        />
      )}

      {detailItem && (
        <ItemDetailModal
          item={detailItem}
          color={colorFor(detailItem.category_id)}
          interestPeople={interestByItem.get(detailItem.id) || []}
          comments={commentsByItem.get(detailItem.id) || []}
          taggedPeople={taggedPeopleFor(detailItem.id)}
          currentName={currentName}
          onToggleInterest={() => toggleInterest(detailItem.id, currentName)}
          onAddComment={addComment}
          onOpenPerson={(person) => setViewingPersonId(person.id)}
          onEdit={() => handleEditFromDetail(detailItem)}
          onDelete={() => handleDeleteFromDetail(detailItem)}
          onClose={() => setDetailItem(null)}
        />
      )}

      {viewingPerson && (
        <PersonProfileModal
          person={viewingPerson}
          onUpdatePerson={updatePerson}
          onOpenItem={handleOpenPersonMemory}
          onClose={() => setViewingPersonId(null)}
        />
      )}
    </div>
  )
}
