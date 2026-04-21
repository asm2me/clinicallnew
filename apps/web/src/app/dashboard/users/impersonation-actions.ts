"use server";

import { redirect } from "next/navigation";

import { startImpersonation, stopImpersonation } from "@/lib/impersonation";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export async function startUserImpersonationAction(formData: FormData): Promise<void> {
  const userId = formData.get("userId");

  if (typeof userId !== "string" || !userId.trim()) {
    redirect("/dashboard/users?error=User%20ID%20is%20required.");
  }

  try {
    await startImpersonation(userId);
  } catch (error) {
    redirect(`/dashboard/users?error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  redirect("/dashboard?message=You%20are%20now%20impersonating%20the%20selected%20user.");
}

export async function stopUserImpersonationAction(): Promise<void> {
  try {
    await stopImpersonation();
  } catch (error) {
    redirect(`/dashboard/users?error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  redirect("/dashboard/users?message=Returned%20to%20your%20SUPER_ADMIN%20account.");
}