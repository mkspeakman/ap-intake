# Guest User Implementation Guide

## How Guest Accounts Work

### 1. **Anonymous Quote Submission**
When someone submits a quote without logging in:
- System automatically creates a `guest` user account
- Uses their email and name from the form
- No password required
- Role set to `guest` (cannot login yet)

### 2. **Quote Association**
- All quotes are linked to the guest user via `submitted_by` or user_id
- Guest can see their quotes if they later claim their account
- Maintains history and continuity

### 3. **Account Claiming**
Guest users can later "claim" their account by:
- Visiting a "Create Account" or "Claim Account" flow
- Providing their email (must match)
- Setting a password
- Automatically upgraded to `estimator` role
- Can now login and see all their past quotes

## Implementation Examples

### In your quote submission form (App.tsx or similar):

```typescript
import { findOrCreateGuestUser } from '../api/helpers/guest-user';

// When submitting a quote
const submitQuote = async (formData) => {
  let userId = null;
  
  if (isAuthenticated) {
    // User is logged in, use their ID
    userId = currentUser.id;
  } else {
    // Anonymous submission - create/find guest user
    userId = await findOrCreateGuestUser(
      formData.email, 
      formData.contact_name
    );
  }

  // Submit quote with userId
  await fetch('/api/quote-requests', {
    method: 'POST',
    body: JSON.stringify({
      ...formData,
      user_id: userId,
    }),
  });
};
```

### Create an account claim endpoint:

```typescript
// api/auth/claim-account.ts
import { claimGuestAccount, canClaimAccount } from '../helpers/guest-user';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name } = req.body;

    // Check if account can be claimed
    const canClaim = await canClaimAccount(email);
    if (!canClaim) {
      return res.status(400).json({ 
        error: 'No guest account found or account already claimed' 
      });
    }

    // Claim the account
    const success = await claimGuestAccount(email, password, name);
    
    if (success) {
      return res.json({ 
        success: true, 
        message: 'Account claimed! You can now login.' 
      });
    }
  }
  
  res.status(400).json({ error: 'Failed to claim account' });
}
```

## Best Practices

### ✅ DO:
- Auto-create guest users on first quote submission
- Allow password-less submissions (low friction)
- Send email with "claim your account" link after first submission
- Upgrade to `estimator` role on claim (not `guest`)
- Link all past quotes when account is claimed

### ❌ DON'T:
- Require login to submit a quote (high friction)
- Allow admins to manually assign `guest` role
- Let guests login (they have no password)
- Show guest users in normal user management UI
- Delete guest accounts (orphans their quotes)

## UI Flow

### For Anonymous Users:
1. Fill out quote form
2. Submit (auto-creates guest account)
3. See success message: "Check your email for a link to track your quote"
4. Email contains "Create Account" link
5. Click link → set password → become estimator

### For Admins:
- Guest accounts appear in user list with special badge
- Cannot manually edit guest role (system-managed)
- Can upgrade guest to estimator if needed
- See all quotes submitted by guest users

## Database Note

Guest users in the database:
```sql
-- Guest user created by system
{
  email: 'customer@example.com',
  name: 'Jane Customer',
  role: 'guest',
  password_hash: '', -- empty = no login possible
  can_view_history: false
}

-- After claiming account
{
  email: 'customer@example.com',
  name: 'Jane Customer',
  role: 'estimator', -- upgraded
  password_hash: 'hashed_password',
  can_view_history: true
}
```

## Next Steps

1. ✅ Remove guest from assignable roles in UI (DONE)
2. ⬜ Update quote submission to auto-create guest users
3. ⬜ Add "claim account" flow and endpoint
4. ⬜ Send email with claim link after first submission
5. ⬜ Add badge to distinguish guest users in admin UI
