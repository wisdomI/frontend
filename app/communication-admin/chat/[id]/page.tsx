import ChatInterface from '@/components/communication/ChatInterface'

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatInterface basePath="/communication-admin" />
}

