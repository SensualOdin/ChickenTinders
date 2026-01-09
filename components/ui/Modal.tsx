import { View, Text, Pressable, ScrollView, Modal as RNModal } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button } from './Button';

const modalVariants = cva(
  'bg-surface rounded-3xl shadow-elevated w-full',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full mx-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ModalProps extends VariantProps<typeof modalVariants> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeButton?: boolean;
  className?: string;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  footer,
  closeButton = true,
  size,
  className,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-charcoal/70">
        {/* Backdrop */}
        <Pressable
          onPress={onClose}
          className="absolute inset-0"
        />

        {/* Modal Content */}
        <View className="flex-1 items-center justify-center px-4">
          <Pressable
            className="w-full items-center"
            onPress={(e) => e.stopPropagation()}
          >
            <View className={cn(modalVariants({ size }), className)}>
              {/* Header */}
              {(title || closeButton) && (
                <View className="px-6 pt-6 pb-4 border-b border-cream-dark flex-row items-center justify-between">
                  {title && (
                    <Text
                      className="text-xl font-bold text-textDark flex-1"
                      style={{ fontFamily: 'Fraunces' }}
                    >
                      {title}
                    </Text>
                  )}
                  {closeButton && (
                    <Pressable
                      onPress={onClose}
                      className="w-8 h-8 items-center justify-center rounded-full active:bg-gray-100"
                    >
                      <Text className="text-xl text-textMuted">×</Text>
                    </Pressable>
                  )}
                </View>
              )}

              {/* Content */}
              <ScrollView className="px-6 py-6 max-h-96">
                {children}
              </ScrollView>

              {/* Footer */}
              {footer && (
                <View className="px-6 pb-6 pt-4 border-t border-cream-dark">
                  {footer}
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </View>
    </RNModal>
  );
}

// Preset modal types for common use cases
export interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
}

export function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              onPress={onClose}
              variant="outline"
              size="md"
              fullWidth
            >
              {cancelText}
            </Button>
          </View>
          <View className="flex-1">
            <Button
              onPress={() => {
                onConfirm();
                onClose();
              }}
              variant={confirmVariant}
              size="md"
              fullWidth
            >
              {confirmText}
            </Button>
          </View>
        </View>
      }
    >
      <Text className="text-base text-textDark leading-relaxed">
        {message}
      </Text>
    </Modal>
  );
}
