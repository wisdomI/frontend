import { BsGrid, BsList } from 'react-icons/bs'

type CardView = 'grid' | 'list'

interface CardViewToggleProps {
  view: CardView
  onChange: (view: CardView) => void
}

const CardViewToggle: React.FC<CardViewToggleProps> = ({ view, onChange }) => {
  return (
    <div className="flex bg-white p-1 border gap-4 rounded">
      <button
        onClick={() => onChange('list')}
        className={`p-2 rounded ${view === 'list' ? 'bg-event-blue text-white' : ''}`}
      >
        <BsList />
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`p-2 rounded ${view === 'grid' ? 'bg-event-blue text-white' : ''}`}
      >
        <BsGrid />
      </button>
    </div>
  )
}

export default CardViewToggle
