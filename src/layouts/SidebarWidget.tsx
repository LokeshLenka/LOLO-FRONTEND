import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function SidebarWidget() {
  const { logout } = useAuth();

  return (
    <div className="fixed left-0 right-0 bottom-0 mx-auto w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03] z-50 mb-32 lg:mb-20">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            aria-label="Logout"
            className="flex items-center justify-center w-full p-6 font-medium text-theme-md rounded-md bg-lolo-red text-white hover:bg-lolo-red/50 hover:text-xl transition-all duration-200"
          >
            Logout
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will log you out of your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="py-6">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-lolo-red py-6" onClick={logout}>
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
