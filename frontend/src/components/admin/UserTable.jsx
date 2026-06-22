import { Ban, CheckCircle2, Trash2 } from 'lucide-react'

const ROLE_COLOR = {
  seller: 'bg-blue-100 text-blue-700',
  host: 'bg-emerald-100 text-emerald-700',
  courier: 'bg-orange-100 text-orange-700',
  admin: 'bg-violet-100 text-violet-700',
}

const STATUS_COLOR = {
  active: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  suspended: 'bg-red-100 text-red-600',
}

export default function UserTable({ users, onSuspend, onDelete }) {
  if (!users || users.length === 0) return (
    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
      <p className="text-slate-500 text-sm">No users found</p>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              {['User', 'Email', 'Role', 'Status', 'Joined', ''].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u, i) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 font-bold text-sm">
                      {u.full_name?.[0] || u.name?.[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-800">{u.full_name || u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{u.email}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${ROLE_COLOR[u.role] || 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[u.status] || STATUS_COLOR.active}`}>{u.status || 'active'}</span>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : u.joined}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {onSuspend && (
                      <button onClick={() => onSuspend(u.id)} className={`p-1.5 rounded-lg transition-colors ${u.status === 'suspended' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-amber-500 hover:bg-amber-50'}`}>
                        {u.status === 'suspended' ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(u.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}