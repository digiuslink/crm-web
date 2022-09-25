export interface IClient {
  objectId?: string;
  isVerified?: boolean;
  clientState?: string;
  addedBy?: any;
  assignedTo?: any;
  key?: string;
  gps?: { latitude: number; longitude: number };
  fullName?: string;
  wcom?: string;
  wilaya?: string;
  commune?: string;
  address?: string;
  tel_1?: string;
  tel_2?: string;
  tel_3?: string;
  category?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  facebook?: string;
}
