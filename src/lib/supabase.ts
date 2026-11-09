import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}

export type Program = {
  id: string;
  title: string;
  description: string;
  image_path: string;
  duration: string;
  price: number | null;
  departure_date: string | null;
  mecca_hotel: string;
  medina_hotel: string;
  published: boolean;
  sort_order: number;
};

export function programImage(path: string) {
  return (
    getSupabase()?.storage.from("umrah-images").getPublicUrl(path).data
      .publicUrl ?? ""
  );
}

export function priceText(price: number | null) {
  return price === null
    ? "السعر عند الاستفسار"
    : `يبدأ من ${new Intl.NumberFormat("ar-EG").format(price)} جنيه`;
}
