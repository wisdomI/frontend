import ChatWindow from '@/components/chat/ChatWindow'

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Conversations</h2>
          <div className="space-y-2">
            <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <h3 className="font-medium">Elite Photography</h3>
              <p className="text-sm text-gray-600">Thanks for your inquiry...</p>
            </div>
            <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <h3 className="font-medium">Delicious Catering</h3>
              <p className="text-sm text-gray-600">We can accommodate 150 guests...</p>
            </div>
            <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <h3 className="font-medium">Sound & Lights Pro</h3>
              <p className="text-sm text-gray-600">Our equipment includes...</p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <ChatWindow />
        </div>
      </div>
    </div>
  )
}