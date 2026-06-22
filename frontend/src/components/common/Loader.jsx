export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-7 h-7 border-2 border-[#1c1917] border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-medium text-[#71717a]">{text}</p>
    </div>
  )
}