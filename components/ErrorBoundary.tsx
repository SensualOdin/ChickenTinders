import React, { Component, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { captureError } from '../lib/monitoring/sentry';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Send error to Sentry
    captureError(error, {
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View className="flex-1 bg-background items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 shadow-lg max-w-md w-full">
            <Text className="text-4xl mb-4 text-center">😕</Text>
            <Text className="text-2xl font-bold text-textDark mb-2 text-center">
              Something Went Wrong
            </Text>
            <Text className="text-base text-textMuted mb-6 text-center">
              We're sorry, but something unexpected happened. The error has been reported to our team.
            </Text>

            {__DEV__ && this.state.error && (
              <View className="bg-gray-100 rounded-lg p-3 mb-4">
                <Text className="text-xs text-gray-600 font-mono">
                  {this.state.error.message}
                </Text>
              </View>
            )}

            <Button
              onPress={this.handleReset}
              variant="primary"
              size="lg"
              fullWidth
            >
              Try Again
            </Button>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
