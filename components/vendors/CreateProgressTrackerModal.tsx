'use client'

import { useState } from 'react'
import { FiPlus, FiX, FiArrowLeft, FiCalendar } from 'react-icons/fi'

interface Task {
  id: number
  name: string
  status: string
  startDate: string
  endDate: string
}

interface CreateProgressTrackerModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (tasks: Task[]) => void
}

function CreateProgressTrackerModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateProgressTrackerModalProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: 'Planning',
      status: '',
      startDate: '12/05/2025',
      endDate: '12/05/2025',
    },
    {
      id: 2,
      name: 'Design and Preparation',
      status: 'Completed',
      startDate: '12/05/2025',
      endDate: '12/05/2025',
    },
  ])

  const statusOptions = [
    'Select an Option',
    'Not Started',
    'In Progress',
    'Completed',
    'On Hold',
    'Cancelled',
  ]

  const handleTaskChange = (taskId: number, field: keyof Task, value: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ))
  }

  const addTask = () => {
    const newTask: Task = {
      id: tasks.length + 1,
      name: `Task Name ${tasks.length + 1}`,
      status: '',
      startDate: '12/05/2025',
      endDate: '12/05/2025',
    }
    setTasks([...tasks, newTask])
  }

  const handleSubmit = () => {
    onSubmit(tasks)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Create Progress Tracker</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Kindly fill in your task breakdown and timeline
          </p>

          {/* Tasks */}
          <div className="space-y-6">
            {tasks.map((task, index) => (
              <div key={task.id}>
                {/* Task Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Name {index + 1}
                  </label>
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => handleTaskChange(task.id, 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-event-blue focus:outline-none"
                  />
                </div>

                {/* Project Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Status
                  </label>
                  <select
                    value={task.status}
                    onChange={(e) => handleTaskChange(task.id, 'status', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-event-blue focus:outline-none"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option === 'Select an Option' ? '' : option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Timeline */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select the Project Timeline
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={task.startDate}
                          onChange={(e) => handleTaskChange(task.id, 'startDate', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-event-blue focus:outline-none"
                        />
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={task.endDate}
                          onChange={(e) => handleTaskChange(task.id, 'endDate', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-event-blue focus:outline-none"
                        />
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Separator line between tasks */}
                {index < tasks.length - 1 && (
                  <hr className="border-gray-200 my-6" />
                )}
              </div>
            ))}
          </div>

          {/* Add Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={addTask}
              className="flex items-center gap-2 px-4 py-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="w-full bg-event-blue text-white py-3 rounded-lg font-semibold hover:bg-event-blue-hover transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProgressTrackerModal 
