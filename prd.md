

## Product Requirements Document: "GreenSquare" Activity Tracker

### 1. Product Overview

"GreenSquare" (working title) is a mobile-responsive web application designed for simple, frictionless activity tracking. Users click a single button to log an action, which instantly populates a GitHub-style contribution graph. The app incorporates a social element, allowing users to scroll a feed to view the tracking graphs of other users.

### 2. Objectives

- Provide a frictionless way for users to track a daily habit or action.
    
- Visualize data instantly using a recognizable, intuitive UI (GitHub commit graph).
    
- Foster subtle social motivation by displaying other users' progress.
    
- Ensure seamless performance across desktop and mobile browsers.
    

### 3. Core Features & User Stories (Updated)

**B. The "Track" Action (Categorical Logging)**

- _Story:_ As a user, I want to select my primary workout for the day from a specific list of categories.
    
- _Requirements:_
    
    - Instead of a single button, the UI provides six distinct options: **Gym, Running, CrossFit, Boxing, Pilates, and Yoga**.
        
    - Tapping an option logs it for the current day.
        
    - _Overwrite Capability:_ If the user taps a different category on the _same day_, it overwrites the previous selection for that day.
        

**C. Personal Contribution Graph (Color-Coded)**

- _Story:_ As a user, I want my GitHub-style grid to show different colors based on the type of workout I did, rather than how many times I clicked.
    
- _Requirements:_
    
    - The grid displays 365 days.
        
    - Each day displays a maximum of **one** color block.
        
    - Specific color mappings are applied (e.g., Gym = Blue, Running = Orange, CrossFit = Red, Boxing = Purple, Pilates = Pink, Yoga = Teal). Empty days remain a muted gray.
        

**E. Immutability of Past Records (New Requirement)**

- _Story:_ As a user, I want my past records locked so I am held strictly accountable for my historical data.
    
- _Requirements:_
    
    - The system locks a daily record at midnight (based on the user's local timezone).
        
    - Users cannot edit, add, or delete an entry for any day prior to "today."

### 4. Technical Architecture

|**Component**|**Technology**|**Description**|
|---|---|---|
|**Frontend Framework**|Next.js (React)|Handles routing, UI rendering, and API calls. Optimized for both desktop and mobile web.|
|**Hosting & Deployment**|Vercel|Seamless CI/CD integration with Next.js, providing fast global edge network delivery.|
|**Database & Auth**|Supabase|PostgreSQL database for storing user and click data. Built-in authentication handling.|
|**Styling**|Tailwind CSS|Utility-first CSS framework to easily replicate the GitHub aesthetic and manage mobile responsiveness.|

### 5. Proposed Data Model (Supabase - Updated)

To enforce your "one per day" and "overwrite today" rules efficiently, the database structure needs a slight tweak, specifically using an `ENUM` and a unique constraint.

- **Table: `users`**
    
    - `id` (UUID, Primary Key)
        
    - `username` (String, unique)
        
    - `timezone` (String) - _Crucial for determining when "midnight" happens to lock past records._
        
- **Table: `tracked_events`**
    
    - `id` (UUID, Primary Key)
        
    - `user_id` (UUID, Foreign Key)
        
    - `exercise_type` (String or ENUM: 'gym', 'running', 'crossfit', 'boxing', 'pilates', 'yoga')
        
    - `logged_date` (Date) - _Stores just the YYYY-MM-DD instead of a full timestamp._
        
    - `created_at` (Timestamp)
        

> **The Secret Sauce:** We will add a **Unique Constraint** on `(user_id, logged_date)`. This tells Supabase: "A user can only have one row per date." When a user taps a button today, we run an `UPSERT` command. If a row for today exists, it updates the `exercise_type`. If not, it creates a new one.

### 6. UI/UX & Design Constraints (Updated)

- **The Palette:** We need to move away from GitHub's monochrome green and establish a highly distinguishable 6-color palette that looks good on both light and dark modes.
    
- **The Input Mechanism:** On mobile, a horizontal scrolling pill-menu or a clean 2x3 grid of buttons for the 6 categories will work best.

