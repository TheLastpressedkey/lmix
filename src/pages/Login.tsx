import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Container } from '../components/ui/Container';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError('Email ou mot de passe invalide');
      setIsLoading(false);
      return;
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <Container className="max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Plateforme LMI
          </h1>
          <p className="mt-2 text-gray-600">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        <Card>
          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="error">
                  {error}
                </Alert>
              )}
              
              <Input
                id="email"
                type="email"
                label="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                required
                autoComplete="email"
                placeholder="Entrez votre email"
              />

              <Input
                id="password"
                type="password"
                label="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
                autoComplete="current-password"
                placeholder="Entrez votre mot de passe"
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Se connecter
              </Button>
            </form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}