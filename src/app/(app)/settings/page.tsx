"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    User,
    Mail,
    Building,
    Globe,
    Phone,
    Lock,
} from "lucide-react"; // Import icons
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Import card components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; // Import Dialog components

// Schema for password validation
const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    });

export default function SettingsPage() {
    const { data: session } = useSession();
    const [userData, setUserData] = useState({
        fullname: "",
        email: "",
        affilation: "",
        country: "",
        contactNumber: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // State for confirmation dialogs
    const [isProfileUpdateDialogOpen, setIsProfileUpdateDialogOpen] = useState(false);
    const [isPasswordChangeDialogOpen, setIsPasswordChangeDialogOpen] = useState(false);

    // Form for changing password
    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    // Fetch user data on page load
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/get-user");
                const data = await response.json();
                if (response.ok) {
                    setUserData(data);
                } else {
                    toast({ title: "Error", description: data.error, variant: "destructive" });
                }
            } catch (error) {
                toast({ title: "Error", description: "Failed to fetch user data", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [toast]);

    // Handle profile update submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProfileUpdateDialogOpen(true); // Open confirmation dialog
    };

    const confirmProfileUpdate = async () => {
        setIsProfileUpdateDialogOpen(false); // Close confirmation dialog
        try {
            const response = await fetch("/api/update-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (response.ok) {
                toast({ title: "Success", description: data.message });
            } else {
                toast({ title: "Error", description: data.error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update user data", variant: "destructive" });
        }
    };

    // Handle password change submission
    const handleChangePassword = async (values: z.infer<typeof passwordSchema>) => {
        setIsPasswordChangeDialogOpen(true); // Open confirmation dialog
    };

    const confirmPasswordChange = async () => {
        setIsPasswordChangeDialogOpen(false); // Close confirmation dialog
        try {
            const response = await fetch("/api/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(passwordForm.getValues()),
            });
            const data = await response.json();
            if (response.ok) {
                toast({ title: "Success", description: data.message });
                passwordForm.reset();
            } else {
                toast({ title: "Error", description: data.error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to change password", variant: "destructive" });
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

            {/* Profile Update Card */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4" />
                                    Full Name
                                </Label>
                                <Input
                                    value={userData.fullname}
                                    onChange={(e) => setUserData({ ...userData, fullname: e.target.value })}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </Label>
                                <Input
                                    value={userData.email}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <Building className="w-4 h-4" />
                                    Affiliation
                                </Label>
                                <Input
                                    value={userData.affilation}
                                    onChange={(e) => setUserData({ ...userData, affilation: e.target.value })}
                                    placeholder="Enter your affiliation"
                                />
                            </div>
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <Globe className="w-4 h-4" />
                                    Country
                                </Label>
                                <Input
                                    value={userData.country}
                                    onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                                    placeholder="Enter your country"
                                />
                            </div>
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <Phone className="w-4 h-4" />
                                    Contact Number
                                </Label>
                                <Input
                                    value={userData.contactNumber}
                                    onChange={(e) => setUserData({ ...userData, contactNumber: e.target.value })}
                                    placeholder="Enter your contact number"
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full md:w-auto">
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Change Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    Current Password
                                </Label>
                                <Input
                                    type="password"
                                    {...passwordForm.register("currentPassword")}
                                    placeholder="Enter your current password"
                                />
                                {passwordForm.formState.errors.currentPassword && (
                                    <p className="text-sm text-red-500">
                                        {passwordForm.formState.errors.currentPassword.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    New Password
                                </Label>
                                <Input
                                    type="password"
                                    {...passwordForm.register("newPassword")}
                                    placeholder="Enter your new password"
                                />
                                {passwordForm.formState.errors.newPassword && (
                                    <p className="text-sm text-red-500">
                                        {passwordForm.formState.errors.newPassword.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    Confirm New Password
                                </Label>
                                <Input
                                    type="password"
                                    {...passwordForm.register("confirmPassword")}
                                    placeholder="Confirm your new password"
                                />
                                {passwordForm.formState.errors.confirmPassword && (
                                    <p className="text-sm text-red-500">
                                        {passwordForm.formState.errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button type="submit" className="w-full md:w-auto">
                            Change Password
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Confirmation Dialog for Profile Update */}
            <Dialog open={isProfileUpdateDialogOpen} onOpenChange={setIsProfileUpdateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to update your profile?</DialogTitle>
                        <DialogDescription>
                            This will update your personal information.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsProfileUpdateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmProfileUpdate}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog for Password Change */}
            <Dialog open={isPasswordChangeDialogOpen} onOpenChange={setIsPasswordChangeDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to change your password?</DialogTitle>
                        <DialogDescription>
                            This will update your password. Make sure you remember the new password.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPasswordChangeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmPasswordChange}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}