# Supabase Realtime Setup

## 📡 Enable Realtime for Tables

For optimal real-time performance, enable Supabase Realtime on these tables:
- `group_members` - Real-time lobby updates
- `swipes` - Real-time swipe progress (optional, polling fallback exists)

### Quick Setup (30 seconds):

1. **Go to your Supabase dashboard**: https://supabase.com/dashboard/project/gcvpxiyesidhkklalqia

2. **Navigate to Database → Replication**:
   - Click "Database" in the left sidebar
   - Click "Replication" tab

3. **Enable Realtime for both tables**:
   - Find the `group_members` table in the list
   - Toggle the switch to **ON** (should turn green)
   - Find the `swipes` table in the list
   - Toggle the switch to **ON** (should turn green)

4. **Done!** Real-time updates will now work instantly.

---

## ✅ Verify It's Working

### Test Lobby (group_members):
1. Open your lobby in 2 different browser tabs (or incognito)
2. Copy the lobby URL from tab 1
3. Open it in tab 2
4. Enter a different name in tab 2
5. Watch tab 1 - the new member should appear instantly! 🎉

### Test Swipe Progress (swipes):
1. Create a group with 2 members
2. User 1 finishes swiping first → sees "Waiting for Everyone..."
3. User 2 swipes on their device
4. User 1's browser console should show:
   - `Subscription status: SUBSCRIBED`
   - `Swipe change detected!` (when User 2 swipes)
5. User 1 should see results appear automatically when User 2 finishes

**Note**: Even without Realtime enabled for `swipes`, the app uses 2-second polling as a fallback. Enabling Realtime just makes updates instant (< 100ms instead of ~2 seconds).

---

## 🔧 Alternative: Enable via SQL

If you prefer SQL, run this in the SQL Editor:

```sql
-- Enable Realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE group_members;
ALTER PUBLICATION supabase_realtime ADD TABLE swipes;
```

---

## 🐛 Troubleshooting

**Members not appearing in real-time?**
- Check that Realtime is enabled in Database → Replication
- Check browser console for errors (F12)
- Make sure your dev server is running

**"Realtime not available" error?**
- Restart your dev server
- Check that Supabase credentials are correct in `.env.local`

---

**That's it!** Real-time updates should now work perfectly. 🍗
