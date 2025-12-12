import DisputeDetail from '@/components/dispute/DisputeDetail'

export default function SuperAdminDisputeDetailPage({ params }: { params: { id: string } }) {
  return <DisputeDetail basePath="/super-admin/dispute" disputeId={params.id} userRole="Super Admin" />
}

