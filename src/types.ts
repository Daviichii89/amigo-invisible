export interface Gift {
  id: string;
  title: string;
  price: number;
  url?: string;
  imageUrl?: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  userId?: string; // Opcional: ID del usuario si tiene cuenta
  createdAt: number;
}

export interface Group {
  id: string;
  name: string;
  adminUserId: string;
  maxBudget: number;
  inviteCode: string; // Código para unirse al grupo
  createdAt: number;
}

export interface Member {
  userId: string;
  role: 'admin' | 'member';
  participantId?: string; // ID del participante asociado
  joinedAt: number;
}
