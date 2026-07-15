import { useState, useMemo } from 'react'
import * as Lucide from 'lucide-react'

const iconNames = Object.keys(Lucide).filter(name => name !== 'default' && name !== 'icons' && name !== 'createLucideIcon')

const categories = {
  Business: ['Building', 'Building2', 'Briefcase', 'CreditCard', 'Landmark', 'Banknote', 'Receipt', 'Wallet', 'ShoppingBag', 'ShoppingCart', 'Store'],
  Storage: ['Warehouse', 'Package', 'Box', 'Archive', 'Container', 'HardDrive', 'Database', 'Server'],
  Delivery: ['Truck', 'Car', 'Plane', 'Ship', 'Bike', 'MapPin', 'Navigation', 'Route'],
  Security: ['Shield', 'Lock', 'Key', 'Eye', 'EyeOff', 'Fingerprint', 'UserCheck', 'ShieldCheck'],
  Users: ['User', 'Users', 'UserPlus', 'UserCheck', 'Contact', 'PersonStanding'],
  Finance: ['DollarSign', 'Coins', 'CreditCard', 'Banknote', 'Receipt', 'Percent', 'TrendingUp', 'TrendingDown'],
  Home: ['Home', 'Building', 'Warehouse', 'Building2', 'Factory'],
  Travel: ['Map', 'MapPin', 'Navigation', 'Compass', 'Globe'],
  Technology: ['Smartphone', 'Tablet', 'Monitor', 'Laptop', 'Cpu', 'Wifi', 'Bluetooth'],
  Communication: ['MessageCircle', 'MessageSquare', 'Mail', 'Phone', 'PhoneCall', 'Send', 'Share2'],
  Shopping: ['ShoppingCart', 'ShoppingBag', 'Store', 'Tag', 'Ticket'],
  Location: ['MapPin', 'Navigation', 'Compass', 'Pin'],
  Time: ['Clock', 'Calendar', 'CalendarDays', 'Timer'],
  Files: ['File', 'FileText', 'Image', 'Folder', 'Download', 'Upload'],
  Miscellaneous: ['Award', 'Star', 'Heart', 'ThumbsUp', 'ThumbsDown', 'Flag', 'Bookmark', 'Bell', 'Settings', 'Wrench'],
}

export default function IconPicker({ value, onChange }) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [recent, setRecent] = useState([])

  const filteredIcons = useMemo(() => {
    if (!search) return iconNames.slice(0, 200)
    return iconNames.filter(name => name.toLowerCase().includes(search.toLowerCase()))
  }, [search])

  const SelectedIcon = value ? Lucide[value] : null

  const selectIcon = (name) => {
    onChange(name)
    setRecent(prev => [name, ...prev.filter(n => n !== name)].slice(0, 10))
    setOpen(false)
    setSearch('')
  }

  const toggleFavorite = (name) => {
    setFavorites(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-[#FAFAF9] text-sm hover:border-[#1c1917]/40 transition-colors"
        >
          {SelectedIcon ? <SelectedIcon size={16} /> : <Lucide.HelpCircle size={16} />}
          <span>{value || 'Select icon'}</span>
        </button>
        {value && (
          <button type="button" onClick={() => onChange('')} className="text-xs text-red-500 hover:underline">Clear</button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[280px] bg-white border border-border rounded-xl shadow-xl animate-scale-in">
          <div className="p-2 border-b border-border">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-[#FAFAF9] focus:border-[#1c1917]"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto p-2">
            {recent.length > 0 && (
              <div className="mb-2">
                <p className="text-[10px] font-bold text-[#71717a] uppercase mb-1">Recent</p>
                <div className="flex flex-wrap gap-1">
                  {recent.map(name => {
                    const Icon = Lucide[name]
                    return Icon ? (
                      <button type="button" key={name} onClick={() => selectIcon(name)} className="p-1.5 rounded hover:bg-chalk" title={name}>
                        <Icon size={16} />
                      </button>
                    ) : null
                  })}
                </div>
              </div>
            )}

            {favorites.length > 0 && (
              <div className="mb-2">
                <p className="text-[10px] font-bold text-[#71717a] uppercase mb-1">Favorites</p>
                <div className="flex flex-wrap gap-1">
                  {favorites.map(name => {
                    const Icon = Lucide[name]
                    return Icon ? (
                      <button type="button" key={name} onClick={() => selectIcon(name)} className="p-1.5 rounded hover:bg-chalk" title={name}>
                        <Icon size={16} />
                      </button>
                    ) : null
                  })}
                </div>
              </div>
            )}

            {Object.entries(categories).map(([category, names]) => (
              <div key={category} className="mb-2">
                <p className="text-[10px] font-bold text-[#71717a] uppercase mb-1">{category}</p>
                <div className="flex flex-wrap gap-1">
                  {names.map(name => {
                    const Icon = Lucide[name]
                    return Icon ? (
                      <button type="button" key={name} onClick={() => selectIcon(name)} className={`p-1.5 rounded hover:bg-chalk ${name === value ? 'bg-[#1c1917] text-white' : ''}`} title={name}>
                        <Icon size={16} />
                      </button>
                    ) : null
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}