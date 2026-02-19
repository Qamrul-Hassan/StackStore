import { Input } from "@/components/ui/input";

export default function AccountPage() {
  return (
    <div className="space-y-10 pb-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-300">
          Home / <span className="font-semibold text-white">My Account</span>
        </p>
        <p className="text-sm text-zinc-200">
          Welcome! <span className="font-semibold text-[#FB8500]">Qamrul Hassan</span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="glass-panel section-shell section-single-cart cart-left space-y-6 rounded-2xl p-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[#210E14]">Manage My Account</h3>
            <p className="pl-4 font-medium text-[#F92D0A]">My Profile</p>
            <p className="pl-4 text-zinc-600">Address Book</p>
            <p className="pl-4 text-zinc-600">My Payment Options</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[#210E14]">My Orders</h3>
            <p className="pl-4 text-zinc-600">My Returns</p>
            <p className="pl-4 text-zinc-600">My Cancellations</p>
          </div>
          <h3 className="text-xl font-semibold text-[#210E14]">My WishList</h3>
        </aside>

        <div className="glass-panel section-shell section-single-cart cart-right rounded-2xl p-8">
          <h2 className="text-4xl font-semibold text-[#F92D0A]">Edit Your Profile</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="First Name" value="Qamrul" />
            <Field label="Last Name" value="Hassan" />
            <Field label="Email" value="mdqamrul74@gmail.com" />
            <Field label="Address" value="Kingston, 5236, United State" />
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-2xl font-semibold text-[#210E14]">Password Changes</h3>
            <Input className="h-12 bg-[#f5f5f5]" placeholder="Current Password" />
            <Input className="h-12 bg-[#f5f5f5]" placeholder="New Password" />
            <Input className="h-12 bg-[#f5f5f5]" placeholder="Confirm New Password" />
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button className="rounded-lg border border-[#d4dbe5] bg-white/80 px-8 py-3 text-[#210E14] transition hover:border-[#FB8500] hover:text-[#F92D0A]">
              Cancel
            </button>
            <button className="rounded-lg bg-gradient-to-r from-[#210E14] via-[#712825] to-[#F92D0A] px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_-18px_rgba(249,45,10,0.92)]">
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
      <label className="text-sm font-medium text-[#4b5563]">{label}</label>
      <Input className="h-12 border-[#dce3ea] bg-white/90" defaultValue={value} />
    </div>
  );
}
