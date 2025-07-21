'use client';

import { View, Button } from 'reshaped';

interface AdminFormActionsProps {
  isNew: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export function AdminFormActions({ 
  isNew, 
  isSaving, 
  isDeleting, 
  onSave, 
  onCancel, 
  onDelete,
  disabled = false
}: AdminFormActionsProps) {
  return (
    <View 
      direction="row" 
      gap={3} 
      justify="end" 
      paddingTop={4}
    >
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isSaving || isDeleting}
      >
        Cancel
      </Button>
      
      {!isNew && onDelete && (
        <Button 
          variant="outline" 
          color="critical" 
          onClick={onDelete}
          disabled={isSaving || isDeleting}
          loading={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      )}
      
      <Button 
        variant="solid" 
        color="primary"
        onClick={onSave}
        disabled={disabled || isSaving || isDeleting}
        loading={isSaving}
      >
        {isSaving ? 'Saving...' : isNew ? 'Create' : 'Save Changes'}
      </Button>
    </View>
  );
} 