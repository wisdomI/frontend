import DisputeDetail from '@/components/dispute/DisputeDetail'

export default function DisputeAdminDetailPage({ params }: { params: { id: string } }) {
  return <DisputeDetail basePath="/dispute-admin" disputeId={params.id} userRole="Dispute Admin" />
}

