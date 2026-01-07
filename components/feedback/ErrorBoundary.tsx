import { Component, ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <View className="flex-1 items-center justify-center bg-background p-4">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text
            className="text-2xl font-bold text-primary mb-4 text-center"
            style={{ fontFamily: 'Fraunces' }}
          >
            Something Went Wrong
          </Text>
          <Text className="text-base text-textMuted mb-6 text-center max-w-md">
            {this.state.error.message || 'An unexpected error occurred'}
          </Text>
          <Pressable
            onPress={this.resetError}
            className="bg-primary px-6 py-3 rounded-full active:scale-95"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
