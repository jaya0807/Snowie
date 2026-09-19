import re

with open("frontend/src/context/AuthContext.tsx", "r") as f:
    content = f.read()

content = content.replace("parentLogin as serviceParentLogin,", "parentLogin as serviceParentLogin,\n  clinicianLogin as serviceClinicianLogin,")
content = content.replace('role: "parent" | null;', 'role: "parent" | "clinician" | null;')
content = content.replace("loginParent: (creds: ParentLoginCredentials) => Promise<{ success: boolean; error?: string }>;", "loginParent: (creds: ParentLoginCredentials) => Promise<{ success: boolean; error?: string }>;\n  loginClinician: (creds: { email: string; password?: string }) => Promise<{ success: boolean; error?: string }>;")

clinician_login_fn = """
  const loginClinician = async (creds: { email: string; password?: string }) => {
    const res = await serviceClinicianLogin(creds);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };
"""
content = re.sub(r'(const logout = async)', clinician_login_fn + r'\n  \1', content)

content = content.replace("loginParent,", "loginParent,\n        loginClinician,")

with open("frontend/src/context/AuthContext.tsx", "w") as f:
    f.write(content)
