import Modal from './Modal'
import PersonForm from './PersonForm'

export default function AddPersonModal({ onClose, onCreatePerson }) {
  async function handleSubmit({ name, bio, photoFile }) {
    await onCreatePerson(name, { bio, photoFile })
    onClose()
  }

  return (
    <Modal title="Add a person" onClose={onClose}>
      <PersonForm submitLabel="Add person" onCancel={onClose} onSubmit={handleSubmit} />
    </Modal>
  )
}
