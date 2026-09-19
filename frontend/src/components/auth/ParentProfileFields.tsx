import React from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { FormField } from "./FormField";

export function ParentProfileFields({
  fullName, setFullName,
  email, setEmail,
  phone, setPhone,
  relationship, setRelationship,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  showPassword, setShowPassword,
  showConfirmPassword, setShowConfirmPassword
}: any) {
  return (
    <div className="space-y-3 flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Full Name *" icon={<User className="w-4 h-4" />} type="text" value={fullName} onChange={(e: any) => setFullName(e.target.value)} placeholder="Full name" required />
        <FormField label="Email Address *" icon={<Mail className="w-4 h-4" />} type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="parent@example.com" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Phone (opt)" icon={<Phone className="w-4 h-4" />} type="tel" value={phone} onChange={(e: any) => { const val = e.target.value; if (/^[\d+\-()\s]*$/.test(val)) setPhone(val); }} placeholder="+1 555 000-0000" />
        <FormField label="Relationship *" isSelect value={relationship} onChange={(e: any) => setRelationship(e.target.value)} required options={[{ label: "Select", value: "", disabled: true }, { label: "Mother", value: "Mother" }, { label: "Father", value: "Father" }, { label: "Guardian", value: "Guardian" }, { label: "Other", value: "Other" }]} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Password *" icon={<Lock className="w-4 h-4" />} type={showPassword ? "text" : "password"} value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="••••••••" required rightElement={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-zinc-400 hover:text-zinc-600 p-1">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
        <FormField label="Confirm *" icon={<Lock className="w-4 h-4" />} type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} placeholder="••••••••" required rightElement={<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-zinc-400 hover:text-zinc-600 p-1">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
      </div>
    </div>
  );
}
