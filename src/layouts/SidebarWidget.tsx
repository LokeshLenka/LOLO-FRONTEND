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
import { Button } from "@/components/ui/button/button";
import { useAuth } from "../context/AuthContext";

export default function SidebarWidget() {
  const { logout } = useAuth();

  return (
    <div className="fixed left-0 right-0 bottom-0 mx-auto w-full max-w-60 rounded-2xl bg-black/1 p-1 text-center dark:bg-white/1 z-50 mb-32 lg:mb-20">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            aria-label="Logout"
            className="w-full h-12 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold text-base bg-lolo-red text-white shadow-md hover:bg-lolo-red/80  transition-all duration-200"
          >
            <span className="material-icons-outlined text-lg">Logout</span>
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="bg-white dark:bg-white/1 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will log you out of your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 flex items-center justify-center gap-2 rounded-lg font-semibold text-base text-black dark:text-white  bg-white dark:bg-white/5 hover:dark:bg-gray-900 shadow-sm  transition-colors duration-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-12 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold text-base bg-lolo-red text-white shadow-md hover:bg-lolo-red/80  transition-all duration-200"
              onClick={logout}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
