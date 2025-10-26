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
  // const { logout } = useAuth();

  return (
    <div className="fixed left-0 right-0 bottom-0 mx-auto w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03] z-50 mb-32 lg:mb-20">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            aria-label="Logout"
            className="w-full h-12 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold text-base bg-lolo-red text-white shadow-md hover:bg-lolo-red/80 focus:outline-none focus:ring-2 focus:ring-lolo-red/60 focus:ring-offset-2 transition-all duration-200"
          >
            <span className="material-icons-outlined text-lg">Logout</span>
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
            <AlertDialogCancel className=" h-12 flex items-center justify-center gap-2 rounded-lg font-semibold text-base text-gray-700 bg-white/60 hover:bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-lolo-white/40 focus:ring-offset-2 transition-colors duration-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-12 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold text-base bg-lolo-red text-white shadow-md hover:bg-lolo-red/80 focus:outline-none focus:ring-2 focus:ring-lolo-red/60 focus:ring-offset-2 transition-all duration-200"
              // onClick={logout}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
