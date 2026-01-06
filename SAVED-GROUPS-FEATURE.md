# Saved Groups Feature

## Overview

The Saved Groups feature allows authenticated users to save their recurring dining groups with members and preferences, making it easy to quickly start new sessions without re-entering information each time.

## Database Setup

### 1. Run the Migration

Execute the SQL migration in your Supabase SQL Editor:

```bash
# File: supabase-saved-groups-migration.sql
```

This creates two new tables:
- `saved_groups` - Stores group configurations
- `saved_group_members` - Stores members for each saved group

### 2. Verify Tables

After running the migration, verify the tables were created:

```sql
SELECT * FROM saved_groups;
SELECT * FROM saved_group_members;
```

## Features

### For Authenticated Users

1. **My Groups Page** (`/my-groups`)
   - View all saved groups
   - See group details (location, radius, price tier, members)
   - Quick start sessions from saved groups
   - Edit or delete saved groups

2. **Create Saved Group** (`/my-groups/create`)
   - Name your recurring group
   - Set default preferences (ZIP code, radius, price tier)
   - Add members with their names
   - Save for quick access

3. **Quick Start from Saved Group**
   - Click "Start Session" on any saved group
   - Preferences are pre-filled
   - Share the group code with saved members
   - Members join with their own devices

### Navigation

- Access "My Groups" from the Account page (👤 button)
- Guest users are prompted to sign up when accessing saved groups
- Authenticated users see "My Groups" in Quick Actions

## User Flow

### Creating a Saved Group

1. Sign up or log in to ChickenTinders
2. Go to Account → My Groups
3. Click "Create New Group"
4. Enter group details:
   - Group name (e.g., "Friday Night Crew")
   - ZIP code for restaurant search
   - Search radius (5, 10, 15, or 25 miles)
   - Price range ($, $$, $$$, $$$$)
   - Add member names
5. Click "Create Group"

### Starting a Session from Saved Group

1. Go to My Groups
2. Find your group
3. Click "Start Session"
4. Create page opens with pre-filled preferences
5. Enter your name and any adjustments
6. Create group and share code with members

## API Functions

Located in `lib/api/savedGroups.ts`:

- `getSavedGroups(userId)` - Get all groups for user
- `getSavedGroup(groupId)` - Get single group with members
- `createSavedGroup(userId, input)` - Create new saved group
- `updateSavedGroup(groupId, input)` - Update group settings
- `deleteSavedGroup(groupId)` - Delete a saved group
- `addSavedGroupMember(groupId, member)` - Add member to group
- `updateSavedGroupMember(memberId, updates)` - Update member info
- `removeSavedGroupMember(memberId)` - Remove member from group

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own saved groups
- Authentication required to create/edit saved groups
- Guest users are redirected to sign up

## Database Schema

### saved_groups

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| owner_id | UUID | References users(id) |
| name | TEXT | Group name |
| zip_code | TEXT | Default location |
| radius | INTEGER | Search radius in miles |
| price_tier | INTEGER | Price range (1-4) |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

### saved_group_members

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| saved_group_id | UUID | References saved_groups(id) |
| display_name | TEXT | Member name |
| email | TEXT | Optional email |
| dietary_tags | TEXT[] | Dietary preferences |
| created_at | TIMESTAMP | Creation time |

## Future Enhancements

- Email invitations to saved group members
- Push notifications when group sessions start
- Member RSVP tracking
- Dietary preference templates for members
- Group statistics and history
- Favorite restaurants per group
