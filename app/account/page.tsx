import { Input } from "@/components/ui/input";

export default function AccountPage() {
  return (
    <div className="space-y-10 pb-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Home / <span className="text-[#210E14]">My Account</span>
        </p>
        <p className="text-sm text-zinc-600">
          Welcome! <span className="text-[#F92D0A]">Md Rimel</span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[#210E14]">Manage My Account</h3>
            <p className="pl-4 text-[#F92D0A]">My Profile</p>
            <p className="pl-4 text-zinc-500">Address Book</p>
            <p className="pl-4 text-zinc-500">My Payment Options</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[#210E14]">My Orders</h3>
            <p className="pl-4 text-zinc-500">My Returns</p>
            <p className="pl-4 text-zinc-500">My Cancellations</p>
          </div>
          <h3 className="text-xl font-semibold text-[#210E14]">My WishList</h3>
        </aside>

        <div className="rounded border border-[#e5e7eb] bg-white p-8">
          <h2 className="text-4xl font-semibold text-[#F92D0A]">Edit Your Profile</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="First Name" value="Md" />
            <Field label="Last Name" value="Rimel" />
            <Field label="Email" value="rimell111@gmail.com" />
            <Field label="Address" value="Kingston, 5236, United State" />
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-2xl font-semibold text-[#210E14]">Password Changes</h3>
            <Input className="h-12 bg-[#f5f5f5]" placeholder="Current Password" />
            <Input className="h-12 bg-[#f5f5f5]" placeholder="New Password" />
            <Input className="h-12 bg-[#f5f5f5]" placeholder="Confirm New Password" />
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button className="px-8 py-3 text-[#210E14]">Cancel</button>
            <button className="rounded bg-[#F92D0A] px-8 py-3 text-sm font-semibold text-white">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-[#210E14]">{label}</label>
      <Input className="h-12 bg-[#f5f5f5]" defaultValue={value} />
    </div>
  );
}
