import React from "react";
import { User, Calendar, Plus, X } from "lucide-react";
import { FormField } from "./FormField";

export function ChildProfileFields({
  childName, setChildName,
  childDob, setChildDob,
  childGender, setChildGender,
  childPhotoFront, setChildPhotoFront,
  childPhotoRear, setChildPhotoRear,
  childPhotoLeft, setChildPhotoLeft,
  childPhotoRight, setChildPhotoRight
}: any) {
  return (
    <div className="space-y-3 flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Child's Name *" icon={<User className="w-4 h-4" />} type="text" value={childName} onChange={(e: any) => setChildName(e.target.value)} placeholder="Name" required />
        <FormField label="Date of Birth *" icon={<Calendar className="w-4 h-4" />} type="date" value={childDob} onChange={(e: any) => setChildDob(e.target.value)} required />
      </div>

      <FormField label="Gender (optional)" isSelect value={childGender} onChange={(e: any) => setChildGender(e.target.value)} options={[{ label: "Select Gender", value: "", disabled: true }, { label: "Boy", value: "Boy" }, { label: "Girl", value: "Girl" }, { label: "Other", value: "Other" }, { label: "Prefer not to say", value: "Prefer not to say" }]} />

      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 mt-2">Child Photos <span className="text-zinc-400 normal-case font-normal">(optional)</span></label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Front', state: childPhotoFront, set: setChildPhotoFront },
            { label: 'Rear', state: childPhotoRear, set: setChildPhotoRear },
            { label: 'Left', state: childPhotoLeft, set: setChildPhotoLeft },
            { label: 'Right', state: childPhotoRight, set: setChildPhotoRight }
          ].map((photo, i) => (
            <div key={i} className="relative flex flex-col items-center">
              <div className="w-full aspect-square bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden relative group transition-all hover:border-brand/30 hover:bg-brand-light/30 shadow-sm">
                {photo.state ? (
                  <>
                    <img src={URL.createObjectURL(photo.state)} alt={photo.label} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => photo.set(null)} className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-20 shadow-sm"><X className="w-3 h-3" /></button>
                  </>
                ) : (
                  <>
                    <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={(e) => { if (e.target.files && e.target.files.length > 0) photo.set(e.target.files[0]); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 group-hover:text-brand transition-colors bg-brand-light/20">
                      <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-brand mb-0.5 border border-black/5"><Plus className="w-3 h-3" /></div>
                    </div>
                  </>
                )}
              </div>
              <span className="text-[9px] font-bold text-zinc-600 mt-1.5 uppercase tracking-wide">{photo.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
