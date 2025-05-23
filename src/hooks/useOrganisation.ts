"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { env, getConfig } from '../config/environment';

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export const useOrganisation = () => {
  const { accessToken, isAuthenticated } = useAuth();
  const [organisationsetOrganisation] = useState<Organisation | null>(null);
  const [loadingsetLoading] = useState<boolean>(true);
  const [errorsetError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganisation = async () => {
      if (!isAuthenticated || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = getConfig('apiUrl');
        const response = await fetch(`${apiUrl}/api/organisations/current`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrganisation(data as Organisation);
        } else {
          setError('Failed to fetch organisation');
        }
      } catch (err) {
        setError('Error fetching organisation data');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisation();
  }, [isAuthenticatedaccessToken]);

  return { organisation, loading, error };
};