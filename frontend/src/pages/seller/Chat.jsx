import { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare, ArrowLeft, Search, Users, Archive } from 'lucide-react'
import { getContacts, getConversation } from '../../services/chatService'
import { getGroups, getGroupMessages, sendGroupMessage } from '../../services/groupChatService'
import { useAuth } from '../../hooks/useAuth'
import { useSocket } from '../../hooks/useSocket'
import Loader from '../../components/common/Loader'

export default function Chat() {
  const { user } = useAuth()
  const { sendMessage, emitTyping, markAsRead, onNewMessage, onMessageSent, onTyping, isUserOnline } = useSocket()
  
  const [contacts, setContacts] = useState([])
  const [groups, setGroups] = useState([])
  const [active, setActive] = useState(null)
  const [activeType, setActiveType] = useState(null)
  const [messages, setMessages] = useState([])
  const [groupMembers, setGroupMembers] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [typingUser, setTypingUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [chatTab, setChatTab] = useState('direct')
  const bottomRef = useRef(null)
  const typingTimeout = useRef(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const messagesContainerRef = useRef(null)

  useEffect(() => {
    Promise.all([getContacts(), getGroups()])
      .then(([contactRes, groupRes]) => {
        const c = contactRes.data.data.contacts || []
        const g = groupRes.data.data.groups || []
        setContacts(sortContacts(c))
        setGroups(g)
        if (c.length > 0 && window.innerWidth >= 640) {
          setActive({ ...c[0], type: 'direct' })
          setActiveType('direct')
          setShowSidebar(false)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!active) return
    
    if (activeType === 'direct') {
      getConversation(active.contact_id)
        .then(res => setMessages(res.data.data.messages || []))
        .catch(() => {})
      markAsRead(active.contact_id, user.id)
      setContacts(prev => prev.map(c => 
        c.contact_id === active.contact_id ? { ...c, unread_count: 0 } : c
      ))
    } else if (activeType === 'group') {
      getGroupMessages(active.id)
        .then(res => {
          setMessages(res.data.data.messages || [])
          setGroupMembers(res.data.data.members || [])
        })
        .catch(() => {})
    }
  }, [active, activeType])

  useEffect(() => {
    const cleanup = onNewMessage((message) => {
      if (active && activeType === 'direct' && String(message.sender_id) === String(active.contact_id)) {
        setMessages(prev => [...prev, message])
        markAsRead(message.sender_id, user.id)
        setShouldAutoScroll(true)
      }
      refreshAll()
    })
    return cleanup
  }, [active, activeType, onNewMessage])

  useEffect(() => {
    const cleanup = onMessageSent((message) => {
      if (active && activeType === 'direct' && String(message.receiver_id) === String(active.contact_id)) {
        setMessages(prev => [...prev, message])
        setShouldAutoScroll(true)
      }
      refreshAll()
    })
    return cleanup
  }, [active, activeType, onMessageSent])

  useEffect(() => {
    const cleanup = onTyping((data) => {
      if (active && activeType === 'direct' && String(data.userId) === String(active.contact_id)) {
        setTypingUser(data.userId)
        clearTimeout(typingTimeout.current)
        typingTimeout.current = setTimeout(() => setTypingUser(null), 2500)
      }
    })
    return cleanup
  }, [active, activeType, onTyping])

  useEffect(() => {
    if (shouldAutoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, typingUser, shouldAutoScroll])

  const handleScroll = () => {
    if (!messagesContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShouldAutoScroll(isNearBottom)
  }

  const sortContacts = (list) => {
    return [...list].sort((a, b) => {
      const timeA = a.last_time ? new Date(a.last_time).getTime() : 0
      const timeB = b.last_time ? new Date(b.last_time).getTime() : 0
      return timeB - timeA
    })
  }

  const refreshAll = async () => {
    try {
      const [contactRes, groupRes] = await Promise.all([getContacts(), getGroups()])
      setContacts(sortContacts(contactRes.data.data.contacts || []))
      setGroups(groupRes.data.data.groups || [])
    } catch {}
  }

  const handleSelectContact = (contact) => {
    setActive({ ...contact, type: 'direct' })
    setActiveType('direct')
    setShowSidebar(false)
  }

  const handleSelectGroup = (group) => {
    setActive({ ...group, type: 'group' })
    setActiveType('group')
    setShowSidebar(false)
  }

  const handleSend = async () => {
    if (!input.trim() || !active) return
    if (activeType === 'group' && !active.is_active) return
    
    if (activeType === 'direct') {
      sendMessage(user.id, active.contact_id, input.trim())
    } else if (activeType === 'group') {
      try {
        await sendGroupMessage({ group_id: active.id, message: input.trim() })
        setMessages(prev => [...prev, {
          id: Date.now(),
          group_id: active.id,
          sender_id: user.id,
          sender_name: user.full_name,
          sender_role: user.role,
          message: input.trim(),
          created_at: new Date().toISOString()
        }])
        setShouldAutoScroll(true)
        refreshAll()
      } catch {}
    }
    
    setInput('')
    setShouldAutoScroll(true)
  }

  const handleTyping = () => {
    if (active && activeType === 'direct') emitTyping(user.id, active.contact_id)
  }

  const allItems = [
    ...(chatTab === 'direct' ? contacts.map(c => ({ ...c, itemType: 'direct' })) : []),
    ...(chatTab === 'group' ? groups.map(g => ({ ...g, itemType: 'group', contact_name: g.name, last_message: g.last_message, last_time: g.last_time, is_active: g.is_active })) : [])
  ]

  const filteredItems = allItems.filter(item =>
    (item.contact_name || item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const formatMessageTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return <Loader />

  const isGroupActive = activeType === 'group'
  const isArchived = isGroupActive && active?.is_active === 0
  const activeName = isGroupActive ? active?.name : active?.contact_name
  const activeId = isGroupActive ? active?.id : active?.contact_id

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden flex h-[calc(100vh-120px)] sm:h-[calc(100vh-100px)] animate-fade-in">
      <div className={`${showSidebar ? 'flex' : 'hidden'} sm:flex w-full sm:w-72 lg:w-80 shrink-0 border-r border-border flex-col`}>
        <div className="px-4 py-3 border-b border-border">
          <p className="font-display font-bold text-[#1c1917] text-base mb-3">Chats</p>
          <div className="flex gap-1 bg-chalk-dark rounded-lg p-1 mb-3">
            <button
              onClick={() => setChatTab('direct')}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                chatTab === 'direct' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#71717a] hover:text-[#1c1917]'
              }`}
            >
              Direct
            </button>
            <button
              onClick={() => setChatTab('group')}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                chatTab === 'group' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#71717a] hover:text-[#1c1917]'
              }`}
            >
              Groups
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-xl bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white focus:ring-1 focus:ring-[#1c1917]/10 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="p-10 text-center">
              <MessageSquare size={36} className="text-border mx-auto mb-3" />
              <p className="text-sm text-[#71717a] font-medium">
                {chatTab === 'group' ? 'No group chats yet' : 'No chats yet'}
              </p>
              <p className="text-xs text-[#71717a] mt-1">
                {chatTab === 'group' ? 'Groups appear when a courier accepts your delivery' : 'Book a storage to start chatting'}
              </p>
            </div>
          ) : filteredItems.map(item => (
            <button
              key={item.itemType === 'group' ? `g-${item.id}` : `d-${item.contact_id}`}
              onClick={() => item.itemType === 'group' ? handleSelectGroup(item) : handleSelectContact(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-chalk ${
                (item.itemType === 'group' && isGroupActive && activeId === item.id) ||
                (item.itemType === 'direct' && !isGroupActive && activeId === item.contact_id)
                  ? 'bg-chalk-dark' : item.is_active === 0 ? 'opacity-60' : ''
              }`}
            >
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base ${
                  item.itemType === 'group' ? (item.is_active === 0 ? 'bg-gray-400' : 'bg-purple-500') : 'bg-[#52525b]'
                }`}>
                  {item.itemType === 'group' ? <Users size={18} /> : item.contact_name?.charAt(0)?.toUpperCase()}
                </div>
                {item.itemType === 'direct' && isUserOnline(item.contact_id) && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                )}
                {item.is_active === 0 && (
                  <div className="absolute top-0 right-0 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                    <Archive size={8} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm truncate font-semibold text-[#1c1917]">
                    {item.contact_name || item.name}
                  </p>
                  <span className="text-[11px] text-[#71717a] shrink-0">{formatTime(item.last_time)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-[13px] truncate text-[#71717a]">
                    {item.last_message || (item.itemType === 'group' ? 'Group created' : 'Tap to start chatting')}
                  </p>
                  {item.itemType === 'group' && item.is_active === 0 && (
                    <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full shrink-0">
                      Archived
                    </span>
                  )}
                  {item.itemType === 'group' && item.is_active === 1 && (
                    <span className="text-[10px] font-medium text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded-full shrink-0">
                      Group
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`${showSidebar ? 'hidden' : 'flex'} sm:flex flex-1 flex-col min-w-0`}>
        {active ? (
          <>
            <div className="px-4 py-3 border-b border-border bg-white flex items-center gap-3 shrink-0">
              <button onClick={() => setShowSidebar(true)} className="sm:hidden p-1 -ml-1 text-[#71717a] hover:text-[#1c1917] transition-colors">
                <ArrowLeft size={20} />
              </button>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                isGroupActive ? (isArchived ? 'bg-gray-400' : 'bg-purple-500') : 'bg-[#52525b]'
              }`}>
                {isGroupActive ? <Users size={16} /> : activeName?.charAt(0)?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#1c1917] text-sm truncate">{activeName}</p>
                {isGroupActive ? (
                  <p className="text-xs text-[#71717a]">
                    {groupMembers.map(m => m.full_name).join(', ')}
                    {isArchived && ' · Archived'}
                  </p>
                ) : (
                  <p className={`text-xs ${typingUser ? 'text-brick font-medium' : isUserOnline(active.contact_id) ? 'text-emerald-600' : 'text-[#71717a]'}`}>
                    {typingUser ? 'typing...' : isUserOnline(active.contact_id) ? 'Online' : 'Offline'}
                  </p>
                )}
              </div>
            </div>

            {isArchived && (
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-center">
                <p className="text-xs text-amber-700 font-medium">
                  <Archive size={12} className="inline mr-1" />
                  This chat is archived. Delivery has been completed.
                </p>
              </div>
            )}

            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-3"
              style={{ backgroundColor: '#f8fafc' }}
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <MessageSquare size={28} className="text-border" />
                    </div>
                    <p className="text-sm text-[#71717a]">No messages yet</p>
                  </div>
                </div>
              ) : (
                messages.map((m, i) => {
                  const isMine = String(m.sender_id) === String(user.id)
                  const showSender = isGroupActive && !isMine
                  
                  return (
                    <div key={m.id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'} mt-2`}>
                      <div className={`max-w-[75%] sm:max-w-[65%]`}>
                        {showSender && (
                          <p className="text-xs font-semibold text-purple-500 mb-0.5 ml-1">{m.sender_name || 'Unknown'}</p>
                        )}
                        <div className={`px-3.5 py-2 rounded-lg text-[14px] leading-relaxed ${
                          isMine 
                            ? 'bg-[#d9fdd3] text-[#1c1917] rounded-tr-none' 
                            : 'bg-white text-[#1c1917] rounded-tl-none shadow-sm'
                        }`}>
                          <p className="break-words whitespace-pre-wrap">{m.message}</p>
                          <div className={`flex items-center gap-1.5 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[11px] text-[#8696a0]">{formatMessageTime(m.created_at)}</span>
                            {isMine && !isGroupActive && (
                              <span className="text-[10px] text-[#8696a0] font-medium tracking-wide">Seen</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 py-3 border-t border-border bg-white flex items-end gap-2 shrink-0">
              <input
                type="text"
                placeholder={isArchived ? "Chat is archived" : isGroupActive ? "Message group..." : "Message"}
                value={input}
                disabled={isArchived}
                onChange={e => { setInput(e.target.value); if (!isGroupActive) handleTyping() }}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                className={`flex-1 px-4 py-2.5 text-sm border border-border rounded-xl bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white focus:ring-1 focus:ring-[#1c1917]/10 transition-all ${
                  isArchived ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isArchived}
                className="w-11 h-11 bg-[#1c1917] hover:bg-brick disabled:opacity-40 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-all shrink-0"
              >
                <Send size={17} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
            <div className="text-center px-4">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MessageSquare size={32} className="text-border" />
              </div>
              <h3 className="font-semibold text-[#1c1917] text-lg mb-1">SamanBhandar Chat</h3>
              <p className="text-sm text-[#71717a] max-w-xs">
                Select a chat from the left or book a storage space to start messaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}