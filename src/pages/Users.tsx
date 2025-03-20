import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { UserPlus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { userService } from '../services/userService';
import type { User } from '../types';

export function Users() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'employee' as 'admin' | 'employee'
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/', { replace: true });
      return;
    }
    loadProfiles();
  }, [user, navigate]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllProfiles();
      setProfiles(data);
    } catch (err) {
      console.error('Error loading profiles:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      await userService.createUser({
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
      });

      setNewUser({
        email: '',
        password: '',
        role: 'employee'
      });
      setShowAddModal(false);
      await loadProfiles();
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;

    try {
      setLoading(true);
      setError(null);

      await userService.updateProfile(selectedProfile.id, {
        email: selectedProfile.email,
        role: selectedProfile.role
      });

      await loadProfiles();
      setShowEditModal(false);
      setSelectedProfile(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la modification de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedProfile) return;

    try {
      setLoading(true);
      setError(null);

      await userService.deleteProfile(selectedProfile.id);

      await loadProfiles();
      setShowDeleteModal(false);
      setSelectedProfile(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <div className="flex space-x-4">
          <Button
            variant="secondary"
            onClick={loadProfiles}
            isLoading={loading}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Actualiser
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Ajouter un Utilisateur
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de Création
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Chargement des utilisateurs...
                  </td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {profile.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        profile.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {profile.role === 'admin' ? 'Administrateur' : 'Employé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(profile.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProfile(profile);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProfile(profile);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal d'ajout */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter un Utilisateur"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />

          <Input
            type="password"
            label="Mot de passe"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
            minLength={6}
          />

          <Select
            label="Rôle"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'employee' })}
            options={[
              { value: 'employee', label: 'Employé' },
              { value: 'admin', label: 'Administrateur' }
            ]}
          />

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAddModal(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              Créer l'utilisateur
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de modification */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProfile(null);
        }}
        title="Modifier l'Utilisateur"
      >
        {selectedProfile && (
          <form onSubmit={handleEditUser} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={selectedProfile.email}
              onChange={(e) => setSelectedProfile({ ...selectedProfile, email: e.target.value })}
              required
            />

            <Select
              label="Rôle"
              value={selectedProfile.role}
              onChange={(e) => setSelectedProfile({ ...selectedProfile, role: e.target.value as 'admin' | 'employee' })}
              options={[
                { value: 'employee', label: 'Employé' },
                { value: 'admin', label: 'Administrateur' }
              ]}
            />

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProfile(null);
                }}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                isLoading={loading}
              >
                Modifier l'utilisateur
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal de suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProfile(null);
        }}
        title="Confirmer la suppression"
      >
        {selectedProfile && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedProfile.email} ?
              Cette action est irréversible.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProfile(null);
                }}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteUser}
                isLoading={loading}
              >
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}