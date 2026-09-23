import React from 'react';
import { ProfileExperienceModal } from './ProfileExperienceModal';
import { ProfileExperienceId } from '../themes/types';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  onAppThemeSaved?: (themeId: any) => void;
  onProfileExperienceSaved?: (expId: ProfileExperienceId) => void;
  onThemeSavedToProfile?: (themeId: any) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  onProfileExperienceSaved,
  onThemeSavedToProfile,
}) => {
  return (
    <ProfileExperienceModal
      isOpen={isOpen}
      onClose={onClose}
      onSelectExperience={(expId) => {
        if (onProfileExperienceSaved) onProfileExperienceSaved(expId);
        if (onThemeSavedToProfile) onThemeSavedToProfile(expId);
      }}
    />
  );
};
