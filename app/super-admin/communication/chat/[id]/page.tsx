import ChatInterface from '@/components/communication/ChatInterface'

export default function SuperAdminChatPage({ params }: { params: { id: string } }) {
  return <ChatInterface basePath="/super-admin/communication" />
}

