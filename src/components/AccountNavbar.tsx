import * as React from "react";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { VscAccount } from "react-icons/vsc";
import Link from "next/link"; //import link component

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog components

interface User {
  fullname?: string | undefined;
  email?: string | undefined;
}

export function Account({ fullname, email }: User) {
  const [isHover, setIsHover] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false); // State to control the dialog

  const handleLogout = () => {
    setIsDialogOpen(true); // Open the confirmation dialog
  };

  const confirmLogout = () => {
    setIsDialogOpen(false); // Close the dialog
    signOut({ callbackUrl: "/" }); // Redirect to the homepage after logout
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="max-lg:pt-0">
            <VscAccount size={30} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* Non-clickable Username */}
            <DropdownMenuLabel className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{fullname}</span>
            </DropdownMenuLabel>
            {/* Non-clickable Email */}
            <DropdownMenuLabel className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              <span className="truncate w-full">{email}</span>
            </DropdownMenuLabel>
            {/* Clickable Settings Page */}
            <Link href="/settings">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
            </Link>
            {/* Billing - Uncomment to display */}
            {/* <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          {/* Logout Button */}
          <DropdownMenuItem
            onClick={handleLogout} // Open the dialog on click
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{
              backgroundColor: isHover ? "#DC143C" : "transparent",
              color: isHover ? "white" : "inherit",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
            <DialogDescription>
              You will be signed out of your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLogout}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}