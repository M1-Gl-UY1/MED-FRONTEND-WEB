import { api } from './api';

export interface NotificationDTO {
  id?: number;
  type: string;
  titre: string;
  message: string;
  lien?: string;
  lu: boolean;
  dateCreation: string;
  typeLabel?: string;
  tempsEcoule?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

export const notificationService = {
  /**
   * Recuperer toutes les notifications de l'utilisateur
   */
  async getAll(userId: number): Promise<NotificationDTO[]> {
    const response = await api.get<NotificationDTO[]>(`/api/notifications/user/${userId}`);
    return response.data;
  },

  /**
   * Compter les notifications non lues
   */
  async countUnread(userId: number): Promise<number> {
    const response = await api.get<number>(`/api/notifications/user/${userId}/unread/count`);
    return response.data;
  },

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(id: number): Promise<void> {
    await api.patch(`/api/notifications/${id}/read`);
  },

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(userId: number): Promise<void> {
    await api.patch(`/api/notifications/user/${userId}/read-all`);
  },

  /**
   * Supprimer une notification
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/api/notifications/${id}`);
  },

  /**
   * Obtenir l'URL WebSocket
   */
  getWebSocketUrl(): string {
    return `${API_BASE_URL}/ws`;
  },
};

export default notificationService;
