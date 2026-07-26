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
import { useLocalName } from './hooks/useLocalName'
import { useCategories } from './hooks/useCategories'
import { useItems } from './hooks/useItems'
import { useInterest } from './hooks/useInterest'

export default function App() {
  const [currentName, setCurrentName] = useLocalName()
  const [editingName, setEditingName] = useState(false)
  const [view, setView] = useState('active')

  const { categories, createCategory, colorFor } = useCategories()
  const { items, addItem, updateItem, deleteItem } = useItems()
  const { byItem: interestByItem, toggle: toggleInterest } = useInterest()

  const [showAdd, setShowAdd] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [markDoneItem, setMarkDoneItem] = useState(null)
  const [markBookedItem, setMarkBookedItem] = useState(null)

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

  const sharedListProps = {
    categories,
    colorFor,
    currentName,
    interestByItem,
    onToggleInterest: (itemId) => toggleInterest(itemId, currentName),
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
          onClose={() => setEditingItem(null)}
          onSubmit={updateItem}
        />
      )}

      {markDoneItem && (
        <MarkDoneModal
          item={markDoneItem}
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
    </div>
  )
}
