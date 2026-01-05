# Supabase Realtime Setup

## 📡 Enable Realtime for group_members Table

For the real-time lobby to work, you need to enable Supabase Realtime on the `group_members` table.

### Quick Setup (30 seconds):

1. **Go to your Supabase dashboard**: https://supabase.com/dashboard/project/gcvpxiyesidhkklalqia

2. **Navigate to Database → Replication**:
   - Click "Database" in the left sidebar
   - Click "Replication" tab

3. **Enable Realtime for group_members**:
   - Find the `group_members` table in the list
   - Toggle the switch to **ON** (should turn green)

4. **Done!** Real-time updates will now work instantly.

---

## ✅ Verify It's Working

After enabling:

1. Open your lobby in 2 different browser tabs (or incognito)
2. Copy the lobby URL from tab 1
3. Open it in tab 2
4. Enter a different name in tab 2
5. Watch tab 1 - the new member should appear instantly! 🎉

---

## 🔧 Alternative: Enable via SQL

If you prefer SQL, run this in the SQL Editor:

```sql
-- Enable Realtime for group_members table
ALTER PUBLICATION supabase_realtime ADD TABLE group_members;
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
