import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!api|fonts|icon.ico|pricing|signup|login|auth|contexts|_next/static|_next/image|.*\\.png$).*)",
  ],
};
