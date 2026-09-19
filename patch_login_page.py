with open("frontend/src/app/login/page.tsx", "r") as f:
    content = f.read()

content = content.replace("const { loginParent } = useAuth();", "const { loginParent, loginClinician } = useAuth();\n  const [loginRole, setLoginRole] = useState<'parent' | 'clinician'>('parent');")

submit_logic = """
    setIsLoading(true);
    try {
      if (loginRole === 'parent') {
        const res = await loginParent({ email, password, childName });
        if (res.success) {
          router.push("/dashboard");
        } else {
          setErrorMessage(res.error || "Login failed. Please try again.");
        }
      } else {
        const res = await loginClinician({ email, password });
        if (res.success) {
          router.push("/professional");
        } else {
          setErrorMessage(res.error || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
"""
import re
content = re.sub(r'setIsLoading\(true\);.*?setIsLoading\(false\);\s*\}', submit_logic, content, flags=re.DOTALL)

ui_tabs = """
              {errorMessage && <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage(null)} className="mb-5" />}
              
              <div className="flex p-1 bg-zinc-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setLoginRole('parent')}
                  className={`flex-1 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all ${loginRole === 'parent' ? 'bg-white text-brand shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                  Parent
                </button>
                <button
                  type="button"
                  onClick={() => setLoginRole('clinician')}
                  className={`flex-1 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all ${loginRole === 'clinician' ? 'bg-white text-brand shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                  Clinician
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
"""
content = content.replace('{errorMessage && <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage(null)} className="mb-5" />}\n              <form onSubmit={handleSubmit} className="space-y-4">', ui_tabs)

content = content.replace(
    '<div>\n                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Child Name (Optional)</label>',
    '{loginRole === "parent" && (<div>\n                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Child Name (Optional)</label>'
)
content = content.replace(
    'className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none" />\n                  </div>\n                </div>',
    'className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none" />\n                  </div>\n                </div>)}'
)

with open("frontend/src/app/login/page.tsx", "w") as f:
    f.write(content)
