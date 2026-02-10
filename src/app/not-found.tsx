import { View, Text, Button } from 'reshaped';
import Link from 'next/link';

export default function NotFound() {
  return (
    <View direction="column" align="center" justify="center" padding={10} gap={4} attributes={{ style: { minHeight: '50vh' } }}>
      <Text variant="featured-1" weight="bold">Page not found</Text>
      <Text variant="body-1" color="neutral-faded">
        The page you are looking for does not exist.
      </Text>
      <Link href="/">
        <Button variant="solid" color="primary">Go Home</Button>
      </Link>
    </View>
  );
}
