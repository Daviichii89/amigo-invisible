import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Participant, Gift, Group } from '../types';

/**
 * Generar código de invitación aleatorio
 */
function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Hook para obtener grupos del usuario (como admin o miembro)
 */
export function useUserGroups(userId: string | undefined) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setGroups([]);
      setLoading(false);
      return;
    }

    const groupsMap = new Map<string, Group>();
    let memberGroupIds = new Set<string>();

    // Listener para grupos donde es admin
    const adminQuery = query(
      collection(db, 'groups'),
      where('adminUserId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeAdmin = onSnapshot(
      adminQuery,
      (snapshot) => {
        snapshot.docs.forEach((doc) => {
          groupsMap.set(doc.id, { id: doc.id, ...doc.data() } as Group);
        });
        
        // Remover grupos admin que ya no existen
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'removed') {
            groupsMap.delete(change.doc.id);
          }
        });
        
        updateGroupsList();
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching admin groups:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    // Listener para todos los grupos (para verificar membresía)
    const allGroupsQuery = query(collection(db, 'groups'));
    
    const unsubscribeAllGroups = onSnapshot(allGroupsQuery, async (snapshot) => {
      const checkMembership = async () => {
        const newMemberGroupIds = new Set<string>();
        
        for (const groupDoc of snapshot.docs) {
          const membersQuery = query(
            collection(db, `groups/${groupDoc.id}/members`),
            where('userId', '==', userId)
          );
          const membersSnapshot = await getDocs(membersQuery);
          
          if (!membersSnapshot.empty) {
            newMemberGroupIds.add(groupDoc.id);
            groupsMap.set(groupDoc.id, { id: groupDoc.id, ...groupDoc.data() } as Group);
          } else if (memberGroupIds.has(groupDoc.id)) {
            // Era miembro pero ya no lo es
            groupsMap.delete(groupDoc.id);
          }
        }
        
        // Remover grupos que fueron eliminados
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'removed') {
            groupsMap.delete(change.doc.id);
            newMemberGroupIds.delete(change.doc.id);
          }
        });
        
        memberGroupIds = newMemberGroupIds;
        updateGroupsList();
      };
      
      await checkMembership();
    });

    function updateGroupsList() {
      setGroups(Array.from(groupsMap.values()).sort((a, b) => 
        (b.createdAt || 0) - (a.createdAt || 0)
      ));
    }

    return () => {
      unsubscribeAdmin();
      unsubscribeAllGroups();
    };
  }, [userId]);

  return { groups, loading, error };
}

/**
 * Hook para obtener un grupo específico
 */
export function useGroup(groupId: string | undefined) {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!groupId) {
      setGroup(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'groups', groupId),
      (docSnap) => {
        if (docSnap.exists()) {
          setGroup({ id: docSnap.id, ...docSnap.data() } as Group);
        } else {
          setGroup(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching group:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [groupId]);

  return { group, loading, error };
}

/**
 * Hook para obtener participantes de un grupo
 */
export function useParticipants(groupId: string | undefined) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!groupId) {
      setParticipants([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `groups/${groupId}/participants`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const participantsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Participant[];
        setParticipants(participantsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching participants:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [groupId]);

  return { participants, loading, error };
}

/**
 * Hook para obtener los regalos de un participante
 */
export function useGifts(groupId: string | undefined, participantId: string | undefined) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!groupId || !participantId) {
      setGifts([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `groups/${groupId}/participants/${participantId}/gifts`),
      orderBy('title', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const giftsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Gift[];
        setGifts(giftsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching gifts:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [groupId, participantId]);

  return { gifts, loading, error };
}

/**
 * Funciones para manipular grupos
 */
export async function createGroup(userId: string, name: string, maxBudget: number = 15) {
  try {
    const inviteCode = generateInviteCode();
    const docRef = await addDoc(collection(db, 'groups'), {
      name,
      adminUserId: userId,
      maxBudget,
      inviteCode,
      createdAt: serverTimestamp(),
    });
    
    // Añadir al admin como miembro
    await addDoc(collection(db, `groups/${docRef.id}/members`), {
      userId,
      role: 'admin',
      joinedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
}

export async function updateGroupName(groupId: string, newName: string) {
  try {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, { name: newName });
  } catch (error) {
    console.error('Error updating group name:', error);
    throw error;
  }
}

export async function joinGroupByCode(userId: string, inviteCode: string, userName: string, userEmail: string) {
  try {
    // Buscar grupo por código de invitación
    const q = query(
      collection(db, 'groups'),
      where('inviteCode', '==', inviteCode.toUpperCase())
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      throw new Error('Código de invitación inválido');
    }
    
    const groupDoc = snapshot.docs[0];
    const groupId = groupDoc.id;
    
    // Crear participante
    const participantRef = await addDoc(collection(db, `groups/${groupId}/participants`), {
      name: userName,
      email: userEmail,
      userId,
      createdAt: serverTimestamp(),
    });
    
    // Añadir como miembro
    await addDoc(collection(db, `groups/${groupId}/members`), {
      userId,
      role: 'member',
      participantId: participantRef.id,
      joinedAt: serverTimestamp(),
    });
    
    return groupId;
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
}

/**
 * Funciones para manipular participantes
 */
export async function addParticipant(groupId: string, name: string, email: string, userId?: string) {
  try {
    const docRef = await addDoc(collection(db, `groups/${groupId}/participants`), {
      name,
      email,
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding participant:', error);
    throw error;
  }
}

export async function deleteParticipant(groupId: string, participantId: string) {
  try {
    await deleteDoc(doc(db, `groups/${groupId}/participants`, participantId));
  } catch (error) {
    console.error('Error deleting participant:', error);
    throw error;
  }
}

/**
 * Funciones para manipular regalos
 */
export async function addGift(
  groupId: string,
  participantId: string,
  gift: Omit<Gift, 'id'>
) {
  try {
    const docRef = await addDoc(
      collection(db, `groups/${groupId}/participants/${participantId}/gifts`),
      gift
    );
    return docRef.id;
  } catch (error) {
    console.error('Error adding gift:', error);
    throw error;
  }
}

export async function updateGift(
  groupId: string,
  participantId: string,
  giftId: string,
  updates: Partial<Gift>
) {
  try {
    const giftRef = doc(db, `groups/${groupId}/participants/${participantId}/gifts`, giftId);
    await updateDoc(giftRef, updates);
  } catch (error) {
    console.error('Error updating gift:', error);
    throw error;
  }
}

export async function deleteGift(groupId: string, participantId: string, giftId: string) {
  try {
    await deleteDoc(doc(db, `groups/${groupId}/participants/${participantId}/gifts`, giftId));
  } catch (error) {
    console.error('Error deleting gift:', error);
    throw error;
  }
}

/**
 * Eliminar un grupo completo (solo admin)
 */
export async function deleteGroup(groupId: string) {
  try {
    // Eliminar todos los participantes y sus regalos
    const participantsSnapshot = await getDocs(collection(db, `groups/${groupId}/participants`));
    
    for (const participantDoc of participantsSnapshot.docs) {
      // Eliminar regalos del participante
      const giftsSnapshot = await getDocs(collection(db, `groups/${groupId}/participants/${participantDoc.id}/gifts`));
      for (const giftDoc of giftsSnapshot.docs) {
        await deleteDoc(giftDoc.ref);
      }
      // Eliminar participante
      await deleteDoc(participantDoc.ref);
    }
    
    // Eliminar miembros
    const membersSnapshot = await getDocs(collection(db, `groups/${groupId}/members`));
    for (const memberDoc of membersSnapshot.docs) {
      await deleteDoc(memberDoc.ref);
    }
    
    // Eliminar el grupo
    await deleteDoc(doc(db, 'groups', groupId));
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
}

/**
 * Calcular el total de regalos de un participante
 */
export function calculateTotal(gifts: Gift[]): number {
  return gifts.reduce((sum, gift) => sum + gift.price, 0);
}
