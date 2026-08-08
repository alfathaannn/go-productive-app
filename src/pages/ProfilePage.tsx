import { Block, BlockTitle, List, ListItem } from "konsta/react";
import { Lock, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";

export default function ProfilePage() {
  const { user, lock, signOut } = useAuth();

  return (
    <>
      <BlockTitle>Profil</BlockTitle>
      <Block strong inset>
        <p className="font-semibold">{user?.name}</p>
        <p className="text-sm opacity-70">{user?.email}</p>
      </Block>

      <List strong inset>
        <ListItem
          link
          title="Kunci Aplikasi"
          media={<Lock size={20} />}
          onClick={() => lock()}
        />
        <ListItem
          link
          title="Keluar & Lepas Device"
          media={<LogOut size={20} />}
          onClick={() => signOut()}
        />
      </List>
    </>
  );
}
