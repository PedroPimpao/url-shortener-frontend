import { ShortUrlRedirect } from '@/components/short-url-redirect';

export default async function ShortUrlPage(props: PageProps<'/[shortCode]'>) {
  const { shortCode } = await props.params;
  return <ShortUrlRedirect code={shortCode} />;
}
