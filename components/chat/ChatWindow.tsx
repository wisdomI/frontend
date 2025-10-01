import OnlineStatusIndicator from './OnlineStatusIndicator'
import { Conversation, Message } from '@/types/api'

interface ChatWindowProps {
  conversation: Conversation
  onSendMessage: (recipientId: string, message: string, messageType?: 'text' | 'image' | 'file') => Promise<Message>
}

export default function ChatWindow({ conversation, onSendMessage }: ChatWindowProps) {
  return (
    <div className="bg-white rounded-lg shadow border h-96 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
          <div>
            <h3 className="font-medium">Elite Photography</h3>
            <OnlineStatusIndicator isOnline={true} />
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex">
            <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
              <p className="text-sm">Hi! I&apos;m interested in your photography services for my wedding.</p>
              <span className="text-xs text-gray-500">10:30 AM</span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
              <p className="text-sm">Thank you for your inquiry! I&apos;d love to help capture your special day. When is your wedding date?</p>
              <span className="text-xs text-blue-200">10:32 AM</span>
            </div>
          </div>
          
          <div className="flex">
            <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
              <p className="text-sm">It&apos;s on March 15th, 2024. We&apos;re expecting about 150 guests.</p>
              <span className="text-xs text-gray-500">10:35 AM</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-event-blue text-white px-4 py-2 rounded-r-lg hover:bg-event-blue-hover transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}