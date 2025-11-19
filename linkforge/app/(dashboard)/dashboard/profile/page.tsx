import ProfileEditor from "@/components/dashboard/ProfileEditor";

export default function ProfilePage() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-6">
        <ProfileEditor />
      </div>
      <div className="card p-6">
        <h3 className="font-semibold mb-2">Live Preview</h3>
        <div className="rounded-xl border border-white/10 p-6 text-center text-neutral-300">
          Your profile preview will update as you edit.
        </div>
      </div>
    </div>
  );
}

