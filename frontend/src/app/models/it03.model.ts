export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IT03Doc {
  id: number;
  title: string;      // เอกสาร
  decidedBy: string;
  status: ApprovalStatus;

  approvedReason?: string;
  rejectedReason?: string;
  updatedAt: string;
}
