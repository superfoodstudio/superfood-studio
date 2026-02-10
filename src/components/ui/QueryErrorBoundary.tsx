'use client';

import { Component, ReactNode } from 'react';
import { View, Text, Button } from 'reshaped';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class QueryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View direction="column" align="center" padding={8} gap={4}>
          <Text variant="body-1" color="neutral-faded">
            Failed to load data. Please try again.
          </Text>
          <Button
            variant="outline"
            size="small"
            onClick={() => this.setState({ hasError: false })}
          >
            Retry
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}
