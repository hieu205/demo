export interface Parent {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  occupation: string;
}

export interface StudentParent {
  studentId: number;
  parentId: number;
  relationshipType: 'Father' | 'Mother' | 'Guardian';
}

