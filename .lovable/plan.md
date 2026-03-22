
# Unknown Express — Anonymous Blogging Platform

## Brand & Design
- **Dark luxury theme**: Deep charcoal/black backgrounds, subtle purple & gold accent colors, smooth gradients
- **Typography**: Clean modern sans-serif, large headings with character
- **Micro-interactions**: Hover effects, smooth transitions, emoji-rich category pills

## Pages & Layout

### 1. Home Feed (`/`)
- Hero section with tagline: "Speak Freely. Stay Unknown."
- Category filter bar with emoji pills (Confessions, Relationships, Academic Stress, Campus Gist, Rants, Advice)
- Post cards showing: nickname/userId, category badge, post content preview, timestamp, like/comment count
- Floating "Create Post" button

### 2. Create Post (`/create`)
- Nickname/userId input (auto-generated or custom)
- Category selector (visual emoji cards)
- Rich text area for post content
- Anonymous toggle & submit

### 3. Post Detail (`/post/:id`)
- Full post view with comments section
- Anonymous commenting with nickname
- Like/react functionality

### 4. Category Page (`/category/:name`)
- Filtered feed by selected category
- Category header with emoji and description

### 5. Auth Pages (`/login`, `/signup`)
- Login/Signup forms (email + password)
- Optional — users can browse and post without an account using just a nickname
- Logged-in users get persistent profile & notifications

### 6. Profile (`/profile`)
- View your posts (tracked by userId/nickname or auth account)
- Edit nickname, avatar selection (preset avatars)

### 7. Notifications (`/notifications`)
- List of notifications: replies to your posts, likes, trending alerts
- Read/unread states

### Navigation
- Sticky top navbar: Logo, category links, search icon, notification bell (with badge), profile/login button
- Mobile: Bottom tab bar for Home, Categories, Create, Notifications, Profile
- Sidebar on desktop for categories (collapsible)

## Backend (Lovable Cloud / Supabase)
- **Tables**: posts, comments, categories, notifications, profiles, user_roles
- **Auth**: Supabase Auth (email/password), plus anonymous posting via nickname for non-logged-in users
- **RLS**: Public read on posts/comments, write requires either auth or nickname-based session
- **Edge function**: Notification creation on new comment/like

## Key Features
- Post anonymously without account (nickname only)
- Optional account for persistent identity & notifications
- Category-based browsing
- Like & comment system
- Real-time notification badges
- Fully responsive dark luxury UI
