with open("frontend/src/services/authService.ts", "r") as f:
    content = f.read()

clinician_login_method = """
export async function clinicianLogin(
  credentials: { email: string; password?: string }
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const res = await apiRequest("/api/auth/clinician/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (res.status === 200 && res.data && res.data.status === "success") {
      const user: ParentUser = { ...res.data.user, role: "clinician" };
      setStoredSession(res.data.user.token, user);
      return { success: true, user };
    }
    
    return { success: false, error: res.error || res.data?.message || "Invalid credentials" };

  } catch (error: any) {
    console.error("Login failed:", error);
    return { success: false, error: "Network error. Please try again." };
  }
}
"""

if "export async function clinicianLogin" not in content:
    content = content.replace("export async function logout", clinician_login_method + "export async function logout")

with open("frontend/src/services/authService.ts", "w") as f:
    f.write(content)
